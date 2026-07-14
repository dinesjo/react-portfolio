# React Portfolio

Personal portfolio site for Linus Dinesjö, built with React, Vite, and Tailwind CSS. The site presents selected projects, a filterable project archive, KTH coursework, contact links, and a server-backed portfolio chat.

## Requirements

- Node.js `^20.19.0 || >=22.12.0`
- npm
- An Ollama Cloud API key for the chat interface

## Getting Started

Install dependencies and create a local server environment file:

```bash
npm install
cp .env.example .env.local
```

Add the Cloud credential to `.env.local`. `OLLAMA_API_KEY` is server-only: do
not rename it with a `VITE_` prefix or put it in client code.

Start the portfolio and its same-origin API server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the portfolio and API server, loading `.env.local` when present. |
| `npm run dev:static` | Start Vite without the assistant API. |
| `npm run build` | Optimize project images and build the production bundle into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run start` | Serve the production build and API from the Node runtime. |
| `npm run context:evaluate` | Compare configured Ollama Cloud models against full-context grounding checks. |
| `npm test` | Run corpus, context, streaming, safety, and supporting server tests. |
| `npm run lint` | Run ESLint over JavaScript and JSX files. |
| `npm run optimize-images` | Regenerate optimized WebP project images. |
| `npm run deploy` | Build and publish the static site with `gh-pages`; this does not include the API. |

## Project Structure

```text
src/
  assets/                Source and optimized project images
  components/            React UI components
  data/                  Canonical project, course, and profile data
  App.jsx                Page composition
  main.jsx               React entry point
server/
  corpus.js              Page-owned records used by the assistant
  full-context.js        Stable citation labels and complete context packing
  ollama.js              Ollama Cloud request, streaming, and output safeguards
  rate-limit.js          Socket-address request limiting with bounded state
  index.js               Static server and same-origin API
```

The repository still contains the earlier embedding, vector-store, and hybrid
retrieval modules and their regression tests. They are retained as an experiment
and comparison point, but they are no longer imported by the live server.

## Portfolio Assistant

The assistant answers from the facts already published on this page. It does
not crawl linked sites or inspect screenshots. The canonical corpus currently
contains 23 records: one profile, 17 projects, and five course-year records.

That complete corpus is only about 4,300 estimated prompt tokens, so the live
path deliberately uses all records instead of trying to retrieve a small subset.
Each request receives the same unabridged, citation-labelled context. This makes
cross-record questions such as “Which projects used React?” complete and removes
embedding and ranking failure modes from the visitor-facing path.

Safeguards remain explicit:

- a 12,000-token corpus budget fails at startup rather than silently truncating
  or omitting a record;
- the Cloud request has a configurable context window, 1,200-token default output
  cap, 45-second upstream timeout, request size limit, per-address rate limit,
  and single-request concurrency limit;
- recent conversation history is capped at 40 messages and approximately 6,000
  tokens, then packaged as one explicitly untrusted visitor transcript rather
  than authoritative assistant messages;
- the system prompt requires source-level attribution, neutral wording for
  private work, exact course facts, same-language replies, and an explicit
  response when the portfolio does not contain an answer;
- only records actually cited in the final answer become source links in the UI;
- course questions are buffered for deterministic course-name normalization,
  while project and general answers stream immediately.

Ollama Cloud generation is configurable with server environment variables:

```dotenv
OLLAMA_MODEL=gemma4:31b
OLLAMA_CONTEXT_TOKENS=131072
OLLAMA_MAX_OUTPUT_TOKENS=1200
```

The request context is hard-capped at 128K tokens, even if a larger environment
override is supplied. The largest normal prompt envelope allowed by the corpus,
history, question, and output safeguards is estimated below 22K tokens, leaving
substantial headroom. `think` is disabled for predictable visitor latency. No
model or internal runtime metadata is sent to the frontend.

## Images and Styling

Original project assets live in `src/assets/project-originals/`; generated WebP
files live in `src/assets/project-optimized/`. The production build refreshes
them through the `prebuild` script.

Tailwind CSS is processed through PostCSS. Relevant configuration lives in
`tailwind.config.js`, `postcss.config.js`, and `src/index.css`.

## Deployment

GitHub Pages remains a static copy and cannot expose the assistant API. The
self-hosted container serves both the portfolio and `/api/chat` from the Node
runtime. Supply the Cloud credential only at runtime:

```bash
docker compose --env-file .env.local up --build
```

The Compose service has no local Ollama or vector-database dependency. Model and
token limits may be overridden through the same environment file.

`/api/health` is a liveness endpoint and reports whether the chat is configured.
`/api/ready` returns HTTP 200 only when the Cloud key and complete in-process
portfolio context are ready; the container healthcheck uses this endpoint.

The key is excluded from Git and the Docker build context. Rotate development
credentials before publishing or sharing logs.
