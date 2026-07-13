export function evaluateReadiness({
  generationConfigured = false,
  semanticStatus = {},
} = {}) {
  const checks = {
    generationConfigured: generationConfigured === true,
    retrievalReady: semanticStatus.ready === true,
  };
  const blockers = [];

  if (!checks.generationConfigured) blockers.push("generation_not_configured");
  if (!checks.retrievalReady) blockers.push("semantic_retrieval_not_ready");

  const ready = blockers.length === 0;
  return {
    statusCode: ready ? 200 : 503,
    body: {
      status: ready ? "ready" : "not_ready",
      ready,
      checks,
      blockers,
      retrieval: {
        state:
          typeof semanticStatus.state === "string"
            ? semanticStatus.state
            : "unknown",
        indexedSourceCount: Number.isSafeInteger(semanticStatus.indexedCount)
          ? semanticStatus.indexedCount
          : 0,
      },
    },
  };
}
