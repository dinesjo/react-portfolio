import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PortfolioAssistant from "./components/PortfolioAssistant";
import CoursesCarousel from "./components/CoursesCarousel";
import ProjectsGrid from "./components/ProjectsGrid";
import CoursesList from "./components/CoursesList";
import Contact from "./components/Contact";

export default function App() {
  const [showTop, setShowTop] = useState(false);

  // Scroll-based reveal using IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const observe = () => {
      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        observer.observe(el);
      });
    };

    observe();
    const timer = setTimeout(observe, 200);
    const mutationObserver = new MutationObserver(observe);
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  // Show scroll-to-top button
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Skip to content */}
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border focus:border-white/30 focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <div className="site-backdrop fixed inset-0 -z-10" />

      <Navbar />

      <main>
        <Hero />
        <ProjectsGrid />
        <CoursesCarousel />
        <CoursesList />
        <PortfolioAssistant />
        <Contact />
      </main>

      {/* Scroll to top */}
      <button
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
              ? "auto"
              : "smooth",
          })
        }
        aria-label="Scroll to top"
        aria-hidden={!showTop}
        tabIndex={showTop ? 0 : -1}
        className={`scroll-top-button surface-card fixed bottom-5 right-5 z-50 flex h-11 w-11 items-center justify-center text-slate-600 hover:text-slate-950 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <FaChevronUp />
      </button>
    </div>
  );
}
