import { useRef } from "react";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import portraitSrc from "../assets/project-optimized/portrait.webp";

export default function Hero() {
  const briefCardRef = useRef(null);
  const portraitFrameRef = useRef(null);

  const handleBriefPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--brief-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--brief-y", `${event.clientY - rect.top}px`);
  };

  const resetBriefPointer = () => {
    briefCardRef.current?.style.setProperty("--brief-x", "50%");
    briefCardRef.current?.style.setProperty("--brief-y", "50%");
  };

  const handlePortraitPointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    event.currentTarget.style.setProperty("--portrait-shift-x", `${x * -8}px`);
    event.currentTarget.style.setProperty("--portrait-shift-y", `${y * -8}px`);
  };

  const resetPortraitPointer = () => {
    portraitFrameRef.current?.style.setProperty("--portrait-shift-x", "0px");
    portraitFrameRef.current?.style.setProperty("--portrait-shift-y", "0px");
  };

  return (
    <section id="home" className="relative px-6 pb-12 pt-28 sm:pt-32 lg:min-h-[700px]">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="animate-fade-up">
          <span className="section-eyebrow">KTH Computer Science</span>
          <h1 className="section-title mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
            Linus Dinesj&ouml;
          </h1>
          <p className="section-copy mt-6 max-w-2xl text-lg sm:text-xl">
            Final-year KTH computer science student near Stockholm. I build
            full-stack products, research tools, and internal systems with a
            bias for clear architecture, measurable outcomes, and software
            that survives real use.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("featured");
                if (el) window.scrollTo({ top: el.offsetTop - 112, behavior: "smooth" });
              }}
              className="sharp-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold"
            >
              View work <FaArrowRight className="button-arrow text-xs" />
            </button>
            <a
              href="mailto:dinesjo@kth.se"
              className="quiet-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold"
            >
              <FaEnvelope className="text-xs" /> Contact
            </a>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-3 xs:grid-cols-3">
            {[
              ["Focus", "Full-stack systems"],
              ["Current", "KG QA thesis"],
              ["Location", "Strängnäs, Sweden"],
            ].map(([label, value]) => (
              <div key={label} className="hero-stat border-l-2 pl-3">
                <dt className="font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          ref={briefCardRef}
          className="surface-card hero-brief-card animate-fade-up overflow-hidden rounded-lg"
          onPointerMove={handleBriefPointerMove}
          onPointerLeave={resetBriefPointer}
          style={{ animationDelay: "0.15s" }}
        >
          <div className="grid grid-cols-[1fr_auto] border-b border-slate-200/60 bg-white/90">
            <div className="p-5">
              <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Portfolio brief
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Research, internal tools, public products, and
                production-minded web systems.
              </p>
            </div>
            <div className="flex items-center border-l border-slate-200/60 px-5 font-iceland text-4xl text-[var(--coral)]">
              LD
            </div>
          </div>

          <div className="grid items-stretch gap-0 sm:grid-cols-[0.9fr_1.1fr]">
            <div
              ref={portraitFrameRef}
              className="aspect-[4/5] overflow-hidden bg-slate-200 sm:aspect-auto sm:h-full"
              role="img"
              aria-label="Portrait of Linus Dinesjö"
              onPointerMove={handlePortraitPointerMove}
              onPointerLeave={resetPortraitPointer}
            >
              <img
                src={portraitSrc}
                alt="Linus Dinesjö"
                width="900"
                height="900"
                loading="eager"
                decoding="async"
                className="portrait-img h-full w-full object-cover transition-all duration-500"
              />
            </div>
            <div className="flex flex-col justify-between border-t border-slate-200/60 p-5 sm:border-l sm:border-t-0">
              <div>
                <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Current focus
                </p>
                <p className="mt-3 text-2xl font-bold leading-tight text-slate-950">
                  Building research tools and operational systems people can
                  trust and use.
                </p>
              </div>
              <div className="mt-8 flex gap-2">
                <a
                  href="https://github.com/dinesjo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="quiet-button flex h-10 w-10 items-center justify-center"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/dinesjo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="quiet-button flex h-10 w-10 items-center justify-center"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
