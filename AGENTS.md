# Repository instructions

Prefer robustness over flashiness.

## Keep portfolio content and ASK in sync

- Enter project facts once in `src/data/projectRecords.js`. Put detailed case-study facts in `src/data/caseStudies.js`, referenced by the project record. `src/data/projects.js` adds presentation and image assets; do not put facts there that ASK needs to know.
- Maintain course names, completion records, highlight order/notes, and course-to-project connections in `src/data/courses.js`. Maintain personal and employment facts in `src/data/profile.js`. Both the page and ASK consume these shared records.
- `server/corpus.js` derives ASK's sources from those records; `server/full-context.js` includes every source in the trusted model context. Do not maintain a second project/course list in the system prompt, or hardcode inventory counts. If a new content field appears on the page, include its relevant text in the corpus serializer and extend the data-to-context coverage checks.
- Text that appears only in JSX, README/design notes, images, or linked repositories is not automatically available to ASK. Publish approved facts in the shared records; ASK does not crawl links, inspect artwork, or read private repositories.
- Preserve published scope, dates, group attribution, and private-project boundaries. A team project must not become a claim that Linus implemented everything himself. Public upstream links must not be described as the team's source repository.
- Run `npm test` and `npm run lint` after content/context changes, and `npm run build` after page or asset changes. The tests must verify that every canonical project, course, highlight note, and related-work connection reaches the complete trusted context; derive expected inventories from the data rather than updating numeric snapshots.
- For changes to model instructions or important source semantics, add focused cases to `scripts/assistant-evaluation-cases.mjs` and run authorized live cases against the configured provider. Distinguish deterministic context coverage from observed model behavior; do not claim universal answer correctness from a passing evaluation.
- The server builds its context at startup. Restart `npm run dev` after shared-data or server changes; browser hot reload alone does not refresh ASK. Production receives updates when the new source is built and deployed with a restarted container. Keep credentials server-side and out of logs.
