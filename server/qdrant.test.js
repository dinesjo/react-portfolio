import assert from "node:assert/strict";
import test from "node:test";

import {
  DEFAULT_EMBEDDING_MODEL,
  QDRANT_COLLECTION,
  QDRANT_DISTANCE,
  QDRANT_SCHEMA_VERSION,
  QDRANT_VECTOR_SIZE,
  QdrantError,
  contentHashForChunk,
  createQdrantStore,
  pointIdForChunkId,
} from "./qdrant.js";

const chunks = [
  {
    id: "project:semantic-search",
    title: "Semantic Search",
    type: "project",
    text: "A retrieval project using embeddings and grounded answers.",
    keywords: ["RAG", "embeddings", "retrieval"],
    href: "#project-semantic-search",
  },
  {
    id: "courses:year-4",
    title: "KTH coursework — study year 4",
    type: "course",
    text: "DD2395: Computer Security.",
    keywords: ["KTH", "security", "DD2395"],
    href: "#courses-year-4",
  },
];

function vector(value = 0.01) {
  return Array.from({ length: QDRANT_VECTOR_SIZE }, () => value);
}

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function createFakeQdrant({ collectionConfig, queryPoints = [] } = {}) {
  const state = {
    collectionConfig: collectionConfig ?? null,
    points: new Map(),
    queryPoints,
    requests: [],
  };

  const fetchImpl = async (url, init = {}) => {
    const requestUrl = new URL(url);
    const method = init.method ?? "GET";
    const body = init.body ? JSON.parse(init.body) : undefined;
    state.requests.push({
      method,
      path: requestUrl.pathname,
      search: requestUrl.search,
      body,
    });

    const collectionPath = `/collections/${QDRANT_COLLECTION}`;
    if (requestUrl.pathname === collectionPath && method === "GET") {
      if (!state.collectionConfig) {
        return jsonResponse({ status: { error: "not found" } }, 404);
      }
      return jsonResponse({
        result: {
          config: {
            params: { vectors: state.collectionConfig },
          },
        },
        status: "ok",
      });
    }

    if (requestUrl.pathname === collectionPath && method === "PUT") {
      state.collectionConfig = body.vectors;
      return jsonResponse({ result: true, status: "ok" });
    }

    if (requestUrl.pathname === collectionPath && method === "DELETE") {
      state.collectionConfig = null;
      state.points.clear();
      return jsonResponse({ result: true, status: "ok" });
    }

    if (
      requestUrl.pathname === `${collectionPath}/points/scroll` &&
      method === "POST"
    ) {
      return jsonResponse({
        result: {
          points: [...state.points.values()].map((point) => ({
            id: point.id,
            payload: point.payload,
          })),
          next_page_offset: null,
        },
        status: "ok",
      });
    }

    if (requestUrl.pathname === `${collectionPath}/points` && method === "PUT") {
      for (const point of body.points) state.points.set(String(point.id), point);
      return jsonResponse({
        result: { operation_id: 1, status: "completed" },
        status: "ok",
      });
    }

    if (
      requestUrl.pathname === `${collectionPath}/points/delete` &&
      method === "POST"
    ) {
      for (const pointId of body.points) state.points.delete(String(pointId));
      return jsonResponse({
        result: { operation_id: 2, status: "completed" },
        status: "ok",
      });
    }

    if (
      requestUrl.pathname === `${collectionPath}/points/query` &&
      method === "POST"
    ) {
      return jsonResponse({
        result: { points: state.queryPoints },
        status: "ok",
      });
    }

    return jsonResponse({ status: { error: "unexpected request" } }, 500);
  };

  return { state, fetchImpl };
}

function createEmbedDocuments() {
  const calls = [];
  const embedDocuments = async ({ documents, signal }) => {
    calls.push({ documents, signal });
    return documents.map((_, index) => vector((index + 1) / 100));
  };
  return { calls, embedDocuments };
}

function createStore(fetchImpl, options = {}) {
  return createQdrantStore({
    fetchImpl,
    retryDelaysMs: [0],
    sleepImpl: async () => {},
    ...options,
  });
}

test("creates the cosine collection and indexes canonical chunks", async () => {
  const fake = createFakeQdrant();
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);

  const result = await store.synchronize({
    chunks,
    embedDocuments: embedder.embedDocuments,
    embeddingModel: DEFAULT_EMBEDDING_MODEL,
  });

  assert.deepEqual(fake.state.collectionConfig, {
    size: QDRANT_VECTOR_SIZE,
    distance: QDRANT_DISTANCE,
  });
  assert.equal(result.collectionCreated, true);
  assert.equal(result.collectionRecreated, false);
  assert.equal(result.indexedCount, 2);
  assert.equal(result.upsertedCount, 2);
  assert.equal(result.deletedCount, 0);
  assert.equal(store.ready, true);
  assert.deepEqual(store.stats, {
    indexedCount: 2,
    upsertedCount: 2,
    deletedCount: 0,
  });
  assert.equal(embedder.calls.length, 1);
  assert.equal(embedder.calls[0].documents.length, 2);
  assert.match(embedder.calls[0].documents[0], /Title: Semantic Search/);
  assert.match(embedder.calls[0].documents[0], /Content: A retrieval project/);

  const projectId = pointIdForChunkId(chunks[0].id);
  assert.match(
    projectId,
    /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  assert.equal(pointIdForChunkId(chunks[0].id), projectId);
  const storedProject = fake.state.points.get(projectId);
  assert.equal(storedProject.vector.length, QDRANT_VECTOR_SIZE);
  assert.deepEqual(storedProject.payload, {
    chunk_id: chunks[0].id,
    type: "project",
    content_hash: contentHashForChunk(chunks[0]),
    embedding_model: DEFAULT_EMBEDDING_MODEL,
    schema_version: QDRANT_SCHEMA_VERSION,
  });
  assert.equal("text" in storedProject.payload, false);
});

test("does not embed or upsert unchanged chunks", async () => {
  const fake = createFakeQdrant();
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);
  await store.synchronize({ chunks, embedDocuments: embedder.embedDocuments });
  const upsertCount = fake.state.requests.filter(
    (request) => request.method === "PUT" && request.path.endsWith("/points"),
  ).length;

  const result = await store.synchronize({
    chunks,
    embedDocuments: embedder.embedDocuments,
  });

  assert.equal(embedder.calls.length, 1);
  assert.equal(result.upsertedCount, 0);
  assert.equal(
    fake.state.requests.filter(
      (request) => request.method === "PUT" && request.path.endsWith("/points"),
    ).length,
    upsertCount,
  );
});

test("embeds and upserts only changed chunks", async () => {
  const fake = createFakeQdrant();
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);
  await store.synchronize({ chunks, embedDocuments: embedder.embedDocuments });

  const changedChunks = [
    { ...chunks[0], text: `${chunks[0].text} It uses cosine similarity.` },
    chunks[1],
  ];
  const result = await store.synchronize({
    chunks: changedChunks,
    embedDocuments: embedder.embedDocuments,
  });

  assert.equal(result.upsertedCount, 1);
  assert.equal(embedder.calls.length, 2);
  assert.equal(embedder.calls[1].documents.length, 1);
  assert.match(embedder.calls[1].documents[0], /cosine similarity/);
  const stored = fake.state.points.get(pointIdForChunkId(chunks[0].id));
  assert.equal(
    stored.payload.content_hash,
    contentHashForChunk(changedChunks[0]),
  );
});

test("removes stale points without re-embedding retained chunks", async () => {
  const fake = createFakeQdrant();
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);
  await store.synchronize({ chunks, embedDocuments: embedder.embedDocuments });

  const result = await store.synchronize({
    chunks: [chunks[0]],
    embedDocuments: embedder.embedDocuments,
  });

  assert.equal(result.upsertedCount, 0);
  assert.equal(result.deletedCount, 1);
  assert.equal(embedder.calls.length, 1);
  assert.deepEqual([...fake.state.points.keys()], [pointIdForChunkId(chunks[0].id)]);
  const deletion = fake.state.requests.find((request) =>
    request.path.endsWith("/points/delete"),
  );
  assert.deepEqual(deletion.body, {
    points: [pointIdForChunkId(chunks[1].id)],
  });
});

test("queries with threshold and type filter while returning only ids and scores", async () => {
  const fake = createFakeQdrant({
    queryPoints: [
      {
        id: pointIdForChunkId(chunks[0].id),
        score: 0.8125,
        payload: {
          chunk_id: chunks[0].id,
          text: "Untrusted text must not leave the adapter.",
          environment: "secret",
        },
      },
    ],
  });
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);
  await store.synchronize({ chunks, embedDocuments: embedder.embedDocuments });

  const results = await store.query({
    vector: vector(0.02),
    limit: 6,
    scoreThreshold: 0.42,
    type: "project",
  });

  assert.deepEqual(results, [{ chunkId: chunks[0].id, score: 0.8125 }]);
  const query = fake.state.requests.find((request) =>
    request.path.endsWith("/points/query"),
  );
  assert.equal(query.body.query.length, QDRANT_VECTOR_SIZE);
  assert.equal(query.body.limit, 6);
  assert.equal(query.body.score_threshold, 0.42);
  assert.deepEqual(query.body.with_payload, ["chunk_id"]);
  assert.equal(query.body.with_vector, false);
  assert.deepEqual(query.body.filter, {
    must: [{ key: "type", match: { value: "project" } }],
  });
});

test("recreates an incompatible collection before indexing", async () => {
  const fake = createFakeQdrant({
    collectionConfig: { size: 768, distance: "Dot" },
  });
  const embedder = createEmbedDocuments();
  const store = createStore(fake.fetchImpl);

  const result = await store.synchronize({
    chunks: [chunks[0]],
    embedDocuments: embedder.embedDocuments,
  });

  assert.equal(result.collectionCreated, true);
  assert.equal(result.collectionRecreated, true);
  assert.deepEqual(fake.state.collectionConfig, {
    size: QDRANT_VECTOR_SIZE,
    distance: QDRANT_DISTANCE,
  });
  const collectionRequests = fake.state.requests
    .filter((request) => request.path === `/collections/${QDRANT_COLLECTION}`)
    .map((request) => request.method);
  assert.deepEqual(collectionRequests, ["GET", "DELETE", "PUT"]);
  assert.equal(embedder.calls[0].documents.length, 1);
});

test("rejects malformed embedding and search responses with safe typed errors", async () => {
  const fake = createFakeQdrant();
  const store = createStore(fake.fetchImpl);

  await assert.rejects(
    store.synchronize({
      chunks: [chunks[0]],
      embedDocuments: async () => [[0.1, 0.2]],
    }),
    (error) =>
      error instanceof QdrantError &&
      error.code === "invalid_vector" &&
      !error.message.includes("0.1"),
  );

  const validStore = createStore(fake.fetchImpl);
  const embedder = createEmbedDocuments();
  await validStore.synchronize({
    chunks: [chunks[0]],
    embedDocuments: embedder.embedDocuments,
  });
  fake.state.queryPoints = [{ score: "0.8", payload: {} }];

  await assert.rejects(
    validStore.query({ vector: vector() }),
    (error) =>
      error instanceof QdrantError &&
      error.code === "invalid_qdrant_response" &&
      error.status === 502,
  );
});

test("retries transient reachability failures and reports a safe typed error", async () => {
  let attempts = 0;
  const fetchImpl = async () => {
    attempts += 1;
    throw new Error("connect ECONNREFUSED 127.0.0.1:6333 internal detail");
  };
  const store = createStore(fetchImpl, {
    retryDelaysMs: [0, 0, 0],
  });

  await assert.rejects(
    store.synchronize({
      chunks: [chunks[0]],
      embedDocuments: async () => [vector()],
    }),
    (error) => {
      assert.ok(error instanceof QdrantError);
      assert.equal(error.code, "qdrant_unreachable");
      assert.equal(error.retryable, true);
      assert.equal(error.status, 503);
      assert.doesNotMatch(error.message, /ECONNREFUSED|127\.0\.0\.1/);
      return true;
    },
  );

  assert.equal(attempts, 3);
  assert.equal(store.ready, false);
});

test("bounds stalled vector database requests with a safe timeout", async () => {
  const fetchImpl = async (_url, init) =>
    new Promise((_resolve, reject) => {
      const keepAlive = setTimeout(
        () => reject(new Error("timeout signal did not fire")),
        100,
      );
      init.signal.addEventListener(
        "abort",
        () => {
          clearTimeout(keepAlive);
          reject(init.signal.reason);
        },
        { once: true },
      );
    });
  const store = createStore(fetchImpl, { requestTimeoutMs: 1 });

  await assert.rejects(
    store.synchronize({
      chunks: [chunks[0]],
      embedDocuments: async () => [vector()],
    }),
    (error) => {
      assert.ok(error instanceof QdrantError);
      assert.equal(error.code, "qdrant_timeout");
      assert.equal(error.status, 504);
      assert.equal(error.retryable, true);
      return true;
    },
  );
});
