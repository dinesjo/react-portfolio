import { useEffect, useRef, useState } from "react";
import { FaCopy, FaCheck, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const email = "dinesjo@kth.se";
  const [copyStatus, setCopyStatus] = useState("idle");
  const resetTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimerRef.current), []);

  const handleCopy = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(email);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy) {
      const activeElement = document.activeElement;
      const textArea = document.createElement("textarea");
      textArea.value = email;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.left = "-9999px";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, email.length);
      didCopy = document.execCommand("copy");
      textArea.remove();
      activeElement?.focus?.();
    }

    setCopyStatus(didCopy ? "copied" : "failed");
    window.clearTimeout(resetTimerRef.current);
    resetTimerRef.current = window.setTimeout(() => setCopyStatus("idle"), 2000);
  };

  return (
    <section id="contact" className="py-20">
      <div className="section-shell">
        <div className="surface-card reveal grid overflow-hidden rounded-lg lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-slate-200 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <span className="section-eyebrow">Contact</span>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl">
              Let&apos;s talk.
            </h2>
            <p className="section-copy mt-5">
              Best for project questions, collaboration, or anything that needs
              more context than a short LinkedIn message.
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Email
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`mailto:${email}`}
                className="text-2xl font-montserrat font-extrabold text-slate-950 transition-colors hover:text-[var(--coral)]"
              >
                {email}
              </a>
              <button
                onClick={handleCopy}
                aria-live="polite"
                className={`inline-flex w-fit items-center gap-2 rounded-md px-5 py-2.5 font-montserrat text-sm font-bold transition-all duration-300 ${
                  copyStatus === "copied"
                    ? "bg-emerald-600 text-white"
                    : copyStatus === "failed"
                      ? "bg-rose-600 text-white"
                      : "sharp-button hover:-translate-y-0.5"
                }`}
              >
                {copyStatus === "copied" ? (
                  <>
                    <FaCheck /> Copied!
                  </>
                ) : copyStatus === "failed" ? (
                  <>
                    <FaCopy /> Copy failed
                  </>
                ) : (
                  <>
                    <FaCopy /> Copy
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 flex gap-3">
              <a
                href="https://github.com/dinesjo"
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button flex h-11 w-11 items-center justify-center transition-colors hover:bg-white"
                title="GitHub"
                aria-label="GitHub profile"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/dinesjo/"
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button flex h-11 w-11 items-center justify-center transition-colors hover:bg-white"
                title="LinkedIn"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href={`mailto:${email}`}
                className="quiet-button flex h-11 w-11 items-center justify-center transition-colors hover:bg-white"
                title="Email"
                aria-label="Send email"
              >
                <FaEnvelope className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
