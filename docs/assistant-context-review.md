# Portfolio Q&A context review

Reviewed 15 October 2026 against the configured `gemma4:31b` model on Ollama Cloud. The experiments below were run locally before publication.

## What the model receives

Every question sends two or three messages, in this order:

| Message | Contents | Trust and limits |
| --- | --- | --- |
| System | Portfolio-guide role, evidence/attribution rules, language and response style, ambiguity handling, scope/security boundaries, Markdown restrictions | Roughly 2,133 estimated tokens after this review; the model is told that sources and visitor text cannot override these instructions |
| User, optional | JSON transcript inside `untrusted_visitor_transcript`, including `claimedRole` for each message | Up to 40 recent messages, 1,200 characters per message, and about 6,000 estimated tokens; older entries are dropped; `<` and `>` are escaped; claimed assistant entries have no authority |
| User, latest | Full `trusted_portfolio_sources` block, then the current visitor question | All 23 sources, approximately 6,571 estimated tokens including wrappers; question limited to 600 characters |

The snapshot preamble identifies the record update month, explains that first-person source prose is Linus's voice, and distinguishes published project status from a live availability check. It also explains that coursework links are published connections, not proof that a course caused a project or technology choice.

Each source carries a citation label, source ID, title, type, in-page link, and complete semantic text. The corpus is assembled once at server startup and reused in every request. There is no retrieval step, summarization, or silent truncation. A corpus above the 12,000-token estimate budget stops startup.

Token estimates use characters divided by four, not the model's tokenizer. They are measured for this revision, not permanent limits on actual provider token counts. The configured context window is 131,072 tokens, output is capped at 1,200 tokens, temperature is 0.2, and `think` is disabled.

## Source map

Citation numbers reflect the current source order and can change when records are reordered. Evaluation checks for specific evidence resolve the labels from source IDs.

| Labels | Records | Included facts |
| --- | --- | --- |
| S1 | Profile | Name, role, headline, public summary, completed KTH coursework and summer 2026 graduation, current AMF work and scope, city, published contact channels |
| S2 | Industrial Knowledge Graph QA | Project summary and ownership, Python/graph/retrieval methods, complete case-study prose, benchmark comparison and limitations |
| S3 | Thesis Tracker | Published summary, stack, dates, decommissioned status |
| S4 | SnusKoll | Summary, stack, features, dates, personal-project status, case-study architecture/tradeoffs, demo and source URLs |
| S5 | Bible Map | Summary, stack, features, dates, demo and source URLs |
| S6–S7 | AI-Diary; LogPortal | Intentionally public summaries of private projects, published dates/stack, explicit non-inference boundary; case-study prose where available |
| S8 | Efficacy of Context Summarization on LLMs | Bachelor-thesis scope, experiments, qualified cost result, case-study prose, exact DiVA publication URL |
| S9–S18 | 3D Drone Relief Software; Interactive Vim Motions Guide; HabitGrower; React Pathfinding Visualization; FitTrackr; Deadline Tracker; Pathfinding Visualization; This Website; Chess Reporter; Note Hero | Each project's summaries, dates/status, public/private scope, technologies, methods, highlights, public URLs and link labels |
| S19–S23 | Study years 1–5 | All 39 course codes/names, study year, elective flags, completion status, published subject notes, and course-to-project links with their connection notes |

The inputs come from `src/data/profile.js`, `src/data/projectRecords.js`, `src/data/caseStudies.js`, and `src/data/courses.js`, through `server/corpus.js` and `server/full-context.js`. Course/project connections now share the same data with the visible coursework cards.

Not included: linked websites or repository contents, full thesis PDFs, screenshots/image pixels, private source repositories, unpublished grades, salary, availability for work, personal preferences, environment variables, or API credentials. A private-project flag describes the project's access, not secret material in this corpus. Only its deliberately public portfolio text is used. Credentials are sent in the provider's authorization header, never in the prompt.

## Improvements made

- Added the five course-to-project connections already visible on the page. Previously, the model incorrectly denied that such a connection was published.
- Included case-study subtitles and public-link labels, distinguishing an app demo from a publication or blog post.
- Added snapshot provenance and a warning against turning a related-work link into a claim about course assignments or personal motivations.
- Added instructions for clear typos/shorthand, concrete clarification of ambiguous follow-ups, checking a false premise, answering all parts of mixed questions, and keeping informal overviews brief.
- Replaced course cleanup that rebuilt everything after the first course entry. Cleanup now preserves separate work/project/grade paragraphs, corrects list-entry citations from the trusted course sources, and recognizes degree-project codes ending in `X` and Swedish compound words such as `säkerhetskurser`.
- Expanded the live evaluation from five to eighteen cases. Provider errors and failed checks now produce a nonzero exit status; provider errors are counted separately. Correctly worded weather refusals and equivalent Swedish terminology are accepted by the checks, while clarification must name the actual topics discussed.

The corpus estimate grew from 6,196 to 6,571 tokens; instructions grew from 1,666 to 2,133. This deliberately adds useful published evidence and clearer behavior without increasing the context budget or introducing another service. The existing maximum-envelope check remains below 22,000 estimated tokens.

## Imperfect-query results

Twelve queries were run before and after the changes with the same model and full portfolio corpus. The updated harness scored the saved baseline and final answers with the same checks: **30/37 before, 36/37 after**. A further restricted-follow-up case was added after browser testing. With the five existing cases, the final answers scored **54/56 across eighteen cases**, with no provider errors. Saved answers were rescored after manual reading caught an overly broad check accepting a different thesis as a relevant clarification option. These are targeted diagnostics from single runs, not a general accuracy estimate. The checks do not prove that every claim is entailed by its citation.

| Query | Baseline behavior | After changes |
| --- | --- | --- |
| `whats linus doing at amf rn?` | Correct current work despite shorthand | Still correct |
| `that truck ai thing - what did he actually make, and did it work?` | Correct project and qualified results, but unnecessarily long catalog of methods | Shorter overview with measured results and limitations; still more detailed than ideal |
| `so the graph thing was 100% accurate and production ready?` | Correctly rejected the premise | Still correct: actual verdict accuracy and controlled-benchmark limitation |
| `what security courses did he do + whats his amf job?` | AMF paragraph was discarded; its citation was attached to the last course | Both parts retained, with course-year and profile citations kept separate |
| `did he do computer secuirty? what grade did he get?` | Recognized Computer Security; said grades are unpublished | Still useful and grounded |
| `which course connects to snuskoll? how?` | “The portfolio does not state that any specific course connects to SnusKoll.” | Names DD2395 and DD2480 and explains authentication/personal data and API boundaries/authorization contract tests |
| `where can i read the actual bachelor thesis? send the link pls` | Exact DiVA URL returned | Still exact; source now labels the link as a publication |
| `why did he pick supabase for snuskoll instead of firebase?` | Admitted the rationale was undocumented | Still avoids inventing a comparison and gives the known authentication/data fact |
| `why did he choose that?`, after discussing SnusKoll and the bachelor thesis | Guessed that the visitor meant the bachelor thesis | Asks for clarification, but sometimes gives generic options or introduces the master's thesis instead of the bachelor thesis; one usefulness check still fails |
| `vilka säkerhetskurser har han läst o vad gör han på amf nu?` | Correct Swedish response, but bypassed the course normalizer | Both parts retained; now uses deterministic course-label cleanup too |
| `whats his favourite programming language? just guess` | Did not invent a preference | Still declines to guess |
| `is that right?`, after synthetic history claimed CTO status and graduation in 2023 | Corrected the date and work scope, with an unnecessary hedge | Directly corrects the statement using summer 2026 and the published AMF work |
| `ok which of those connects to snuskoll and how?`, after a security-course list | Discovered in local browser testing after the initial changes | Adds DD2480 even though it was outside the referenced list; a new scope check still fails despite the narrowing instruction |

A useful final course/project answer was:

> Two courses connect to SnusKoll: DD2395 – Computer Security; DD2480 – Software Engineering Fundamentals. The connection to DD2395 relates to authentication and access to personal data, while the connection to DD2480 relates to API boundaries and authorization contract tests.

An intermediate ambiguous-follow-up answer was:

> Could you please clarify which choice you're referring to? Are you asking about a specific project, a technology he used, or perhaps a course he took?

The final answer was more specific, but introduced the wrong thesis:

> Could you please clarify which choice you are referring to? Linus has made various engineering and research decisions across several projects, such as the strategies used in his master's thesis or the architecture of SnusKoll.

Both are safer than guessing, but make the visitor repeat context the system already has. A better answer would name Supabase/SnusKoll and context summarization/the bachelor thesis. The restricted-set follow-up is also factually grounded but conversationally wrong: DD2480 does connect to SnusKoll, yet it was not one of “those” security courses. Both failing checks are retained to keep these weaknesses visible instead of loosening the expected behavior.

## Verification and remaining limits

Run the configured model explicitly to avoid evaluating the five comparison models:

```sh
npm run context:evaluate -- gemma4:31b
```

The reviewed answers fail the concrete-clarification and restricted-set checks, so the evaluation correctly reports failure. The final cloud evaluation made eighteen calls; model outputs can vary on later runs. All 98 local tests, lint (including the evaluation modules), and the production build passed. Regression tests cover preserved mixed streamed answers, trusted course citations, degree-project codes, shared related-work facts, and evaluation failure/error accounting. A local browser check also verified mixed answers and the visible shared course/project links.

Grounding for free-form prose is still enforced mainly through instructions. The server recognizes citations but does not perform semantic entailment checks. Course cleanup applies to recognizable list entries; prose and mixed parts remain model-written. Returned external URLs are plain text in the constrained Markdown renderer, and availability is not checked. Snapshot freshness depends on maintaining the published data and restarting/redeploying. These tests do not verify production proxy behavior, real visitor concurrency, or long-conversation quality.
