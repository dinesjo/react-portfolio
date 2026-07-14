import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  isNdjsonResponse,
  readNdjsonStream,
} from "../utils/readNdjsonStream";
import {
  assistantAnswerForAnnouncement,
  nextAssistantStreamStep,
} from "../utils/assistantPresentation";
import {
  MAX_ASSISTANT_HISTORY_MESSAGE_CHARACTERS,
  MAX_ASSISTANT_HISTORY_MESSAGES,
  MAX_ASSISTANT_QUESTION_CHARACTERS,
} from "../data/assistantLimits";
import SectionIntro from "./SectionIntro";

const REQUEST_TIMEOUT_MS = 45_000;
const SOURCE_REVEAL_MAX_FRAMES = 30;
const TRANSCRIPT_FOLLOW_THRESHOLD = 72;

const STREAM_STATUS = "Writing an answer from the portfolio…";
const AssistantMarkdown = lazy(() => import("./AssistantMarkdown"));

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

function sourceLinkProps(source, onSourceClick) {
  const isExternal = /^https?:\/\//i.test(source.href);

  return {
    href: source.href,
    onClick: (event) => onSourceClick(event, source.href),
    target: isExternal ? "_blank" : undefined,
    rel: isExternal ? "noopener noreferrer" : undefined,
  };
}

function AssistantAnswer({ content }) {
  return (
    <Suspense
      fallback={
        <p className="assistant-message-content assistant-markdown-fallback">
          {assistantAnswerForAnnouncement(content)}
        </p>
      }
    >
      <AssistantMarkdown content={content} />
    </Suspense>
  );
}

function AssistantSources({ sources, onSourceClick }) {
  return (
    <details className="assistant-source-block">
      <summary className="assistant-source-summary">
        <span className="assistant-source-heading">From this portfolio</span>
        <span className="assistant-source-disclosure-icon" aria-hidden="true">
          ↓
        </span>
      </summary>
      <ul
        className="assistant-source-list"
        aria-label="Portfolio entries related to this answer"
      >
        {sources.map((source) => {
          const isExternal = /^https?:\/\//i.test(source.href);
          const accessibleSourceLabel = `Open ${source.title} from the portfolio`;
          const sourceContent = (
            <>
              <span className="assistant-source-copy">
                <span className="assistant-source-title">{source.title}</span>
                {source.type && (
                  <span className="assistant-source-type">{source.type}</span>
                )}
              </span>
              {source.href && (
                <span className="assistant-source-arrow" aria-hidden="true">
                  {isExternal ? "↗" : "→"}
                </span>
              )}
            </>
          );

          return (
            <li key={source.key} className="assistant-source-item">
              {source.href ? (
                <a
                  className="assistant-source-card"
                  {...sourceLinkProps(source, onSourceClick)}
                  aria-label={accessibleSourceLabel}
                >
                  {sourceContent}
                </a>
              ) : (
                <span className="assistant-source-card">{sourceContent}</span>
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

class ChatRequestError extends Error {
  constructor(message, code = "chat_failed") {
    super(message);
    this.name = "ChatRequestError";
    this.code = code;
  }
}

async function readChatError(response) {
  try {
    const data = await response.json();
    if (typeof data?.error === "string" && data.error.trim()) {
      return new ChatRequestError(
        data.error.trim(),
        typeof data.code === "string" ? data.code : "chat_failed",
      );
    }
  } catch {
    // The response may be plain text or an interrupted stream.
  }

  return new ChatRequestError(
    `Chat request failed: ${response.status}`,
    response.status === 429 ? "rate_limited" : "chat_failed",
  );
}

function presentChatError(error, didTimeOut) {
  if (didTimeOut) {
    return {
      code: "request_timeout",
      title: "The answer took too long.",
      message:
        "The chat had no new activity for 45 seconds. Your question has been kept below so you can try again.",
      action: null,
    };
  }

  const code = error instanceof ChatRequestError ? error.code : "chat_failed";
  const message =
    error instanceof Error
      ? error.message
      : "The portfolio assistant could not complete that answer.";

  if (
    code === "context_limit_exceeded" ||
    code === "body_too_large" ||
    code === "invalid_history"
  ) {
    return {
      code,
      title: "This conversation is too long.",
      message:
        "Start a new chat to clear the older messages. Your question has been kept below.",
      action: "start_fresh",
    };
  }

  if (code === "cloud_rate_limited" || code === "rate_limited") {
    return {
      code,
      title: "Chat limit reached.",
      message: `${message} Your question has been kept below.`,
      action: null,
    };
  }

  if (code === "assistant_busy") {
    return {
      code,
      title: "The chat is busy.",
      message: `${message} Your question has been kept below.`,
      action: null,
    };
  }

  return {
    code,
    title: "The question stayed open.",
    message: `${message} Your question has been kept below so you can try again.`,
    action: null,
  };
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
    detail: "",
  });
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [activeAnswer, setActiveAnswer] = useState(null);
  const [chatError, setChatError] = useState(null);
  const [liveStatus, setLiveStatus] = useState("");
  const healthControllerRef = useRef(null);
  const requestControllerRef = useRef(null);
  const transcriptRef = useRef(null);
  const questionInputRef = useRef(null);
  const inputFocusFrameRef = useRef(null);
  const sourceRevealCancelRef = useRef(null);
  const messageSequenceRef = useRef(0);
  const streamTimerRef = useRef(null);
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
    setHealth({ status: "checking", detail: "" });

    try {
      const response = await fetch("/api/health", {
        method: "GET",
        headers: { Accept: "application/json" },
        signal: controller.signal,
      });

      if (!response.ok) throw new Error("Health check failed");

      const data = await response.json();
      if (!mountedRef.current) return;

      if (data?.assistant?.configured === true) {
        setHealth({ status: "configured", detail: "" });
      } else {
        setHealth({
          status: "unavailable",
          detail: "Please try again in a moment.",
        });
      }
    } catch (error) {
      if (controller.signal.aborted || !mountedRef.current) return;

      setHealth({
        status: "unavailable",
        detail:
          error instanceof TypeError
            ? "The portfolio chat could not be reached."
            : "Please try again in a moment.",
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
      window.clearTimeout(streamTimerRef.current);
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
        behavior: "auto",
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
    const candidate = value
      .trim()
      .slice(0, MAX_ASSISTANT_QUESTION_CHARACTERS);

    if (
      !candidate ||
      health.status !== "configured" ||
      requestControllerRef.current
    ) {
      return;
    }

    const history = messages
      .slice(-MAX_ASSISTANT_HISTORY_MESSAGES)
      .map((message) => ({
        role: message.role,
        content: message.content.slice(
          0,
          MAX_ASSISTANT_HISTORY_MESSAGE_CHARACTERS,
        ),
      }));
    const userMessageId = `message-${++messageSequenceRef.current}`;
    const assistantMessageId = `message-${++messageSequenceRef.current}`;
    const controller = new AbortController();
    let didTimeOut = false;
    let didComplete = false;
    let timeoutId;
    let deltaBuffer = "";
    let streamedSources = [];
    let pendingCompletion = null;

    const armIdleTimeout = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        didTimeOut = true;
        controller.abort();
      }, REQUEST_TIMEOUT_MS);
    };

    const finalizeAnswer = ({ answer, sources }) => {
      if (!mountedRef.current) return;

      pendingCompletion = null;
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
      setLiveStatus(
        `Answer ready. ${assistantAnswerForAnnouncement(answer)}`,
      );
    };

    const scheduleStreamStep = (delayMs = 0) => {
      if (streamTimerRef.current !== null) return;
      streamTimerRef.current = window.setTimeout(flushDeltaBuffer, delayMs);
    };

    const flushDeltaBuffer = () => {
      streamTimerRef.current = null;
      if (!mountedRef.current) return;

      if (!deltaBuffer) {
        if (pendingCompletion) {
          const completion = pendingCompletion;
          streamTimerRef.current = window.setTimeout(() => {
            streamTimerRef.current = null;
            finalizeAnswer(completion);
          }, 20);
        }
        return;
      }

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const step = reducedMotion
        ? { text: deltaBuffer, delayMs: 0 }
        : nextAssistantStreamStep(deltaBuffer);
      deltaBuffer = deltaBuffer.slice(step.text.length);
      setActiveAnswer((current) =>
        current?.id === assistantMessageId
          ? {
              ...current,
              phase: "generating",
              content: current.content + step.text,
            }
          : current,
      );

      window.requestAnimationFrame(() => {
        const transcript = transcriptRef.current;
        if (transcript && isFollowingRef.current) {
          transcript.scrollTo({ top: transcript.scrollHeight, behavior: "auto" });
        }
      });

      if (deltaBuffer) {
        scheduleStreamStep(step.delayMs);
      } else if (pendingCompletion) {
        scheduleStreamStep(reducedMotion ? 0 : step.delayMs);
      }
    };

    const queueDelta = (content) => {
      if (!content) return;

      deltaBuffer += content;
      scheduleStreamStep();
    };

    const completeAnswer = (data, { smooth = false } = {}) => {
      const answer = typeof data?.answer === "string" ? data.answer.trim() : "";
      if (!answer) {
        throw new Error("Chat response did not contain an answer");
      }

      didComplete = true;
      const sources = normalizeSources(
        Array.isArray(data?.sources) ? data.sources : streamedSources,
      );
      const completion = { answer, sources };

      if (smooth) {
        pendingCompletion = completion;
        scheduleStreamStep();
      } else {
        window.clearTimeout(streamTimerRef.current);
        streamTimerRef.current = null;
        deltaBuffer = "";
        finalizeAnswer(completion);
      }
    };

    requestControllerRef.current = controller;
    isFollowingRef.current = true;
    setQuestion("");
    setChatError(null);
    setLiveStatus("Writing an answer from the portfolio.");
    setActiveAnswer({
      id: assistantMessageId,
      phase: "generating",
      content: "",
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
        throw await readChatError(response);
      }

      if (isNdjsonResponse(response)) {
        await readNdjsonStream(response, (event) => {
          armIdleTimeout();

          if (event.type === "error") {
            throw new ChatRequestError(
              typeof event.error === "string"
                ? event.error
                : "The portfolio assistant could not complete that answer.",
              typeof event.code === "string" ? event.code : "chat_failed",
            );
          }

          if (event.type === "status") {
            if (
              event.phase === "retrieving" ||
              event.phase === "retrieval" ||
              event.phase === "generating" ||
              event.phase === "generation"
            ) {
              setActiveAnswer((current) =>
                current?.id === assistantMessageId
                  ? { ...current, phase: "generating" }
                  : current,
              );
              setLiveStatus("Writing an answer from the portfolio.");
            }
          } else if (event.type === "sources") {
            streamedSources = normalizeSources(event.sources);
          } else if (
            event.type === "delta" &&
            typeof event.content === "string"
          ) {
            queueDelta(event.content);
          } else if (event.type === "done") {
            completeAnswer(event, { smooth: true });
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
      window.clearTimeout(streamTimerRef.current);
      streamTimerRef.current = null;
      deltaBuffer = "";
      pendingCompletion = null;
      setActiveAnswer(null);
      setMessages((current) =>
        current.filter(
          (message) =>
            message.id !== userMessageId && message.id !== assistantMessageId,
        ),
      );
      setQuestion(candidate);
      setLiveStatus("The answer could not be completed.");

      if ((controller.signal.aborted && didTimeOut) || !wasAborted) {
        setChatError(presentChatError(error, didTimeOut));
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

  const handleStartFresh = () => {
    setMessages([]);
    setChatError(null);
    setLiveStatus("Started a new portfolio chat.");
    isFollowingRef.current = true;
    window.cancelAnimationFrame(inputFocusFrameRef.current);
    inputFocusFrameRef.current = window.requestAnimationFrame(() => {
      questionInputRef.current?.focus();
    });
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
  const showSuggestions = messages.length === 0 && !isLoading;
  const hasConversation = messages.length > 0 || isLoading;

  return (
    <section
      id="assistant"
      className="assistant-section"
      aria-labelledby="assistant-title"
    >
      <div className="section-shell">
        <SectionIntro
          eyebrow="Portfolio Q&A"
          title="Ask about the work."
          titleId="assistant-title"
          className="assistant-section-intro mb-8"
        >
          The project cards are the short version. Ask about projects,
          technologies, results, research, or KTH courses, and the answer will
          link back to the relevant parts of this page.
        </SectionIntro>

        <div
          id="assistant-panel"
          className="assistant-shell surface-card reveal"
          data-conversation={hasConversation ? "true" : "false"}
        >
        <div className="assistant-workspace">
          {hasConversation && (
            <div
              ref={transcriptRef}
              className="assistant-transcript"
              role="log"
              aria-label="Portfolio assistant conversation"
              aria-live="off"
              aria-busy={isLoading}
              onScroll={handleTranscriptScroll}
            >
              {messages.map((message) => (
                <article
                  key={message.id}
                  className={`assistant-message assistant-message-${message.role}`}
                >
                  <p className="assistant-message-label">
                    {message.role === "user" ? "You" : "Portfolio assistant"}
                  </p>
                  {message.role === "assistant" ? (
                    <AssistantAnswer
                      content={message.content}
                    />
                  ) : (
                    <p className="assistant-message-content">{message.content}</p>
                  )}

                  {message.role === "assistant" && message.sources.length > 0 && (
                    <AssistantSources
                      sources={message.sources}
                      onSourceClick={handleSourceClick}
                    />
                  )}
                </article>
              ))}

              {isLoading && (
                <article
                  className="assistant-message assistant-message-assistant assistant-message-streaming"
                  data-phase={activeAnswer.phase}
                  data-has-content={activeAnswer.content ? "true" : "false"}
                >
                  <p className="assistant-message-label">Portfolio assistant</p>
                  {activeAnswer.content ? (
                    <AssistantAnswer
                      content={activeAnswer.content}
                    />
                  ) : (
                    <div className="assistant-stream-status" aria-hidden="true">
                      <span className="assistant-stream-pulse">
                        <span />
                        <span />
                        <span />
                      </span>
                      <span className="assistant-stream-copy">
                        {STREAM_STATUS}
                      </span>
                    </div>
                  )}
                </article>
              )}
            </div>
          )}

          {showSuggestions && (
            <div
              className="assistant-prompts"
              aria-labelledby="assistant-prompts-title"
            >
              <p
                id="assistant-prompts-title"
                className="assistant-prompts-title"
              >
                Try asking
              </p>
              <ol className="assistant-prompt-list">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <li key={prompt} className="assistant-prompt-item">
                    <button
                      type="button"
                      className="assistant-prompt-button"
                      onClick={() => askQuestion(prompt)}
                      disabled={actionsAreDisabled}
                    >
                      <span className="assistant-prompt-copy">{prompt}</span>
                      <span className="assistant-prompt-arrow" aria-hidden="true">
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <p
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {liveStatus}
          </p>

          {chatError && (
            <div className="assistant-error" role="alert">
              <div className="assistant-error-content">
                <p className="assistant-error-title">{chatError.title}</p>
                <p className="assistant-error-copy">{chatError.message}</p>
              </div>
              {chatError.action === "start_fresh" && (
                <button
                  type="button"
                  className="assistant-retry-button"
                  onClick={handleStartFresh}
                >
                  Start fresh
                </button>
              )}
            </div>
          )}

          {health.status === "unavailable" && (
            <div className="assistant-unavailable" role="status">
              <div className="assistant-unavailable-copy">
                <p className="assistant-unavailable-title">
                  Chat is temporarily unavailable.
                </p>
                <p className="assistant-unavailable-detail">
                  {health.detail || "Please try again in a moment."}
                </p>
              </div>
              <button
                type="button"
                className="assistant-retry-button"
                onClick={checkHealth}
              >
                Try again
              </button>
            </div>
          )}

          <form className="assistant-form" onSubmit={handleSubmit}>
            <fieldset
              className="assistant-fieldset"
              disabled={assistantIsUnavailable}
            >
              <label
                className="assistant-question-label"
                htmlFor="assistant-question"
              >
                Ask a question
              </label>
              <textarea
                id="assistant-question"
                ref={questionInputRef}
                className="assistant-question-input"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                onKeyDown={handleQuestionKeyDown}
                maxLength={MAX_ASSISTANT_QUESTION_CHARACTERS}
                readOnly={isLoading}
                rows={2}
                placeholder="Ask about a project, technology, result, or course…"
                aria-describedby="assistant-question-help assistant-question-count"
              />
              <div className="assistant-form-meta">
                <p id="assistant-question-help" className="assistant-question-help">
                  Enter to send · Shift + Enter for a new line
                </p>
                <p id="assistant-question-count" className="assistant-question-count">
                  {question.length}/{MAX_ASSISTANT_QUESTION_CHARACTERS}
                </p>
              </div>
              <button
                type="submit"
                className="assistant-submit-button"
                disabled={!canSubmit}
              >
                {isLoading ? "Writing…" : "Send"}
              </button>
            </fieldset>
          </form>
        </div>
        </div>
      </div>
    </section>
  );
}
