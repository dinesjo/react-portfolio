import assert from "node:assert/strict";
import test from "node:test";
import { corpusStats, portfolioChunks } from "./corpus.js";

test("builds one profile, seventeen project, and five course-year chunks", () => {
  assert.deepEqual(corpusStats, {
    sourceCount: 23,
    projectCount: 17,
    courseCount: 39,
    lastUpdated: "October 2026",
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

test("confirms all listed courses are completed without publishing grades", () => {
  const yearFour = portfolioChunks.find((chunk) => chunk.id === "courses:year-4");
  assert.match(yearFour.text, /DD2395: Computer Security/);
  for (const chunk of portfolioChunks.filter((chunk) => chunk.type === "course")) {
    assert.match(chunk.text, /all listed courses in this study year are completed/i);
    assert.match(chunk.text, /graduated from KTH in summer 2026/);
    assert.match(chunk.text, /Individual grades are not published/);
    assert.doesNotMatch(chunk.text, /preliminary|ongoing/);
  }
});

test("publishes graduation and current AMF work as confirmed profile facts", () => {
  const profile = portfolioChunks.find((chunk) => chunk.type === "profile");
  assert.match(profile.text, /graduated from KTH Royal Institute of Technology in summer 2026/);
  assert.match(profile.text, /Current employer: AMF/);
  assert.match(profile.text, /Full-stack development, Test automation/);
  assert.match(profile.text, /actuaries independently configure test cases/);
  assert.match(profile.text, /regression behavior across versions of Lumera/);
  assert.match(profile.text, /user interface, backend services, test scheduling, fault detection, and CI\/CD pipelines/);
  assert.doesNotMatch(profile.text, /student|Current focus:.*thesis/i);
});

test("ends Linus's AI-Diary work in June 2026", () => {
  const aiDiary = portfolioChunks.find((chunk) => chunk.id === "project:ai-diary");
  assert.match(aiDiary.text, /Dates: November 2024 - June 2026/);
  assert.doesNotMatch(aiDiary.text, /Status note:/);
  assert.doesNotMatch(aiDiary.text, /Lifecycle: ongoing/);
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
