import { useState, useEffect } from "react";

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
      const next = sectionToNav[current] || current;
      setActive((prev) => (prev === next ? prev : next));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = id === "home" ? 0 : el.offsetTop - navOffset;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`safe-top-nav fixed left-1/2 -translate-x-1/2 z-50 flex max-w-[calc(100vw-24px)] gap-1 rounded-lg border px-1.5 py-1.5 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 border-slate-300 shadow-lg shadow-slate-900/5"
          : "bg-white/92 border-slate-200/80"
      }`}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`relative rounded-md px-3 py-1.5 text-xs sm:px-4 sm:text-sm font-montserrat font-bold transition-all duration-200 whitespace-nowrap ${
            active === item.id
              ? "bg-slate-950 text-white"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-950"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
