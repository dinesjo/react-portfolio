import { useState } from "react";
import { Link } from "react-router-dom";
import ProjectCard from "./components/ProjectCard";
import { TabTitle } from "./utils/GeneralFunctions";

import habitGrowerIcon from "./assets/habit-grower-icon.png";
import snuskollLogo from "./assets/snuskoll-logo.png";

// PortraitFadeIn component for fade-in and hover effect
function PortraitFadeIn() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`w-60 xs:w-72 h-60 xs:h-72 glass rounded-full mx-auto outline outline-transparent xs:hover:outline-indigo-500 bg-cover bg-center animate-fadein`}
      style={{
        backgroundImage: "url('portrait.png')",
        backgroundSize: hovered ? "125%" : "101%",
        backgroundPosition: "center center",
        transition: "all 0.3s ease, background-size 0.3s ease",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="img"
      aria-label="Portrait of Linus Dinesjö"
      tabIndex={0}
    />
  );
}

export default function Home() {
  TabTitle("Home");

  return (
    <>
      <div className="flex flex-col items-center md:w-1/2 py-16 mx-auto" style={{ minHeight: "50vh" }}>
        <div className="flex flex-col items-center gap-0">
          <PortraitFadeIn />
          <h1 className="h1 text-indigo-500 z-10 mt-0 animate-fadein" style={{ textShadow: "1px 2px 4px #000000" }}>
            <span className="font-iceland text-6xl sm:text-7xl whitespace-nowrap">Linus Dinesjö</span>
          </h1>
        </div>
        <h4 className="font-iceland h3">
          <b className="text-indigo-500">Welcome!</b> I&apos;m a 5th year student at{" "}
          <span className="text-indigo-500">
            <b>KTH Stockholm</b>
          </span>
          , persuing a master&apos;s degree in Computer Science.
        </h4>
        <h5 className="font-iceland h5 mt-5 text-gray-400">
          Check out some of my{" "}
          <Link className="link" to="/projects">
            projects
          </Link>
          , as well as the{" "}
          <Link className="link" to="/courses">
            courses
          </Link>{" "}
          I have taken at KTH. Feel free to get in touch, see the{" "}
          <Link className="link" to="/contact">
            contact
          </Link>{" "}
          page.
        </h5>
      </div>

      {/* Divider and Minimal Cards Section */}
      <div className="w-full pb-20">
        <div className="mt-8 flex items-center w-full max-w-lg mx-auto mb-8">
          <hr className="flex-grow border-t border-slate-300 dark:border-slate-700" />
          <span className="mx-4 text-slate-400 font-semibold uppercase tracking-widest text-xs">Quick Links</span>
          <hr className="flex-grow border-t border-slate-300 dark:border-slate-700" />
        </div>
        <div className="grid grid-cols-2 gap-6 items-start w-fit mx-auto">
          <ProjectCard
            minimal
            color="slate"
            title="Snus Koll"
            href="https://snuskoll.dinesjo.se/"
            hrefText="Open"
            iconSrc={snuskollLogo}
          />
          <ProjectCard
            minimal
            color="lime"
            title="Habit Grower"
            href="https://habitgrower.web.app/"
            hrefText="Open"
            iconSrc={habitGrowerIcon}
          />
        </div>
      </div>
    </>
  );
}
