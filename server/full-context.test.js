import assert from "node:assert/strict";
import test from "node:test";

import { portfolioChunks } from "./corpus.js";
import { courseRelatedWork, courses } from "../src/data/courses.js";
import { projectRecords } from "../src/data/projectRecords.js";
import { createChatPayload } from "./ollama.js";
import {
  FULL_CONTEXT_TOKEN_BUDGET,
  buildFullPortfolioContext,
  sourcesCitedInAnswer,
} from "./full-context.js";

test("packs every canonical portfolio source without truncation", () => {
  const result = buildFullPortfolioContext();

  assert.equal(result.sources.length, portfolioChunks.length);
  assert.ok(result.estimatedTokens < FULL_CONTEXT_TOKEN_BUDGET);

  portfolioChunks.forEach((chunk, index) => {
    const citation = `S${index + 1}`;
    assert.equal(result.sources[index].citation, citation);
    assert.match(result.context, new RegExp(`\\[${citation}\\]`));
    assert.ok(result.context.includes(chunk.text));
  });
});

test("puts the complete generated context into the model request", () => {
  const { context } = buildFullPortfolioContext();
  const payload = createChatPayload({ question: "What projects are in the portfolio?", context });
  const question = payload.messages.at(-1);
  assert.equal(question.role, "user");
  assert.ok(question.content.includes(`<trusted_portfolio_sources>\n${context}\n</trusted_portfolio_sources>`));
});

test("carries every project's published facts into ASK with its own citation", () => {
  const { context, sources } = buildFullPortfolioContext();

  for (const project of projectRecords) {
    const source = sources.find((item) => item.id === `project:${project.id}`);
    assert.ok(source, `Missing ASK source for ${project.id}`);
    assert.equal(source.href, `#project-${project.id}`);
    const block = context.split(`[${source.citation}]\n`)[1].split(`[/${source.citation}]`)[0];
    assert.ok(block.includes(project.title), `Missing title for ${project.id}`);
    assert.ok(block.includes(project.description), `Missing description for ${project.id}`);
    assert.ok(block.includes(project.date), `Missing dates for ${project.id}`);
    for (const note of project.highlights ?? []) {
      assert.ok(block.includes(note), `Missing published highlight for ${project.id}`);
    }
    if (project.isPrivate) assert.match(block, /do not infer confidential/);
  }
});

test("carries every course, highlight, and related-work connection into ASK", () => {
  const { context, sources } = buildFullPortfolioContext();

  for (const course of courses) {
    const source = sources.find((item) => item.id === `courses:year-${course.year}`);
    assert.ok(source, `Missing ASK source for ${course.code}`);
    const block = context.split(`[${source.citation}]\n`)[1].split(`[/${source.citation}]`)[0];
    const line = block.split("\n").find((item) => item.startsWith(`- ${course.code}:`));
    assert.ok(line, `Missing course ${course.code}`);
    assert.ok(line.includes(course.name), `Missing course name for ${course.code}`);
    if (course.featuredNote) {
      assert.ok(line.includes(course.featuredNote), `Missing highlight note for ${course.code}`);
      assert.ok(line.includes(`highlighted coursework, position ${course.featuredOrder}`));
    } else {
      assert.doesNotMatch(line, /highlighted coursework/);
    }
    const related = courseRelatedWork[course.code];
    if (related) {
      assert.ok(line.includes(related.note), `Missing related-work note for ${course.code}`);
      assert.ok(line.includes(`#project-${related.id}`), `Missing project link for ${course.code}`);
      assert.ok(sources.some((item) => item.id === `project:${related.id}`));
    }
  }
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
