import { useState, useEffect } from "react";

const portraitSrc = import.meta.env.BASE_URL + "portrait.png";

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
      {/* Portrait */}
      <div className="relative mb-8 animate-fade-up">
        <div
          className="w-52 h-52 sm:w-72 sm:h-72 rounded-full overflow-hidden ring-4 ring-white/60 dark:ring-white/15 shadow-2xl shadow-blue-500/15 dark:shadow-blue-500/30 transition-all duration-500"
          role="img"
          aria-label="Portrait of Linus Dinesjö"
        >
          <img
            src={portraitSrc}
            alt="Linus Dinesjö"
            className="portrait-img w-full h-full object-cover transition-all duration-500"
          />
        </div>
        {/* Glow behind portrait */}
        <div className="absolute inset-0 -z-10 bg-blue-400/20 dark:bg-blue-500/15 rounded-full blur-3xl scale-150" />
      </div>

      {/* Name */}
      <h1
        className="font-iceland text-6xl sm:text-8xl font-bold text-blue-600 dark:text-blue-400 tracking-tight animate-fade-up"
        style={{ animationDelay: "0.15s" }}
      >
        Linus Dinesj&ouml;
      </h1>

      {/* Tagline */}
      <p
        className="mt-4 text-lg sm:text-xl text-slate-500 dark:text-slate-400 font-inter max-w-xl leading-relaxed animate-fade-up"
        style={{ animationDelay: "0.3s" }}
      >
        5th year Computer Science student at{" "}
        <span className="font-semibold text-blue-500 dark:text-blue-400">KTH Stockholm</span>, building things for the
        web.
      </p>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 animate-fade-up transition-opacity duration-500 ${scrolled ? "opacity-0 pointer-events-none" : ""}`}
        style={{ animationDelay: "0.5s" }}
      >
        <span className="text-xs font-montserrat tracking-widest uppercase">Scroll</span>
        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
