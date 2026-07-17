import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import PortfolioAssistant from "./components/PortfolioAssistant";
import Coursework from "./components/Coursework";
import ProjectsGrid from "./components/ProjectsGrid";
import Contact from "./components/Contact";

export default function App() {
  const [showTop, setShowTop] = useState(false);

  // Scroll-based reveal using IntersectionObserver
  useEffect(() => {
    const revealImmediately = () => {
      document.querySelectorAll(".reveal").forEach((element) => {
        element.classList.add("revealed");
      });
    };

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!("IntersectionObserver" in window) || reducedMotion) {
      revealImmediately();
      return undefined;
    }

    const observedElements = new Set();
    const focusResetTimers = new Set();

    let observer;
    let observeFrame = 0;

    const revealElement = (element) => {
      element.classList.add("revealed");
      observer.unobserve(element);
      observedElements.delete(element);
    };

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target);
          }
        });
      },
      {
        threshold: 0.06,
        rootMargin: "0px 0px -16px 0px",
      }
    );

    const observe = () => {
      observedElements.forEach((element) => {
        if (!element.isConnected || element.classList.contains("revealed")) {
          observer.unobserve(element);
          observedElements.delete(element);
        }
      });

      document.querySelectorAll(".reveal:not(.revealed)").forEach((el) => {
        if (observedElements.has(el)) return;
        observer.observe(el);
        observedElements.add(el);
      });
    };

    const scheduleObserve = () => {
      if (observeFrame) return;
      observeFrame = window.requestAnimationFrame(() => {
        observeFrame = 0;
        observe();
      });
    };

    const revealOnFocus = (event) => {
      const element = event.target?.closest?.(".reveal");
      if (!element || element.classList.contains("revealed")) return;

      element.classList.add("reveal-without-motion");
      revealElement(element);

      const timer = window.setTimeout(() => {
        element.classList.remove("reveal-without-motion");
        focusResetTimers.delete(timer);
      }, 50);
      focusResetTimers.add(timer);
    };

    observe();
    const timer = window.setTimeout(scheduleObserve, 200);
    const mutationObserver = new MutationObserver(scheduleObserve);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("focusin", revealOnFocus);

    return () => {
      window.clearTimeout(timer);
      window.cancelAnimationFrame(observeFrame);
      focusResetTimers.forEach((focusTimer) => window.clearTimeout(focusTimer));
      mutationObserver.disconnect();
      document.removeEventListener("focusin", revealOnFocus);
      observer.disconnect();
      observedElements.clear();
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
        <Coursework />
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
