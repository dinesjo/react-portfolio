# Course project expansion

Four course projects added iteratively on `codex/course-projects-and-ask`.
Facts live in `src/data/projectRecords.js`; course connections live in
`src/data/courses.js`. ASK derives its sources from those same records.

## Source review

Repository metadata, README files, selected source, and contributor history were
reviewed with the GitHub CLI. Candidate applications and security demonstrations
were not executed. These are group projects, not claims of sole authorship.

- **DD2528 — Autonomous Warehouse Simulation:**
  [final group assignment](https://github.com/KlaraLindemalm/DD2528-Group-1-Assignment-4),
  with earlier [assignment 2](https://github.com/dinesjo/relaut-assignment-2) and
  [assignment 3](https://github.com/dinesjo/relaut-assignment-3) stages. Python
  robot/conveyor state machines, Dijkstra, Bug2, coordination, and battery/job
  scheduling. Linus's visible commits include battery work, fetch/put operations,
  and box-movement demos. This is a simulation prototype; no formal safety or
  physical-robot deployment claim is made.
- **DD2480 — Continuous Integration Server:**
  [group repository](https://github.com/DD2480-group16-VT25/continuous-integration).
  README contribution statement credits Linus and Robin with notifications and
  tests, and Linus with asynchronous processing/request differentiation. The
  server uses Jetty, JGit, and Maven. Its notification tests write real GitHub
  statuses, so none were executed. The existing SnusKoll connection remains a
  related personal project, separate from the course assignment.
- **DH2643 — Taskeroo:** private group repository reviewed read-only. The owner
  confirmed the course connection in this conversation; the repository itself
  does not identify DH2643. React/TypeScript frontend, Express backend, Supabase
  data/auth, boards, tasks, members, comments, and GitHub/Calendar integrations
  are supported by README and selected source. Linus's visible commits include
  auth/routing, Supabase, task/backend integration, and UI changes. Public copy
  retains group attribution and supplies no private repository link. Deployment,
  OAuth flows, and authorization behavior were not runtime-verified.
- **DD2525 — Python Deserialization Security:**
  [group repository](https://github.com/eliasfloreteng/language-security-project).
  README identifies the course and describes file-tampering and Flask diary
  demonstrations, HMAC integrity checks, and safer data-only formats. Linus's
  commit `1c0237be` adds the HMAC defense. The summary explicitly distinguishes
  integrity from safe deserialization: an authenticated malicious pickle can
  still execute code. No vulnerable app or payload was executed during review.

Course connections support multiple projects per course and appear in both the
highlight cards and the complete course record, using the same lists as ASK.

## Artwork

Originals are saved in `src/assets/project-originals/`; the normal optimizer
creates responsive WebP versions in `src/assets/project-optimized/`. These are
conceptual illustrations, not screenshots or measured system diagrams.

Generated using the built-in image generation tool. The exact prompts are kept
in [PROMPTS.md](PROMPTS.md).

## Verification

- Portfolio unit/context tests, ESLint, production build, and Git whitespace checks passed.
- All four entries and their artwork were checked in the Codex browser on desktop
  and at a 390px mobile viewport. Image previews load, course links focus the
  corresponding card, and Taskeroo exposes no private source link.
- The local server was restarted and its health endpoint confirms the expanded
  ASK corpus is loaded. Tests verify that every shared record reaches the model
  request without truncation.
- Four focused model-evaluation cases cover group scope, course connections,
  Taskeroo privacy, and the HMAC boundary. They are prepared for a future
  authorized provider run; no new cloud inference was requested for these additions.
