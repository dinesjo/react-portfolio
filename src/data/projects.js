import aiDiaryCard from "../assets/project-optimized/ai-diary-card.webp";
import aiDiaryFull from "../assets/project-optimized/ai-diary-full.webp";
import bachelorCard from "../assets/project-optimized/context-summarization-research-card.webp";
import bachelorFull from "../assets/project-optimized/context-summarization-research-full.webp";
import chessReporterCard from "../assets/project-optimized/chess-reporter-card.webp";
import chessReporterFull from "../assets/project-optimized/chess-reporter-full.webp";
import deadlineTrackerCard from "../assets/project-optimized/deadline-tracker-card.webp";
import deadlineTrackerFull from "../assets/project-optimized/deadline-tracker-full.webp";
import droneCard from "../assets/project-optimized/drone-relief-software-card.webp";
import droneFull from "../assets/project-optimized/drone-relief-software-full.webp";
import fittrackrCard from "../assets/project-optimized/fittrackr-card.webp";
import fittrackrFull from "../assets/project-optimized/fittrackr-full.webp";
import habitGrowerCard from "../assets/project-optimized/habit-grower-card.webp";
import habitGrowerFull from "../assets/project-optimized/habit-grower-full.webp";
import habitGrowerIcon from "../assets/project-optimized/icons/habit-grower-icon.webp";
import logportalCard from "../assets/project-optimized/logportal-card.webp";
import logportalFull from "../assets/project-optimized/logportal-full.webp";
import masterThesisKgqaCard from "../assets/project-optimized/master-thesis-kgqa-card.webp";
import masterThesisKgqaFull from "../assets/project-optimized/master-thesis-kgqa-full.webp";
import noteHeroCard from "../assets/project-optimized/note-hero-card.webp";
import noteHeroFull from "../assets/project-optimized/note-hero-full.webp";
import pathvisCard from "../assets/project-optimized/pathfinding-visualizer-card.webp";
import pathvisFull from "../assets/project-optimized/pathfinding-visualizer-full.webp";
import pathvisReactCard from "../assets/project-optimized/react-pathfinding-visualizer-card.webp";
import pathvisReactFull from "../assets/project-optimized/react-pathfinding-visualizer-full.webp";
import portfolioSiteCard from "../assets/project-optimized/portfolio-site-card.webp";
import portfolioSiteFull from "../assets/project-optimized/portfolio-site-full.webp";
import snuskollCard from "../assets/project-optimized/snuskoll-card.webp";
import snuskollFull from "../assets/project-optimized/snuskoll-full.webp";
import snuskollLogo from "../assets/project-optimized/icons/snuskoll-logo.webp";
import thesisTrackerCard from "../assets/project-optimized/thesis-tracker-card.webp";
import thesisTrackerFull from "../assets/project-optimized/thesis-tracker-full.webp";
import thesisTrackerIcon from "../assets/project-optimized/icons/thesis-tracker-icon.webp";
import vimCard from "../assets/project-optimized/vim-motions-guide-card.webp";
import vimFull from "../assets/project-optimized/vim-motions-guide-full.webp";

export const projects = [
  {
    id: "master-thesis-kgqa",
    title: "Retrieval and Graph-Access Strategies for Industrial Knowledge Graph Question Answering",
    image: masterThesisKgqaCard,
    imageFull: masterThesisKgqaFull,
    description:
      "Master's thesis evaluating natural-language access strategies for Traton's MAZE industrial knowledge graph, comparing retrieval-based answers with direct graph queries for compatibility question answering.",
    featuredDescription:
      "This master's thesis explores how industrial knowledge graphs can become usable without requiring people to know the database structure or where compatibility rules are stored. The work studies natural-language access to Traton's MAZE graph so engineers and support teams could ask whether configurations work together and get grounded answers from the underlying constraints. It compares a fast search-based approach with direct graph queries to understand when quick answers are enough, and when traceable reasoning is worth the extra cost.",
    technologies: ["Research", "Python", "RAG", "SPARQL", "LLMs"],
    category: "Research",
    context: "Academic",
    links: {},
    date: "January 2026 - Present",
    isNew: true,
    featured: true,
  },
  {
    id: "thesis-tracker",
    title: "Thesis Tracker",
    image: thesisTrackerCard,
    imageFull: thesisTrackerFull,
    icon: thesisTrackerIcon,
    description: "A thesis progress tracker with a Kanban board organized around project phases and direct links to key deliverables.",
    technologies: ["React", "Tailwind CSS", "TypeScript"],
    category: "Web",
    context: "Academic",
    links: {
      live: "https://thesis.dinesjo.se/",
      github: "https://github.com/dinesjo/thesis-tracker",
    },
    date: "February 2026 - Present",
  },
  {
    id: "snuskoll",
    title: "SnusKoll",
    image: snuskollCard,
    imageFull: snuskollFull,
    icon: snuskollLogo,
    description:
      "A mobile-first PWA for rating snus products with friends, built in ASP.NET and Blazor with PostgreSQL persistence.",
    technologies: ["ASP.NET", "Blazor", "C#", "SQL", "Tailwind CSS"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://snuskoll.dinesjo.se/",
      github: "https://github.com/dinesjo/SnusKoll",
    },
    date: "June 2025 - Present",
    featured: true,
  },
  {
    id: "ai-diary",
    title: "AI-Diary",
    image: aiDiaryCard,
    imageFull: aiDiaryFull,
    description:
      "A mobile-first web app for Bravida where technicians answer brief questions about their workday in speech. The app uses Azure Speech for transcription and LLMs to summarize entries.",
    technologies: ["React", "Material UI", "TypeScript", "LLMs"],
    category: "Web",
    context: "Professional",
    links: {},
    date: "November 2024 - Present",
    isPrivate: true,
  },
  {
    id: "logportal",
    title: "LogPortal",
    image: logportalCard,
    imageFull: logportalFull,
    description:
      "A secure internal Bravida web app for viewing Azure logs, toggling automations remotely, and helping support teams track orders.",
    technologies: ["C#", "SQL", "ASP.NET", "JavaScript", "Bootstrap"],
    category: "Web",
    context: "Professional",
    links: {},
    date: "June 2023 - August 2024",
    isPrivate: true,
  },
  {
    id: "bachelor",
    title: "Efficacy of Context Summarization on LLMs",
    image: bachelorCard,
    imageFull: bachelorFull,
    description:
      "Bachelor's thesis on context summarization for LLM chatbots. The experiments found cost reductions up to 92% without significant performance loss.",
    technologies: ["Research", "LLMs", "Python"],
    category: "Research",
    context: "Academic",
    links: {
      live: "https://urn.kb.se/resolve?urn=urn%3Anbn%3Ase%3Akth%3Adiva-351103",
      liveText: "Read on DiVA",
    },
    date: "January - June 2024",
  },
  {
    id: "drone",
    title: "3D Drone Relief Software",
    image: droneCard,
    imageFull: droneFull,
    description:
      "Collaborative project with seven KTH students to build a desktop interface for I-CONIC's 3D drone software, used in disaster relief planning for a UN-funded project.",
    technologies: ["C++", "wxWidgets"],
    category: "Desktop",
    context: "Academic",
    links: {
      live: "https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/",
      liveText: "Read I-CONIC Blog",
      github: "https://github.com/I-CONIC-Vision-AB/iconic-measure",
    },
    date: "January - June 2023",
  },
  {
    id: "vim",
    title: "Interactive Vim Motions Guide",
    image: vimCard,
    imageFull: vimFull,
    description:
      "A simple desktop-first web app for practicing Vim motions. Built with vanilla HTML, CSS, and JavaScript.",
    technologies: ["HTML", "CSS", "JavaScript"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://vim.dinesjo.se/",
      github: "https://github.com/dinesjo/vim-motions",
    },
    date: "August 2025",
  },
  {
    id: "habitgrower",
    title: "HabitGrower",
    image: habitGrowerCard,
    imageFull: habitGrowerFull,
    icon: habitGrowerIcon,
    description:
      "A mobile-first habit organizer for building new routines, with Firebase authentication and storage behind a PWA shell.",
    technologies: ["React", "Material UI", "Firebase", "TypeScript"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://habitgrower.web.app/",
      github: "https://github.com/dinesjo/HabitGrower",
    },
    date: "April 2024 - Present",
  },
  {
    id: "pathvis-react",
    title: "React Pathfinding Visualization",
    image: pathvisReactCard,
    imageFull: pathvisReactFull,
    description:
      "A React rewrite of my original pathfinding visualizer with cleaner controls and Joy UI components.",
    technologies: ["React", "Joy UI", "JavaScript"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://dinesjo.github.io/react-pathfinding-vis/",
      github: "https://github.com/dinesjo/react-pathfinding-vis",
    },
    date: "September 2023, January 2025",
  },
  {
    id: "fittrackr",
    title: "FitTrackr",
    image: fittrackrCard,
    imageFull: fittrackrFull,
    description:
      "A KTH group project for tracking workouts, progress, and meals with React, Firebase, and TypeScript.",
    technologies: ["React", "Firebase", "Material UI", "TypeScript"],
    category: "Web",
    context: "Academic",
    links: {
      live: "https://dh2642-project-7eb8e.web.app/",
      github: "https://github.com/DH2642-project/FitTrackr",
    },
    date: "March - June 2024",
  },
  {
    id: "deadline-tracker",
    title: "Deadline Tracker",
    image: deadlineTrackerCard,
    imageFull: deadlineTrackerFull,
    description:
      "A personal project to track deadlines for my courses at KTH.",
    technologies: ["React", "Joy UI", "JavaScript"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://dinesjo.github.io/deadline-tracker/",
      github: "https://github.com/dinesjo/deadline-tracker",
    },
    date: "September - October 2023",
  },
  {
    id: "pathvis",
    title: "Pathfinding Visualization",
    image: pathvisCard,
    imageFull: pathvisFull,
    description:
      "Upper secondary school graduate project for comparing pathfinding algorithms and showing how their behavior differs on a grid.",
    technologies: ["JavaScript", "HTML", "CSS"],
    category: "Web",
    context: "Academic",
    links: {
      live: "https://dinesjo.github.io/pathfinding-vis/",
      github: "https://github.com/dinesjo/pathfinding-vis",
    },
    date: "November 2020 - March 2021",
  },
  {
    id: "this",
    title: "This Website",
    image: portfolioSiteCard,
    imageFull: portfolioSiteFull,
    description:
      "This portfolio site, built with React and Tailwind CSS, with optimized project images and a lightweight static deployment.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    category: "Web",
    context: "Personal",
    links: {
      github: "https://github.com/dinesjo/react-portfolio",
    },
    date: "September 2023 - Present",
  },
  {
    id: "chess-reporter",
    title: "Chess Reporter",
    image: chessReporterCard,
    imageFull: chessReporterFull,
    description:
      "A Twitter bot that posts Python-generated GIFs of high-profile chess games. Part of the KTH course DD1349.",
    technologies: ["Python", "Twitter API"],
    category: "Other",
    context: "Academic",
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
    image: noteHeroCard,
    imageFull: noteHeroFull,
    description:
      "A rhythm game inspired by Guitar Hero. Developed with other students to gamify music theory, using a device's microphone to detect live instruments. Part of KTH course DH1620.",
    technologies: ["Unity", "C#"],
    category: "Other",
    context: "Academic",
    links: {},
    date: "January - June 2022",
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

export const projectContexts = ["All", "Professional", "Personal", "Academic"];
