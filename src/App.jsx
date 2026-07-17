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
        element.classList.add("revealed", "reveal-complete");
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

    const observeReveal = (element) => {
      if (
        element.classList.contains("revealed") ||
        observedElements.has(element)
      ) {
        return;
      }

      observer.observe(element);
      observedElements.add(element);
    };

    const visitRevealSubtree = (node, callback) => {
      if (!(node instanceof Element)) return;

      if (node.matches(".reveal")) callback(node);
      node.querySelectorAll(".reveal").forEach(callback);
    };

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          visitRevealSubtree(node, observeReveal);
        });
        record.removedNodes.forEach((node) => {
          visitRevealSubtree(node, (element) => {
            if (!observedElements.has(element)) return;
            observer.unobserve(element);
            observedElements.delete(element);
          });
        });
      });
    });

    const completeReveal = (event) => {
      if (event.animationName === "hero-portrait-settle") {
        event.target
          ?.closest?.(".hero-section")
          ?.classList.add("hero-motion-complete");
        return;
      }

      if (
        event.animationName !== "reveal-cover-sweep" &&
        event.animationName !== "case-study-media-sweep"
      ) {
        return;
      }

      const element = event.target?.closest?.(".reveal");
      if (element?.classList.contains("revealed")) {
        element.classList.add("reveal-complete");
      }
    };

    const revealOnFocus = (event) => {
      event.target
        ?.closest?.(".hero-section")
        ?.classList.add("hero-motion-complete");

      const element = event.target?.closest?.(".reveal");
      if (!element || element.classList.contains("reveal-complete")) return;

      const alreadyRevealed = element.classList.contains("revealed");
      element.classList.add("reveal-without-motion", "reveal-complete");
      if (!alreadyRevealed) revealElement(element);

      const timer = window.setTimeout(() => {
        element.classList.remove("reveal-without-motion");
        focusResetTimers.delete(timer);
      }, 50);
      focusResetTimers.add(timer);
    };

    document.querySelectorAll(".reveal").forEach(observeReveal);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("animationend", completeReveal, true);
    document.addEventListener("animationcancel", completeReveal, true);
    document.addEventListener("focusin", revealOnFocus);

    return () => {
      focusResetTimers.forEach((focusTimer) => window.clearTimeout(focusTimer));
      mutationObserver.disconnect();
      document.removeEventListener("animationend", completeReveal, true);
      document.removeEventListener("animationcancel", completeReveal, true);
      document.removeEventListener("focusin", revealOnFocus);
      observer.disconnect();
      observedElements.clear();
    };
  }, []);

  // Show scroll-to-top button
  useEffect(() => {
    let animationFrame = 0;
    let isVisible = window.scrollY > 500;
    setShowTop(isVisible);

    const updateVisibility = () => {
      animationFrame = 0;
      const nextVisible = window.scrollY > 500;
      if (nextVisible === isVisible) return;

      isVisible = nextVisible;
      setShowTop(nextVisible);
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", onScroll);
    };
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
