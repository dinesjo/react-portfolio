import aiDiaryCard from "../assets/project-optimized/ai-diary-card.webp";
import aiDiaryFull from "../assets/project-optimized/ai-diary-full.webp";
import bachelorCard from "../assets/project-optimized/context-summarization-research-card.webp";
import bachelorFull from "../assets/project-optimized/context-summarization-research-full.webp";
import bibellandskapCard from "../assets/project-optimized/bibellandskap-card.webp";
import bibellandskapFull from "../assets/project-optimized/bibellandskap-full.webp";
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
    title: "Industrial Knowledge Graph QA",
    image: masterThesisKgqaCard,
    imageFull: masterThesisKgqaFull,
    description:
      "Master's thesis, \"Retrieval and Graph-Access Strategies for Industrial Knowledge Graph Question Answering,\" evaluating natural-language access to Traton's MAZE graph through retrieval-based answers and direct graph queries.",
    featuredDescription:
      "For my master's thesis, I am comparing two ways of answering questions against Traton's MAZE knowledge graph: retrieving relevant context for an LLM and querying the graph directly.",
    technologies: ["Python", "SPARQL", "AWS"],
    methods: ["Knowledge graphs", "RAG", "LLM evaluation", "Compatibility QA"],
    category: "Research",
    context: "Academic",
    links: {},
    date: "January 2026 - Present",
    priority: 1,
    featured: true,
    imageOverlayTone: "light",
    highlights: [
      "I built and evaluated both approaches on the same benchmark questions",
      "I compared answer correctness, traceability, response time, and cost",
      "The retrieval approach answered 96.4% of the benchmark cases correctly",
      "Direct graph queries were slightly more accurate, but slower and more expensive",
    ],
  },
  {
    id: "thesis-tracker",
    title: "Thesis Tracker",
    image: thesisTrackerCard,
    imageFull: thesisTrackerFull,
    icon: thesisTrackerIcon,
    description:
      "A decommissioned React and TypeScript tracker that organized thesis work into phase-based Kanban columns and linked directly to key deliverables.",
    statusNote: "This work has been decommissioned and is no longer publicly available.",
    technologies: ["React", "Tailwind CSS", "TypeScript"],
    methods: ["Research planning", "Kanban workflow"],
    category: "Web",
    context: "Academic",
    links: {},
    date: "February 2026 - Decommissioned",
    isDecommissioned: true,
    priority: 3,
  },
  {
    id: "snuskoll",
    title: "SnusKoll",
    image: snuskollCard,
    imageFull: snuskollFull,
    icon: snuskollLogo,
    description:
      "A Blazor and ASP.NET PWA for browsing, rating, and saving snus products, with Supabase-backed auth/data, search filters, social reviews, favorites, and wishlists.",
    featuredDescription:
      "I built SnusKoll as a mobile-first place to browse snus products, keep personal ratings, save favorites and wishlists, and read recent reviews from other users.",
    technologies: ["ASP.NET", "Blazor", "C#", "Supabase", "SQL", "Tailwind CSS", "Docker"],
    methods: ["Product discovery", "Personal ratings", "Social reviews"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://snuskoll.dinesjo.se/",
      github: "https://github.com/dinesjo/SnusKoll",
    },
    date: "June 2025 - Present",
    priority: 1,
    featured: true,
    highlights: [
      "I split the app into a Blazor WebAssembly frontend, an ASP.NET API, shared DTOs, and Dockerized services",
      "Supabase handles authentication and data, with contract tests around authorization",
      "Users can search and filter the catalog, rate products, save lists, and discover something at random",
    ],
  },
  {
    id: "bibellandskap",
    title: "Bible Map",
    image: bibellandskapCard,
    imageFull: bibellandskapFull,
    description:
      "An English-language Bible atlas using MapLibre and OpenBible data to explore 1,309 biblical places, with search, filters, verse references, confidence bands, and modern identifications.",
    technologies: ["JavaScript", "MapLibre", "HTML", "CSS"],
    methods: ["Interactive maps", "Biblical geography", "Search and filtering"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://bibeln.dinesjo.se/",
      github: "https://github.com/dinesjo/bible-map",
    },
    date: "March 2026 - Present",
    priority: 2,
  },
  {
    id: "ai-diary",
    title: "AI-Diary",
    image: aiDiaryCard,
    imageFull: aiDiaryFull,
    description:
      "A speech-first work diary for Bravida technicians, using Azure Speech transcription and LLM summaries to turn short spoken check-ins into structured daily notes.",
    featuredDescription:
      "I worked on AI-Diary, an internal tool that lets Bravida technicians record a short voice update and turn it into a structured daily note.",
    technologies: ["React", "Material UI", "TypeScript", "Azure", "Azure Speech"],
    methods: ["Field reporting", "Speech-to-text", "LLM summaries"],
    category: "Web",
    context: "Professional",
    links: {},
    date: "November 2024 - Present",
    isPrivate: true,
    priority: 1,
    highlights: [
      "The tool avoids asking technicians to type long reports while they are in the field",
      "Azure Speech creates the transcript and an LLM turns it into a draft note",
      "The user can review the result before it is added to the diary",
    ],
  },
  {
    id: "logportal",
    title: "LogPortal",
    image: logportalCard,
    imageFull: logportalFull,
    description:
      "A secure Bravida support portal for Azure log lookup, order tracing, and remote automation toggles behind a controlled internal web UI.",
    technologies: ["C#", "ASP.NET", "Azure", "SQL", "KQL", "JavaScript", "Bootstrap"],
    methods: ["Azure log lookup", "Order tracing", "Support automation"],
    category: "Web",
    context: "Professional",
    links: {},
    date: "June 2023 - August 2024",
    isPrivate: true,
    priority: 2,
  },
  {
    id: "bachelor",
    title: "Efficacy of Context Summarization on LLMs",
    image: bachelorCard,
    imageFull: bachelorFull,
    description:
      "Bachelor's thesis testing whether summarized chatbot history can cut LLM cost while preserving answer quality; experiments reduced cost up to 92% without significant performance loss.",
    featuredDescription:
      "For my bachelor's thesis, I tested whether a chatbot could summarize older messages to reduce LLM cost without making its answers worse.",
    technologies: ["Python"],
    methods: ["LLM evaluation", "Context summarization", "Cost analysis"],
    category: "Research",
    context: "Academic",
    links: {
      live: "https://urn.kb.se/resolve?urn=urn%3Anbn%3Ase%3Akth%3Adiva-351103",
      liveText: "Read on DiVA",
    },
    date: "January - June 2024",
    priority: 1,
    highlights: [
      "I compared full conversation history with several summarized versions",
      "The experiments measured both answer quality and API cost",
      "The best setup reduced cost by up to 92% without a statistically significant drop in performance",
    ],
  },
  {
    id: "drone",
    title: "3D Drone Relief Software",
    image: droneCard,
    imageFull: droneFull,
    description:
      "KTH team project for I-CONIC: a C++/wxWidgets measurement tool for images with hidden depth maps, turning video-derived 3D model data into distance, height, area, and volume checks.",
    technologies: ["C++", "wxWidgets"],
    methods: ["3D measurement", "Depth maps"],
    category: "Desktop",
    context: "Academic",
    links: {
      live: "https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/",
      liveText: "Read I-CONIC Blog",
      github: "https://github.com/I-CONIC-Vision-AB/iconic-measure",
    },
    date: "January - June 2023",
    priority: 2,
  },
  {
    id: "vim",
    title: "Interactive Vim Motions Guide",
    image: vimCard,
    imageFull: vimFull,
    description:
      "Desktop-first Vim trainer with an interactive keyboard, command stream, mini editor, operators, text objects, and normal/shift/control command hints.",
    technologies: ["HTML", "CSS", "JavaScript"],
    methods: ["Keyboard training", "Developer education"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://vim.dinesjo.se/",
      github: "https://github.com/dinesjo/vim-motions",
    },
    date: "August 2025",
    priority: 2,
  },
  {
    id: "habitgrower",
    title: "HabitGrower",
    image: habitGrowerCard,
    imageFull: habitGrowerFull,
    icon: habitGrowerIcon,
    description:
      "React and TypeScript PWA for habit tracking with Firebase auth/storage, custom habit icons and colors, activity heatmaps, and scheduled reminder notifications.",
    technologies: ["React", "Material UI", "Firebase", "TypeScript"],
    methods: ["Personal improvement", "Habit tracking"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://habitgrower.web.app/",
      github: "https://github.com/dinesjo/HabitGrower",
    },
    date: "April 2024 - Present",
    priority: 2,
  },
  {
    id: "pathvis-react",
    title: "React Pathfinding Visualization",
    image: pathvisReactCard,
    imageFull: pathvisReactFull,
    description:
      "React and Joy UI pathfinding playground for drawing obstacles and comparing Dijkstra and A* with animated visited nodes and shortest paths.",
    technologies: ["React", "Joy UI", "JavaScript"],
    methods: ["Algorithm visualization", "Graph search"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://dinesjo.github.io/react-pathfinding-vis/",
      github: "https://github.com/dinesjo/react-pathfinding-vis",
    },
    date: "September 2023, January 2025",
    priority: 3,
  },
  {
    id: "fittrackr",
    title: "FitTrackr",
    image: fittrackrCard,
    imageFull: fittrackrFull,
    description:
      "KTH group fitness dashboard for workout logging, goals, exercise search APIs, Firebase auth/database, Redux state, and Recharts progress visualizations.",
    technologies: ["React", "Firebase", "Material UI", "TypeScript"],
    methods: ["Personal improvement", "Progress visualization"],
    category: "Web",
    context: "Academic",
    links: {
      live: "https://dh2642-project-7eb8e.web.app/",
      github: "https://github.com/DH2642-project/FitTrackr",
    },
    date: "March - June 2024",
    priority: 2,
  },
  {
    id: "deadline-tracker",
    title: "Deadline Tracker",
    image: deadlineTrackerCard,
    imageFull: deadlineTrackerFull,
    description:
      "Local-first course deadline tracker with a FullCalendar month view, draggable due dates, course management, archive flow, and PWA support.",
    technologies: ["React", "Joy UI", "JavaScript"],
    methods: ["Deadline management", "Local-first data"],
    category: "Web",
    context: "Personal",
    links: {
      live: "https://dinesjo.github.io/deadline-tracker/",
      github: "https://github.com/dinesjo/deadline-tracker",
    },
    date: "September - October 2023",
    priority: 3,
  },
  {
    id: "pathvis",
    title: "Pathfinding Visualization",
    image: pathvisCard,
    imageFull: pathvisFull,
    description:
      "Framework-free final-year project comparing A* and Dijkstra on a hand-built grid, including wall drawing, diagonal movement rules, and path animation.",
    technologies: ["JavaScript", "HTML", "CSS"],
    methods: ["Algorithm visualization", "A* and Dijkstra"],
    category: "Web",
    context: "Academic",
    links: {
      live: "https://dinesjo.github.io/pathfinding-vis/",
      github: "https://github.com/dinesjo/pathfinding-vis",
    },
    date: "November 2020 - March 2021",
    priority: 3,
  },
  {
    id: "this",
    title: "This Website",
    image: portfolioSiteCard,
    imageFull: portfolioSiteFull,
    description:
      "This Vite and React portfolio, with Tailwind styling, optimized WebP project images, filterable project data, and GitHub Pages deployment scripts.",
    technologies: ["React", "Tailwind CSS", "JavaScript"],
    methods: ["Responsive UI", "Image optimization"],
    category: "Web",
    context: "Personal",
    links: {
      github: "https://github.com/dinesjo/react-portfolio",
    },
    date: "September 2023 - Present",
    priority: 3,
  },
  {
    id: "chess-reporter",
    title: "Chess Reporter",
    image: chessReporterCard,
    imageFull: chessReporterFull,
    description:
      "KTH course bot that generated Python GIF recaps of notable chess games and published them to Twitter/X.",
    technologies: ["Python", "Twitter API"],
    methods: ["Content automation", "GIF generation"],
    category: "Other",
    context: "Academic",
    links: {
      live: "https://twitter.com/ChessReporter/",
      liveText: "View on X",
      github: "https://gits-15.sys.kth.se/wver/projinda-twitter-bot",
    },
    date: "May 2022",
    priority: 3,
  },
  {
    id: "note-hero",
    title: "Note Hero",
    image: noteHeroCard,
    imageFull: noteHeroFull,
    description:
      "Unity and C# rhythm game prototype that used microphone input to recognize live instrument notes and turn music-theory practice into a Guitar Hero-style exercise.",
    technologies: ["Unity", "C#"],
    methods: ["Music education", "Audio input"],
    category: "Other",
    context: "Academic",
    links: {},
    date: "January - June 2022",
    priority: 3,
  },
];

export const featuredProjects = projects.filter((p) => p.priority === 1);

export const projectContexts = ["All", "Professional", "Personal", "Academic"];
