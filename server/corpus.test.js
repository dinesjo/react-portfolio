import assert from "node:assert/strict";
import test from "node:test";
import { corpusStats, portfolioChunks } from "./corpus.js";

test("builds one profile, seventeen project, and five course-year chunks", () => {
  assert.deepEqual(corpusStats, {
    sourceCount: 23,
    projectCount: 17,
    courseCount: 39,
    lastUpdated: "May 2026",
  });
  assert.equal(portfolioChunks.filter((chunk) => chunk.type === "profile").length, 1);
  assert.equal(portfolioChunks.filter((chunk) => chunk.type === "project").length, 17);
  assert.equal(portfolioChunks.filter((chunk) => chunk.type === "course").length, 5);
});

test("contains only semantic text and stable in-page source links", () => {
  const serialized = JSON.stringify(portfolioChunks);
  assert.doesNotMatch(serialized, /\.webp|project-optimized|imageFull/);
  assert.ok(portfolioChunks.every((chunk) => chunk.href.startsWith("#")));
});

test("marks professional private summaries with a non-inference boundary", () => {
  const aiDiary = portfolioChunks.find((chunk) => chunk.id === "project:ai-diary");
  assert.match(aiDiary.text, /private project/i);
  assert.match(aiDiary.text, /do not infer confidential/i);
});

test("packs exact course codes and the preliminary year-five caveat", () => {
  const yearFour = portfolioChunks.find((chunk) => chunk.id === "courses:year-4");
  const yearFive = portfolioChunks.find((chunk) => chunk.id === "courses:year-5");
  assert.match(yearFour.text, /DD2395: Computer Security/);
  assert.match(yearFive.text, /preliminary/i);
  assert.match(yearFive.text, /does not state individual completion or grades/i);
});
