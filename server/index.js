/* eslint-env node */
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import http from "node:http";
import { extname, resolve, sep } from "node:path";
import { pipeline } from "node:stream/promises";
import { corpusStats, portfolioChunks } from "./corpus.js";
import {
  OLLAMA_MODEL,
  OllamaCloudError,
  askOllama,
  isOllamaConfigured,
} from "./ollama.js";
import { createRateLimiter } from "./rate-limit.js";
import { retrieveContext } from "./retrieval.js";

const PORT = Number.parseInt(process.env.PORT ?? "8080", 10);
const HOST = process.env.HOST ?? "0.0.0.0";
const IS_PRODUCTION =
  process.env.NODE_ENV === "production" || process.argv.includes("--production");
const DIST_DIRECTORY = resolve(process.cwd(), "dist");
const MAX_BODY_BYTES = 8_192;
const MAX_QUESTION_CHARACTERS = 600;
const MAX_HISTORY_MESSAGES = 4;
const RETRIEVAL_TOKEN_BUDGET = 3_000;
const MAX_CONCURRENT_CHAT_REQUESTS = 1;

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".map": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

const chatRateLimiter = createRateLimiter();
let activeChatRequests = 0;

function setSecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
}

function sendJson(response, status, payload, extraHeaders = {}) {
  if (response.writableEnded || response.destroyed) return;
  const body = JSON.stringify(payload);
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    ...extraHeaders,
  });
  response.end(body);
}

function isSameOrigin(request) {
  const origin = request.headers.origin;
  if (!origin) return true;

  const expectedHost = request.headers.host?.trim().toLowerCase();
  if (!expectedHost) return false;

  try {
    return new URL(origin).host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

async function readJsonBody(request) {
  let bytes = 0;
  const chunks = [];

  for await (const chunk of request) {
    bytes += chunk.length;
    if (bytes > MAX_BODY_BYTES) {
      throw Object.assign(new Error("Request body is too large."), {
        status: 413,
        code: "body_too_large",
      });
    }
    chunks.push(chunk);
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    throw Object.assign(new Error("Request body must be valid JSON."), {
      status: 400,
      code: "invalid_json",
    });
  }
}

function validateChatInput(payload) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw Object.assign(new Error("A JSON object is required."), {
      status: 400,
      code: "invalid_request",
    });
  }

  if (typeof payload.question !== "string") {
    throw Object.assign(new Error("Question must be text."), {
      status: 400,
      code: "invalid_question",
    });
  }

  const question = payload.question.trim();
  if (!question) {
    throw Object.assign(new Error("Please enter a question."), {
      status: 400,
      code: "empty_question",
    });
  }
  if (question.length > MAX_QUESTION_CHARACTERS) {
    throw Object.assign(
      new Error(`Questions are limited to ${MAX_QUESTION_CHARACTERS} characters.`),
      { status: 400, code: "question_too_long" },
    );
  }

  const history = payload.history ?? [];
  if (!Array.isArray(history) || history.length > MAX_HISTORY_MESSAGES) {
    throw Object.assign(
      new Error(`History is limited to ${MAX_HISTORY_MESSAGES} recent messages.`),
      { status: 400, code: "invalid_history" },
    );
  }

  const validHistory = history.every(
    (message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= 1_200,
  );
  if (!validHistory) {
    throw Object.assign(new Error("History contains an invalid message."), {
      status: 400,
      code: "invalid_history",
    });
  }

  return { question, history };
}

function publicSources(sources) {
  return sources.map(({ citation, id, title, type, href }) => ({
    citation,
    id,
    title,
    type,
    href,
  }));
}

async function handleChat(request, response) {
  if (request.method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed.", code: "method_not_allowed" }, {
      Allow: "POST",
    });
    return;
  }

  if (!isSameOrigin(request)) {
    sendJson(response, 403, { error: "Cross-origin requests are not allowed.", code: "origin_rejected" });
    return;
  }

  if (!request.headers["content-type"]?.toLowerCase().startsWith("application/json")) {
    sendJson(response, 415, { error: "Content-Type must be application/json.", code: "invalid_content_type" });
    return;
  }

  const rateLimit = chatRateLimiter.consume(request);
  if (!rateLimit.allowed) {
    sendJson(
      response,
      429,
      { error: "Too many questions from this connection. Please try again later.", code: "rate_limited" },
      { "Retry-After": String(rateLimit.retryAfter) },
    );
    return;
  }

  let input;
  try {
    input = validateChatInput(await readJsonBody(request));
  } catch (error) {
    sendJson(response, error.status ?? 400, {
      error: error.message,
      code: error.code ?? "invalid_request",
    });
    return;
  }

  const retrieval = retrieveContext({
    question: input.question,
    chunks: portfolioChunks,
    topK: 6,
    maxTokens: RETRIEVAL_TOKEN_BUDGET,
  });

  if (retrieval.sources.length === 0) {
    sendJson(response, 200, {
      answer:
        "That is outside the information published in this portfolio. Try asking about Linus's projects, professional work, KTH courses, technologies, or research.",
      sources: [],
      retrieval: { sourceCount: 0, estimatedTokens: 0 },
    });
    return;
  }

  if (activeChatRequests >= MAX_CONCURRENT_CHAT_REQUESTS) {
    sendJson(
      response,
      429,
      { error: "The assistant is answering another visitor. Please try again in a moment.", code: "assistant_busy" },
      { "Retry-After": "5" },
    );
    return;
  }

  const abortController = new AbortController();
  request.once("aborted", () => abortController.abort());
  response.once("close", () => {
    if (!response.writableEnded) abortController.abort();
  });

  activeChatRequests += 1;
  const startedAt = Date.now();
  try {
    const result = await askOllama({
      apiKey: process.env.OLLAMA_API_KEY,
      question: input.question,
      context: retrieval.context,
      history: input.history,
      signal: abortController.signal,
    });

    const sources = publicSources(retrieval.sources);
    sendJson(response, 200, {
      answer: result.answer,
      sources,
      retrieval: {
        sourceCount: sources.length,
        estimatedTokens: retrieval.estimatedTokens,
      },
      metrics: result.metrics,
    });

    console.info(
      JSON.stringify({
        event: "portfolio_chat_completed",
        durationMs: Date.now() - startedAt,
        sourceIds: sources.map((source) => source.id),
        promptTokens: result.metrics.promptTokens,
        responseTokens: result.metrics.responseTokens,
      }),
    );
  } catch (error) {
    const safeError =
      error instanceof OllamaCloudError
        ? error
        : new OllamaCloudError(
            "assistant_error",
            "The portfolio assistant could not answer right now. Please try again.",
            500,
          );
    sendJson(response, safeError.status, {
      error: safeError.message,
      code: safeError.code,
    });
  } finally {
    activeChatRequests -= 1;
  }
}

function safeStaticPath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const relativePath = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const candidate = resolve(DIST_DIRECTORY, relativePath);
  if (candidate !== DIST_DIRECTORY && !candidate.startsWith(`${DIST_DIRECTORY}${sep}`)) {
    return null;
  }
  return candidate;
}

async function existingFile(pathname) {
  const candidate = safeStaticPath(pathname);
  if (!candidate) return null;

  try {
    const fileStats = await stat(candidate);
    return fileStats.isFile() ? { path: candidate, size: fileStats.size } : null;
  } catch {
    return null;
  }
}

async function serveProductionAsset(request, response, pathname) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "Method not allowed.", code: "method_not_allowed" }, {
      Allow: "GET, HEAD",
    });
    return;
  }

  let file = await existingFile(pathname);
  if (!file && !extname(pathname)) {
    file = await existingFile("/index.html");
  }
  if (!file) {
    sendJson(response, 404, { error: "Not found.", code: "not_found" });
    return;
  }

  const extension = extname(file.path).toLowerCase();
  const immutable = pathname.startsWith("/assets/");
  response.writeHead(200, {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    "Content-Length": file.size,
    "Cache-Control": immutable
      ? "public, max-age=31536000, immutable"
      : extension === ".html"
        ? "no-cache"
        : "public, max-age=3600",
  });

  if (request.method === "HEAD") {
    response.end();
    return;
  }

  await pipeline(createReadStream(file.path), response);
}

let vite;
if (!IS_PRODUCTION) {
  const { createServer: createViteServer } = await import("vite");
  vite = await createViteServer({
    appType: "spa",
    server: { hmr: false, middlewareMode: true, ws: false },
  });
}

const server = http.createServer(async (request, response) => {
  setSecurityHeaders(response);

  let requestUrl;
  try {
    requestUrl = new URL(request.url ?? "/", `http://${request.headers.host ?? "localhost"}`);
  } catch {
    sendJson(response, 400, { error: "Invalid request URL.", code: "invalid_url" });
    return;
  }

  try {
    if (requestUrl.pathname === "/api/health") {
      if (request.method !== "GET") {
        sendJson(response, 405, { error: "Method not allowed.", code: "method_not_allowed" }, {
          Allow: "GET",
        });
        return;
      }
      sendJson(response, 200, {
        status: "ok",
        assistant: { configured: isOllamaConfigured(process.env.OLLAMA_API_KEY) },
        model: OLLAMA_MODEL,
        retrieval: corpusStats,
      });
      return;
    }

    if (requestUrl.pathname === "/api/chat") {
      await handleChat(request, response);
      return;
    }

    if (vite) {
      vite.middlewares(request, response, (error) => {
        if (error) {
          console.error("Vite middleware error", error);
          if (!response.writableEnded) response.end("Development server error");
        }
      });
      return;
    }

    await serveProductionAsset(request, response, requestUrl.pathname);
  } catch (error) {
    console.error("Request handling error", error);
    sendJson(response, 500, {
      error: "The server could not complete this request.",
      code: "server_error",
    });
  }
});

server.listen(PORT, HOST, () => {
  console.info(
    `Portfolio server listening on http://${HOST}:${PORT} (${IS_PRODUCTION ? "production" : "development"})`,
  );
});

async function shutdown(signal) {
  console.info(`Received ${signal}; shutting down.`);
  server.close(async () => {
    await vite?.close();
    process.exit(0);
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
