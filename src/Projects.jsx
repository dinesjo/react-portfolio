import {
  FaBootstrap,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCalendarDay,
  FaCalendarWeek,
  FaCertificate,
  FaChess,
  FaCode,
  FaCss3Alt,
  FaGithub,
  FaHtml5,
  FaJsSquare,
  FaLink,
  FaMapPin,
  FaMusic,
  FaPython,
  FaReact,
  FaRoad,
  FaServer,
  FaTwitter,
  FaUnity,
} from "react-icons/fa";
import cppImg from "./assets/c++.png";
import csharpImg from "./assets/csharp.png";
import wxwidgetsImg from "./assets/wxwidgets.png";
import tailwindImg from "./assets/tailwind.png";
import kqlImg from "./assets/kql.png";
import aspnetImg from "./assets/aspnet.png";
import chessreporterImg from "./assets/chess-reporter.png";
import noteheroImg from "./assets/note-hero.png";
import pathvisImg from "./assets/path-vis.png";
import deadlineTracker from "./assets/deadline-tracker.png";
import pathvisReactImg from "./assets/path-vis-react.png";
import droneImg from "./assets/drone-software.png";
import thisImg from "./assets/this.png";
import logportalImg from "./assets/log-portal.png";
import { TabTitle } from "./utils/GeneralFunctions";

const ProjectCard = ({
  children,
  title,
  imgsrc,
  hrefText,
  href,
  tags,
  icon,
  githubhref,
  date,
}) => {
  const colorMap = {
    "c++": "teal",
    wxwidgets: "lime",
    "c#": "green",
    javascript: "indigo",
    kql: "sky",
    "asp.net": "purple",
    html: "blue",
    css: "pink",
    react: "cyan",
    "tailwind css": "emerald",
    bootstrap: "purple",
    python: "cyan",
    "twitter api": "blue",
    unity: "lime",
    "joy ui": "blue",
  };

  const iconMap = {
    javascript: <FaJsSquare className="inline-block me-2" />,
    html: <FaHtml5 className="inline-block me-2" />,
    css: <FaCss3Alt className="inline-block me-2" />,
    react: <FaReact className="inline-block me-2" />,
    bootstrap: <FaBootstrap className="inline-block me-2" />,
    python: <FaPython className="inline-block me-2" />,
    "twitter api": <FaTwitter className="inline-block me-2" />,
    unity: <FaUnity className="inline-block me-2" />,
    "tailwind css": <img src={tailwindImg} className="inline-block me-2 w-3" />,
    "c++": <img src={cppImg} className="inline-block me-2 w-5" />,
    "c#": <img src={csharpImg} className="inline-block me-2 w-5" />,
    wxwidgets: <img src={wxwidgetsImg} className="inline-block me-2 w-5" />,
    kql: <img src={kqlImg} className="inline-block me-2 w-5" />,
    "asp.net": <img src={aspnetImg} className="inline-block me-2 w-5" />,
  };

  return (
    <div
      className="bg-slate-700 rounded-lg shadow-md overflow-hidden transition-all duration-300 outline outline-transparent xs:hover:outline-indigo-500"
      onMouseOver={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1)";
      }}
    >
      {/* IMAGE */}
      <img
        src={imgsrc}
        alt={title}
        className={`w-full h-32 sm:h-48 object-cover transition-all duration-300 overflow-hidden ${
          href && "xs:cursor-pointer"
        }`}
        onClick={() => {
          if (href && window.innerWidth > 768) window.open(href, "_blank"); // FIXME: hack to prevent mobile
        }}
      />

      <div className="p-6">
        {/* TAGS */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-sm text-gray-200 bg-${
                colorMap[tag.toLowerCase()]
              }-700 bg-opacity-60 px-2 py-1 rounded-full whitespace-nowrap items-center flex font-semibold`}
            >
              {iconMap[tag.toLowerCase()]}
              {tag}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h5 className="text-xl font-semibold mb-2">
          {icon}
          {title}
        </h5>

        {/* DESCRIPTION */}
        <p className="text-gray-600 dark:text-gray-400 mb-3">{children}</p>

        {/* LINKS */}
        <div className="flex flex-col gap-3 sm:items-center sm:flex-row">
          {/* DYNAMIC LINK */}
          {href && (
            <a
              href={href}
              target="_blank"
              className="mx-auto px-3 py-2 rounded-lg text-neutral-50 bg-indigo-500 hover:bg-indigo-600 inline-block transition-all"
            >
              <FaLink className="inline-block me-2" />
              {hrefText}
            </a>
          )}
          {/* GITHUB LINK */}
          {githubhref && (
            <a
              href={githubhref}
              target="_blank"
              title="View on GitHub"
              className="truncate underline lg:no-underline mx-auto px-3 py-1 float-right flex flex-col items-center rounded-lg text-neutral-50 hover:bg-gray-600 transition-all"
            >
              <FaGithub className="inline-block text-4xl" />{" "}
              {githubhref.split("/").pop()}
            </a>
          )}
        </div>
        {/* FOOTER with date */}
        {date && (
          <div className="text-gray-400 text-sm font-semibold mt-1 flex">
            <FaCalendarDay className="inline-block me-2 text-lg" />
            {date}
          </div>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  TabTitle("Projects");

  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        {/* TITLE */}
        <h1 className="h1 flex items-end mb-10">
          <FaCertificate className="inline-block me-5" /> Projects
        </h1>

        {/* SUBTITLE */}
        <h3 className="h4 mb-10 w-3/4">
          Here are some of the projects I have worked on, and which{" "}
          <span className="text-lg font-semibold text-gray-200 bg-slate-500 bg-opacity-60 px-2 py-1 rounded-full items-center inline-flex">
            <FaCode className="inline-block me-2" />
            technologies
          </span>{" "}
          were used.
        </h3>

        {/* Grid of cards, each one having an image, header and description */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 w-11/12 xs:w-3/4 md:1/2 mb-5 items-start">
          <ProjectCard
            title="3D drone relief software"
            imgsrc={droneImg}
            href="https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/"
            hrefText="Read I-CONIC blog"
            githubhref={"https://github.com/I-CONIC-Vision-AB/iconic-measure"}
            tags={["C++", "wxWidgets"]}
            icon={<FaUnity className="inline-block me-2 text-lime-600" />}
            date={"January-June 2023"}
          >
            In a collaborative effort with seven other KTH students, we
            developed a user-friendly interface for an existing 3D drone
            software for{" "}
            <a
              href="https://i-conicvision.com/"
              target="_blank"
              className="text-blue-400 hover:text-blue-500 hover:underline"
            >
              I-CONIC
            </a>
            . The software is used to{" "}
            <b>
              plan and execute drone missions for disaster relief operations
            </b>
            , and their software is part of a larger United Nations-funded
            project.
          </ProjectCard>
          <ProjectCard
            title="Log Portal"
            imgsrc={logportalImg}
            tags={[
              "C#",
              "KQL",
              "ASP.NET",
              "JavaScript",
              "Bootstrap",
              "HTML",
              "CSS",
            ]}
            icon={<FaServer className="inline-block me-2 text-emerald-500" />}
            date={"June-August 2023"}
          >
            I provided{" "}
            <a
              href="https://www.bravida.se/en/"
              target="_blank"
              className="text-emerald-500 hover:text-emerald-600 hover:underline"
            >
              Bravida
            </a>{" "}
            a solution for viewing their Azure Logic App logs. On top of this I
            provided an API solution to remotely toggle automations, offloading
            their developers from scheduling maintence. The product is also
            intended for the support team to keep track of orders.
          </ProjectCard>
          <ProjectCard
            title="Pathfinging Visualization"
            imgsrc={pathvisImg}
            href="https://dinesjo.github.io/pathfinding-vis/"
            hrefText="Try Yourself"
            githubhref={"https://github.com/dinesjo/pathfinding-vis"}
            tags={["JavaScript", "HTML", "CSS"]}
            icon={<FaRoad className="inline-block me-2 text-blue-500" />}
            date={"November 2020 - Mars 2021"}
          >
            Upper secondary school graduate project (Gymnasie&shy;arbete) where
            I developed a pathfinding visualization website. The project aimed
            to study the most popular pathfinding algorithms and show their
            characteristics in a visual form.
          </ProjectCard>
          <ProjectCard
            title="Deadline Tracker"
            imgsrc={deadlineTracker}
            githubhref={"https://github.com/dinesjo/deadline-tracker"}
            tags={["React", "Joy UI", "JavaScript", "HTML", "CSS"]}
            icon={
              <FaCalendarAlt className="inline-block me-2 text-yellow-500" />
            }
            date={"September 2023 - Present"}
          >
            Personal project where I developed a website to track deadlines in
            my courses at KTH. The website is still{" "}
            <b className="text-amber-400">in development</b>, but you can check
            out the source code on GitHub in the meantime. <i>In the future</i>{" "}
            I plan to integrate the website with <b>Google API</b> for Drive and
            Calendar connectivity.
          </ProjectCard>
          <ProjectCard
            title="(React) Pathfinging Visualization"
            imgsrc={pathvisReactImg}
            githubhref={"https://github.com/dinesjo/joy-ui-site"}
            tags={["React", "Joy UI", "JavaScript", "HTML", "CSS"]}
            icon={<FaReact className="inline-block me-2 text-sky-400" />}
            date={"September 2023 - Present"}
          >
            <b>New and improved version</b> of the pathfinding visualization
            website. This time using React and a new React-UI framework: Joy UI.
            The website is still{" "}
            <b className="text-amber-400">in development</b>, but you can check
            out the source code on GitHub in the meantime.
          </ProjectCard>
          <ProjectCard
            title="This Website"
            imgsrc={thisImg}
            githubhref="https://github.com/dinesjo/react-portfolio"
            tags={["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"]}
            icon={<FaMapPin className="inline-block text-red-500 me-2" />}
            date={"September 2023 - Present"}
          >
            This portfolio website is my first project using React and Tailwind
            CSS. I wanted to learn these technologies and decided to make a
            portfolio website to showcase my projects.
          </ProjectCard>
          <ProjectCard
            title="Chess Reporter"
            imgsrc={chessreporterImg}
            href="https://twitter.com/ChessReporter/"
            hrefText="View on X (Twitter)"
            githubhref="https://gits-15.sys.kth.se/wver/projinda-twitter-bot"
            tags={["Python", "Twitter API"]}
            icon={<FaChess className="inline-block me-2 text-amber-700" />}
            date={"May 2022"}
          >
            A Twitter bot that posts Python-generated GIFs of high-profile chess
            games. The project was part of the course{" "}
            <a
              href="https://www.kth.se/student/kurser/kurs/DD1349?periods=6&startterm=20221&l=en"
              target="_blank"
              className="link"
            >
              DD1349
            </a>
            .
          </ProjectCard>
          <ProjectCard
            title="Note Hero"
            imgsrc={noteheroImg}
            tags={["Unity", "C#"]}
            icon={<FaMusic className="inline-block me-2 text-purple-500" />}
            date={"January-June 2022"}
          >
            A rhythm game inspired by Guitar Hero. After interviewing music
            teachers I, along with other students, developed a game to help
            gamify music theory. The game used a mobile device's microphone to
            detect a players real-life instrument. The project was part of the
            course{" "}
            <a
              href="https://www.kth.se/student/kurser/kurs/DH1620?periods=6&startterm=20221&l=en"
              target="_blank"
              className="link"
            >
              DH1620
            </a>
            .
          </ProjectCard>
        </div>
      </div>
    </>
  );
};

export default Projects;
