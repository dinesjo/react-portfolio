import {
  FaCalendarAlt,
  FaChess,
  FaCircle,
  FaCode,
  FaDumbbell,
  FaExclamationTriangle,
  FaLock,
  FaMapPin,
  FaMicrophoneAlt,
  FaMusic,
  FaReact,
  FaRoad,
  FaServer,
  FaTree,
  FaUnity,
} from "react-icons/fa";
import aiDiary from "./assets/AI-diary.png";
import chessreporterImg from "./assets/chess-reporter.png";
import deadlineTracker from "./assets/deadline-tracker.png";
import droneImg from "./assets/drone-software.png";
import fittrackrImg from "./assets/fittrackr.png";
import habitGrower from "./assets/habit-grower.png";
import logportalImg from "./assets/logportal.jpg";
import noteheroImg from "./assets/note-hero.png";
import pathvisReactImg from "./assets/path-vis-react.png";
import pathvisImg from "./assets/path-vis.png";
import snuskoll from "./assets/snuskoll.png";
import thisImg from "./assets/this.png";
import ProjectCard from "./components/ProjectCard";
import Alert from "./utils/Alert";
import { TabTitle } from "./utils/GeneralFunctions";

export default function Projects() {
  TabTitle("Projects");

  return (
    <div className="flex flex-col items-center justify-center">
      {/* SUBTITLE */}
      <div className="rounded-2xl py-6 m-4 max-w-4xl">
        <h3 className="h3 leading-relaxed">
          Here are some of the projects I have worked on, showcasing various{" "}
          <span className="text-lg font-semibold dark:text-indigo-300 bg-indigo-900/30 px-3 p-1 mt-1 rounded-full items-center inline-flex">
            <FaCode className="inline-block me-2" />
            technologies
          </span>{" "}
          and development approaches.
        </h3>
      </div>

      {/* Grid of cards, each one having an image, header and description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-7xl mb-8 items-start">
        <ProjectCard
          title={
            <div className="flex items-center gap-2">
              Snuskoll{" "}
              <span
                className={`text-sm text-white bg-sky-700 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center font-semibold`}
              >
                New
              </span>
            </div>
          }
          imgsrcs={snuskoll}
          href={"https://snuskoll.dinesjo.se/"}
          hrefText={"Try Yourself"}
          githubhref={"https://github.com/dinesjo/SnusKoll"}
          tags={["ASP.NET", "Blazor", "C#", "SQL", "Tailwind CSS"]}
          icon={<FaCircle className="inline-block me-2 text-slate-500" />}
          date={"June 2025 - Present"}
        >
          A web app built for some friends and I to rate different snus products. It is built using ASP.NET and Blazor,
          and uses a SQL database to store the data. The app is mobile-first, and is available as a PWA to be downloaded
          to your device.
        </ProjectCard>
        <ProjectCard
          title="HabitGrower"
          imgsrcs={habitGrower}
          href={"https://habitgrower.web.app/"}
          hrefText={"Try Yourself"}
          githubhref={"https://github.com/dinesjo/HabitGrower"}
          tags={["React", "Material UI", "Firebase", "TypeScript"]}
          icon={<FaTree className="inline-block me-2 text-lime-500" />}
          date={"April 2024 - Present"}
        >
          A personal life-organizer website used to grow new or existing habits. Uses Firebase for authentication and
          storage. It is developed <b>mobile-first</b>, and is available as a PWA to be downloaded to your device.
        </ProjectCard>
        <ProjectCard
          title="Deadline Tracker"
          imgsrcs={deadlineTracker}
          href={"https://dinesjo.github.io/deadline-tracker/"}
          hrefText={"Try Yourself"}
          githubhref={"https://github.com/dinesjo/deadline-tracker"}
          tags={["React", "Joy UI", "JavaScript", "HTML", "CSS"]}
          icon={<FaCalendarAlt className="inline-block me-2 text-red-500" />}
          date={"September 2023 - October 2023"}
        >
          A personal project where I developed a website to track deadlines for my courses at KTH.
        </ProjectCard>
        <ProjectCard
          title="FitTrackr"
          imgsrcs={fittrackrImg}
          githubhref={"https://github.com/DH2642-project/FitTrackr"}
          href={"https://dh2642-project-7eb8e.web.app/"}
          hrefText={"Try Yourself"}
          tags={["React", "Firebase", "Material UI", "TypeScript", "HTML", "CSS"]}
          icon={<FaDumbbell className="inline-block me-2 text-amber-600" />}
          date={"March 2024 - June 2024"}
        >
          A KTH course project with three other students where we develop a fitness tracking app using modern web
          development principles. The user should be able to track their workouts and progress over time, as well as
          meals.
        </ProjectCard>
        <ProjectCard
          title={
            <div className="flex items-center gap-2">
              (React) Pathfinding Visualization{" "}
              <span
                className={`text-sm text-white bg-sky-700 px-2 py-0.5 rounded-full whitespace-nowrap flex items-center font-semibold`}
              >
                New
              </span>
            </div>
          }
          imgsrcs={pathvisReactImg}
          githubhref={"https://github.com/dinesjo/react-pathfinding-vis"}
          href={"https://dinesjo.github.io/react-pathfinding-vis/"}
          hrefText={"Try Yourself"}
          tags={["React", "Joy UI", "JavaScript", "HTML", "CSS"]}
          icon={<FaReact className="inline-block me-2 text-sky-400" />}
          date={"September 2023, January 2025"}
        >
          <b>New and improved version</b> of the pathfinding visualization website. This time using React and a new
          React-UI framework: Joy UI.
        </ProjectCard>
        <ProjectCard
          title="3D drone relief software"
          imgsrcs={droneImg}
          href="https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/"
          hrefText="Read I-CONIC blog"
          githubhref={"https://github.com/I-CONIC-Vision-AB/iconic-measure"}
          tags={["C++", "wxWidgets"]}
          icon={<FaUnity className="inline-block me-2 text-lime-600" />}
          date={"January - June 2023"}
        >
          In a collaborative effort with seven other KTH students, we developed a user-friendly interface for an
          existing 3D drone software for{" "}
          <a
            href="https://i-conicvision.com/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 hover:text-blue-500 hover:underline"
          >
            I-CONIC
          </a>
          . The software is used to <b>plan and execute drone missions for disaster relief operations</b>, and their
          software is part of a larger United Nations-funded project.
        </ProjectCard>
        <ProjectCard
          title="AI-Diary"
          imgsrcs={aiDiary}
          tags={["React", "Material UI", "TypeScript", "ChatGPT"]}
          icon={<FaMicrophoneAlt className="inline-block me-2 text-emerald-500" />}
          date={"November 2024 - Present"}
        >
          I provided{" "}
          <a
            href="https://www.bravida.se/en/"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-500 hover:text-emerald-600 hover:underline"
          >
            Bravida
          </a>{" "}
          a mobile-first web app where technicians answer brief questions about their workday in speech. The app uses
          Azure&apos;s AI services for speech-to-text, and thereafter summarizes the text using ChatGPT. The output can
          then be included in the customer&apos;s invoice, or for other documentation purposes.
          <Alert type="info">
            <FaLock className="inline-block text-blue-400 me-2" />
            Unfortunately, the app cannot be viewed publicly.
          </Alert>
        </ProjectCard>
        <ProjectCard
          title="LogPortal"
          imgsrcs={logportalImg}
          tags={["C#", "SQL", "ASP.NET", "JavaScript", "Bootstrap", "HTML", "CSS"]}
          icon={<FaServer className="inline-block me-2 text-emerald-500" />}
          date={"June 2023 - August 2024"}
        >
          I provided{" "}
          <a
            href="https://www.bravida.se/en/"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-500 hover:text-emerald-600 hover:underline"
          >
            Bravida
          </a>{" "}
          a robust, secure web app with 3 uses:
          <ul className="list-disc list-inside">
            <li>
              <strong>Viewing Azure logs</strong>, previously hidden behind inaccessible KQL queries.
            </li>
            <li>
              <strong>Remotely toggling automations</strong>, offloading developers from performing maintenance manually
              on each app.
            </li>
            <li>
              Help support team <strong>track orders</strong>.
            </li>
          </ul>
          <Alert type="info">
            <FaLock className="inline-block text-blue-400 me-2" />
            Unfortunately, the app cannot be viewed publicly.
          </Alert>
        </ProjectCard>
        <ProjectCard
          title="Pathfinding Visualization"
          imgsrcs={pathvisImg}
          href="https://dinesjo.github.io/pathfinding-vis/"
          hrefText="Try Yourself"
          githubhref={"https://github.com/dinesjo/pathfinding-vis"}
          tags={["JavaScript", "HTML", "CSS"]}
          icon={<FaRoad className="inline-block me-2 text-blue-500" />}
          date={"November 2020 - March 2021"}
        >
          Upper secondary school graduate project (<em>gymnasie&shy;arbete</em>) where I visualized pathfinding
          algorithms in a website. The project aimed to study the most popular pathfinding algorithms and show their
          characteristics in a visual form.
          <br />
          <Alert type="warning">
            <FaExclamationTriangle className="inline-block text-amber-400 me-2" /> Please keep in mind that the{" "}
            <b>website lacks mobile support</b>, and is meant to be used with a keyboard and mouse.
          </Alert>
        </ProjectCard>
        <ProjectCard
          title="This Website"
          imgsrcs={thisImg}
          githubhref="https://github.com/dinesjo/react-portfolio"
          tags={["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"]}
          icon={<FaMapPin className="inline-block text-red-500 me-2" />}
          date={"September 2023 - Present"}
        >
          This portfolio website is my first project using React and Tailwind CSS. I wanted to learn these technologies
          and decided to make a portfolio website to showcase my projects.
        </ProjectCard>
        <ProjectCard
          title="Chess Reporter"
          imgsrcs={chessreporterImg}
          href="https://twitter.com/ChessReporter/"
          hrefText="View on X (Twitter)"
          githubhref="https://gits-15.sys.kth.se/wver/projinda-twitter-bot"
          tags={["Python", "Twitter API"]}
          icon={<FaChess className="inline-block me-2 text-amber-700" />}
          date={"May 2022"}
        >
          A Twitter bot that posts Python-generated GIFs of high-profile chess games. The project was part of the course{" "}
          <a
            href="https://www.kth.se/student/kurser/kurs/DD1349?periods=6&startterm=20221&l=en"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            DD1349
          </a>
          .
        </ProjectCard>
        <ProjectCard
          title="Note Hero"
          imgsrcs={noteheroImg}
          tags={["Unity", "C#"]}
          icon={<FaMusic className="inline-block me-2 text-purple-500" />}
          date={"January - June 2022"}
        >
          A rhythm game inspired by Guitar Hero. After interviewing music teachers I, along with other students,
          developed a game to help gamify music theory. The game used a mobile device&apos;s microphone to detect a
          players real-life instrument. The project was part of the course{" "}
          <a
            href="https://www.kth.se/student/kurser/kurs/DH1620?periods=6&startterm=20221&l=en"
            target="_blank"
            rel="noreferrer"
            className="link"
          >
            DH1620
          </a>
          .
        </ProjectCard>
      </div>
    </div>
  );
}
