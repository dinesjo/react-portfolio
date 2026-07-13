import { portfolioChunks } from "../server/corpus.js";
import {
  EMBEDDING_MODEL,
  embedDocuments,
  embedQuery,
} from "../server/embeddings.js";
import {
  DEFAULT_VECTOR_SCORE_THRESHOLD,
  retrieveHybridContext,
} from "../server/hybrid-retrieval.js";
import { createQdrantStore } from "../server/qdrant.js";

const evaluationCases = [
  {
    question: "Which projects best demonstrate work with AI and knowledge graphs?",
    expectedIds: ["project:master-thesis-kgqa"],
  },
  {
    question: "What did Linus make so field staff could document a day without typing?",
    expectedIds: ["project:ai-diary"],
  },
  {
    question: "Which project made learning an instrument feel like a rhythm game?",
    expectedIds: ["project:note-hero"],
  },
  {
    question: "Vilket projekt omvandlar talade uppdateringar till strukturerade anteckningar?",
    expectedIds: ["project:ai-diary"],
  },
  {
    question: "Which KTH courses relate to security and software reliability?",
    expectedIds: ["courses:year-4"],
  },
  {
    question: "What is DD2395?",
    expectedIds: ["courses:year-4"],
  },
  {
    question: "What will the weather be in Tokyo tomorrow?",
    expectedIds: [],
  },
  {
    question: "Give me a recipe for sourdough bread.",
    expectedIds: [],
  },
];

const store = createQdrantStore();
const synchronization = await store.synchronize({
  chunks: portfolioChunks,
  embedDocuments,
  embeddingModel: EMBEDDING_MODEL,
});

console.log(
  `Vector index ready: ${synchronization.indexedCount} records, ${synchronization.upsertedCount} embedded in this run.`,
);

let failures = 0;
for (const evaluation of evaluationCases) {
  const vector = await embedQuery({ query: evaluation.question });
  const rawVectorMatches = await store.query({
    vector,
    limit: Math.min(6, portfolioChunks.length),
    scoreThreshold: -1,
  });
  const retrieval = retrieveHybridContext({
    question: evaluation.question,
    chunks: portfolioChunks,
    vectorMatches: rawVectorMatches,
    topK: 6,
    maxTokens: 3_000,
    vectorScoreThreshold: DEFAULT_VECTOR_SCORE_THRESHOLD,
  });
  const retrievedIds = retrieval.sources.map((source) => source.id);
  const passed = evaluation.expectedIds.length === 0
    ? retrievedIds.length === 0
    : evaluation.expectedIds.every((id) => retrievedIds.includes(id));
  if (!passed) failures += 1;

  console.log(`\n${passed ? "PASS" : "FAIL"}: ${evaluation.question}`);
  console.log(
    "  vector:",
    rawVectorMatches
      .slice(0, 3)
      .map((match) => `${match.chunkId} (${match.score.toFixed(3)})`)
      .join(", "),
  );
  console.log(
    "  fused:",
    retrieval.sources.length > 0
      ? retrieval.sources
          .map(
            (source) =>
              `${source.id} [${source.retrievalSignals.join("+")}]`,
          )
          .join(", ")
      : "no portfolio evidence",
  );
}

if (failures > 0) {
  throw new Error(`${failures} semantic retrieval evaluation case(s) failed.`);
}

console.log(`\nAll ${evaluationCases.length} semantic retrieval cases passed.`);
