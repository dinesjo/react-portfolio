const DEFAULT_TOP_K = 5;
const DEFAULT_MAX_TOKENS = 1_200;
const DEFAULT_MIN_SCORE = 2;

const STOP_WORDS = new Set([
  "a",
  "about",
  "all",
  "also",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "but",
  "by",
  "can",
  "could",
  "did",
  "do",
  "does",
  "for",
  "from",
  "give",
  "had",
  "has",
  "have",
  "he",
  "her",
  "him",
  "his",
  "how",
  "i",
  "in",
  "is",
  "it",
  "its",
  "linus",
  "me",
  "my",
  "of",
  "on",
  "or",
  "our",
  "please",
  "she",
  "so",
  "some",
  "tell",
  "than",
  "that",
  "the",
  "their",
  "them",
  "there",
  "these",
  "they",
  "this",
  "those",
  "to",
  "us",
  "was",
  "we",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

const TYPE_HINTS = {
  course: new Set([
    "course",
    "courses",
    "education",
    "learn",
    "learned",
    "school",
    "studied",
    "studies",
    "study",
    "university",
  ]),
  experience: new Set([
    "career",
    "employment",
    "experience",
    "job",
    "jobs",
    "role",
    "roles",
    "work",
  ]),
  project: new Set([
    "app",
    "apps",
    "build",
    "built",
    "made",
    "portfolio",
    "project",
    "projects",
    "work",
  ]),
  skill: new Set([
    "language",
    "languages",
    "skill",
    "skills",
    "stack",
    "tech",
    "technologies",
    "technology",
    "tool",
    "tools",
  ]),
};

const BROAD_OVERVIEW_PATTERN =
  /\b(overview|background|bio|biography|everything|highlights?|portfolio|profile|summary)\b/i;
const BROAD_ACTIVITY_PATTERN =
  /\bwhat\s+(?:has|have|did|does)\b.{0,40}\b(?:achieved|built|done|made|studied|worked)\b/i;

function fold(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(value) {
  return (
    fold(value).match(/[\p{L}\p{N}][\p{L}\p{N}+#.-]*/gu) ?? []
  ).map((token) => token.replace(/[.-]+$/g, ""));
}

function stem(token) {
  if (token.length < 5 || /\d/.test(token)) return token;
  if (token.endsWith("ies") && token.length > 5) return `${token.slice(0, -3)}y`;
  if (token.endsWith("ing") && token.length > 6) {
    const base = token.slice(0, -3);
    return /(.)\1$/.test(base) ? base.slice(0, -1) : base;
  }
  if (token.endsWith("ed") && token.length > 5) return token.slice(0, -2);
  if (/(?:ches|shes|sses|xes|zes)$/.test(token)) return token.slice(0, -2);
  if (token.endsWith("s") && !token.endsWith("ss") && !token.endsWith("us")) {
    return token.slice(0, -1);
  }
  return token;
}

function searchableTokens(value) {
  const result = new Set();
  for (const token of tokenize(value)) {
    result.add(token);
    result.add(stem(token));
  }
  return result;
}

function meaningfulQueryTerms(question) {
  const terms = [];
  const seen = new Set();

  for (const token of tokenize(question)) {
    if (STOP_WORDS.has(token)) continue;
    const normalized = stem(token);
    if (!seen.has(normalized)) {
      seen.add(normalized);
      terms.push(normalized);
    }
  }

  return terms;
}

function normalizeType(type) {
  const value = fold(type);
  if (/course|education|study/.test(value)) return "course";
  if (/experience|employment|job|role/.test(value)) return "experience";
  if (/project|case-study|work/.test(value)) return "project";
  if (/skill|technology|stack|tool/.test(value)) return "skill";
  return value || "other";
}

function isBroadOverview(question) {
  if (BROAD_OVERVIEW_PATTERN.test(question)) return true;
  if (BROAD_ACTIVITY_PATTERN.test(question)) return true;
  return false;
}

function assertTrustedChunk(chunk, index) {
  if (!chunk || typeof chunk !== "object") {
    throw new TypeError(`chunks[${index}] must be an object`);
  }

  for (const key of ["id", "title", "type", "text", "href"]) {
    if (typeof chunk[key] !== "string") {
      throw new TypeError(`chunks[${index}].${key} must be a string`);
    }
  }

  if (!Array.isArray(chunk.keywords) || chunk.keywords.some((item) => typeof item !== "string")) {
    throw new TypeError(`chunks[${index}].keywords must be an array of strings`);
  }
}

function validateLimit(value, name, fallback) {
  const resolved = value ?? fallback;
  if (!Number.isSafeInteger(resolved) || resolved < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer`);
  }
  return resolved;
}

function phraseBonus(terms, foldedField, weight) {
  if (terms.length < 2) return 0;

  let bonus = 0;
  for (let index = 0; index < terms.length - 1; index += 1) {
    const pair = `${terms[index]} ${terms[index + 1]}`;
    if (foldedField.includes(pair)) bonus += weight;
  }
  return bonus;
}

function scoreChunk(chunk, terms, broadOverview) {
  const titleTokens = searchableTokens(chunk.title);
  const keywordTokens = searchableTokens(chunk.keywords.join(" "));
  const typeTokens = searchableTokens(chunk.type);
  const idTokens = searchableTokens(chunk.id);
  const textTokens = searchableTokens(chunk.text);
  const normalizedType = normalizeType(chunk.type);
  const matchedTerms = [];
  let score = broadOverview ? 1 : 0;

  for (const term of terms) {
    let termScore = 0;
    if (titleTokens.has(term)) termScore += 8;
    if (keywordTokens.has(term)) termScore += 7;
    if (idTokens.has(term)) termScore += 5;
    if (typeTokens.has(term)) termScore += 4;
    if (textTokens.has(term)) termScore += 2;

    const looksLikeCode = /[a-z]/.test(term) && /\d/.test(term);
    if (looksLikeCode && termScore > 0) termScore += 12;

    if (TYPE_HINTS[normalizedType]?.has(term)) termScore += 3;

    if (termScore > 0) {
      score += termScore;
      matchedTerms.push(term);
    }
  }

  score += phraseBonus(terms, fold(chunk.title), 5);
  score += phraseBonus(terms, fold(chunk.keywords.join(" ")), 4);
  score += phraseBonus(terms, fold(chunk.text), 1.5);

  return { score, matchedTerms };
}

function diversify(ranked) {
  const firstOfEachType = [];
  const remainder = [];
  const seenTypes = new Set();

  for (const item of ranked) {
    const type = normalizeType(item.chunk.type);
    if (seenTypes.has(type)) {
      remainder.push(item);
    } else {
      seenTypes.add(type);
      firstOfEachType.push(item);
    }
  }

  return [...firstOfEachType, ...remainder];
}

function compact(value, maximumLength) {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= maximumLength) return normalized;
  return `${normalized.slice(0, Math.max(0, maximumLength - 1)).trimEnd()}…`;
}

function truncateAtWord(value, maximumLength) {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= maximumLength) return normalized;
  if (maximumLength <= 1) return "…".slice(0, maximumLength);

  const candidate = normalized.slice(0, maximumLength - 1);
  const lastSpace = candidate.lastIndexOf(" ");
  const cutoff = lastSpace >= Math.floor(maximumLength * 0.6) ? lastSpace : candidate.length;
  return `${candidate.slice(0, cutoff).trimEnd()}…`;
}

function formatSourceBlock(chunk, maximumLength, citation) {
  const title = compact(chunk.title, 120);
  const id = compact(chunk.id, 80);
  const type = compact(chunk.type, 40);
  const href = compact(chunk.href, 240);
  const linkLine = href ? `Link: ${href}\n` : "";
  const prefix = `[${citation}]\nSource id: ${id}\nTitle: ${title}\nType: ${type}\n${linkLine}Content: `;
  const suffix = `\n[/${citation}]`;
  const availableForText = maximumLength - prefix.length - suffix.length;

  if (availableForText >= 1) {
    return `${prefix}${truncateAtWord(chunk.text, availableForText)}${suffix}`;
  }

  const fallbackPrefix = `[${citation}] ${id}\n`;
  const fallbackAvailable = maximumLength - fallbackPrefix.length;
  if (fallbackAvailable < 1) return "";
  return `${fallbackPrefix}${truncateAtWord(chunk.text, fallbackAvailable)}`;
}

/**
 * Estimate tokens conservatively enough for a lightweight context guard.
 * This is intentionally tokenizer-independent; the caller should leave a
 * separate allowance for its system prompt, question, and generated answer.
 */
export function estimateTokens(value) {
  return Math.ceil(String(value ?? "").length / 4);
}

/**
 * Rank trusted, page-owned content and assemble a bounded context string.
 *
 * @param {object} input
 * @param {string} input.question
 * @param {Array<{id:string,title:string,type:string,text:string,keywords:string[],href:string}>} input.chunks
 * @param {number} [input.topK=5]
 * @param {number} [input.maxTokens=1200]
 * @param {number} [input.minScore=2]
 * @returns {{sources:Array, context:string, estimatedTokens:number}}
 */
export function retrieveContext({
  question,
  chunks,
  topK = DEFAULT_TOP_K,
  maxTokens = DEFAULT_MAX_TOKENS,
  minScore = DEFAULT_MIN_SCORE,
}) {
  if (typeof question !== "string") throw new TypeError("question must be a string");
  if (!Array.isArray(chunks)) throw new TypeError("chunks must be an array");
  chunks.forEach(assertTrustedChunk);

  const resolvedTopK = validateLimit(topK, "topK", DEFAULT_TOP_K);
  const resolvedMaxTokens = validateLimit(maxTokens, "maxTokens", DEFAULT_MAX_TOKENS);
  if (!Number.isFinite(minScore) || minScore < 0) {
    throw new RangeError("minScore must be a non-negative number");
  }

  const trimmedQuestion = question.trim();
  if (!trimmedQuestion || resolvedTopK === 0 || resolvedMaxTokens === 0) {
    return { sources: [], context: "", estimatedTokens: 0 };
  }

  const terms = meaningfulQueryTerms(trimmedQuestion);
  const broadOverview = isBroadOverview(trimmedQuestion);
  if (terms.length === 0 && !broadOverview) {
    return { sources: [], context: "", estimatedTokens: 0 };
  }

  const scored = chunks
    .map((chunk, index) => ({
      chunk,
      index,
      ...scoreChunk(chunk, terms, broadOverview),
    }))
    .filter((item) => (broadOverview ? item.score > 0 : item.score >= minScore))
    .sort((left, right) => right.score - left.score || left.index - right.index);

  const relativeScoreFloor = broadOverview
    ? 0
    : Math.max(minScore, (scored[0]?.score ?? 0) * 0.35);
  const ranked = scored.filter((item) => item.score >= relativeScoreFloor);

  const ordered = broadOverview ? diversify(ranked) : ranked;
  const candidates = ordered.slice(0, resolvedTopK);
  if (candidates.length === 0) {
    return { sources: [], context: "", estimatedTokens: 0 };
  }

  const maximumCharacters = resolvedMaxTokens * 4;
  const separator = "\n\n";
  const separatorCharacters = separator.length * Math.max(0, candidates.length - 1);
  const perSourceCharacters = Math.floor(
    (maximumCharacters - separatorCharacters) / candidates.length,
  );

  const included = candidates
    .map((candidate, index) => ({
      candidate,
      citation: `S${index + 1}`,
      block: formatSourceBlock(candidate.chunk, perSourceCharacters, `S${index + 1}`),
    }))
    .filter(({ block }) => block.length > 0);

  const context = included.map(({ block }) => block).join(separator);
  const sources = included.map(({ candidate, citation }) => ({
    citation,
    id: candidate.chunk.id,
    title: candidate.chunk.title,
    type: candidate.chunk.type,
    href: candidate.chunk.href,
    score: Number(candidate.score.toFixed(3)),
    matchedTerms: candidate.matchedTerms,
  }));

  return {
    sources,
    context,
    estimatedTokens: estimateTokens(context),
  };
}
