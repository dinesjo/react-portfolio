/* eslint-env node */

export const EMBEDDING_BASE_URL =
  process.env.OLLAMA_EMBEDDING_URL?.trim() || "http://127.0.0.1:11434";
export const EMBEDDING_ENDPOINT = "/api/embed";
export const EMBEDDING_MODEL = "qwen3-embedding:0.6b";
export const EMBEDDING_DIMENSIONS = 1024;
export const EMBEDDING_TIMEOUT_MS = 30_000;
export const EMBEDDING_BATCH_SIZE = 32;

export const QWEN_QUERY_INSTRUCTION =
  "Given a portfolio visitor question, retrieve relevant portfolio passages that answer the question";

export class EmbeddingError extends Error {
  constructor(code, message, status = 502) {
    super(message);
    this.name = "EmbeddingError";
    this.code = code;
    this.status = status;
  }
}

function invalidInput(message = "Embedding input is invalid.") {
  return new EmbeddingError("invalid_embedding_input", message, 500);
}

function validateText(value, label) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw invalidInput(`${label} must be non-empty text.`);
  }
  return value;
}

function validatePositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw invalidInput(`${label} must be a positive safe integer.`);
  }
  return value;
}

function validateBaseUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw invalidInput("Embedding base URL is invalid.");
  }

  if (
    (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
    parsed.username ||
    parsed.password
  ) {
    throw invalidInput("Embedding base URL is invalid.");
  }

  return new URL(EMBEDDING_ENDPOINT, parsed).toString();
}

function isAbortSignal(value) {
  return (
    value &&
    typeof value.aborted === "boolean" &&
    typeof value.addEventListener === "function"
  );
}

function composeAbortSignal(signal, timeoutMs) {
  if (signal !== undefined && !isAbortSignal(signal)) {
    throw invalidInput("Embedding signal must be an AbortSignal.");
  }

  try {
    const timeoutSignal = AbortSignal.timeout(timeoutMs);
    return {
      signal: signal
        ? AbortSignal.any([signal, timeoutSignal])
        : timeoutSignal,
      timeoutSignal,
    };
  } catch {
    throw invalidInput("Embedding abort configuration is invalid.");
  }
}

function mappedFetchError(error, callerSignal, timeoutSignal) {
  if (callerSignal?.aborted) {
    return new EmbeddingError(
      "embedding_aborted",
      "The embedding request was cancelled.",
      499,
    );
  }

  if (timeoutSignal.aborted || error?.name === "TimeoutError") {
    return new EmbeddingError(
      "embedding_timeout",
      "The local embedding service took too long to respond.",
      504,
    );
  }

  if (error?.name === "AbortError") {
    return new EmbeddingError(
      "embedding_aborted",
      "The embedding request was cancelled.",
      499,
    );
  }

  return new EmbeddingError(
    "embedding_unreachable",
    "The local embedding service could not be reached.",
    503,
  );
}

function mappedUpstreamError(status) {
  if (status === 404) {
    return new EmbeddingError(
      "embedding_model_unavailable",
      "The configured local embedding model is unavailable.",
      503,
    );
  }

  if (status === 429) {
    return new EmbeddingError(
      "embedding_rate_limited",
      "The local embedding service is temporarily busy.",
      503,
    );
  }

  return new EmbeddingError(
    "embedding_upstream_failed",
    "The local embedding service returned an error.",
    503,
  );
}

function invalidResponse() {
  return new EmbeddingError(
    "invalid_embedding_response",
    "The local embedding service returned an invalid response.",
    502,
  );
}

function validateEmbeddings(payload, expectedCount, dimensions) {
  if (
    !payload ||
    typeof payload !== "object" ||
    !Array.isArray(payload.embeddings) ||
    payload.embeddings.length !== expectedCount
  ) {
    throw invalidResponse();
  }

  for (const vector of payload.embeddings) {
    if (!Array.isArray(vector) || vector.length !== dimensions) {
      throw invalidResponse();
    }

    if (
      vector.some(
        (value) => typeof value !== "number" || !Number.isFinite(value),
      )
    ) {
      throw invalidResponse();
    }
  }

  return payload.embeddings;
}

async function requestBatch({
  inputs,
  endpoint,
  model,
  dimensions,
  callerSignal,
  timeoutSignal,
  signal,
  fetchImpl,
}) {
  let response;
  try {
    response = await fetchImpl(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        model,
        input: inputs,
        truncate: false,
        dimensions,
      }),
      signal,
    });
  } catch (error) {
    throw mappedFetchError(error, callerSignal, timeoutSignal);
  }

  if (!response || response.ok !== true) {
    throw mappedUpstreamError(Number(response?.status) || 502);
  }

  let payload;
  try {
    payload = await response.json();
  } catch (error) {
    if (
      callerSignal?.aborted ||
      timeoutSignal.aborted ||
      error?.name === "AbortError" ||
      error?.name === "TimeoutError"
    ) {
      throw mappedFetchError(error, callerSignal, timeoutSignal);
    }
    throw invalidResponse();
  }

  return validateEmbeddings(payload, inputs.length, dimensions);
}

async function embedInputs({
  inputs,
  signal: callerSignal,
  fetchImpl = globalThis.fetch,
  baseUrl = EMBEDDING_BASE_URL,
  model = EMBEDDING_MODEL,
  dimensions = EMBEDDING_DIMENSIONS,
  batchSize = EMBEDDING_BATCH_SIZE,
  timeoutMs = EMBEDDING_TIMEOUT_MS,
}) {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    throw invalidInput("Embedding inputs must be a non-empty array.");
  }
  inputs.forEach((input, index) => validateText(input, `inputs[${index}]`));

  if (typeof fetchImpl !== "function") {
    throw invalidInput("Embedding fetch implementation must be a function.");
  }

  const endpoint = validateBaseUrl(baseUrl);
  const resolvedModel = validateText(model, "Embedding model").trim();
  validatePositiveInteger(dimensions, "Embedding dimensions");
  validatePositiveInteger(batchSize, "Embedding batch size");
  validatePositiveInteger(timeoutMs, "Embedding timeout");

  const { signal, timeoutSignal } = composeAbortSignal(
    callerSignal,
    timeoutMs,
  );
  const embeddings = [];

  for (let index = 0; index < inputs.length; index += batchSize) {
    const batch = inputs.slice(index, index + batchSize);
    const vectors = await requestBatch({
      inputs: batch,
      endpoint,
      model: resolvedModel,
      dimensions,
      callerSignal,
      timeoutSignal,
      signal,
      fetchImpl,
    });
    embeddings.push(...vectors);
  }

  if (embeddings.length !== inputs.length) {
    throw invalidResponse();
  }

  return embeddings;
}

export function formatEmbeddingQuery(query) {
  const normalized = validateText(query, "Embedding query").trim();
  return `Instruct: ${QWEN_QUERY_INSTRUCTION}\n Query:${normalized}`;
}

export async function embedDocuments({ documents, ...options } = {}) {
  if (!Array.isArray(documents) || documents.length === 0) {
    throw invalidInput("Embedding documents must be a non-empty array.");
  }

  documents.forEach((document, index) =>
    validateText(document, `documents[${index}]`),
  );

  return embedInputs({ inputs: documents, ...options });
}

export async function embedQuery({ query, ...options } = {}) {
  const [embedding] = await embedInputs({
    inputs: [formatEmbeddingQuery(query)],
    ...options,
  });
  return embedding;
}
