import assert from "node:assert/strict";
import test from "node:test";
import {
  EMBEDDING_BASE_URL,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_ENDPOINT,
  EMBEDDING_MODEL,
  EmbeddingError,
  QWEN_QUERY_INSTRUCTION,
  embedDocuments,
  embedQuery,
  formatEmbeddingQuery,
} from "./embeddings.js";

function vector(seed = 0, dimensions = EMBEDDING_DIMENSIONS) {
  return Array.from({ length: dimensions }, (_, index) => seed + index / 10_000);
}

function embeddingResponse(embeddings, status = 200) {
  return new Response(JSON.stringify({ model: EMBEDDING_MODEL, embeddings }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

test("embeds raw documents with the pinned local Ollama payload", async () => {
  const documents = [
    "Project: Industrial Knowledge Graph QA.",
    "Course: DD2395 Computer Security.",
  ];
  let capturedRequest;
  const fetchImpl = async (url, init) => {
    capturedRequest = { url, init };
    return embeddingResponse([vector(1), vector(2)]);
  };

  const result = await embedDocuments({ documents, fetchImpl });
  const payload = JSON.parse(capturedRequest.init.body);

  assert.equal(
    capturedRequest.url,
    new URL(EMBEDDING_ENDPOINT, EMBEDDING_BASE_URL).toString(),
  );
  assert.equal(capturedRequest.init.method, "POST");
  assert.equal(capturedRequest.init.headers.Authorization, undefined);
  assert.deepEqual(payload, {
    model: "qwen3-embedding:0.6b",
    input: documents,
    truncate: false,
    dimensions: 1024,
  });
  assert.equal(EMBEDDING_MODEL, "qwen3-embedding:0.6b");
  assert.equal(EMBEDDING_DIMENSIONS, 1024);
  assert.equal(result.length, documents.length);
  assert.equal(result[0].length, EMBEDDING_DIMENSIONS);
});

test("formats only queries with the exact Qwen retrieval instruction", async () => {
  const query = "Which projects use knowledge graphs?";
  const expected =
    `Instruct: ${QWEN_QUERY_INSTRUCTION}\n Query:${query}`;
  let payload;
  const fetchImpl = async (_url, init) => {
    payload = JSON.parse(init.body);
    return embeddingResponse([vector(3)]);
  };

  const result = await embedQuery({ query, fetchImpl });

  assert.equal(formatEmbeddingQuery(`  ${query}  `), expected);
  assert.deepEqual(payload.input, [expected]);
  assert.equal(result.length, EMBEDDING_DIMENSIONS);
});

test("batches document embeddings and preserves input and output order", async () => {
  const documents = ["one", "two", "three", "four", "five"];
  const batches = [];
  let seed = 1;
  const fetchImpl = async (_url, init) => {
    const { input } = JSON.parse(init.body);
    batches.push(input);
    const response = input.map(() => vector(seed++));
    return embeddingResponse(response);
  };

  const result = await embedDocuments({
    documents,
    batchSize: 2,
    fetchImpl,
  });

  assert.deepEqual(batches, [["one", "two"], ["three", "four"], ["five"]]);
  assert.equal(result.length, 5);
  assert.deepEqual(
    result.map((embedding) => embedding[0]),
    [1, 2, 3, 4, 5],
  );
});

test("rejects wrong vector counts, dimensions, and non-finite values", async (t) => {
  const invalidPayloads = [
    { name: "count", embeddings: [] },
    { name: "dimensions", embeddings: [[0, 1]] },
    { name: "finite values", embeddings: [vector()] },
  ];
  invalidPayloads[2].embeddings[0][17] = Number.POSITIVE_INFINITY;

  for (const { name, embeddings } of invalidPayloads) {
    await t.test(name, async () => {
      const fetchImpl = async () => ({
        ok: true,
        status: 200,
        json: async () => ({ embeddings }),
      });

      await assert.rejects(
        embedDocuments({ documents: ["document"], fetchImpl }),
        (error) => {
          assert.ok(error instanceof EmbeddingError);
          assert.equal(error.code, "invalid_embedding_response");
          assert.equal(error.status, 502);
          return true;
        },
      );
    });
  }
});

test("maps upstream status and transport failures to safe typed errors", async (t) => {
  await t.test("upstream status", async () => {
    const fetchImpl = async () =>
      new Response("sensitive upstream detail", { status: 500 });

    await assert.rejects(
      embedQuery({ query: "private question text", fetchImpl }),
      (error) => {
        assert.ok(error instanceof EmbeddingError);
        assert.equal(error.code, "embedding_upstream_failed");
        assert.equal(error.status, 503);
        assert.doesNotMatch(error.message, /sensitive|private/i);
        return true;
      },
    );
  });

  await t.test("transport failure", async () => {
    const fetchImpl = async () => {
      throw new Error("connection includes internal details");
    };

    await assert.rejects(
      embedQuery({ query: "question", fetchImpl }),
      (error) => {
        assert.ok(error instanceof EmbeddingError);
        assert.equal(error.code, "embedding_unreachable");
        assert.doesNotMatch(error.message, /internal details/i);
        return true;
      },
    );
  });
});

test("composes caller cancellation with the embedding timeout signal", async () => {
  const controller = new AbortController();
  let capturedSignal;
  const fetchImpl = async (_url, init) => {
    capturedSignal = init.signal;
    return new Promise((_resolve, reject) => {
      init.signal.addEventListener(
        "abort",
        () => reject(init.signal.reason),
        { once: true },
      );
    });
  };

  const pending = embedQuery({
    query: "question",
    signal: controller.signal,
    timeoutMs: 5_000,
    fetchImpl,
  });
  controller.abort();

  await assert.rejects(pending, (error) => {
    assert.ok(error instanceof EmbeddingError);
    assert.equal(error.code, "embedding_aborted");
    assert.equal(error.status, 499);
    return true;
  });
  assert.equal(capturedSignal.aborted, true);
  assert.notEqual(capturedSignal, controller.signal);
});

test("maps an elapsed embedding timeout without exposing transport details", async () => {
  const fetchImpl = async (_url, init) =>
    new Promise((_resolve, reject) => {
      const keepAlive = setTimeout(
        () => reject(new Error("timeout signal did not fire")),
        100,
      );
      init.signal.addEventListener(
        "abort",
        () => {
          clearTimeout(keepAlive);
          reject(init.signal.reason);
        },
        { once: true },
      );
    });

  await assert.rejects(
    embedQuery({
      query: "question",
      timeoutMs: 1,
      fetchImpl,
    }),
    (error) => {
      assert.ok(error instanceof EmbeddingError);
      assert.equal(error.code, "embedding_timeout");
      assert.equal(error.status, 504);
      return true;
    },
  );
});

test("rejects invalid input before making an upstream request", async () => {
  let called = false;
  const fetchImpl = async () => {
    called = true;
    return embeddingResponse([vector()]);
  };

  await assert.rejects(
    embedDocuments({ documents: ["   "], fetchImpl }),
    (error) => {
      assert.ok(error instanceof EmbeddingError);
      assert.equal(error.code, "invalid_embedding_input");
      return true;
    },
  );
  assert.equal(called, false);
});
