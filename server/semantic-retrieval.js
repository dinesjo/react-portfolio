import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
  embedDocuments,
  embedQuery,
} from "./embeddings.js";
import {
  DEFAULT_VECTOR_SCORE_THRESHOLD,
  retrieveHybridContext,
} from "./hybrid-retrieval.js";
import { createQdrantStore } from "./qdrant.js";

const DEFAULT_TOP_K = 6;
const DEFAULT_MAX_TOKENS = 3_000;

export class SemanticRetrievalError extends Error {
  constructor(code, message, status = 503, { cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "SemanticRetrievalError";
    this.code = code;
    this.status = status;
  }
}

function safeRetrievalError(error, fallbackCode = "semantic_retrieval_unavailable") {
  if (error instanceof SemanticRetrievalError) return error;

  return new SemanticRetrievalError(
    fallbackCode,
    "The portfolio semantic index is temporarily unavailable.",
    Number.isSafeInteger(error?.status) ? error.status : 503,
    { cause: error },
  );
}

function validateChunks(chunks) {
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new TypeError("chunks must be a non-empty array");
  }
  if (chunks.length > 100) {
    throw new RangeError("semantic retrieval supports at most 100 chunks");
  }
  return chunks;
}

function validEmbeddingVector(vector, dimensions) {
  return (
    Array.isArray(vector) &&
    vector.length === dimensions &&
    vector.every((value) => typeof value === "number" && Number.isFinite(value))
  );
}

function isCancellation(error) {
  return (
    error?.code === "embedding_aborted" ||
    error?.code === "qdrant_aborted" ||
    error?.name === "AbortError"
  );
}

export function createSemanticRetriever({
  chunks,
  store = createQdrantStore(),
  embedDocumentsImpl = embedDocuments,
  embedQueryImpl = embedQuery,
  embeddingModel = EMBEDDING_MODEL,
  embeddingDimensions = EMBEDDING_DIMENSIONS,
  vectorScoreThreshold = DEFAULT_VECTOR_SCORE_THRESHOLD,
} = {}) {
  const trustedChunks = validateChunks(chunks);
  if (!store || typeof store.synchronize !== "function" || typeof store.query !== "function") {
    throw new TypeError("store must implement synchronize and query");
  }
  if (typeof embedDocumentsImpl !== "function" || typeof embedQueryImpl !== "function") {
    throw new TypeError("embedding functions must be callable");
  }
  if (typeof embeddingModel !== "string" || !embeddingModel.trim()) {
    throw new TypeError("embeddingModel must be non-empty text");
  }
  if (!Number.isSafeInteger(embeddingDimensions) || embeddingDimensions <= 0) {
    throw new TypeError("embeddingDimensions must be a positive integer");
  }
  if (!Number.isFinite(vectorScoreThreshold)) {
    throw new TypeError("vectorScoreThreshold must be a finite number");
  }

  let initializationPromise = null;
  let state = {
    state: "idle",
    ready: false,
    indexedCount: 0,
    lastErrorCode: null,
    lastSynchronizedAt: null,
  };

  async function initialize({ signal, force = false } = {}) {
    if (state.ready && !force) return { ...state };
    if (initializationPromise) return initializationPromise;

    state = { ...state, state: "initializing", ready: false, lastErrorCode: null };
    initializationPromise = (async () => {
      try {
        const result = await store.synchronize({
          chunks: trustedChunks,
          embedDocuments: embedDocumentsImpl,
          embeddingModel,
          signal,
        });
        const readinessVector = await embedQueryImpl({
          query: "portfolio semantic retrieval readiness check",
          signal,
        });
        if (!validEmbeddingVector(readinessVector, embeddingDimensions)) {
          throw new SemanticRetrievalError(
            "invalid_query_embedding",
            "The local embedding service returned an invalid query vector.",
            502,
          );
        }
        state = {
          state: "ready",
          ready: true,
          indexedCount: result.indexedCount,
          lastErrorCode: null,
          lastSynchronizedAt: new Date().toISOString(),
        };
        return { ...state, ...result };
      } catch (error) {
        const safeError = safeRetrievalError(error, "semantic_index_initialization_failed");
        state = {
          ...state,
          state: "unavailable",
          ready: false,
          indexedCount: 0,
          lastErrorCode: safeError.code,
        };
        throw safeError;
      } finally {
        initializationPromise = null;
      }
    })();

    return initializationPromise;
  }

  async function retrieve({
    question,
    topK = DEFAULT_TOP_K,
    maxTokens = DEFAULT_MAX_TOKENS,
    signal,
  } = {}) {
    if (!state.ready || !store.ready) {
      throw new SemanticRetrievalError(
        "semantic_index_not_ready",
        "The portfolio semantic index is not ready.",
        503,
      );
    }
    if (typeof question !== "string" || !question.trim()) {
      throw new TypeError("question must be non-empty text");
    }

    try {
      const embeddingStartedAt = performance.now();
      const vector = await embedQueryImpl({ query: question, signal });
      const embeddingDurationMs = performance.now() - embeddingStartedAt;
      if (!validEmbeddingVector(vector, embeddingDimensions)) {
        throw new SemanticRetrievalError(
          "invalid_query_embedding",
          "The local embedding service returned an invalid query vector.",
          502,
        );
      }

      const vectorSearchStartedAt = performance.now();
      const vectorMatches = await store.query({
        vector,
        limit: trustedChunks.length,
        scoreThreshold: vectorScoreThreshold,
        signal,
      });
      const vectorSearchDurationMs = performance.now() - vectorSearchStartedAt;
      const result = retrieveHybridContext({
        question,
        chunks: trustedChunks,
        vectorMatches,
        topK,
        maxTokens,
        vectorScoreThreshold,
      });

      return {
        ...result,
        diagnostics: {
          ...result.diagnostics,
          embeddingDurationMs: Math.round(embeddingDurationMs),
          vectorSearchDurationMs: Math.round(vectorSearchDurationMs),
        },
      };
    } catch (error) {
      if (!isCancellation(error)) {
        state = {
          ...state,
          state: "unavailable",
          ready: false,
          lastErrorCode: error.code,
        };
      }
      throw safeRetrievalError(error);
    }
  }

  return {
    initialize,
    retrieve,
    get status() {
      return {
        ...state,
        mode: "hybrid-vector",
        vectorStore: "Qdrant",
        collection: store.collection,
        embeddingModel,
        embeddingDimensions,
        vectorScoreThreshold,
      };
    },
  };
}
