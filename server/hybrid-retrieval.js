import {
  buildContextFromRanked,
  normalizeType,
  rankLexicalChunks,
} from "./retrieval.js";

export const DEFAULT_VECTOR_SCORE_THRESHOLD = 0.45;
export const DEFAULT_VECTOR_RELATIVE_FLOOR = 0.92;
const DEFAULT_TOP_K = 6;
const DEFAULT_MAX_TOKENS = 3_000;
const RECIPROCAL_RANK_OFFSET = 60;
const LEXICAL_WEIGHT = 1.15;
const VECTOR_WEIGHT = 1;

function validateVectorMatch(match, index) {
  if (!match || typeof match !== "object") {
    throw new TypeError(`vectorMatches[${index}] must be an object`);
  }
  if (typeof match.chunkId !== "string" || !match.chunkId.trim()) {
    throw new TypeError(`vectorMatches[${index}].chunkId must be a non-empty string`);
  }
  if (!Number.isFinite(match.score)) {
    throw new TypeError(`vectorMatches[${index}].score must be a finite number`);
  }
}

function reciprocalRank(rank, weight) {
  return weight / (RECIPROCAL_RANK_OFFSET + rank + 1);
}

function diversifyByType(ranked) {
  const firstOfEachType = [];
  const remainder = [];
  const seenTypes = new Set();

  for (const item of ranked) {
    const type = normalizeType(item.chunk.type);
    if (seenTypes.has(type)) remainder.push(item);
    else {
      seenTypes.add(type);
      firstOfEachType.push(item);
    }
  }

  return [...firstOfEachType, ...remainder];
}

/**
 * Fuse deterministic lexical ranks with dense-vector ranks. Qdrant payloads are
 * deliberately not accepted here: vector results can only select a canonical
 * in-process chunk by its id.
 */
export function fuseRetrievalRanks({
  chunks,
  lexicalRanked,
  vectorMatches,
  requestedType = null,
  broadOverview = false,
  vectorScoreThreshold = DEFAULT_VECTOR_SCORE_THRESHOLD,
  vectorRelativeFloor = DEFAULT_VECTOR_RELATIVE_FLOOR,
}) {
  if (!Array.isArray(chunks)) throw new TypeError("chunks must be an array");
  if (!Array.isArray(lexicalRanked)) {
    throw new TypeError("lexicalRanked must be an array");
  }
  if (!Array.isArray(vectorMatches)) {
    throw new TypeError("vectorMatches must be an array");
  }
  if (!Number.isFinite(vectorScoreThreshold)) {
    throw new TypeError("vectorScoreThreshold must be a finite number");
  }
  if (
    !Number.isFinite(vectorRelativeFloor) ||
    vectorRelativeFloor < 0 ||
    vectorRelativeFloor > 1
  ) {
    throw new TypeError("vectorRelativeFloor must be between 0 and 1");
  }
  vectorMatches.forEach(validateVectorMatch);

  const canonicalById = new Map(chunks.map((chunk, index) => [chunk.id, { chunk, index }]));
  const candidates = new Map();

  lexicalRanked.forEach((item, rank) => {
    const canonical = canonicalById.get(item?.chunk?.id);
    if (!canonical) return;
    if (requestedType && normalizeType(canonical.chunk.type) !== requestedType) return;

    candidates.set(canonical.chunk.id, {
      chunk: canonical.chunk,
      index: canonical.index,
      score: reciprocalRank(rank, LEXICAL_WEIGHT),
      lexicalScore: item.score,
      vectorScore: null,
      matchedTerms: item.matchedTerms,
      retrievalSignals: ["lexical"],
    });
  });

  const eligibleVectorMatches = vectorMatches.filter((match) => {
    const canonical = canonicalById.get(match.chunkId);
    return (
      match.score >= vectorScoreThreshold &&
      canonical &&
      (!requestedType || normalizeType(canonical.chunk.type) === requestedType)
    );
  });
  const strongestVectorScore = eligibleVectorMatches.reduce(
    (strongest, match) => Math.max(strongest, match.score),
    Number.NEGATIVE_INFINITY,
  );
  const effectiveVectorFloor = Math.max(
    vectorScoreThreshold,
    strongestVectorScore * vectorRelativeFloor,
  );

  vectorMatches.forEach((match, rank) => {
    if (match.score < effectiveVectorFloor) return;
    const canonical = canonicalById.get(match.chunkId);
    if (!canonical) return;
    if (requestedType && normalizeType(canonical.chunk.type) !== requestedType) return;

    const existing = candidates.get(match.chunkId);
    if (existing) {
      existing.score += reciprocalRank(rank, VECTOR_WEIGHT);
      existing.vectorScore = match.score;
      existing.retrievalSignals.push("vector");
      return;
    }

    candidates.set(match.chunkId, {
      chunk: canonical.chunk,
      index: canonical.index,
      score: reciprocalRank(rank, VECTOR_WEIGHT),
      lexicalScore: null,
      vectorScore: match.score,
      matchedTerms: [],
      retrievalSignals: ["vector"],
    });
  });

  const ranked = [...candidates.values()].sort(
    (left, right) =>
      right.score - left.score ||
      (right.vectorScore ?? -1) - (left.vectorScore ?? -1) ||
      (right.lexicalScore ?? -1) - (left.lexicalScore ?? -1) ||
      left.index - right.index,
  );

  return broadOverview ? diversifyByType(ranked) : ranked;
}

export function retrieveHybridContext({
  question,
  chunks,
  vectorMatches,
  topK = DEFAULT_TOP_K,
  maxTokens = DEFAULT_MAX_TOKENS,
  minLexicalScore,
  vectorScoreThreshold = DEFAULT_VECTOR_SCORE_THRESHOLD,
  vectorRelativeFloor = DEFAULT_VECTOR_RELATIVE_FLOOR,
}) {
  const lexical = rankLexicalChunks({
    question,
    chunks,
    ...(minLexicalScore === undefined ? {} : { minScore: minLexicalScore }),
  });
  const ranked = fuseRetrievalRanks({
    chunks,
    lexicalRanked: lexical.ranked,
    vectorMatches,
    requestedType: lexical.requestedType,
    broadOverview: lexical.broadOverview,
    vectorScoreThreshold,
    vectorRelativeFloor,
  });
  const packed = buildContextFromRanked({ ranked, topK, maxTokens });

  return {
    ...packed,
    diagnostics: {
      mode: "hybrid-vector",
      lexicalCandidateCount: lexical.ranked.length,
      vectorCandidateCount: ranked.filter((item) => item.vectorScore !== null).length,
      fusedCandidateCount: ranked.length,
      vectorScoreThreshold,
      vectorRelativeFloor,
    },
  };
}
