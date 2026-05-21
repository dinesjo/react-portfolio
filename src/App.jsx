import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProjects from "./components/FeaturedProjects";
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

    return () => {
      clearTimeout(timer);
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
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-xl focus:font-semibold"
      >
        Skip to content
      </a>

      <div className="site-backdrop fixed inset-0 -z-10" />

      <Navbar />

      <main>
        <Hero />
        <FeaturedProjects />
        <ProjectsGrid />
        <CoursesCarousel />
        <CoursesList />
        <Contact />
      </main>

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`fixed bottom-5 right-5 z-50 w-10 h-10 flex items-center justify-center rounded-lg surface-card text-slate-600 hover:text-slate-950 transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <FaChevronUp />
      </button>
    </div>
  );
}
