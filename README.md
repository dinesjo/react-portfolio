# React Portfolio

Personal portfolio site for Linus Dinesjö, built with React, Vite, and Tailwind CSS. The site presents selected projects, a filterable project archive, KTH coursework, and contact links.

## Requirements

- Node.js `^20.19.0 || >=22.12.0`
- npm
- Docker with Compose, for the Qdrant vector database
- A native Ollama daemon with `qwen3-embedding:0.6b`

## Getting Started

Install dependencies:

```bash
npm install
```

Create a local server environment file and add an Ollama Cloud API key:

```bash
cp .env.example .env.local
```

`OLLAMA_API_KEY` is server-only. Do not rename it with a `VITE_` prefix or put it
in client code.

Pull the pinned local embedding model and start the loopback-only vector store:

```bash
ollama pull qwen3-embedding:0.6b
npm run vector:up
```

Start the portfolio and its local API server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the portfolio and same-origin API server, loading `.env.local` when present. |
| `npm run dev:static` | Start Vite without the assistant API. |
| `npm run build` | Optimize project images, then build the production bundle into `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run start` | Serve the production build and API from the Node runtime. |
| `npm test` | Run the corpus, retrieval, and Ollama request tests. |
| `npm run lint` | Run ESLint over JavaScript and JSX files. |
| `npm run optimize-images` | Regenerate optimized WebP project images from `src/assets/project-originals/`. |
| `npm run vector:up` | Start Qdrant on `127.0.0.1:6333` with persistent Compose storage. |
| `npm run retrieval:evaluate` | Run the live English, Swedish, exact-match, and out-of-domain retrieval evaluation. |
| `npm run deploy` | Build the site and publish `dist/` with `gh-pages`. |

## Project Structure

```text
src/
  assets/
    project-originals/   Source screenshots and icons
    project-optimized/   Generated WebP assets used by the app
  components/            React UI components
  data/                  Project and course data
  App.jsx                Page composition
  main.jsx               React entry point
server/
  corpus.js              Page-owned records packed into retrieval chunks
  embeddings.js          Pinned local Ollama embedding contract
  qdrant.js              Persistent vector indexing and cosine search
  retrieval.js           Deterministic lexical ranking and context packing
  hybrid-retrieval.js    Dense/lexical rank fusion and relevance floors
  semantic-retrieval.js  Vector-index readiness and retrieval orchestration
  rate-limit.js          Socket-address request limiting with bounded state
  ollama.js              Fixed Ollama Cloud request contract
  index.js               Static server and same-origin API
```

## Portfolio Assistant

The assistant is an embedding-backed retrieval-augmented generation experiment
over the facts already published on this page. It does not crawl linked sites
or inspect screenshots. The server builds 23 trusted sources: one profile
record, 17 project records, and five course-year records.

The retrieval and generation runtimes are deliberately separate:

- native Ollama runs the pinned `qwen3-embedding:0.6b` model locally and emits
  1,024-dimensional embeddings;
- Qdrant stores those vectors in the persistent `portfolio_records_v1`
  collection and searches them with cosine similarity;
- the existing lexical ranker remains in the path for exact project names,
  technologies, and course codes;
- Ollama Cloud runs `gpt-oss:20b` only after retrieval has selected evidence.

At startup, the server compares each canonical record's content hash, embedding
model, and index schema with Qdrant. It batch-embeds only new or changed records,
removes stale points, and probes the embedding model before reporting retrieval
readiness. Qdrant results return only canonical record IDs and scores; prompt
evidence is always loaded again from the current in-process portfolio corpus,
never trusted from vector-database payload text.

For each question, the server:

1. validates, rate-limits, and concurrency-limits the request;
2. embeds the question with Qwen's retrieval instruction and searches Qdrant;
3. fuses dense and lexical ranks, applies absolute and relative relevance
   floors, and selects up to six records within a 3,000-token evidence budget;
4. sends only those records and up to four recent messages, packaged as one
   explicitly untrusted visitor transcript, to Ollama Cloud;
5. returns the answer with deterministic links to the consulted page records.

Dense retrieval has a calibrated minimum cosine score of `0.45`; candidates
must also reach 92% of the strongest accepted vector score. The included
evaluation keeps semantically phrased Swedish retrieval working while rejecting
unrelated weather and recipe questions. Exact lexical evidence can still retain
a course code or named technology when its dense score is weak.

The upstream host and model are fixed in server code. Direct Cloud API calls use
`https://ollama.com/api/chat` with `gpt-oss:20b`; the `gpt-oss:20b-cloud` name is
only used when routing through a signed-in local Ollama CLI or daemon. The model
context is capped at 8,192 tokens and generated answers at 450 tokens.

Ollama currently offers no official Cloud embedding model, so do not add a
fabricated `-cloud` suffix. The exact `qwen3-embedding:0.6b` tag matters: the
untagged `qwen3-embedding` name resolves to the substantially larger model.

## Images

Project screenshots and selected standalone images are stored in `src/assets/project-originals/`. The optimized WebP assets in `src/assets/project-optimized/` are generated by:

```bash
npm run optimize-images
```

The production build runs this automatically through the `prebuild` script, so `npm run build` keeps the optimized assets current.

## Styling

Tailwind CSS is processed through PostCSS as part of the Vite pipeline. No separate Tailwind watch or build command is needed.

- Tailwind configuration: `tailwind.config.js`
- PostCSS configuration: `postcss.config.js`
- Global styles: `src/index.css`

## Deployment

`npm run deploy` runs the production build and publishes `dist/` using `gh-pages`.

The Vite base path is `/` by default. Set `VITE_GITHUB_PAGES=true` when building for a GitHub Pages project path that should serve assets from `/react-portfolio/`.

GitHub Pages remains a static copy and does not expose the assistant API. The
self-hosted container serves both the portfolio and `/api/chat` from the Node
runtime. Qdrant remains on the internal Compose network and is published only
to host loopback for development. Its named volume keeps vectors across
container restarts. Supply `OLLAMA_API_KEY` only as a runtime environment
variable:

```bash
docker compose --env-file .env.local up --build
```

Compose builds the `runtime` target from the current checkout before starting
it. The app container reaches the native host Ollama daemon through
`host.docker.internal`. Docker Desktop provides that route on macOS. On Linux,
Compose maps the name to the Docker host gateway, and Ollama must listen on a
host address reachable from that gateway without being exposed publicly. Set
`OLLAMA_EMBEDDING_DOCKER_URL` when the server uses a different bridge address.

`/api/health` remains a liveness endpoint and returns HTTP 200 while the Node
process is running. `assistant.configured` is true only when both the Cloud key
is configured and the local embedding/vector index is ready. The response also
separates `generationConfigured`, `retrievalReady`, indexed record count,
embedding model, dimensions, and vector-store state.

`/api/ready` is the deployment-readiness endpoint. It returns HTTP 200 only when
Cloud generation is configured and semantic retrieval is ready; otherwise it
returns HTTP 503 with safe blocker codes. The container healthcheck uses this
endpoint, so `docker compose ps` does not report the portfolio healthy while its
assistant dependencies are unavailable. GitHub Actions runs `npm test` and
`npm run lint` before authenticating to GHCR and publishing any image.

The key is excluded from both Git and the Docker build context. Rotate any
development credential before publishing or sharing logs.
