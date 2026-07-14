import { performance } from "node:perf_hooks";

import { buildFullPortfolioContext } from "../server/full-context.js";
import { askOllama } from "../server/ollama.js";

const DEFAULT_MODELS = [
  "minimax-m3",
  "gemma4:31b",
  "nemotron-3-super",
  "nemotron-3-ultra",
  "gpt-oss:120b",
];
const REACT_PROJECTS = [
  "Thesis Tracker",
  "AI-Diary",
  "HabitGrower",
  "React Pathfinding Visualization",
  "FitTrackr",
  "Deadline Tracker",
  "This Website",
];
const requestedModels = process.argv.slice(2).join(",");
const models = (requestedModels || process.env.EVAL_MODELS || DEFAULT_MODELS.join(","))
  .split(",")
  .map((model) => model.trim())
  .filter(Boolean);
const { context } = buildFullPortfolioContext();

function normalizeForComparison(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[‐‑–—]/g, "-")
    .replace(/[’‘]/g, "'");
}

const cases = [
  {
    id: "react-enumeration",
    question: "Which projects in the portfolio used React?",
    checks(answer) {
      const normalized = normalizeForComparison(answer);
      return {
        allSevenProjects: REACT_PROJECTS.every((title) => normalized.includes(title)),
        aiDiaryIncluded: normalized.includes("AI-Diary"),
        cited: /\[S\d+\]/.test(answer),
      };
    },
  },
  {
    id: "private-attribution",
    question: "What did Linus build for AI-Diary?",
    checks(answer) {
      const normalized = normalizeForComparison(answer);
      return {
        neutralAttribution: /\bworked on\b/i.test(normalized),
        noEscalatedOwnership:
          !/(?:\b(?:Linus|he)\b.{0,24}\b(?:built|created|designed|developed|led|owned)\b|\b(?:built|created|designed|developed|led|owned)\b.{0,24}\bby Linus\b)/i.test(
            normalized,
          ),
        cited: /\[S\d+\]/.test(answer),
      };
    },
  },
  {
    id: "out-of-scope",
    question: "What will the weather be in Stockholm tomorrow?",
    checks(answer) {
      const normalized = normalizeForComparison(answer);
      return {
        declinesUnsupportedAnswer:
          /(?:not|isn't|is not|doesn't|does not).{0,50}(?:published|included|available|contain)|outside.{0,50}portfolio/i.test(
            normalized,
          ),
        noInventedForecast:
          !/\b(?:degrees?|celsius|fahrenheit|rainy|sunny|cloudy)\b/i.test(
            normalized,
          ),
      };
    },
  },
  {
    id: "visitor-recommendation",
    question:
      "I'm curious about AI and knowledge graphs. Which project should I look at first, and why?",
    checks(answer) {
      return {
        recommendsKnowledgeGraphProject: answer.includes("Industrial Knowledge Graph QA"),
        givesPublishedReason: /(?:knowledge graph|MAZE|retrieval|graph quer)/i.test(answer),
        cited: /\[S\d+\]/.test(answer),
        avoidsPortfolioCliches: !/\b(?:showcases|demonstrates)\b/i.test(answer),
      };
    },
  },
  {
    id: "swedish-private-attribution",
    question: "Vad byggde Linus för AI-Diary?",
    checks(answer) {
      return {
        answersInSwedish: /\b(?:Linus|han|verktyg|dagbok)\b/i.test(answer),
        neutralAttribution: /\barbetade med\b/i.test(answer),
        noEscalatedOwnership: !/\b(?:byggde|utvecklade|ledde|skapade)\b/i.test(answer),
        cited: /\[S\d+\]/.test(answer),
      };
    },
  },
];

if (!process.env.OLLAMA_API_KEY) {
  throw new Error("OLLAMA_API_KEY is required for the live model evaluation.");
}

for (const model of models) {
  const modelResult = { model, cases: [], passed: 0, total: 0 };

  for (const evaluationCase of cases) {
    const startedAt = performance.now();

    try {
      const result = await askOllama({
        apiKey: process.env.OLLAMA_API_KEY,
        model,
        question: evaluationCase.question,
        context,
      });
      const checks = evaluationCase.checks(result.answer);
      const passed = Object.values(checks).filter(Boolean).length;
      const total = Object.keys(checks).length;

      modelResult.passed += passed;
      modelResult.total += total;
      modelResult.cases.push({
        id: evaluationCase.id,
        durationMs: Math.round(performance.now() - startedAt),
        checks,
        metrics: result.metrics,
        answer: result.answer,
      });
    } catch (error) {
      modelResult.cases.push({
        id: evaluationCase.id,
        durationMs: Math.round(performance.now() - startedAt),
        error: {
          code: error?.code ?? "evaluation_failed",
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  process.stdout.write(`${JSON.stringify(modelResult, null, 2)}\n`);
}
