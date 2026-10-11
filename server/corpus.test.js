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

test("grounds case-study answers in benchmark scope and engineering tradeoffs", () => {
  const thesis = portfolioChunks.find((chunk) => chunk.id === "project:master-thesis-kgqa");
  const snuskoll = portfolioChunks.find((chunk) => chunk.id === "project:snuskoll");
  assert.match(thesis.text, /280 questions/);
  assert.match(thesis.text, /77\.1%.*96\.4%.*98\.2%/);
  assert.match(thesis.text, /not statistically decisive/);
  assert.match(thesis.text, /single diagnostic run/);
  assert.match(thesis.text, /do not establish production reliability/);
  assert.match(thesis.text, /explanation correctness was not scored/);
  assert.match(thesis.text, /local GraphDB snapshot/);
  assert.match(thesis.text, /Dense retrieval: verdict accuracy 77\.1%; median end-to-end response time 5\.34 s/);
  assert.match(thesis.text, /Hybrid lexical-semantic retrieval: verdict accuracy 96\.4%; median end-to-end response time 5\.45 s/);
  assert.match(thesis.text, /SPARQL graph agent: verdict accuracy 98\.2%; median end-to-end response time 21\.62 s/);
  assert.match(snuskoll.text, /tradeoff is maintaining/);
  assert.match(snuskoll.text, /contract tests around authorization/);
});
