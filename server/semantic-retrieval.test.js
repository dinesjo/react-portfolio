import assert from "node:assert/strict";
import test from "node:test";

import { EMBEDDING_DIMENSIONS } from "./embeddings.js";
import {
  SemanticRetrievalError,
  createSemanticRetriever,
} from "./semantic-retrieval.js";

const chunks = [
  {
    id: "project:music",
    title: "Music Tutor",
    type: "project",
    text: "A microphone-driven rhythm game for instrument practice.",
    keywords: ["Unity", "audio"],
    href: "#project-music",
  },
  {
    id: "project:map",
    title: "Historical Atlas",
    type: "project",
    text: "An interactive map for exploring historical places.",
    keywords: ["MapLibre", "geography"],
    href: "#project-map",
  },
];

function vector(value = 0.01) {
  return Array.from({ length: EMBEDDING_DIMENSIONS }, () => value);
}

function fakeStore({ matches = [{ chunkId: "project:music", score: 0.72 }] } = {}) {
  const calls = { synchronize: [], query: [] };
  let ready = false;
  return {
    collection: "portfolio_records_v1",
    get ready() {
      return ready;
    },
    calls,
    async synchronize(input) {
      calls.synchronize.push(input);
      ready = true;
      return { indexedCount: input.chunks.length, upsertedCount: input.chunks.length };
    },
    async query(input) {
      calls.query.push(input);
      return matches;
    },
  };
}

test("initializes the persistent index with document embeddings", async () => {
  const store = fakeStore();
  const embedDocumentsImpl = async () => [vector(), vector(0.02)];
  const retriever = createSemanticRetriever({
    chunks,
    store,
    embedDocumentsImpl,
    embedQueryImpl: async () => vector(0.03),
  });

  const result = await retriever.initialize();

  assert.equal(result.indexedCount, 2);
  assert.equal(store.calls.synchronize.length, 1);
  assert.equal(store.calls.synchronize[0].embedDocuments, embedDocumentsImpl);
  assert.equal(retriever.status.ready, true);
  assert.equal(retriever.status.vectorStore, "Qdrant");
  assert.equal(retriever.status.embeddingDimensions, 1024);
});

test("embeds a query, searches Qdrant, and packs hybrid evidence", async () => {
  const store = fakeStore();
  const queries = [];
  const retriever = createSemanticRetriever({
    chunks,
    store,
    embedDocumentsImpl: async () => [vector(), vector()],
    embedQueryImpl: async ({ query }) => {
      queries.push(query);
      return vector(0.03);
    },
  });
  await retriever.initialize();

  const result = await retriever.retrieve({
    question: "Does anything react when a person performs aloud?",
    topK: 2,
    maxTokens: 200,
  });

  assert.deepEqual(queries, [
    "portfolio semantic retrieval readiness check",
    "Does anything react when a person performs aloud?",
  ]);
  assert.equal(store.calls.query.length, 1);
  assert.equal(store.calls.query[0].vector.length, 1024);
  assert.equal(store.calls.query[0].limit, chunks.length);
  assert.equal(result.sources[0].id, "project:music");
  assert.deepEqual(result.sources[0].retrievalSignals, ["vector"]);
  assert.equal(result.diagnostics.mode, "hybrid-vector");
});

test("fails closed before the vector index is ready", async () => {
  const retriever = createSemanticRetriever({ chunks, store: fakeStore() });

  await assert.rejects(
    retriever.retrieve({ question: "What did he build?" }),
    (error) =>
      error instanceof SemanticRetrievalError &&
      error.code === "semantic_index_not_ready" &&
      error.status === 503,
  );
});

test("records safe unavailable state when synchronization fails", async () => {
  const store = fakeStore();
  store.synchronize = async () => {
    throw new Error("internal vector host details");
  };
  const retriever = createSemanticRetriever({ chunks, store });

  await assert.rejects(retriever.initialize(), (error) => {
    assert.ok(error instanceof SemanticRetrievalError);
    assert.equal(error.code, "semantic_index_initialization_failed");
    assert.doesNotMatch(error.message, /internal vector host/i);
    return true;
  });
  assert.equal(retriever.status.ready, false);
  assert.equal(retriever.status.state, "unavailable");
});
