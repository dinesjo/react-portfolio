import assert from "node:assert/strict";
import test from "node:test";

import { estimateTokens, retrieveContext } from "./retrieval.js";

const chunks = [
  {
    id: "project-cloud-diary",
    title: "Cloud Diary",
    type: "project",
    text: "A React interface backed by Azure Functions and Cosmos DB for structured field notes.",
    keywords: ["React", "Azure", "serverless", "Cosmos DB"],
    href: "/projects/cloud-diary",
  },
  {
    id: "project-rust-renderer",
    title: "Rust Renderer",
    type: "project",
    text: "A small physically based renderer written in Rust with a focus on performance.",
    keywords: ["Rust", "graphics", "ray tracing"],
    href: "/projects/rust-renderer",
  },
  {
    id: "course-dd2424",
    title: "DD2424 Deep Learning in Data Science",
    type: "course",
    text: "Graduate coursework covering neural networks, optimization, CNNs, and sequence models.",
    keywords: ["DD2424", "deep learning", "KTH"],
    href: "/education#dd2424",
  },
  {
    id: "course-id1019",
    title: "ID1019 Programming II",
    type: "course",
    text: "Functional and concurrent programming concepts explored with Elixir.",
    keywords: ["ID1019", "Elixir", "concurrency"],
    href: "/education#id1019",
  },
  {
    id: "experience-integration-developer",
    title: "Integration Developer",
    type: "experience",
    text: "Professional work designing and maintaining dependable API integrations.",
    keywords: ["APIs", "integration", "software engineering"],
    href: "/experience#integration-developer",
  },
  {
    id: "skills-toolkit",
    title: "Technical toolkit",
    type: "skill",
    text: "Daily tools include JavaScript, Python, C sharp, Git, Docker, and cloud platforms.",
    keywords: ["JavaScript", "Python", "Docker", "Git"],
    href: "/skills",
  },
];

test("ranks a project by the technologies in the question", () => {
  const result = retrieveContext({
    question: "Which project used React with Azure?",
    chunks,
    topK: 3,
    maxTokens: 300,
  });

  assert.equal(result.sources[0].id, "project-cloud-diary");
  assert.ok(result.sources[0].matchedTerms.includes("azure"));
  assert.ok(result.sources[0].matchedTerms.includes("react"));
  assert.equal(result.sources[0].citation, "S1");
  assert.match(result.context, /\[S1\]/);
  assert.match(result.context, /Cloud Diary/);
  assert.ok(
    result.sources.every(
      (source) => source.id !== "project-rust-renderer",
    ),
  );
});

test("gives an exact course code a strong match", () => {
  const result = retrieveContext({
    question: "What was covered in DD2424?",
    chunks,
    topK: 1,
    maxTokens: 200,
  });

  assert.equal(result.sources.length, 1);
  assert.equal(result.sources[0].id, "course-dd2424");
  assert.ok(result.sources[0].score >= 20);
});

test("uses diverse source types for a broad overview", () => {
  const result = retrieveContext({
    question: "Give me an overview of the projects, studies, work, and technical skills.",
    chunks,
    topK: 4,
    maxTokens: 500,
  });

  assert.equal(result.sources.length, 4);
  assert.equal(new Set(result.sources.map((source) => source.type)).size, 4);
  assert.ok(result.sources.some((source) => source.type === "project"));
  assert.ok(result.sources.some((source) => source.type === "course"));
});

test("returns no context for an irrelevant question", () => {
  const result = retrieveContext({
    question: "What will the weather be in Tokyo tomorrow?",
    chunks,
    topK: 5,
    maxTokens: 300,
  });

  assert.deepEqual(result, { sources: [], context: "", estimatedTokens: 0 });
});

test("never exceeds the requested approximate token budget", () => {
  const longChunks = chunks.map((chunk) => ({
    ...chunk,
    text: `${chunk.text} ${"Detailed portfolio evidence. ".repeat(200)}`,
  }));

  const result = retrieveContext({
    question: "Give me a portfolio overview of projects, courses, and experience.",
    chunks: longChunks,
    topK: 3,
    maxTokens: 60,
  });

  assert.ok(result.sources.length <= 3);
  assert.ok(result.estimatedTokens <= 60);
  assert.equal(result.estimatedTokens, estimateTokens(result.context));
  assert.ok(result.context.length <= 60 * 4);
});
