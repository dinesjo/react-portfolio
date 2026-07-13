import assert from "node:assert/strict";
import test from "node:test";

import {
  fuseRetrievalRanks,
  retrieveHybridContext,
} from "./hybrid-retrieval.js";
import { rankLexicalChunks } from "./retrieval.js";

const chunks = [
  {
    id: "project:atlas",
    title: "Atlas",
    type: "project",
    text: "An interactive map for exploring historical places.",
    keywords: ["MapLibre", "geography"],
    href: "#project-atlas",
  },
  {
    id: "project:music",
    title: "Music Tutor",
    type: "project",
    text: "A microphone-driven rhythm game for instrument practice.",
    keywords: ["Unity", "audio"],
    href: "#project-music",
  },
  {
    id: "courses:year-4",
    title: "KTH coursework — study year 4",
    type: "course",
    text: "DD2395: Computer Security",
    keywords: ["DD2395", "security"],
    href: "#courses-year-4",
  },
];

test("retrieves a semantic paraphrase with no lexical evidence", () => {
  const result = retrieveHybridContext({
    question: "Did he make something that listens while a person rehearses?",
    chunks,
    vectorMatches: [
      { chunkId: "project:music", score: 0.72 },
      { chunkId: "project:atlas", score: 0.31 },
    ],
    topK: 2,
    maxTokens: 200,
  });

  assert.deepEqual(result.sources.map((source) => source.id), ["project:music"]);
  assert.deepEqual(result.sources[0].retrievalSignals, ["vector"]);
  assert.equal(result.diagnostics.mode, "hybrid-vector");
});

test("rewards sources supported by both lexical and vector ranks", () => {
  const lexical = rankLexicalChunks({
    question: "Which project uses an interactive map?",
    chunks,
  });
  const ranked = fuseRetrievalRanks({
    chunks,
    lexicalRanked: lexical.ranked,
    vectorMatches: [
      { chunkId: "project:music", score: 0.7 },
      { chunkId: "project:atlas", score: 0.69 },
    ],
  });

  assert.equal(ranked[0].chunk.id, "project:atlas");
  assert.deepEqual(ranked[0].retrievalSignals, ["lexical", "vector"]);
});

test("retains exact lexical matches even when their dense score is weak", () => {
  const result = retrieveHybridContext({
    question: "What is DD2395?",
    chunks,
    vectorMatches: [{ chunkId: "courses:year-4", score: 0.3 }],
    topK: 2,
    maxTokens: 200,
  });

  assert.deepEqual(result.sources.map((source) => source.id), ["courses:year-4"]);
  assert.deepEqual(result.sources[0].retrievalSignals, ["lexical"]);
});

test("uses explicit content types to exclude dense results of another type", () => {
  const result = retrieveHybridContext({
    question: "Which courses relate to security?",
    chunks,
    vectorMatches: [
      { chunkId: "project:atlas", score: 0.9 },
      { chunkId: "courses:year-4", score: 0.7 },
    ],
    topK: 3,
    maxTokens: 200,
  });

  assert.ok(result.sources.length > 0);
  assert.ok(result.sources.every((source) => source.type === "course"));
});

test("rejects weak semantic neighbors when lexical retrieval has no evidence", () => {
  const result = retrieveHybridContext({
    question: "Will it rain in Tokyo tomorrow?",
    chunks,
    vectorMatches: [
      { chunkId: "project:atlas", score: 0.44 },
      { chunkId: "project:music", score: 0.39 },
    ],
    topK: 3,
    maxTokens: 200,
  });

  assert.deepEqual(result.sources, []);
  assert.equal(result.context, "");
});

test("drops the weak dense tail relative to the strongest semantic match", () => {
  const result = retrieveHybridContext({
    question: "Does anything react when a person performs aloud?",
    chunks,
    vectorMatches: [
      { chunkId: "project:music", score: 0.72 },
      { chunkId: "project:atlas", score: 0.6 },
    ],
    topK: 3,
    maxTokens: 200,
  });

  assert.deepEqual(result.sources.map((source) => source.id), ["project:music"]);
  assert.equal(result.diagnostics.vectorCandidateCount, 1);
});

test("ignores unknown vector payload ids and keeps the evidence budget", () => {
  const result = retrieveHybridContext({
    question: "Give me a portfolio overview.",
    chunks: chunks.map((chunk) => ({
      ...chunk,
      text: `${chunk.text} ${"More published evidence. ".repeat(100)}`,
    })),
    vectorMatches: [
      { chunkId: "untrusted:unknown", score: 0.99 },
      { chunkId: "project:atlas", score: 0.8 },
      { chunkId: "courses:year-4", score: 0.7 },
    ],
    topK: 2,
    maxTokens: 60,
  });

  assert.ok(result.sources.every((source) => source.id !== "untrusted:unknown"));
  assert.ok(result.estimatedTokens <= 60);
});
