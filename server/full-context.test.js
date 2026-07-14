import assert from "node:assert/strict";
import test from "node:test";

import { portfolioChunks } from "./corpus.js";
import {
  FULL_CONTEXT_TOKEN_BUDGET,
  buildFullPortfolioContext,
  sourcesCitedInAnswer,
} from "./full-context.js";

test("packs every canonical portfolio source without truncation", () => {
  const result = buildFullPortfolioContext();

  assert.equal(result.sources.length, portfolioChunks.length);
  assert.equal(result.sources.length, 23);
  assert.ok(result.estimatedTokens < FULL_CONTEXT_TOKEN_BUDGET);

  portfolioChunks.forEach((chunk, index) => {
    const citation = `S${index + 1}`;
    assert.equal(result.sources[index].citation, citation);
    assert.match(result.context, new RegExp(`\\[${citation}\\]`));
    assert.ok(result.context.includes(chunk.text));
  });
});

test("fails instead of silently truncating an oversized full context", () => {
  assert.throws(
    () => buildFullPortfolioContext({ maxTokens: 1 }),
    /above the 1-token budget/,
  );
});

test("returns unique canonical sources in the order cited by an answer", () => {
  const { sources } = buildFullPortfolioContext();
  const cited = sourcesCitedInAnswer(
    "First [S7, S2], repeated [S7], full-width 【S23】, unknown [S99].",
    sources,
  );

  assert.deepEqual(
    cited.map((source) => source.citation),
    ["S7", "S2", "S23"],
  );
});

test("returns no source links when the model does not cite evidence", () => {
  const { sources } = buildFullPortfolioContext();
  assert.deepEqual(sourcesCitedInAnswer("That is not published.", sources), []);
});
