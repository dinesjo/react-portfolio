import assert from "node:assert/strict";
import test from "node:test";

import { evaluateReadiness } from "./readiness.js";

test("reports ready only when generation and semantic retrieval are ready", () => {
  assert.deepEqual(
    evaluateReadiness({
      generationConfigured: true,
      semanticStatus: { ready: true, state: "ready", indexedCount: 23 },
    }),
    {
      statusCode: 200,
      body: {
        status: "ready",
        ready: true,
        checks: {
          generationConfigured: true,
          retrievalReady: true,
        },
        blockers: [],
        retrieval: {
          state: "ready",
          indexedSourceCount: 23,
        },
      },
    },
  );
});

test("blocks readiness when Cloud generation is not configured", () => {
  const result = evaluateReadiness({
    generationConfigured: false,
    semanticStatus: { ready: true, state: "ready", indexedCount: 23 },
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.ready, false);
  assert.deepEqual(result.body.blockers, ["generation_not_configured"]);
});

test("blocks readiness while semantic retrieval is unavailable", () => {
  const result = evaluateReadiness({
    generationConfigured: true,
    semanticStatus: {
      ready: false,
      state: "unavailable",
      indexedCount: 0,
    },
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.ready, false);
  assert.deepEqual(result.body.blockers, ["semantic_retrieval_not_ready"]);
  assert.deepEqual(result.body.retrieval, {
    state: "unavailable",
    indexedSourceCount: 0,
  });
});

test("fails closed when readiness inputs are absent or non-boolean", () => {
  const result = evaluateReadiness({
    generationConfigured: "true",
    semanticStatus: { ready: 1 },
  });

  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body.checks, {
    generationConfigured: false,
    retrievalReady: false,
  });
  assert.deepEqual(result.body.blockers, [
    "generation_not_configured",
    "semantic_retrieval_not_ready",
  ]);
  assert.deepEqual(result.body.retrieval, {
    state: "unknown",
    indexedSourceCount: 0,
  });
});
