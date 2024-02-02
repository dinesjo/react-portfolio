import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaEnvelope,
  FaCertificate,
  FaGithub,
  FaLinkedin,
  FaBook,
} from "react-icons/fa";

const NavBar = () => {
  return (
    <div className="fixed w-full flex flex-wrap justify-center gap-2 bg-neutral-800 shadow z-50">
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
      className={`flex items-center p-2 text-lg font-semibold rounded-md transition-all ${
        current ? "text-indigo-500" : "text-zinc-300 hover:text-indigo-500"
      }`}
    >
      <span className="inline-block me-2">{icon}</span>
      {name}
    </Link>
  );
};

const Footer = () => {
  return (
    <div className="flex justify-center gap-10 mt-auto py-5 text-gray-300 bg-neutral-800">
      <a
        href="https://github.com/dinesjo"
        target="_blank"
        rel="noopener noreferrer"
        title="View my GitHub"
      >
        <FaGithub className="text-4xl hover:text-gray-400 transition-all" />
      </a>
      <a href={`mailto:dinesjo@kth.se`} title="Send me an email">
        <FaEnvelope className="text-4xl hover:text-gray-400 transition-all" />
      </a>
      <a
        href="https://www.linkedin.com/in/dinesjo/"
        target="_blank"
        rel="noopener noreferrer"
        title="Open my LinkedIn"
      >
        <FaLinkedin className="text-4xl hover:text-gray-400 transition-all" />
      </a>
    </div>
  );
};

export default function Root() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <div className="w-11/12 mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
