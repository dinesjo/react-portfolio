import { useEffect, useState } from "react";
import { FaChevronUp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedProjects from "./components/FeaturedProjects";
import CoursesCarousel from "./components/CoursesCarousel";
import ProjectsGrid from "./components/ProjectsGrid";
import CoursesList from "./components/CoursesList";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

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

      {/* Background gradient */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-sky-50 via-blue-50 to-blue-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />

      {/* Decorative blurred blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-blue-200/30 dark:bg-blue-900/20 blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full bg-sky-200/25 dark:bg-sky-900/15 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-200/20 dark:bg-indigo-900/15 blur-3xl" />
      </div>

      <Navbar />

      <main>
        <Hero />
        <FeaturedProjects />
        <CoursesCarousel />
        <ProjectsGrid />
        <CoursesList />
        <Contact />
      </main>

      <Footer />

      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center rounded-xl glass-card text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
      >
        <FaChevronUp />
      </button>
    </div>
  );
}
