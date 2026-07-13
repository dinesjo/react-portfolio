/* eslint-env node */
import { createHash } from "node:crypto";

export const DEFAULT_QDRANT_URL = "http://127.0.0.1:6333";
export const QDRANT_COLLECTION = "portfolio_records_v1";
export const QDRANT_VECTOR_SIZE = 1_024;
export const QDRANT_DISTANCE = "Cosine";
export const QDRANT_SCHEMA_VERSION = 1;
export const DEFAULT_EMBEDDING_MODEL = "qwen3-embedding:0.6b";
export const DEFAULT_SCORE_THRESHOLD = 0.35;
export const QDRANT_REQUEST_TIMEOUT_MS = 10_000;

const UUID_NAMESPACE = "38df6a5e-2277-4f85-8793-3e598cf49252";
const SCROLL_PAGE_SIZE = 256;
const MAX_SCROLL_PAGES = 1_000;
const DEFAULT_RETRY_DELAYS_MS = [0, 250, 750, 1_500];

export class QdrantError extends Error {
  constructor(code, message, status = 503, { retryable = false, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "QdrantError";
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

function normalizeBaseUrl(value) {
  let url;
  try {
    url = new URL(value || DEFAULT_QDRANT_URL);
  } catch {
    throw new TypeError("QDRANT_URL must be a valid URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new TypeError("QDRANT_URL must use http or https");
  }
  if (url.username || url.password || url.search || url.hash) {
    throw new TypeError("QDRANT_URL must not contain credentials, a query, or a fragment");
  }

  return url.href.replace(/\/$/, "");
}

function namespaceBytes(value) {
  const hex = value.replaceAll("-", "");
  if (!/^[0-9a-f]{32}$/i.test(hex)) {
    throw new TypeError("UUID namespace is invalid");
  }
  return Buffer.from(hex, "hex");
}

/** Return a stable RFC 9562 UUIDv5 for a canonical portfolio chunk id. */
export function pointIdForChunkId(chunkId) {
  if (typeof chunkId !== "string" || !chunkId.trim()) {
    throw new TypeError("chunkId must be a non-empty string");
  }

  const digest = createHash("sha1")
    .update(namespaceBytes(UUID_NAMESPACE))
    .update(chunkId)
    .digest()
    .subarray(0, 16);

  digest[6] = (digest[6] & 0x0f) | 0x50;
  digest[8] = (digest[8] & 0x3f) | 0x80;
  const hex = digest.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

function assertChunk(chunk, index) {
  if (!chunk || typeof chunk !== "object" || Array.isArray(chunk)) {
    throw new TypeError(`chunks[${index}] must be an object`);
  }

  for (const field of ["id", "title", "type", "text"]) {
    if (typeof chunk[field] !== "string" || !chunk[field].trim()) {
      throw new TypeError(`chunks[${index}].${field} must be a non-empty string`);
    }
  }
  if (
    !Array.isArray(chunk.keywords) ||
    chunk.keywords.some((keyword) => typeof keyword !== "string")
  ) {
    throw new TypeError(`chunks[${index}].keywords must be an array of strings`);
  }
}

/** The exact document representation stored in the embedding space. */
export function embeddingDocumentForChunk(chunk) {
  return [
    `Source id: ${chunk.id}`,
    `Title: ${chunk.title}`,
    `Type: ${chunk.type}`,
    `Keywords: ${chunk.keywords.join(", ")}`,
    `Content: ${chunk.text}`,
  ].join("\n");
}

export function contentHashForChunk(
  chunk,
  embeddingModel = DEFAULT_EMBEDDING_MODEL,
) {
  if (typeof embeddingModel !== "string" || !embeddingModel.trim()) {
    throw new TypeError("embeddingModel must be a non-empty string");
  }

  return createHash("sha256")
    .update(
      JSON.stringify({
        schemaVersion: QDRANT_SCHEMA_VERSION,
        embeddingModel,
        document: embeddingDocumentForChunk(chunk),
      }),
    )
    .digest("hex");
}

function assertVector(vector, label = "vector") {
  if (!Array.isArray(vector) || vector.length !== QDRANT_VECTOR_SIZE) {
    throw new QdrantError(
      "invalid_vector",
      `The ${label} must contain ${QDRANT_VECTOR_SIZE} values.`,
      500,
    );
  }
  if (vector.some((value) => !Number.isFinite(value))) {
    throw new QdrantError(
      "invalid_vector",
      `The ${label} contains an invalid value.`,
      500,
    );
  }
}

function responseHasResult(payload) {
  return payload && typeof payload === "object" && "result" in payload;
}

function safeRequestError(status) {
  const retryable =
    status === 408 ||
    status === 409 ||
    status === 425 ||
    status === 429 ||
    status >= 500;
  return new QdrantError(
    "qdrant_request_failed",
    "The portfolio vector database is temporarily unavailable.",
    503,
    { retryable },
  );
}

function validateRetryDelays(value) {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((delay) => !Number.isSafeInteger(delay) || delay < 0)
  ) {
    throw new TypeError("retryDelaysMs must contain non-negative integers");
  }
  return [...value];
}

function defaultSleep(delay, signal) {
  if (delay === 0) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(
        new QdrantError(
          "qdrant_aborted",
          "The vector database operation was cancelled.",
          503,
        ),
      );
      return;
    }
    const onAbort = () => {
      clearTimeout(timeout);
      reject(
        new QdrantError(
          "qdrant_aborted",
          "The vector database operation was cancelled.",
          503,
        ),
      );
    };
    const timeout = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, delay);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}

function embeddingFailure(error) {
  if (error instanceof QdrantError) return error;
  return new QdrantError(
    "embedding_failed",
    "The portfolio vector index could not be built.",
    503,
    {
      retryable:
        error?.retryable === true ||
        Number(error?.status) >= 500 ||
        error?.name === "TimeoutError",
      cause: error,
    },
  );
}

export function createQdrantStore({
  baseUrl = process.env.QDRANT_URL ?? DEFAULT_QDRANT_URL,
  collection = QDRANT_COLLECTION,
  fetchImpl = fetch,
  retryDelaysMs = DEFAULT_RETRY_DELAYS_MS,
  sleepImpl = defaultSleep,
  requestTimeoutMs = QDRANT_REQUEST_TIMEOUT_MS,
} = {}) {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl);
  if (typeof collection !== "string" || !/^[a-zA-Z0-9_-]+$/.test(collection)) {
    throw new TypeError("collection must contain only letters, numbers, underscores, or hyphens");
  }
  if (typeof fetchImpl !== "function") throw new TypeError("fetchImpl must be a function");
  if (typeof sleepImpl !== "function") throw new TypeError("sleepImpl must be a function");
  if (!Number.isSafeInteger(requestTimeoutMs) || requestTimeoutMs <= 0) {
    throw new TypeError("requestTimeoutMs must be a positive integer");
  }
  const resolvedRetryDelays = validateRetryDelays(retryDelaysMs);
  const collectionPath = `/collections/${encodeURIComponent(collection)}`;

  let ready = false;
  let synchronizationPromise = null;
  let latestStats = {
    indexedCount: 0,
    upsertedCount: 0,
    deletedCount: 0,
  };

  async function request(
    path,
    { method = "GET", body, signal, allowNotFound = false } = {},
  ) {
    const timeoutSignal = AbortSignal.timeout(requestTimeoutMs);
    const requestSignal = signal
      ? AbortSignal.any([signal, timeoutSignal])
      : timeoutSignal;
    let response;
    try {
      response = await fetchImpl(`${resolvedBaseUrl}${path}`, {
        method,
        headers: {
          Accept: "application/json",
          ...(body === undefined ? {} : { "Content-Type": "application/json" }),
        },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: requestSignal,
      });
    } catch (error) {
      if (error instanceof QdrantError) throw error;
      if (signal?.aborted || error?.name === "AbortError") {
        throw new QdrantError(
          "qdrant_aborted",
          "The vector database operation was cancelled.",
          503,
          { cause: error },
        );
      }
      if (timeoutSignal.aborted || error?.name === "TimeoutError") {
        throw new QdrantError(
          "qdrant_timeout",
          "The portfolio vector database took too long to respond.",
          504,
          { retryable: true, cause: error },
        );
      }
      throw new QdrantError(
        "qdrant_unreachable",
        "The portfolio vector database could not be reached.",
        503,
        { retryable: true, cause: error },
      );
    }

    if (allowNotFound && response.status === 404) return null;
    if (!response.ok) throw safeRequestError(response.status);
    if (response.status === 204) return null;

    try {
      return await response.json();
    } catch (error) {
      throw new QdrantError(
        "invalid_qdrant_response",
        "The portfolio vector database returned an invalid response.",
        502,
        { retryable: true, cause: error },
      );
    }
  }

  async function createCollection(signal) {
    const payload = await request(collectionPath, {
      method: "PUT",
      body: {
        vectors: {
          size: QDRANT_VECTOR_SIZE,
          distance: QDRANT_DISTANCE,
        },
      },
      signal,
    });
    if (!responseHasResult(payload)) {
      throw new QdrantError(
        "invalid_qdrant_response",
        "The vector database did not confirm collection creation.",
        502,
      );
    }
  }

  async function ensureCollection(signal) {
    const payload = await request(collectionPath, { signal, allowNotFound: true });
    if (payload === null) {
      await createCollection(signal);
      return { recreated: false, created: true };
    }
    if (!responseHasResult(payload) || !payload.result || typeof payload.result !== "object") {
      throw new QdrantError(
        "invalid_qdrant_response",
        "The vector database returned invalid collection metadata.",
        502,
      );
    }

    const vectors = payload.result.config?.params?.vectors;
    if (!vectors || typeof vectors !== "object") {
      throw new QdrantError(
        "invalid_qdrant_response",
        "The vector database returned invalid collection metadata.",
        502,
      );
    }
    const compatible =
      vectors.size === QDRANT_VECTOR_SIZE &&
      String(vectors.distance).toLowerCase() === QDRANT_DISTANCE.toLowerCase();
    if (compatible) return { recreated: false, created: false };

    await request(collectionPath, {
      method: "DELETE",
      signal,
      allowNotFound: true,
    });
    await createCollection(signal);
    return { recreated: true, created: true };
  }

  async function scrollPoints(signal) {
    const points = [];
    const seenOffsets = new Set();
    let offset;

    for (let page = 0; page < MAX_SCROLL_PAGES; page += 1) {
      const body = {
        limit: SCROLL_PAGE_SIZE,
        with_payload: [
          "chunk_id",
          "type",
          "content_hash",
          "embedding_model",
          "schema_version",
        ],
        with_vector: false,
        ...(offset === undefined ? {} : { offset }),
      };
      const payload = await request(`${collectionPath}/points/scroll`, {
        method: "POST",
        body,
        signal,
      });
      const result = payload?.result;
      if (!result || !Array.isArray(result.points)) {
        throw new QdrantError(
          "invalid_qdrant_response",
          "The vector database returned invalid indexed records.",
          502,
        );
      }

      for (const point of result.points) {
        const validId =
          typeof point?.id === "string" ||
          (Number.isSafeInteger(point?.id) && point.id >= 0);
        if (!validId || (point.payload !== null && typeof point.payload !== "object")) {
          throw new QdrantError(
            "invalid_qdrant_response",
            "The vector database returned an invalid indexed record.",
            502,
          );
        }
        points.push({
          id: point.id,
          payload: point.payload ?? {},
        });
      }

      const nextOffset = result.next_page_offset;
      if (nextOffset === undefined || nextOffset === null) return points;
      const offsetKey = JSON.stringify(nextOffset);
      if (seenOffsets.has(offsetKey)) {
        throw new QdrantError(
          "invalid_qdrant_response",
          "The vector database returned an invalid pagination cursor.",
          502,
        );
      }
      seenOffsets.add(offsetKey);
      offset = nextOffset;
    }

    throw new QdrantError(
      "invalid_qdrant_response",
      "The vector database returned too many index pages.",
      502,
    );
  }

  async function synchronizeOnce({
    chunks,
    embedDocuments,
    embeddingModel,
    signal,
  }) {
    const collectionState = await ensureCollection(signal);
    const existingPoints = collectionState.recreated
      ? []
      : await scrollPoints(signal);
    const existingById = new Map(
      existingPoints.map((point) => [String(point.id), point]),
    );
    const expectedById = new Map();

    chunks.forEach((chunk, index) => {
      assertChunk(chunk, index);
      const pointId = pointIdForChunkId(chunk.id);
      if (expectedById.has(pointId)) {
        throw new TypeError(`chunks contains a duplicate id: ${chunk.id}`);
      }
      expectedById.set(pointId, {
        pointId,
        chunk,
        contentHash: contentHashForChunk(chunk, embeddingModel),
        document: embeddingDocumentForChunk(chunk),
      });
    });

    const dirty = [...expectedById.values()].filter((expected) => {
      const existing = existingById.get(expected.pointId)?.payload;
      return (
        existing?.chunk_id !== expected.chunk.id ||
        existing?.content_hash !== expected.contentHash ||
        existing?.embedding_model !== embeddingModel ||
        existing?.schema_version !== QDRANT_SCHEMA_VERSION
      );
    });

    if (dirty.length > 0) {
      let vectors;
      try {
        vectors = await embedDocuments({
          documents: dirty.map((item) => item.document),
          signal,
        });
      } catch (error) {
        throw embeddingFailure(error);
      }
      if (!Array.isArray(vectors) || vectors.length !== dirty.length) {
        throw new QdrantError(
          "invalid_embedding_response",
          "The embedding service returned an unexpected number of vectors.",
          502,
        );
      }
      vectors.forEach((vector, index) =>
        assertVector(vector, `embedding vector ${index + 1}`),
      );

      const payload = await request(`${collectionPath}/points?wait=true`, {
        method: "PUT",
        body: {
          points: dirty.map((item, index) => ({
            id: item.pointId,
            vector: vectors[index],
            payload: {
              chunk_id: item.chunk.id,
              type: item.chunk.type,
              content_hash: item.contentHash,
              embedding_model: embeddingModel,
              schema_version: QDRANT_SCHEMA_VERSION,
            },
          })),
        },
        signal,
      });
      if (!responseHasResult(payload)) {
        throw new QdrantError(
          "invalid_qdrant_response",
          "The vector database did not confirm indexed records.",
          502,
        );
      }
    }

    const staleIds = existingPoints
      .filter((point) => !expectedById.has(String(point.id)))
      .map((point) => point.id);
    if (staleIds.length > 0) {
      const payload = await request(`${collectionPath}/points/delete?wait=true`, {
        method: "POST",
        body: { points: staleIds },
        signal,
      });
      if (!responseHasResult(payload)) {
        throw new QdrantError(
          "invalid_qdrant_response",
          "The vector database did not confirm stale-record removal.",
          502,
        );
      }
    }

    return {
      indexedCount: expectedById.size,
      upsertedCount: dirty.length,
      deletedCount: staleIds.length,
      collectionCreated: collectionState.created,
      collectionRecreated: collectionState.recreated,
    };
  }

  async function synchronize(input) {
    if (synchronizationPromise) return synchronizationPromise;
    if (!input || typeof input !== "object") {
      throw new TypeError("synchronization input must be an object");
    }
    const chunks = input.chunks;
    const embedDocuments = input.embedDocuments;
    const embeddingModel = input.embeddingModel ?? DEFAULT_EMBEDDING_MODEL;
    if (!Array.isArray(chunks)) throw new TypeError("chunks must be an array");
    if (typeof embedDocuments !== "function") {
      throw new TypeError("embedDocuments must be a function");
    }
    if (typeof embeddingModel !== "string" || !embeddingModel.trim()) {
      throw new TypeError("embeddingModel must be a non-empty string");
    }

    ready = false;
    synchronizationPromise = (async () => {
      let lastError;
      for (let attempt = 0; attempt < resolvedRetryDelays.length; attempt += 1) {
        if (attempt > 0) {
          await sleepImpl(resolvedRetryDelays[attempt], input.signal);
        }
        try {
          const result = await synchronizeOnce({
            chunks,
            embedDocuments,
            embeddingModel,
            signal: input.signal,
          });
          latestStats = {
            indexedCount: result.indexedCount,
            upsertedCount: result.upsertedCount,
            deletedCount: result.deletedCount,
          };
          ready = true;
          return result;
        } catch (error) {
          const typedError = error instanceof QdrantError
            ? error
            : new QdrantError(
                "qdrant_initialization_failed",
                "The portfolio vector index could not be initialized.",
                503,
                { cause: error },
              );
          lastError = typedError;
          if (!typedError.retryable || attempt === resolvedRetryDelays.length - 1) {
            throw typedError;
          }
        }
      }
      throw lastError;
    })().finally(() => {
      synchronizationPromise = null;
    });

    return synchronizationPromise;
  }

  async function query({
    vector,
    limit = 12,
    scoreThreshold = DEFAULT_SCORE_THRESHOLD,
    type,
    signal,
  } = {}) {
    if (!ready) {
      throw new QdrantError(
        "qdrant_not_ready",
        "The portfolio vector index is not ready.",
        503,
      );
    }
    assertVector(vector, "query vector");
    if (!Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      throw new RangeError("limit must be an integer from 1 to 100");
    }
    if (
      !Number.isFinite(scoreThreshold) ||
      scoreThreshold < -1 ||
      scoreThreshold > 1
    ) {
      throw new RangeError("scoreThreshold must be between -1 and 1");
    }
    if (type !== undefined && (typeof type !== "string" || !type.trim())) {
      throw new TypeError("type must be a non-empty string when provided");
    }

    const payload = await request(`${collectionPath}/points/query`, {
      method: "POST",
      body: {
        query: vector,
        limit,
        score_threshold: scoreThreshold,
        with_payload: ["chunk_id"],
        with_vector: false,
        ...(type
          ? {
              filter: {
                must: [{ key: "type", match: { value: type } }],
              },
            }
          : {}),
      },
      signal,
    });
    const points = payload?.result?.points;
    if (!Array.isArray(points)) {
      throw new QdrantError(
        "invalid_qdrant_response",
        "The vector database returned invalid search results.",
        502,
      );
    }

    return points.map((point) => {
      if (
        typeof point?.payload?.chunk_id !== "string" ||
        !point.payload.chunk_id ||
        !Number.isFinite(point.score)
      ) {
        throw new QdrantError(
          "invalid_qdrant_response",
          "The vector database returned an invalid search result.",
          502,
        );
      }
      return {
        chunkId: point.payload.chunk_id,
        score: point.score,
      };
    });
  }

  return {
    collection,
    get ready() {
      return ready;
    },
    get stats() {
      return { ...latestStats };
    },
    synchronize,
    query,
  };
}
