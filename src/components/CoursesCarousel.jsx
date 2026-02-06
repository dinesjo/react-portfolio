import { useRef, useEffect, useCallback } from "react";
import { courses, getCourseColor } from "../data/courses";

const featured = courses.filter((c) =>
  [
    "DD2350",
    "DH2642",
    "DD2395",
    "DD2480",
    "DD2525",
    "DD2380",
  ].includes(c.code)
);

export default function CoursesCarousel() {
  const scrollRef = useRef(null);
  const pausedRef = useRef(false);
  const timeoutRef = useRef(null);

  const pause = useCallback(() => {
    pausedRef.current = true;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 3000);
  }, []);

  // Auto-scroll with requestAnimationFrame
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let direction = 1;
    let lastTime = 0;
    let rafId;

    const step = (time) => {
      rafId = requestAnimationFrame(step);
      if (pausedRef.current || !el) return;

      // Move ~1px per 30ms
      if (time - lastTime < 30) return;
      lastTime = time;

      const maxScroll = el.scrollWidth - el.offsetWidth;
      if (el.scrollLeft >= maxScroll - 1) direction = -1;
      else if (el.scrollLeft <= 0) direction = 1;

      el.scrollLeft += direction;
    };

    rafId = requestAnimationFrame(step);

    el.addEventListener("pointerdown", pause);
    el.addEventListener("wheel", pause, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutRef.current);
      el.removeEventListener("pointerdown", pause);
      el.removeEventListener("wheel", pause);
    };
  }, [pause]);

  const handleKeyDown = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.key === "ArrowRight") {
      el.scrollBy({ left: 288, behavior: "smooth" });
      pause();
    } else if (e.key === "ArrowLeft") {
      el.scrollBy({ left: -288, behavior: "smooth" });
      pause();
    }
  };

  return (
    <section id="courses-carousel" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-iceland text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 text-center mb-4 reveal">
          Featured Courses
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 font-inter mb-12 max-w-2xl mx-auto reveal">
          A few highlights from my studies at KTH Stockholm.
        </p>

        {/* Carousel wrapper */}
        <div className="relative reveal">
          {/* Scrollable track */}
          <div
            ref={scrollRef}
            tabIndex={0}
            role="region"
            aria-label="Featured courses"
            onKeyDown={handleKeyDown}
            onFocus={pause}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide outline-none"
          >
            {featured.map((course) => {
              const color = getCourseColor(course.code);
              return (
                <div
                  key={course.code}
                  className="glass-card flex-shrink-0 w-72 rounded-2xl p-5 group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="text-sm font-bold font-mono px-2.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${color}15`,
                        color: color,
                      }}
                    >
                      {course.code}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-inter">
                      Year {course.year}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-inter leading-snug">
                    {course.name}
                  </p>
                  {course.optional && (
                    <span className="text-xs text-slate-400 dark:text-slate-500 italic mt-1 inline-block">
                      Elective
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-sky-50/50 dark:from-slate-950/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-sky-50/50 dark:from-slate-950/80 to-transparent" />
        </div>
      </div>
    </section>
  );
}
