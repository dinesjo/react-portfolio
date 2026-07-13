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
import { projectRecords } from "./projectRecords";

const projectMedia = {
  "master-thesis-kgqa": {
    image: masterThesisKgqaCard,
    imageFull: masterThesisKgqaFull,
    imageOverlayTone: "light",
  },
  "thesis-tracker": {
    image: thesisTrackerCard,
    imageFull: thesisTrackerFull,
    icon: thesisTrackerIcon,
  },
  snuskoll: {
    image: snuskollCard,
    imageFull: snuskollFull,
    icon: snuskollLogo,
  },
  bibellandskap: {
    image: bibellandskapCard,
    imageFull: bibellandskapFull,
  },
  "ai-diary": {
    image: aiDiaryCard,
    imageFull: aiDiaryFull,
  },
  logportal: {
    image: logportalCard,
    imageFull: logportalFull,
  },
  bachelor: {
    image: bachelorCard,
    imageFull: bachelorFull,
  },
  drone: {
    image: droneCard,
    imageFull: droneFull,
  },
  vim: {
    image: vimCard,
    imageFull: vimFull,
  },
  habitgrower: {
    image: habitGrowerCard,
    imageFull: habitGrowerFull,
    icon: habitGrowerIcon,
  },
  "pathvis-react": {
    image: pathvisReactCard,
    imageFull: pathvisReactFull,
  },
  fittrackr: {
    image: fittrackrCard,
    imageFull: fittrackrFull,
  },
  "deadline-tracker": {
    image: deadlineTrackerCard,
    imageFull: deadlineTrackerFull,
  },
  pathvis: {
    image: pathvisCard,
    imageFull: pathvisFull,
  },
  this: {
    image: portfolioSiteCard,
    imageFull: portfolioSiteFull,
  },
  "chess-reporter": {
    image: chessReporterCard,
    imageFull: chessReporterFull,
  },
  "note-hero": {
    image: noteHeroCard,
    imageFull: noteHeroFull,
  },
};

export const projects = projectRecords.map(({ id, title, highlights, ...content }) => {
  const { image, imageFull, icon, imageOverlayTone } = projectMedia[id];

  return {
    id,
    title,
    image,
    imageFull,
    ...(icon ? { icon } : {}),
    ...content,
    ...(imageOverlayTone ? { imageOverlayTone } : {}),
    ...(highlights ? { highlights } : {}),
  };
});

export const featuredProjects = projects.filter((p) => p.priority === 1);

export const projectContexts = ["All", "Professional", "Personal", "Academic"];
