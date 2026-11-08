import { performance } from "node:perf_hooks";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { buildFullPortfolioContext } from "../server/full-context.js";
import { askOllama } from "../server/ollama.js";
import { imperfectCases } from "./assistant-evaluation-cases.mjs";
import { projectRecords } from "../src/data/projectRecords.js";

const DEFAULT_MODELS = [
  "minimax-m3",
  "gemma4:31b",
  "nemotron-3-super",
  "nemotron-3-ultra",
  "gpt-oss:120b",
];
const REACT_PROJECTS = projectRecords
  .filter((project) => project.technologies.includes("React"))
  .map((project) => project.title);
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
        allReactProjects: REACT_PROJECTS.every((title) => normalized.includes(title)),
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
        publishedOwnership: /sole (?:technical )?developer|only (?:technical )?developer/i.test(normalized),
        describesWorkflow: /speech|spoken|voice/i.test(normalized) && /note|diary/i.test(normalized),
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
          /(?:not|isn't|is not|doesn't|does not).{0,50}(?:published|included|available|contain)|outside.{0,50}portfolio|(?:don't|do not|cannot|can't).{0,40}(?:access|forecast)|(?:limited|restricted) to.{0,60}portfolio/i.test(
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
        recommendsKnowledgeGraphProject: answer.includes("Truck compatibility with AI"),
        givesPublishedReason: /(?:knowledge graph|MAZE|retrieval|graph quer)/i.test(answer),
        cited: /\[S\d+\]/.test(answer),
        avoidsPortfolioCliches: !/\b(?:showcases|demonstrates)\b/i.test(answer),
      };
    },
  },
  {
    id: "swedish-private-attribution",
    question: "Vad byggde Linus för AI-Diary, och var han ensam utvecklare?",
    checks(answer) {
      return {
        answersInSwedish: /\b(?:Linus|han|verktyg|dagbok)\b/i.test(answer),
        publishedOwnership: /ensam|enda/i.test(answer) && /utvecklare|utveckling/i.test(answer),
        describesWorkflow: /tal|röst|transkrip/i.test(answer) && /anteckning|dagbok/i.test(answer),
        cited: /\[S\d+\]/.test(answer),
      };
    },
  },
];

export const evaluationCases = [...cases, ...imperfectCases];

export async function evaluateModel({ model, apiKey, cases = evaluationCases, ask = askOllama }) {
  const modelResult = { model, cases: [], passed: 0, total: 0, failedCases: 0, errors: 0 };

  for (const evaluationCase of cases) {
    const startedAt = performance.now();

    try {
      const result = await ask({
        apiKey,
        model,
        question: evaluationCase.question,
        history: evaluationCase.history ?? [],
        context,
      });
      const checks = evaluationCase.checks(result.answer);
      const passed = Object.values(checks).filter(Boolean).length;
      const total = Object.keys(checks).length;

      modelResult.passed += passed;
      modelResult.total += total;
      if (passed < total) modelResult.failedCases += 1;
      modelResult.cases.push({
        id: evaluationCase.id,
        question: evaluationCase.question,
        ...(evaluationCase.history ? { history: evaluationCase.history } : {}),
        durationMs: Math.round(performance.now() - startedAt),
        checks,
        metrics: result.metrics,
        answer: result.answer,
      });
    } catch (error) {
      modelResult.failedCases += 1;
      modelResult.errors += 1;
      modelResult.cases.push({
        id: evaluationCase.id,
        question: evaluationCase.question,
        durationMs: Math.round(performance.now() - startedAt),
        error: {
          code: error?.code ?? "evaluation_failed",
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  }

  return modelResult;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  if (!process.env.OLLAMA_API_KEY) {
    throw new Error("OLLAMA_API_KEY is required for the live model evaluation.");
  }
  for (const model of models) {
    const result = await evaluateModel({ model, apiKey: process.env.OLLAMA_API_KEY });
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (result.failedCases > 0) process.exitCode = 1;
  }
}
