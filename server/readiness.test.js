import assert from "node:assert/strict";
import test from "node:test";

import { evaluateReadiness } from "./readiness.js";

test("reports ready only when generation and full portfolio context are ready", () => {
  assert.deepEqual(
    evaluateReadiness({
      generationConfigured: true,
      contextReady: true,
      sourceCount: 23,
    }),
    {
      statusCode: 200,
      body: {
        status: "ready",
        ready: true,
        checks: {
          generationConfigured: true,
          contextReady: true,
        },
        blockers: [],
        context: { sourceCount: 23 },
      },
    },
  );
});

test("blocks readiness when Cloud generation is not configured", () => {
  const result = evaluateReadiness({
    generationConfigured: false,
    contextReady: true,
    sourceCount: 23,
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.ready, false);
  assert.deepEqual(result.body.blockers, ["generation_not_configured"]);
});

test("blocks readiness while full portfolio context is unavailable", () => {
  const result = evaluateReadiness({
    generationConfigured: true,
    contextReady: false,
    sourceCount: 0,
  });

  assert.equal(result.statusCode, 503);
  assert.equal(result.body.ready, false);
  assert.deepEqual(result.body.blockers, ["portfolio_context_not_ready"]);
  assert.deepEqual(result.body.context, { sourceCount: 0 });
});

test("fails closed when readiness inputs are absent or non-boolean", () => {
  const result = evaluateReadiness({
    generationConfigured: "true",
    contextReady: 1,
    sourceCount: -1,
  });

  assert.equal(result.statusCode, 503);
  assert.deepEqual(result.body.checks, {
    generationConfigured: false,
    contextReady: false,
  });
  assert.deepEqual(result.body.blockers, [
    "generation_not_configured",
    "portfolio_context_not_ready",
  ]);
  assert.deepEqual(result.body.context, { sourceCount: 0 });
});
