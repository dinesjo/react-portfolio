# React Portfolio

Personal portfolio site for Linus Dinesjö, built with React, Vite, and Tailwind CSS. The site presents selected projects, a filterable project archive, KTH coursework, contact links, and a server-backed portfolio chat.

Featured projects open standalone case studies at shareable hash URLs such as
`/#/work/snuskoll`. These also work when the app is hosted as static files,
without server-side route rewrites. Section links use URL fragments and support
browser history and keyboard focus. Featured cards use the original project
images, with readable research results beside them and full image previews.

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

The assistant answers from the same shared data that renders the page. Project
facts come from `src/data/projectRecords.js` and referenced case studies; courses,
highlight order/notes, and related-work links come from `src/data/courses.js`;
profile facts come from `src/data/profile.js`. Update the facts there once and
both the page and ASK receive them. There is no separate project list to maintain
in the model instructions. ASK does not crawl linked sites, inspect screenshots,
or read text that exists only in README/design notes.

`server/corpus.js` generates a profile record, one record for every project, and
one for each study year present in the course data. The live path deliberately
uses every record instead of trying to retrieve a small subset.
Each request receives the same unabridged, citation-labelled context. This makes
cross-record questions such as “Which projects used React?” complete and removes
embedding and ranking failure modes from the visitor-facing path.

The server builds this context at startup, so restart `npm run dev` after shared
data changes; browser hot reload alone does not refresh ASK. In production,
rebuild and deploy the updated container. Startup logs report the generated
source count and estimated tokens. `npm test` checks that every canonical project,
course, highlight note, and course-to-project connection reaches the trusted
context with a citation; expected inventories are derived from the data.
See [AGENTS.md](AGENTS.md) for the maintenance instructions used by coding agents.

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
- only records actually cited in the final answer appear as quiet, linked
  portfolio entries inside a default-closed disclosure below it; citation
  labels remain internal so the prose stays natural and uncluttered;
- course questions are buffered for deterministic course-name and citation
  normalization without discarding separate work or project answers, while
  project and general answers stream immediately;
- the browser buffers transport deltas and reveals complete words at an adaptive
  cadence, so provider chunk sizes do not produce abrupt blocks of text;
- visitors can stop an answer, which cancels the request and any buffered text,
  keeps earlier messages, and restores the question for editing;
- assistant answers support constrained Markdown for emphasis and semantic
  lists. Raw HTML is ignored, unsupported markup is unwrapped to text, and the
  renderer is loaded only after a visitor starts a conversation.

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

The [context review](docs/assistant-context-review.md) maps every prompt input,
documents the imperfect-query experiments and remaining limitations, and explains
the shared coursework-to-project evidence. To evaluate only the configured default
model, run `npm run context:evaluate -- gemma4:31b`. The expanded evaluation uses
the general grounding cases plus S3K group-attribution and highlighted-course
checks, and exits nonzero for failed checks or provider errors; its checks are
diagnostics rather than proof that every claim is supported.

## Images and Styling

Original project assets live in `src/assets/project-originals/`; generated WebP
files live in `src/assets/project-optimized/`. The production build refreshes
them through the `prebuild` script.

Tailwind CSS is processed through PostCSS. Relevant configuration lives in
`postcss.config.js` and `src/index.css`; Tailwind 4's theme and source paths are
declared in the stylesheet. Supported browsers are Safari 16.4+, Chrome 111+,
and Firefox 128+.

Cards keep a readable minimum column width, and stacked case-study artwork is
bounded by the viewport. Full illustrations stay uncropped and can be expanded.

For rendered layout regression checks, start the app and use Playwright CLI:

```bash
playwright-cli -s=responsive open http://127.0.0.1:8080
playwright-cli -s=responsive run-code --filename=scripts/check-responsive.browser.js
playwright-cli -s=responsive close
```

Repeat with `--browser=firefox` or `--browser=webkit` on the `open` command.
The script checks the portfolio, expanded disclosures, every case-study route,
and image-viewer dismissal/focus across mobile, landscape, tablet, laptop, and
wide desktop sizes. Its 320px and 640px layouts also cover the reflow widths of
a 1280px browser at 400% and 200% zoom. It checks overflow and clipped text;
visual review and interactive ASK checks remain separate. It sends no questions
to the model provider.

Install the locked dependencies with `npm ci`. Run `npm audit` to check both
runtime and build dependencies against current security advisories.

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
