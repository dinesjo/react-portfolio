import { FaBook, FaCertificate, FaEnvelope, FaGithub, FaHome, FaLinkedin } from "react-icons/fa";
import { Link, Outlet, useLocation } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="fixed w-full flex flex-wrap justify-center gap-4 navbar-blur shadow-lg z-50 py-4">
      <NavBarItem name="Home" icon={<FaHome />} to="/" />
      <NavBarItem name="Projects" icon={<FaCertificate />} to="/projects" />
      <NavBarItem name="Courses" icon={<FaBook />} to="/courses" />
      <NavBarItem name="Contact" icon={<FaEnvelope />} to="/contact" />
    </div>
  );
};

const NavBarItem = ({ name, icon, to }) => {
  let current = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-lg font-medium rounded-xl transition-all duration-200 ${
        current
          ? "text-white bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-lg"
          : "dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-700/50 hover:bg-slate-200 hover:text-slate-900 hover:shadow-md text-slate-700"
      }`}
    >
      <span className="inline-block me-2">{icon}</span>
      {name}
    </Link>
  );
};

const Footer = () => {
  return (
    <div className="flex justify-center gap-8 mt-auto py-8 text-slate-400 glass">
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

export default function Root() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="w-11/12 mx-auto flex flex-col items-center justify-center pt-28">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
