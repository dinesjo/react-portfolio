import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "featured", label: "Work" },
  { id: "courses-carousel", label: "Courses" },
  { id: "contact", label: "Contact" },
];

const allSections = [
  "home",
  "featured",
  "courses-carousel",
  "projects",
  "courses",
  "contact",
];

// Map sections to their nav parent
const sectionToNav = {
  home: "home",
  featured: "featured",
  "courses-carousel": "courses-carousel",
  projects: "featured",
  courses: "courses-carousel",
  contact: "contact",
};

const navOffset = 112;

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const navRefs = useRef([]);
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === active));

  const updateIndicator = useCallback(() => {
    const activeButton = navRefs.current[activeIndex];
    if (!activeButton) return;

    setIndicator({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      ready: true,
    });
  }, [activeIndex]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const nextProgress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, nextProgress)));

      let current = "home";
      let maxVis = 0;
      for (const id of allSections) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const top = Math.max(rect.top, navOffset);
        const bottom = Math.min(rect.bottom, window.innerHeight);
        const vis = Math.max(0, bottom - top);
        if (vis > maxVis) {
          maxVis = vis;
          current = id;
        }
      }
      const next = sectionToNav[current] || current;
      setActive((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateIndicator);
    window.addEventListener("resize", updateIndicator);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = id === "home" ? 0 : el.offsetTop - navOffset;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`site-nav safe-top-nav fixed left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100vw-24px)] gap-1 rounded-lg border px-1.5 py-1.5 backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "border-slate-300/40 bg-white/95 shadow-lg shadow-slate-900/5"
          : "border-white/75 bg-white/75 shadow-sm shadow-slate-900/5"
      }`}
      style={{ "--scroll-progress": `${scrollProgress}%` }}
    >
      <span
        aria-hidden="true"
        className="site-nav__indicator"
        style={{
          opacity: indicator.ready ? 1 : 0,
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
      <span aria-hidden="true" className="site-nav__progress" />
      {navItems.map((item) => (
        <button
          key={item.id}
          ref={(node) => {
            navRefs.current[navItems.findIndex((navItem) => navItem.id === item.id)] = node;
          }}
          onClick={() => scrollTo(item.id)}
          className={`nav-item rounded-md px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-montserrat font-bold transition-colors duration-200 whitespace-nowrap ${
            active === item.id
              ? "text-white"
              : "text-slate-500 hover:text-slate-950"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
