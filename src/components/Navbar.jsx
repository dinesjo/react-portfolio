import { useCallback, useEffect, useRef, useState } from "react";
import { focusSection } from "../utils/portfolioNavigation";

const navItems = [
  { id: "home", label: "Home" },
  { id: "featured", label: "Work" },
  { id: "courses-carousel", label: "Study" },
  { id: "assistant", label: "Ask" },
  { id: "contact", label: "Contact" },
];

const allSections = [
  "home",
  "featured",
  "projects",
  "courses-carousel",
  "courses",
  "assistant",
  "contact",
];

// Map sections to their nav parent
const sectionToNav = {
  home: "home",
  assistant: "assistant",
  featured: "featured",
  "courses-carousel": "courses-carousel",
  projects: "featured",
  courses: "courses-carousel",
  contact: "contact",
};

const navOffset = 112;

export default function Navbar({ detailView = false }) {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [indicator, setIndicator] = useState({ left: 0, width: 0, ready: false });
  const navRefs = useRef([]);
  const activeIndex = Math.max(0, navItems.findIndex((item) => item.id === (detailView ? "featured" : active)));

  const updateIndicator = useCallback(() => {
    const activeButton = navRefs.current[activeIndex];
    if (!activeButton) return;

    setIndicator({
      left: activeButton.offsetLeft,
      width: activeButton.offsetWidth,
      ready: activeButton.offsetWidth > 0,
    });
  }, [activeIndex]);

  useEffect(() => {
    let animationFrame = 0;

    const updateFromScroll = () => {
      animationFrame = 0;
      const nextScrolled = window.scrollY > 20;
      setScrolled((previous) =>
        previous === nextScrolled ? previous : nextScrolled,
      );

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
      const isAtPageEnd =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 8;
      const next = isAtPageEnd ? "contact" : sectionToNav[current] || current;
      setActive((prev) => (prev === next ? prev : next));
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateFromScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateFromScroll();
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(updateIndicator);
    let cancelled = false;

    document.fonts?.ready.then(() => {
      if (!cancelled) updateIndicator();
    });
    window.addEventListener("resize", updateIndicator);

    // Follow layout changes through the navigation's responsive transition.
    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateIndicator)
      : null;
    const activeButton = navRefs.current[activeIndex];
    if (activeButton) resizeObserver?.observe(activeButton);

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", updateIndicator);
      resizeObserver?.disconnect();
    };
  }, [activeIndex, updateIndicator]);

  return (
    <nav
      aria-label="Primary navigation"
      className={`site-nav safe-top-nav fixed left-1/2 z-50 flex -translate-x-1/2 items-center border backdrop-blur-md transition-all duration-300 ${
        scrolled
          ? "site-nav--scrolled border-slate-300/50 bg-white/95"
          : "border-white/75 bg-white/80"
      }`}
    >
      <a
        href="#home"
        className="site-nav__brand"
        onClick={focusSection}
        aria-label="Back to the top"
      >
        <span className="site-nav__monogram">LD</span>
        <span className="site-nav__brand-copy">
          <strong>Portfolio</strong>
          <small>Linus Dinesj&ouml;</small>
        </span>
      </a>

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
          <a
            key={item.id}
            href={`#${item.id}`}
            ref={(node) => {
              const index = navItems.findIndex(
                (navItem) => navItem.id === item.id,
              );
              navRefs.current[index] = node;
            }}
            onClick={focusSection}
            aria-current={activeIndex === navItems.indexOf(item) ? "location" : undefined}
            className={`nav-item whitespace-nowrap px-3 py-2 font-montserrat text-[0.68rem] font-bold uppercase tracking-[0.08em] transition-colors duration-200 sm:px-4 ${
              activeIndex === navItems.indexOf(item)
                ? "text-white"
                : "text-slate-500 hover:text-slate-950"
            }`}
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
