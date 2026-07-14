import { portfolioChunks } from "./corpus.js";

export const FULL_CONTEXT_TOKEN_BUDGET = 12_000;

function estimateTokens(value) {
  return Math.ceil(String(value ?? "").length / 4);
}

function assertPortfolioChunk(chunk, index) {
  if (!chunk || typeof chunk !== "object") {
    throw new TypeError(`chunks[${index}] must be an object`);
  }

  for (const key of ["id", "title", "type", "text", "href"]) {
    if (typeof chunk[key] !== "string") {
      throw new TypeError(`chunks[${index}].${key} must be a string`);
    }
  }
}

function formatSource(chunk, citation) {
  return [
    `[${citation}]`,
    `Source id: ${chunk.id}`,
    `Title: ${chunk.title}`,
    `Type: ${chunk.type}`,
    `Link: ${chunk.href}`,
    `Content: ${chunk.text}`,
    `[/${citation}]`,
  ].join("\n");
}

/**
 * Build one stable, unabridged prompt context from every page-owned record.
 * The guard fails loudly if the corpus grows beyond the deliberate budget;
 * silently dropping or truncating a record would defeat full-context answers.
 */
export function buildFullPortfolioContext({
  chunks = portfolioChunks,
  maxTokens = FULL_CONTEXT_TOKEN_BUDGET,
} = {}) {
  if (!Array.isArray(chunks)) throw new TypeError("chunks must be an array");
  if (!Number.isSafeInteger(maxTokens) || maxTokens <= 0) {
    throw new RangeError("maxTokens must be a positive safe integer");
  }

  chunks.forEach(assertPortfolioChunk);

  const sources = chunks.map((chunk, index) => ({
    citation: `S${index + 1}`,
    id: chunk.id,
    title: chunk.title,
    type: chunk.type,
    href: chunk.href,
  }));
  const context = chunks
    .map((chunk, index) => formatSource(chunk, sources[index].citation))
    .join("\n\n");
  const estimatedTokens = estimateTokens(context);

  if (estimatedTokens > maxTokens) {
    throw new RangeError(
      `Full portfolio context is estimated at ${estimatedTokens} tokens, above the ${maxTokens}-token budget.`,
    );
  }

  return { context, sources, estimatedTokens };
}

/** Return only canonical sources explicitly cited by the generated answer. */
export function sourcesCitedInAnswer(answer, sources) {
  if (!Array.isArray(sources)) throw new TypeError("sources must be an array");

  const sourceByCitation = new Map(
    sources.map((source) => [String(source?.citation).toUpperCase(), source]),
  );
  const citedSources = [];
  const seen = new Set();
  const citationGroupPattern = /(?:\[|【|［)([^】］\]]+)(?:\]|】|］)/g;

  for (const group of String(answer ?? "").matchAll(citationGroupPattern)) {
    for (const match of group[1].matchAll(/\bS\d+\b/gi)) {
      const citation = match[0].toUpperCase();
      const source = sourceByCitation.get(citation);
      if (!source || seen.has(citation)) continue;
      seen.add(citation);
      citedSources.push(source);
    }
  }

  return citedSources;
}
