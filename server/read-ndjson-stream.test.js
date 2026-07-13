import assert from "node:assert/strict";
import test from "node:test";

import {
  isNdjsonResponse,
  readNdjsonStream,
} from "../src/utils/readNdjsonStream.js";

function createChunkedResponse(chunks, contentType = "application/x-ndjson") {
  const encoder = new TextEncoder();

  return new Response(
    new ReadableStream({
      start(controller) {
        chunks.forEach((chunk) => controller.enqueue(encoder.encode(chunk)));
        controller.close();
      },
    }),
    { headers: { "Content-Type": contentType } },
  );
}

test("detects NDJSON responses with content type parameters", () => {
  const response = createChunkedResponse([], "application/x-ndjson; charset=utf-8");
  assert.equal(isNdjsonResponse(response), true);
  assert.equal(isNdjsonResponse(new Response("{}")), false);
});

test("reads events split across network chunks and accepts a trailing line", async () => {
  const response = createChunkedResponse([
    '{"type":"status","phase":"retr',
    'ieving"}\n\n{"type":"delta","content":"Hel',
    'lo"}\n{"type":"done","answer":"Hello"}',
  ]);
  const events = [];

  await readNdjsonStream(response, (event) => events.push(event));

  assert.deepEqual(events, [
    { type: "status", phase: "retrieving" },
    { type: "delta", content: "Hello" },
    { type: "done", answer: "Hello" },
  ]);
});

test("rejects malformed and non-object stream events", async () => {
  await assert.rejects(
    readNdjsonStream(createChunkedResponse(["not-json\n"]), () => {}),
    /invalid stream event/i,
  );
  await assert.rejects(
    readNdjsonStream(createChunkedResponse(["[]\n"]), () => {}),
    /invalid stream event/i,
  );
});

test("bounds an unterminated stream event", async () => {
  await assert.rejects(
    readNdjsonStream(createChunkedResponse(["x".repeat(64_001)]), () => {}),
    /invalid stream event/i,
  );
});

test("rejects a response without a readable body", async () => {
  await assert.rejects(
    readNdjsonStream(
      new Response(null, {
        headers: { "Content-Type": "application/x-ndjson" },
      }),
      () => {},
    ),
    /could not be streamed/i,
  );
});
