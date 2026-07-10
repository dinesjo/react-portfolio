import { useEffect, useRef, useState } from "react";
import { FaCopy, FaCheck, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import SectionIntro from "./SectionIntro";

export default function Contact() {
  const email = "dinesjo@kth.se";
  const [copyStatus, setCopyStatus] = useState("idle");
  const resetTimerRef = useRef(null);

  useEffect(() => () => window.clearTimeout(resetTimerRef.current), []);

  const handleCopy = async () => {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        didCopy = await Promise.race([
          navigator.clipboard.writeText(email).then(() => true),
          new Promise((resolve) => window.setTimeout(() => resolve(false), 800)),
        ]);
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
        <div className="surface-card contact-panel reveal grid overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
          <div className="border-b border-slate-200/60 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:border-slate-200/60">
            <SectionIntro
              eyebrow="Contact"
              title="Get in touch."
              className="section-intro--in-card"
            >
              If you want to ask about a project or just say hello, email is
              the easiest way to reach me.
            </SectionIntro>
          </div>

          <div className="p-6 sm:p-8">
            <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Email
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href={`mailto:${email}`}
                className="contact-email font-montserrat text-2xl font-extrabold"
              >
                {email}
              </a>
              <button
                onClick={handleCopy}
                aria-live="polite"
                className={`copy-button sharp-button inline-flex w-fit items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold ${
                  copyStatus === "copied"
                    ? "copy-button--copied"
                    : copyStatus === "failed"
                      ? "copy-button--failed"
                      : ""
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
                className="quiet-button flex h-11 w-11 items-center justify-center"
                title="GitHub"
                aria-label="GitHub profile"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://www.linkedin.com/in/dinesjo/"
                target="_blank"
                rel="noopener noreferrer"
                className="quiet-button flex h-11 w-11 items-center justify-center"
                title="LinkedIn"
                aria-label="LinkedIn profile"
              >
                <FaLinkedin className="text-xl" />
              </a>
              <a
                href={`mailto:${email}`}
                className="quiet-button flex h-11 w-11 items-center justify-center"
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
