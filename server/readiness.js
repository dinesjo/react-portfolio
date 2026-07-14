export function evaluateReadiness({
  generationConfigured = false,
  contextReady = false,
  sourceCount = 0,
} = {}) {
  const checks = {
    generationConfigured: generationConfigured === true,
    contextReady: contextReady === true,
  };
  const blockers = [];

  if (!checks.generationConfigured) blockers.push("generation_not_configured");
  if (!checks.contextReady) blockers.push("portfolio_context_not_ready");

  const ready = blockers.length === 0;
  return {
    statusCode: ready ? 200 : 503,
    body: {
      status: ready ? "ready" : "not_ready",
      ready,
      checks,
      blockers,
      context: {
        sourceCount:
          Number.isSafeInteger(sourceCount) && sourceCount >= 0
            ? sourceCount
            : 0,
      },
    },
  };
}
