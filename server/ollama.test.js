import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_OUTPUT_TOKENS,
  MODEL_CONTEXT_TOKENS,
  OLLAMA_CLOUD_URL,
  OLLAMA_MODEL,
  askOllama,
  createChatPayload,
  toPlainText,
} from "./ollama.js";

test("builds a fixed direct-cloud request with bounded generation", () => {
  const payload = createChatPayload({
    question: "Which security courses are listed?",
    context: "[S1] DD2395 Computer Security",
    history: [],
  });

  assert.equal(OLLAMA_CLOUD_URL, "https://ollama.com/api/chat");
  assert.equal(payload.model, OLLAMA_MODEL);
  assert.equal(payload.model, "gpt-oss:20b");
  assert.equal(payload.options.num_ctx, MODEL_CONTEXT_TOKENS);
  assert.equal(payload.options.num_predict, MAX_OUTPUT_TOKENS);
  assert.equal(payload.think, "low");
  assert.equal(payload.stream, false);
  assert.match(payload.messages.at(-1).content, /\[S1\]/);
});

test("keeps only four bounded conversation messages", () => {
  const history = Array.from({ length: 7 }, (_, index) => ({
    role: index % 2 ? "assistant" : "user",
    content: `message-${index}-${"x".repeat(2_000)}`,
  }));

  const payload = createChatPayload({
    question: "Follow up",
    context: "[S1] Context",
    history,
  });

  const retainedHistory = payload.messages.slice(1, -1);
  assert.equal(retainedHistory.length, 4);
  assert.ok(retainedHistory.every((message) => message.content.length <= 1_200));
});

test("normalizes common Markdown decoration into display-safe plain text", () => {
  assert.equal(
    toPlainText("## Answer\n**SnusKoll** uses `Blazor`."),
    "Answer\nSnusKoll uses Blazor.",
  );
});

test("sends the API key only as an authorization header and ignores thinking", async () => {
  let capturedRequest;
  const fetchImpl = async (url, init) => {
    capturedRequest = { url, init };
    return new Response(
      JSON.stringify({
        message: { content: "A grounded answer [S1].", thinking: "hidden reasoning" },
        prompt_eval_count: 210,
        eval_count: 28,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  };

  const result = await askOllama({
    apiKey: "test-key",
    question: "Question",
    context: "[S1] Evidence",
    fetchImpl,
  });

  assert.equal(capturedRequest.url, OLLAMA_CLOUD_URL);
  assert.equal(capturedRequest.init.headers.Authorization, "Bearer test-key");
  assert.doesNotMatch(capturedRequest.init.body, /test-key/);
  assert.deepEqual(result, {
    answer: "A grounded answer [S1].",
    metrics: {
      promptTokens: 210,
      responseTokens: 28,
      totalDuration: null,
    },
  });
});
