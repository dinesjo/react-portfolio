import { useCallback, useEffect, useRef, useState } from "react";
import {
  isNdjsonResponse,
  readNdjsonStream,
} from "../utils/readNdjsonStream";

const MAX_QUESTION_LENGTH = 600;
const HISTORY_MESSAGE_LIMIT = 4;
const HISTORY_CONTENT_LENGTH = 1_200;
const REQUEST_TIMEOUT_MS = 45_000;
const SOURCE_REVEAL_MAX_FRAMES = 30;
const TRANSCRIPT_FOLLOW_THRESHOLD = 72;
const MODEL_LABEL = "gpt-oss:120b · Ollama Cloud";
const RETRIEVAL_LABEL = "qwen3-embedding:0.6b · Qdrant";

const STREAM_STATUS = {
  retrieving: {
    step: "SEARCH / 01",
    copy: "Looking through the published portfolio records…",
  },
  generating: {
    step: "WRITE / 02",
    copy: "Reading the strongest matches and writing the evidence note…",
  },
};

const SUGGESTED_PROMPTS = [
  "Which projects best demonstrate work with AI and knowledge graphs?",
  "Which KTH courses relate to security and software reliability?",
  "How has Linus worked with evaluation and retrieval-augmented generation?",
];

function safeSourceHref(value) {
  if (typeof value !== "string") return "";

  const href = value.trim();
  if (/^https?:\/\//i.test(href) || href.startsWith("#")) return href;
  return href.startsWith("/") && !href.startsWith("//") ? href : "";
}

function normalizeSources(value) {
  if (!Array.isArray(value)) return [];

  const seen = new Set();

  return value
    .map((source) => {
      const id = typeof source?.id === "string" ? source.id.trim() : "";
      const title =
        typeof source?.title === "string" ? source.title.trim() : "";
      const type = typeof source?.type === "string" ? source.type.trim() : "";
      const citation =
        typeof source?.citation === "string" ? source.citation.trim() : "";
      const href = safeSourceHref(source?.href);
      const key = id || `${type}:${title}:${href}`;

      return { citation, id, title, type, href, key };
    })
    .filter((source) => {
      if (!source.title || !source.key || seen.has(source.key)) return false;
      seen.add(source.key);
      return true;
    });
}

async function readErrorMessage(response) {
  try {
    const data = await response.json();
    if (typeof data?.error === "string" && data.error.trim()) {
      return data.error.trim();
    }
  } catch {
    // The response may be plain text or an interrupted stream.
  }

  return `Chat request failed: ${response.status}`;
}

function streamStatusCopy(activeAnswer) {
  if (activeAnswer?.phase !== "generating") {
    return STREAM_STATUS.retrieving.copy;
  }

  if (Number.isFinite(activeAnswer.sourceCount)) {
    const recordLabel = activeAnswer.sourceCount === 1 ? "record" : "records";
    return `Writing from ${activeAnswer.sourceCount} matched ${recordLabel}…`;
  }

  return STREAM_STATUS.generating.copy;
}

function scheduleSourceReveal(href, { replaceHistory = false } = {}) {
  if (!href.startsWith("#") || href.length < 2) return () => {};

  const targetId = href.slice(1);
  window.dispatchEvent(
    new CustomEvent("portfolio:reveal-source", { detail: { targetId } }),
  );

  let animationFrame = 0;
  let attempts = 0;
  let cancelled = false;

  const revealWhenReady = () => {
    if (cancelled) return;

    const target = document.getElementById(targetId);
    if (!target) {
      attempts += 1;
      if (attempts < SOURCE_REVEAL_MAX_FRAMES) {
        animationFrame = window.requestAnimationFrame(revealWhenReady);
      }
      return;
    }

    const disclosure = target.closest("details");
    if (disclosure) disclosure.open = true;

    if (replaceHistory) window.history.replaceState(null, "", href);
    target.scrollIntoView({
      block: "center",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    target.focus({ preventScroll: true });
    target.classList.add("assistant-source-target");
    const clearHighlight = (event) => {
      if (
        event.target !== target ||
        event.animationName !== "assistant-source-flash"
      ) {
        return;
      }

      target.classList.remove("assistant-source-target");
      target.removeEventListener("animationend", clearHighlight);
    };
    target.addEventListener("animationend", clearHighlight);
  };

  animationFrame = window.requestAnimationFrame(revealWhenReady);

  return () => {
    cancelled = true;
    window.cancelAnimationFrame(animationFrame);
  };
}

export default function PortfolioAssistant() {
  const [health, setHealth] = useState({
    status: "checking",
    sourceCount: null,
    detail: "",
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [liveStatus, setLiveStatus] = useState("");
  const healthControllerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const transcriptRef = useRef(null);
  const questionInputRef = useRef(null);
  const inputFocusFrameRef = useRef(null);
  const sourceRevealCancelRef = useRef(null);
  const messageSequenceRef = useRef(0);
  const streamFrameRef = useRef(null);
  const isFollowingRef = useRef(true);
  const mountedRef = useRef(false);
  const isLoading = activeAnswer !== null;

  const beginSourceReveal = useCallback((href, options) => {
    sourceRevealCancelRef.current?.();
    sourceRevealCancelRef.current = scheduleSourceReveal(href, options);
  }, []);

  const checkHealth = useCallback(async () => {
    healthControllerRef.current?.abort();

    const controller = new AbortController();
    healthControllerRef.current = controller;
    setHealth({ status: "checking", sourceCount: null, detail: "" });

    try {
      const response = await fetch("/api/health", {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Health check failed");

      const data = await response.json();
      if (!mountedRef.current) return;

      const sourceCount = Number.isFinite(data?.retrieval?.indexedSourceCount)
        ? data.retrieval.indexedSourceCount
        : null;

      if (data?.assistant?.configured === true) {
        setHealth({ status: "configured", sourceCount, detail: "" });
      } else if (data?.assistant?.generationConfigured !== true) {
        setHealth({
          status: "unavailable",
          sourceCount,
          detail: "The cloud model is not configured for this deployment.",
        });
      } else {
        setHealth({
          status: "unavailable",
          sourceCount,
          detail:
            "The local embedding model or portfolio vector index is unavailable.",
        });
      }
    } catch (error) {
      if (controller.signal.aborted || !mountedRef.current) return;

      setHealth({
        status: "unavailable",
        sourceCount: null,
        detail:
          error instanceof TypeError
            ? "The portfolio assistant service could not be reached."
            : "The portfolio assistant did not pass its availability check.",
      });
    } finally {
      if (healthControllerRef.current === controller) {
        healthControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    checkHealth();

    return () => {
      mountedRef.current = false;
      healthControllerRef.current?.abort();
      requestControllerRef.current?.abort();
      window.cancelAnimationFrame(inputFocusFrameRef.current);
      window.cancelAnimationFrame(streamFrameRef.current);
    };
  }, [checkHealth]);

  useEffect(() => {
    const revealCurrentHash = () => {
      if (window.location.hash) beginSourceReveal(window.location.hash);
    };

    revealCurrentHash();
    window.addEventListener("hashchange", revealCurrentHash);

    return () => {
      window.removeEventListener("hashchange", revealCurrentHash);
      sourceRevealCancelRef.current?.();
    };
  }, [beginSourceReveal]);

  useEffect(() => {
    if (messages.length === 0 && !isLoading) return;

    const animationFrame = window.requestAnimationFrame(() => {
      const transcript = transcriptRef.current;
      if (!transcript || !isFollowingRef.current) return;

      transcript.scrollTo({
        top: transcript.scrollHeight,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [activeAnswer?.id, isLoading, messages.length]);

  const handleTranscriptScroll = () => {
    const transcript = transcriptRef.current;
    if (!transcript) return;

    const distanceFromBottom =
      transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight;
    isFollowingRef.current = distanceFromBottom <= TRANSCRIPT_FOLLOW_THRESHOLD;
  };

  const askQuestion = async (value) => {
    const candidate = value.trim().slice(0, MAX_QUESTION_LENGTH);

    if (
      !candidate ||
      health.status !== "configured" ||
      requestControllerRef.current
    ) {
      return;
    }

    const history = messages.slice(-HISTORY_MESSAGE_LIMIT).map((message) => ({
      role: message.role,
      content: message.content.slice(0, HISTORY_CONTENT_LENGTH),
    }));
    const userMessageId = `message-${++messageSequenceRef.current}`;
    const assistantMessageId = `message-${++messageSequenceRef.current}`;
    const controller = new AbortController();
    let didTimeOut = false;
    let didComplete = false;
    let timeoutId;
    let deltaBuffer = "";
    let streamedSources = [];

    const armIdleTimeout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        didTimeOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);
    };

    const flushDeltaBuffer = () => {
      streamFrameRef.current = null;
      if (!deltaBuffer || !mountedRef.current) return;

      const content = deltaBuffer;
      deltaBuffer = "";
      setActiveAnswer((current) =>
        current?.id === assistantMessageId
          ? {
              ...current,
              phase: "generating",
              content: current.content + content,
            }
          : current,
      );

      window.requestAnimationFrame(() => {
        const transcript = transcriptRef.current;
        if (transcript && isFollowingRef.current) {
          transcript.scrollTop = transcript.scrollHeight;
        }
      });
    };

    const queueDelta = (content) => {
      if (!content) return;

      deltaBuffer += content;
      if (streamFrameRef.current === null) {
        streamFrameRef.current = window.requestAnimationFrame(flushDeltaBuffer);
      }
    };

    const completeAnswer = (data) => {
      const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
      if (!answer) {
        throw new Error("Chat response did not contain an answer");
      }

      didComplete = true;
      window.cancelAnimationFrame(streamFrameRef.current);
      streamFrameRef.current = null;
      deltaBuffer = "";

      const sources = normalizeSources(
        Array.isArray(data?.sources) ? data.sources : streamedSources,
      );
      setMessages((current) => [
        ...current,
        {
          id: assistantMessageId,
          role: "assistant",
          content: answer,
          sources,
        },
      ]);
      setActiveAnswer(null);
      setLiveStatus(`Answer ready. ${answer}`);
    };

    requestControllerRef.current = controller;
    isFollowingRef.current = true;
    setQuestion("");
    setErrorMessage("");
    setLiveStatus("Searching the published portfolio records.");
    setActiveAnswer({
      id: assistantMessageId,
      phase: "retrieving",
      content: "",
      sourceCount: null,
    });
    setMessages((current) => [
      ...current,
      { id: userMessageId, role: "user", content: candidate, sources: [] },
    ]);
    window.cancelAnimationFrame(inputFocusFrameRef.current);
    inputFocusFrameRef.current = window.requestAnimationFrame(() => {
      questionInputRef.current?.focus();
    });
    armIdleTimeout();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          Accept: "application/x-ndjson, application/json;q=0.8",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: candidate, history }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(await readErrorMessage(response));
      }

      if (isNdjsonResponse(response)) {
        await readNdjsonStream(response, (event) => {
          armIdleTimeout();

          if (event.type === "error") {
            throw new Error(
              typeof event.error === "string"
                ? event.error
                : "The portfolio assistant could not complete that answer.",
            );
          }

          if (event.type === "status") {
            if (event.phase === "retrieving" || event.phase === "retrieval") {
              setActiveAnswer((current) =>
                current?.id === assistantMessageId
                  ? { ...current, phase: "retrieving" }
                  : current,
              );
              setLiveStatus("Searching the published portfolio records.");
            } else if (
              event.phase === "generating" ||
              event.phase === "generation"
            ) {
              setActiveAnswer((current) =>
                current?.id === assistantMessageId
                  ? { ...current, phase: "generating" }
                  : current,
              );
              setLiveStatus("Writing a grounded answer from the matched records.");
            }
          } else if (event.type === "sources") {
            streamedSources = normalizeSources(event.sources);
            const sourceCount = streamedSources.length;
            setActiveAnswer((current) =>
              current?.id === assistantMessageId
                ? { ...current, phase: "generating", sourceCount }
                : current,
            );
            setLiveStatus(
              `${sourceCount} matched ${sourceCount === 1 ? "record" : "records"}. Writing the answer.`,
            );
          } else if (
            event.type === "delta" &&
            typeof event.content === "string"
          ) {
            queueDelta(event.content);
          } else if (event.type === "done") {
            completeAnswer(event);
          }
        });

        if (!didComplete) {
          throw new Error("The assistant stream ended before the answer was complete.");
        }
      } else {
        const data = await response.json();
        if (!mountedRef.current) return;
        completeAnswer(data);
      }
    } catch (error) {
      if (!mountedRef.current) return;

      const wasAborted = controller.signal.aborted;
      controller.abort();
      window.cancelAnimationFrame(streamFrameRef.current);
      streamFrameRef.current = null;
      deltaBuffer = "";
      setActiveAnswer(null);
      setMessages((current) =>
        current.filter(
          (message) =>
            message.id !== userMessageId && message.id !== assistantMessageId,
        ),
      );
      setQuestion(candidate);
      setLiveStatus("The answer could not be completed.");

      if (controller.signal.aborted && didTimeOut) {
        setErrorMessage(
          "The evidence desk had no new activity for 45 seconds. Your question is still below so you can try again.",
        );
      } else if (!wasAborted) {
        setErrorMessage(
          `${error instanceof Error ? error.message : "The portfolio assistant could not complete that answer."} Your question has been restored so you can try again.`,
        );
      }
    } finally {
      window.clearTimeout(timeoutId);

      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    askQuestion(question);
  };

  const handleSourceClick = (event, href) => {
    if (!href.startsWith("#")) return;

    event.preventDefault();
    beginSourceReveal(href, { replaceHistory: true });
  };

  const handleQuestionKeyDown = (event) => {
    if (isLoading || health.status !== "configured") return;

    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  const assistantIsUnavailable = health.status !== "configured";
  const actionsAreDisabled = isLoading || assistantIsUnavailable;
  const canSubmit = question.trim().length > 0 && !actionsAreDisabled;
  const statusLabel =
    health.status === "configured"
      ? "Vector index ready"
      : health.status === "checking"
        ? "Checking evidence desk"
        : "Evidence desk unavailable";

  return (
    <section
      id="assistant"
      className="assistant-section"
      aria-labelledby="assistant-title"
    >
      <div className="assistant-shell">
        <header className="assistant-intro">
          <div className="assistant-intro-copy">
            <p className="assistant-eyebrow">Portfolio evidence desk</p>
            <h2 id="assistant-title" className="assistant-title">
              Ask the work, not the r&eacute;sum&eacute;.
            </h2>
            <p className="assistant-description">
              Ask about projects, professional work, research, or KTH courses.
              A hybrid vector and exact-match search grounds each answer in the
              records published here, with the consulted evidence attached below.
            </p>
          </div>

          <dl className="assistant-runtime" aria-label="Assistant runtime">
            <div className="assistant-runtime-item">
              <dt className="assistant-runtime-label">Answer model</dt>
              <dd className="assistant-runtime-value">{MODEL_LABEL}</dd>
            </div>
            <div className="assistant-runtime-item">
              <dt className="assistant-runtime-label">Retrieval</dt>
              <dd className="assistant-runtime-value">{RETRIEVAL_LABEL}</dd>
            </div>
            <div className="assistant-runtime-item">
              <dt className="assistant-runtime-label">Vectors indexed</dt>
              <dd className="assistant-runtime-value">
                {health.sourceCount ?? "—"}
              </dd>
            </div>
          </dl>

          <div
            className="assistant-availability"
            data-state={health.status}
            role="status"
            aria-live="polite"
          >
            <span className="assistant-availability-mark" aria-hidden="true" />
            <span className="assistant-availability-label">{statusLabel}</span>
          </div>
        </header>

        <div className="assistant-desk">
          <aside
            className="assistant-prompts"
            aria-labelledby="assistant-prompts-title"
          >
            <p id="assistant-prompts-title" className="assistant-prompts-title">
              Suggested enquiries
            </p>
            <ol className="assistant-prompt-list">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <li key={prompt} className="assistant-prompt-item">
                  <button
                    type="button"
                    className="assistant-prompt-button"
                    onClick={() => askQuestion(prompt)}
                    disabled={actionsAreDisabled}
                  >
                    <span className="assistant-prompt-number" aria-hidden="true">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="assistant-prompt-copy">{prompt}</span>
                  </button>
                </li>
              ))}
            </ol>
            <p className="assistant-scope-note">
              This assistant only answers from published portfolio evidence. It
              may say when the records do not support an answer.
            </p>
          </aside>

          <div className="assistant-workspace">
            <div
              ref={transcriptRef}
              className="assistant-transcript"
              role="log"
              aria-label="Portfolio assistant conversation"
              aria-live="off"
              aria-busy={isLoading}
              onScroll={handleTranscriptScroll}
            >
              {messages.length === 0 && !isLoading && (
                <div className="assistant-empty-state">
                  <p className="assistant-empty-kicker">No enquiry open</p>
                  <p className="assistant-empty-copy">
                    Start with a suggested enquiry or write your own question
                    below. Plain-language answers and their evidence will appear
                    here.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`assistant-message assistant-message-${message.role}`}
                >
                  <p className="assistant-message-label">
                    {message.role === "user" ? "Your enquiry" : "Evidence note"}
                  </p>
                  <p className="assistant-message-content">{message.content}</p>

                  {message.role === "assistant" &&
                    message.sources.length > 0 && (
                      <div className="assistant-source-block">
                        <p className="assistant-source-heading">
                          Records consulted
                        </p>
                        <ul
                          className="assistant-source-list"
                          aria-label="Records consulted for this answer"
                        >
                          {message.sources.map((source, index) => {
                            const citation = source.citation || `S${index + 1}`;
                            const accessibleSourceLabel = [
                              citation,
                              source.type ? `${source.type} source` : "source",
                              source.title,
                            ].join(", ");
                            const sourceContent = (
                              <>
                                <span
                                  className="assistant-source-number"
                                >
                                  {citation}
                                </span>
                                {source.type && (
                                  <span className="assistant-source-type">
                                    {source.type}
                                  </span>
                                )}
                                <span className="assistant-source-title">
                                  {source.title}
                                </span>
                              </>
                            );

                            return (
                              <li
                                key={source.key}
                                className="assistant-source-item"
                              >
                                {source.href ? (
                                  <a
                                    className="assistant-source-chip"
                                    href={source.href}
                                    aria-label={accessibleSourceLabel}
                                    onClick={(event) =>
                                      handleSourceClick(event, source.href)
                                    }
                                    target={
                                      /^https?:\/\//i.test(source.href)
                                        ? "_blank"
                                        : undefined
                                    }
                                    rel={
                                      /^https?:\/\//i.test(source.href)
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                  >
                                    {sourceContent}
                                  </a>
                                ) : (
                                  <span className="assistant-source-chip">
                                    {sourceContent}
                                  </span>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                </article>
              ))}

              {isLoading && (
                <article
                  className="assistant-message assistant-message-assistant assistant-message-streaming"
                  data-phase={activeAnswer.phase}
                  data-has-content={activeAnswer.content ? "true" : "false"}
                >
                  <p className="assistant-message-label">
                    {activeAnswer.content ? "Evidence note" : "Desk activity"}
                  </p>
                  {activeAnswer.content ? (
                    <p className="assistant-message-content">
                      {activeAnswer.content}
                      <span className="assistant-stream-caret" aria-hidden="true" />
                    </p>
                  ) : (
                    <div className="assistant-stream-status" aria-hidden="true">
                      <span className="assistant-stream-step">
                        {STREAM_STATUS[activeAnswer.phase]?.step ||
                          STREAM_STATUS.retrieving.step}
                      </span>
                      <span className="assistant-stream-copy">
                        {streamStatusCopy(activeAnswer)}
                      </span>
                      <span className="assistant-stream-pulse">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  )}
                </article>
              )}
            </div>

            <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
              {liveStatus}
            </p>

            {errorMessage && (
              <div className="assistant-error" role="alert">
                <p className="assistant-error-title">The enquiry stayed open.</p>
                <p className="assistant-error-copy">{errorMessage}</p>
              </div>
            )}

            {health.status === "unavailable" && (
              <div className="assistant-unavailable" role="status">
                <div className="assistant-unavailable-copy">
                  <p className="assistant-unavailable-title">
                    The evidence desk is offline.
                  </p>
                  <p className="assistant-unavailable-detail">
                    {health.detail ||
                      "The cloud assistant is not available at the moment."}
                  </p>
                </div>
                <button
                  type="button"
                  className="assistant-retry-button"
                  onClick={checkHealth}
                >
                  Check again
                </button>
              </div>
            )}

            <form className="assistant-form" onSubmit={handleSubmit}>
              <fieldset
                className="assistant-fieldset"
                disabled={assistantIsUnavailable}
              >
                <label className="assistant-question-label" htmlFor="assistant-question">
                  Your question
                </label>
                <textarea
                  id="assistant-question"
                  ref={questionInputRef}
                  className="assistant-question-input"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  maxLength={MAX_QUESTION_LENGTH}
                  readOnly={isLoading}
                  rows={3}
                  placeholder="Ask about a project, course, method, or technology…"
                  aria-describedby="assistant-question-help assistant-question-count"
                />
                <div className="assistant-form-meta">
                  <p id="assistant-question-help" className="assistant-question-help">
                    Enter to send · Shift + Enter for a new line
                  </p>
                  <p id="assistant-question-count" className="assistant-question-count">
                    {question.length}/{MAX_QUESTION_LENGTH}
                  </p>
                </div>
                <button
                  type="submit"
                  className="assistant-submit-button"
                  disabled={!canSubmit}
                >
                  {activeAnswer?.phase === "retrieving"
                    ? "Searching records…"
                    : isLoading
                      ? "Writing answer…"
                      : "Send enquiry"}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
