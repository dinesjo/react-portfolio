import { useState, useEffect } from "react";

const navItems = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "courses", label: "Courses" },
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
  featured: "home",
  "courses-carousel": "home",
  projects: "projects",
  courses: "courses",
  contact: "contact",
};

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
        const top = Math.max(rect.top, 80);
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
      const offset = id === "home" ? 0 : el.offsetTop - 80;
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-1 rounded-2xl px-2 py-2 transition-all duration-500 ${
        scrolled ? "glass-card shadow-lg shadow-blue-500/5" : "bg-transparent"
      }`}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollTo(item.id)}
          className={`px-3 sm:px-5 py-1.5 rounded-xl text-sm font-montserrat font-semibold transition-all duration-300 whitespace-nowrap ${
            active === item.id
              ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
              : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
