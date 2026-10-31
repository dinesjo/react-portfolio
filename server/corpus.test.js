import assert from "node:assert/strict";
import test from "node:test";
import { corpusStats, portfolioChunks } from "./corpus.js";
import { courseRelatedWork, courses, studyYears } from "../src/data/courses.js";
import { projectRecords } from "../src/data/projectRecords.js";
import { profile } from "../src/data/profile.js";

test("builds exactly one profile and every canonical project and course year", () => {
  const years = [...new Set(courses.map((course) => course.year))].sort((a, b) => a - b);
  assert.deepEqual(studyYears, years);
  assert.deepEqual(corpusStats, {
    sourceCount: 1 + projectRecords.length + years.length,
    projectCount: projectRecords.length,
    courseCount: courses.length,
    lastUpdated: profile.education.recordUpdated,
  });
  assert.deepEqual(portfolioChunks.map((chunk) => chunk.id), [
    "profile:linus-dinesjo",
    ...projectRecords.map((project) => `project:${project.id}`),
    ...years.map((year) => `courses:year-${year}`),
  ]);
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
  assert.match(snuskoll.text, /contract tests for API authorization attributes and public review fields/);
  assert.match(snuskoll.text, /sign-in and sessions directly through Supabase Auth/);
  assert.match(snuskoll.text, /do not exercise requests against a live Supabase instance/);
});

test("includes every published course-to-project connection without inventing course assignments", () => {
  for (const [code, relatedProjects] of Object.entries(courseRelatedWork)) {
    const course = courses.find((item) => item.code === code);
    const chunk = portfolioChunks.find((item) => item.id === `courses:year-${course.year}`);
    for (const related of relatedProjects) {
      assert.ok(projectRecords.some((project) => project.id === related.id));
      assert.ok(chunk.text.includes(`${related.title} (#project-${related.id})`));
      assert.ok(chunk.text.includes(related.note));
    }
  }
});

test("distinguishes a research publication from an app link", () => {
  const bachelor = portfolioChunks.find((chunk) => chunk.id === "project:bachelor");
  assert.match(bachelor.text, /Read on DiVA: https:\/\/urn\.kb\.se\/resolve/);
  assert.doesNotMatch(bachelor.text, /Try the app:/);
});
