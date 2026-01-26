import { useEffect, useState } from "react";
import { FaBook, FaCertificate, FaEnvelope, FaGithub, FaHome, FaLinkedin } from "react-icons/fa";
import Home from "./Home.jsx";
import Projects from "./Projects.jsx";
import Courses from "./Courses.jsx";
import Contact from "./Contact.jsx";

const NavBar = ({ activeSection }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 250; // Approximate height of navbar
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="fixed w-full flex flex-wrap justify-center gap-4 navbar-blur shadow-lg z-50 py-4">
      <NavBarItem
        name="Home"
        icon={<FaHome />}
        onClick={() => scrollToSection("home")}
        active={activeSection === "home"}
      />
      <NavBarItem
        name="Projects"
        icon={<FaCertificate />}
        onClick={() => scrollToSection("projects")}
        active={activeSection === "projects"}
      />
      <NavBarItem
        name="Courses"
        icon={<FaBook />}
        onClick={() => scrollToSection("courses")}
        active={activeSection === "courses"}
      />
      <NavBarItem
        name="Contact"
        icon={<FaEnvelope />}
        onClick={() => scrollToSection("contact")}
        active={activeSection === "contact"}
      />
    </div>
  );
};

const NavBarItem = ({ name, icon, onClick, active }) => {
  return (
    <button
      onClick={onClick}
      className={`font-iceland flex items-center px-3 sm:px-4 py-2 text-2xl font-medium rounded-xl transition-all duration-200 ${
        active
          ? "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 navbar-active-glow"
          : "dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50 hover:bg-slate-200 hover:text-slate-900 hover:shadow-md text-slate-700"
      }`}
    >
      <span className="inline-block sm:me-2">{icon}</span>
      <span className="hidden sm:inline">{name}</span>
    </button>
  );
};

const Footer = () => {
  return (
    <div className="flex justify-center gap-8 py-8 text-slate-400 glass">
      <a
        href="https://github.com/dinesjo"
        target="_blank"
        rel="noopener noreferrer"
        title="View my GitHub"
        className="group transition-all duration-200 hover:scale-110"
      >
        <FaGithub className="text-4xl group-hover:text-slate-200 transition-all duration-200" />
      </a>
      <a
        href={`mailto:dinesjo@kth.se`}
        title="Send me an email"
        className="group transition-all duration-200 hover:scale-110"
      >
        <FaEnvelope className="text-4xl group-hover:text-indigo-400 transition-all duration-200" />
      </a>
      <a
        href="https://www.linkedin.com/in/dinesjo/"
        target="_blank"
        rel="noopener noreferrer"
        title="Open my LinkedIn"
        className="group transition-all duration-200 hover:scale-110"
      >
        <FaLinkedin className="text-4xl group-hover:text-blue-400 transition-all duration-200" />
      </a>
    </div>
  );
};

export default function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "projects", "courses", "contact"];
      const navbarHeight = 80; // Account for navbar height

      // Find which section is currently most visible in the viewport
      let currentSection = "home";
      let maxVisibility = 0;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const elementTop = Math.max(rect.top, navbarHeight);
          const elementBottom = Math.min(rect.bottom, window.innerHeight);
          const visibleHeight = Math.max(0, elementBottom - elementTop);

          if (visibleHeight > maxVisibility) {
            maxVisibility = visibleHeight;
            currentSection = sectionId;
          }
        }
      }

      setActiveSection(currentSection);

      // Scroll animations
      const animatedElements = document.querySelectorAll(".scroll-animate");
      animatedElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        if (isVisible) {
          el.classList.add("scroll-visible");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar activeSection={activeSection} />

      <div className="w-11/12 mx-auto flex flex-col items-center pt-20">
        <section id="home" className="min-h-screen w-full flex flex-col items-center justify-center">
          <Home />
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl my-16 scroll-animate">
          <div className="flex items-center py-4 rounded-2xl">
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
            <span className="mx-8 text-indigo-400 font-bold uppercase tracking-widest text-base flex items-center gap-3">
              <FaCertificate className="text-xl" />
              Projects
            </span>
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
          </div>
        </div>

        <section id="projects" className="min-h-screen w-full flex flex-col items-center justify-center scroll-animate">
          <Projects />
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl my-16 scroll-animate">
          <div className="flex items-center py-4 rounded-2xl">
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
            <span className="mx-8 text-indigo-400 font-bold uppercase tracking-widest text-base flex items-center gap-3">
              <FaBook className="text-xl" />
              Courses
            </span>
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
          </div>
        </div>

        <section id="courses" className="min-h-screen w-full flex flex-col items-center justify-center scroll-animate">
          <Courses />
        </section>

        {/* Divider */}
        <div className="w-full max-w-4xl my-16 scroll-animate">
          <div className="flex items-center py-4 rounded-2xl">
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
            <span className="mx-8 text-indigo-400 font-bold uppercase tracking-widest text-base flex items-center gap-3">
              <FaEnvelope className="text-xl" />
              Contact
            </span>
            <hr className="flex-grow border-t-2 border-indigo-500/50" />
          </div>
        </div>

        <section id="contact" className="w-full flex flex-col items-center">
          <Contact />
        </section>
      </div>

      <Footer />
    </div>
  );
}
