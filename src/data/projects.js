import snuskollImg from "../assets/snuskoll.png";
import snuskollLogo from "../assets/snuskoll-logo.png";
import habitGrowerImg from "../assets/habit-grower.png";
import habitGrowerIcon from "../assets/habit-grower-icon.png";
import thesisTrackerImg from "../assets/thesis-tracker.jpeg"
import thesisTrackerIcon from "../assets/thesis-tracker.png"
import vimImg from "../assets/vim.png";
import deadlineTrackerImg from "../assets/deadline-tracker.png";
import fittrackrImg from "../assets/fittrackr.png";
import pathvisReactImg from "../assets/path-vis-react.png";
import bachelorImg from "../assets/bachelor.png";
import droneImg from "../assets/drone-software.png";
import aiDiaryImg from "../assets/AI-diary.png";
import logportalImg from "../assets/logportal.png";
import pathvisImg from "../assets/path-vis.png";
import thisImg from "../assets/this.png";
import chessReporterImg from "../assets/chess-reporter.png";
import noteHeroImg from "../assets/note-hero.png";

export const projects = [
  {
    id: "snuskoll",
    title: "SnusKoll",
    image: snuskollImg,
    icon: snuskollLogo,
    description:
      "A web app built for some friends and I to rate different snus products. Built with ASP.NET and Blazor, using PostgreSQL for persistence. Mobile-first and available as a PWA.",
    technologies: ["ASP.NET", "Blazor", "C#", "SQL", "Tailwind CSS"],
    category: "Web",
    links: {
      live: "https://snuskoll.dinesjo.se/",
      github: "https://github.com/dinesjo/SnusKoll",
    },
    date: "June 2025 - Present",
    featured: false,
  },
  {
    id: "thesis-tracker",
    title: "Thesis Tracker",
    image: thesisTrackerImg,
    icon: thesisTrackerIcon,
    description: "I built this web app to track my progress throughout my master's thesis. It features a Kanban board that organizes tasks across project phases and links directly to key deliverables",
    technologies: ["React", "Tailwind CSS", "TypeScript"],
    category: "Web",
    links: {
      live: "https://thesis.dinesjo.se/",
      github: "https://github.com/dinesjo/thesis-tracker",
    },
    date: "February 2025 - Present",
    featured: true,
  },
  {
    id: "habitgrower",
    title: "HabitGrower",
    image: habitGrowerImg,
    icon: habitGrowerIcon,
    description:
      "A personal life-organizer website to grow new or existing habits. Uses Firebase for authentication and storage. Developed mobile-first and available as a PWA.",
    technologies: ["React", "Material UI", "Firebase", "TypeScript"],
    category: "Web",
    links: {
      live: "https://habitgrower.web.app/",
      github: "https://github.com/dinesjo/HabitGrower",
    },
    date: "April 2024 - Present",
    featured: true,
  },
  {
    id: "vim",
    title: "Interactive Vim Motions Guide",
    image: vimImg,
    description:
      "A simple web app to help learn various Vim keyboard shortcuts. Built with vanilla HTML, CSS, and JavaScript. Best experienced on desktop.",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Web",
    links: {
      live: "https://vim.dinesjo.se/",
      github: "https://github.com/dinesjo/vim-motions",
    },
    date: "August 2025",
    isNew: true,
  },
  {
    id: "deadline-tracker",
    title: "Deadline Tracker",
    image: deadlineTrackerImg,
    description:
      "A personal project to track deadlines for my courses at KTH.",
    technologies: ["React", "Joy UI", "JavaScript"],
    category: "Web",
    links: {
      live: "https://dinesjo.github.io/deadline-tracker/",
      github: "https://github.com/dinesjo/deadline-tracker",
    },
    date: "September - October 2023",
  },
  {
    id: "fittrackr",
    title: "FitTrackr",
    image: fittrackrImg,
    description:
      "A KTH group project developing a fitness tracking app. Users can track workouts, progress, and meals using modern web development principles.",
    technologies: ["React", "Firebase", "Material UI", "TypeScript"],
    category: "Web",
    links: {
      live: "https://dh2642-project-7eb8e.web.app/",
      github: "https://github.com/DH2642-project/FitTrackr",
    },
    date: "March - June 2024",
  },
  {
    id: "pathvis-react",
    title: "React Pathfinding Visualization",
    image: pathvisReactImg,
    description:
      "New and improved version of the pathfinding visualization using React and Joy UI.",
    technologies: ["React", "Joy UI", "JavaScript"],
    category: "Web",
    links: {
      live: "https://dinesjo.github.io/react-pathfinding-vis/",
      github: "https://github.com/dinesjo/react-pathfinding-vis",
    },
    date: "September 2023, January 2025",
  },
  {
    id: "bachelor",
    title: "Efficacy of Context Summarization on LLMs",
    image: bachelorImg,
    description:
      "Research paper on using context summarization of LLM chatbots to reduce operating costs. Findings include cost-cutting upwards of 92% without significant performance loss.",
    technologies: ["Research", "ChatGPT"],
    category: "Research",
    links: {
      live: "https://urn.kb.se/resolve?urn=urn%3Anbn%3Ase%3Akth%3Adiva-351103",
      liveText: "See Paper on Diva",
    },
    date: "January - June 2024",
  },
  {
    id: "drone",
    title: "3D Drone Relief Software",
    image: droneImg,
    description:
      "Collaborative project with seven other KTH students to develop a user-friendly interface for I-CONIC's 3D drone software, used for disaster relief operations as part of a UN-funded project.",
    technologies: ["C++", "wxWidgets"],
    category: "Desktop",
    links: {
      live: "https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/",
      liveText: "Read I-CONIC Blog",
      github: "https://github.com/I-CONIC-Vision-AB/iconic-measure",
    },
    date: "January - June 2023",
  },
  {
    id: "ai-diary",
    title: "AI-Diary",
    image: aiDiaryImg,
    description:
      "A mobile-first web app for Bravida where technicians answer brief questions about their workday in speech. Uses Azure AI services for speech-to-text and ChatGPT for summarization.",
    technologies: ["React", "Material UI", "TypeScript", "ChatGPT"],
    category: "Web",
    links: {},
    date: "November 2024 - Present",
    isPrivate: true,
  },
  {
    id: "logportal",
    title: "LogPortal",
    image: logportalImg,
    description:
      "A robust, secure web app for Bravida for viewing Azure logs, remotely toggling automations, and helping the support team track orders.",
    technologies: ["C#", "SQL", "ASP.NET", "JavaScript", "Bootstrap"],
    category: "Web",
    links: {},
    date: "June 2023 - August 2024",
    isPrivate: true,
  },
  {
    id: "pathvis",
    title: "Pathfinding Visualization",
    image: pathvisImg,
    description:
      "Upper secondary school graduate project visualizing pathfinding algorithms. Aimed to study the most popular algorithms and show their characteristics visually.",
    technologies: ["JavaScript", "HTML", "CSS"],
    category: "Web",
    links: {
      live: "https://dinesjo.github.io/pathfinding-vis/",
      github: "https://github.com/dinesjo/pathfinding-vis",
    },
    date: "November 2020 - March 2021",
  },
  {
    id: "this",
    title: "This Website",
    image: thisImg,
    description:
      "This portfolio website, built with React and Tailwind CSS to showcase my projects and courses.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    category: "Web",
    links: {
      github: "https://github.com/dinesjo/react-portfolio",
    },
    date: "September 2023 - Present",
  },
  {
    id: "chess-reporter",
    title: "Chess Reporter",
    image: chessReporterImg,
    description:
      "A Twitter bot that posts Python-generated GIFs of high-profile chess games. Part of the KTH course DD1349.",
    technologies: ["Python", "Twitter API"],
    category: "Other",
    links: {
      live: "https://twitter.com/ChessReporter/",
      liveText: "View on X",
      github: "https://gits-15.sys.kth.se/wver/projinda-twitter-bot",
    },
    date: "May 2022",
  },
  {
    id: "note-hero",
    title: "Note Hero",
    image: noteHeroImg,
    description:
      "A rhythm game inspired by Guitar Hero. Developed with other students to gamify music theory, using a device's microphone to detect real-life instruments. Part of KTH course DH1620.",
    technologies: ["Unity", "C#"],
    category: "Other",
    links: {},
    date: "January - June 2022",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const categories = ["All", ...new Set(projects.map((p) => p.category))];
