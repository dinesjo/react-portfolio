import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "featured", label: "Work" },
  { id: "courses-carousel", label: "Study" },
  { id: "contact", label: "Contact" },
];

const allSections = [
  "home",
  "assistant",
  "featured",
  "projects",
  "courses-carousel",
  "courses",
  "contact",
];

// Map sections to their nav parent
const sectionToNav = {
  home: "home",
  assistant: "courses-carousel",
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
      const isAtPageEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 8;
      const next = isAtPageEnd ? "contact" : sectionToNav[current] || current;
      setActive((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateIndicator);
    let cancelled = false;

    document.fonts?.ready.then(() => {
      if (!cancelled) updateIndicator();
    });
    window.addEventListener("resize", updateIndicator);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateIndicator);
    };
  }, [updateIndicator]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = id === "home" ? 0 : el.offsetTop - navOffset;
      window.scrollTo({
        top: offset,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
      });
    }
  };

  return (
    <nav
      aria-label="Primary navigation"
      className={`site-nav safe-top-nav fixed left-1/2 z-50 flex -translate-x-1/2 items-center border backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "site-nav--scrolled border-slate-300/50 bg-white/95"
          : "border-white/75 bg-white/80"
      }`}
    >
      <button
        type="button"
        className="site-nav__brand"
        onClick={() => scrollTo("home")}
        aria-label="Back to the top"
      >
        <span className="site-nav__monogram">LD</span>
        <span className="site-nav__brand-copy">
          <strong>Portfolio</strong>
          <small>Linus Dinesj&ouml;</small>
        </span>
      </button>

      <div className="site-nav__links">
        <span
          aria-hidden="true"
          className="site-nav__indicator"
          style={{
            opacity: indicator.ready ? 1 : 0,
            transform: `translateX(${indicator.left}px)`,
            width: `${indicator.width}px`,
          }}
        />
        {navItems.map((item) => (
        <button
          key={item.id}
          type="button"
          ref={(node) => {
            navRefs.current[navItems.findIndex((navItem) => navItem.id === item.id)] = node;
          }}
          onClick={() => scrollTo(item.id)}
          aria-current={active === item.id ? "location" : undefined}
          className={`nav-item whitespace-nowrap px-3 py-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors duration-200 sm:px-4 ${
            active === item.id
              ? "text-white"
              : "text-slate-500 hover:text-slate-950"
          }`}
        >
          {item.label}
        </button>
        ))}
      </div>
    </nav>
  );
}
