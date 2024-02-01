import { Outlet, Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaEnvelope,
  FaCertificate,
  FaGithub,
  FaLinkedin,
  FaBook,
} from "react-icons/fa";

const SideBar = () => {
  return (
    <div className="fixed top-0 left-0 w-screen shadow flex justify-center gap-4 bg-neutral-800 z-50">
      <SideBarItem name="Home" icon={<FaHome />} to="/" />
      <SideBarItem name="Projects" icon={<FaCertificate />} to="/projects" />
      <SideBarItem name="Courses" icon={<FaBook />} to="/courses" />
      <SideBarItem name="Contact" icon={<FaEnvelope />} to="/contact" />
    </div>
  );
};

const SideBarItem = ({ name, icon, to }) => {
  let current = useLocation().pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center py-2 text-lg font-semibold rounded-md transition-all ${
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
      <SideBar />
      <Outlet />
      <Footer />
    </div>
  );
}
