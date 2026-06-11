import { useState, useEffect } from "react";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import portraitSrc from "../assets/project-optimized/portrait.webp";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="relative px-6 pb-16 pt-28 sm:pt-32 lg:min-h-[760px]">
      <div className="section-shell grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="animate-fade-up">
          <span className="section-eyebrow">KTH Computer Science</span>
          <h1 className="section-title mt-6 max-w-4xl text-5xl sm:text-7xl lg:text-8xl">
            Linus Dinesj&ouml;
          </h1>
          <p className="section-copy mt-6 max-w-2xl text-lg sm:text-xl">
            Final-year computer science student near Stockholm, building
            web systems, internal tools, and small products that stay
            maintainable after the first release.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("featured");
                if (el) window.scrollTo({ top: el.offsetTop - 112, behavior: "smooth" });
              }}
              className="sharp-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5"
            >
              View work <FaArrowRight className="text-xs" />
            </button>
            <a
              href="mailto:dinesjo@kth.se"
              className="quiet-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold transition-colors duration-200 hover:bg-white"
            >
              <FaEnvelope className="text-xs" /> Contact
            </a>
          </div>

          <dl className="mt-10 grid max-w-2xl grid-cols-1 gap-3 xs:grid-cols-3">
            {[
              ["Focus", "Web systems"],
              ["Current", "Master thesis"],
              ["Location", "Strängnäs, Sweden"],
            ].map(([label, value]) => (
              <div key={label} className="border-l-2 border-slate-300 pl-3">
                <dt className="font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <aside
          className="surface-card animate-fade-up overflow-hidden rounded-lg"
          style={{ animationDelay: "0.15s" }}
        >
          <div className="grid grid-cols-[1fr_auto] border-b border-slate-200 bg-white">
            <div className="p-5">
              <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Portfolio brief
              </p>
              <p className="mt-2 text-sm text-slate-600">
                KTH coursework, research, side work, and production
                software.
              </p>
            </div>
            <div className="flex items-center border-l border-slate-200 px-5 font-iceland text-4xl text-[var(--coral)]">
              LD
            </div>
          </div>

          <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
            <div
              className="aspect-[4/5] overflow-hidden bg-slate-200"
              role="img"
              aria-label="Portrait of Linus Dinesjö"
            >
              <img
                src={portraitSrc}
                alt="Linus Dinesjö"
                className="portrait-img h-full w-full object-cover transition-all duration-500"
              />
            </div>
            <div className="flex flex-col justify-between border-t border-slate-200 p-5 sm:border-l sm:border-t-0">
              <div>
                <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Current focus
                </p>
                <p className="mt-3 text-2xl font-bold leading-tight text-slate-950">
                  Building focused tools for research, support, and daily work.
                </p>
              </div>
              <div className="mt-8 flex gap-2">
                <a
                  href="https://github.com/dinesjo"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="quiet-button flex h-10 w-10 items-center justify-center transition-colors hover:bg-white"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/dinesjo/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="quiet-button flex h-10 w-10 items-center justify-center transition-colors hover:bg-white"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div
        className={`pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-opacity duration-500 sm:flex ${scrolled ? "opacity-0" : "opacity-100"}`}
      >
        <span className="font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.22em]">
          Selected work below
        </span>
        <span className="h-8 w-px bg-slate-300" />
      </div>
    </section>
  );
}
