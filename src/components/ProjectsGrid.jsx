import { useMemo, useState } from "react";
import { projects, projectContexts } from "../data/projects";
import ProjectBadges from "./ProjectBadges";
import ProjectImageFrame from "./ProjectImageFrame";
import SectionIntro from "./SectionIntro";
import {
  FaArchive,
  FaExternalLinkAlt,
  FaGithub,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa";

const priorityGroups = {
  1: {
    eyebrow: "In detail",
    title: "Case studies",
    filteredTitle: "case studies",
    copy:
      "Projects with more detail about the problem, what I built, and the result.",
  },
  2: {
    eyebrow: "Selected",
    title: "Selected projects",
    filteredTitle: "selected projects",
    copy:
      "Other projects from work, university, and my own time.",
  },
  3: {
    eyebrow: "Older projects",
    title: "Older projects",
    filteredTitle: "older projects",
    copy:
      "Course projects, experiments, and apps I no longer maintain.",
  },
};

const overlayStyles = {
  light: {
    container:
      "project-image-label project-image-label--light border-white/70 bg-[var(--paper-strong)]/95 text-slate-950",
    label: "text-slate-600",
    icon: "bg-white/80",
  },
  dark: {
    container:
      "project-image-label project-image-label--dark border-white/20 bg-[var(--ink)]/94 text-white",
    label: "text-white/60",
    icon: "bg-white/95",
  },
};

const byPriority = (priority) => (project) => (project.priority || 2) === priority;

function getStatusLabel(project) {
  if (project.isDecommissioned) return "Archived";
  if (project.isPrivate) return "Private";
  if (project.date?.toLowerCase().includes("present")) return "In progress";
  return "Completed";
}

function getFilteredTitle(filter, priority) {
  const group = priorityGroups[priority];
  if (filter === "All") return group.title;
  return `${filter} ${group.filteredTitle}`;
}

function ProjectTags({ project, className = "" }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      <span className="project-tag project-tag--context px-2.5 py-1 text-xs font-bold">
        {project.context}
      </span>
      <span className="project-tag project-tag--category px-2.5 py-1 text-xs font-bold">
        {project.category}
      </span>
      {project.isPrivate && (
        <span className="project-tag project-tag--status flex items-center gap-1 px-2.5 py-1 text-xs font-semibold">
          <FaLock className="text-[10px]" /> Private
        </span>
      )}
      {project.isDecommissioned && (
        <span className="project-tag project-tag--status flex items-center gap-1 px-2.5 py-1 text-xs font-semibold">
          <FaArchive className="text-[10px]" /> Decommissioned
        </span>
      )}
    </div>
  );
}

function ProjectLinks({ project, compact = false }) {
  const hasLinks = project.links.live || project.links.github;
  if (!hasLinks) return null;

  const primaryClass = compact
    ? "sharp-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
    : "sharp-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold";
  const secondaryClass = compact
    ? "quiet-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
    : "quiet-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold";

  return (
    <div className={`flex flex-wrap ${compact ? "gap-2" : "gap-3"}`}>
      {project.links.live && (
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryClass}
        >
          <FaExternalLinkAlt className="text-[10px]" />
          {project.links.liveText || "Try it"}
        </a>
      )}
      {project.links.github && (
        <a
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryClass}
        >
          <FaGithub />
          {compact ? "Code" : "GitHub"}
        </a>
      )}
    </div>
  );
}

function PriorityGroupHeader({ filter, priority, count }) {
  const group = priorityGroups[priority];

  return (
    <div className="work-group-header reveal">
      <div>
        <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--coral)]">
          {group.eyebrow}
        </p>
        <h3 className="mt-2 font-montserrat text-2xl font-extrabold leading-tight text-slate-950 sm:text-3xl">
          {getFilteredTitle(filter, priority)}
        </h3>
        <p className="section-copy mt-3 max-w-3xl text-sm sm:text-base">
          {group.copy}
        </p>
      </div>
      <span className="work-group-count">
        {count} {count === 1 ? "project" : "projects"}
      </span>
    </div>
  );
}

function CaseStudyCard({ project, index }) {
  const overlayTone = project.featuredOverlayTone || project.imageOverlayTone;
  const overlayStyle = overlayStyles[overlayTone] || overlayStyles.dark;

  return (
    <article
      className={`surface-card priority-case-card group reveal overflow-hidden rounded-lg ${
        index % 2 === 1
          ? "priority-case-card--text-left"
          : "priority-case-card--text-right"
      }`}
    >
      <div className={`grid lg:grid-cols-[1.03fr_0.97fr] ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <ProjectImageFrame
          project={project}
          displayImageSrc={project.imageFull || project.image}
          frameClassName="min-h-72 overflow-hidden border-b border-slate-200/30 bg-slate-900 lg:border-b-0"
          imageClassName="h-full min-h-72 w-full object-cover"
          imageSizes="(min-width: 1180px) 608px, (min-width: 1024px) 50vw, calc(100vw - 48px)"
        >
          <div className={`absolute bottom-4 left-4 flex items-center gap-3 border px-3 py-2 ${overlayStyle.container}`}>
            {project.icon && (
              <img
                src={project.icon}
                alt=""
                className={`h-8 w-8 rounded p-1 object-contain ${overlayStyle.icon}`}
              />
            )}
            <div>
              <p className={`font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.16em] ${overlayStyle.label}`}>
                {getStatusLabel(project)}
              </p>
              <p className="text-sm font-semibold">{project.date}</p>
            </div>
          </div>
        </ProjectImageFrame>

        <div className="priority-case-card__content flex flex-col justify-between p-6 sm:p-8">
          <div>
            <ProjectTags project={project} className="mb-5" />
            <h3 className="font-montserrat text-3xl font-extrabold leading-tight text-slate-950">
              {project.title}
            </h3>
            <p className="section-copy mt-4">
              {project.featuredDescription || project.description}
            </p>

            {project.highlights?.length > 0 && (
              <ul className="mt-6 space-y-3">
                {project.highlights.map((note) => (
                  <li key={note} className="flex gap-3 text-sm text-slate-700">
                    <span className="project-bullet mt-2 flex-shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}

            {project.statusNote && (
              <p className="project-status-note mt-6 flex items-start gap-2 border px-3 py-2 text-xs font-semibold leading-relaxed">
                <FaInfoCircle className="mt-0.5 flex-shrink-0 text-slate-400" />
                <span>{project.statusNote}</span>
              </p>
            )}

            <ProjectBadges project={project} className="mt-6" />
          </div>

          <div className="mt-8">
            <ProjectLinks project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

function SelectedProjectCard({ project, index }) {
  return (
    <article
      className="surface-card project-card group flex flex-col overflow-hidden rounded-lg"
      style={{ animationDelay: `${index * 0.045}s` }}
    >
      <ProjectImageFrame
        project={project}
        frameClassName="h-44 overflow-hidden border-b border-slate-200/50 bg-slate-200"
        imageClassName="h-full w-full object-cover"
        imageSizes="(min-width: 1180px) 382px, (min-width: 1024px) 31vw, (min-width: 640px) 50vw, calc(100vw - 48px)"
      >
        <ProjectTags project={project} className="absolute left-3 top-3 max-w-[calc(100%-4rem)]" />
      </ProjectImageFrame>

      <div className="flex flex-1 flex-col p-5">
        <div className="project-card__heading mb-4 border-b pb-3">
          <div className="space-y-2">
            <h3 className="font-montserrat text-lg font-extrabold leading-tight text-slate-950">
              {project.title}
            </h3>
            <span className="block text-left text-[0.66rem] font-semibold uppercase leading-snug tracking-[0.08em] text-slate-500">
              {project.date}
            </span>
          </div>
        </div>

        <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        {project.statusNote && (
          <p className="project-status-note mb-4 flex items-start gap-2 border px-3 py-2 text-xs font-semibold leading-relaxed">
            <FaInfoCircle className="mt-0.5 flex-shrink-0 text-slate-400" />
            <span>{project.statusNote}</span>
          </p>
        )}

        <ProjectBadges project={project} className="mb-5" />

        <div className="mt-auto">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </article>
  );
}

function ArchiveProjectCard({ project }) {
  return (
    <article className="archive-card group grid overflow-hidden sm:grid-cols-[11.5rem_1fr] lg:grid-cols-[13rem_1fr]">
      <ProjectImageFrame
        project={project}
        frameClassName="h-44 overflow-hidden bg-slate-200 sm:h-full sm:min-h-44"
        imageClassName="h-full w-full object-cover"
        imageSizes="(min-width: 1024px) 208px, (min-width: 640px) 184px, calc(100vw - 48px)"
      />

      <div className="flex min-w-0 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="font-montserrat text-base font-extrabold leading-tight text-slate-950">
              {project.title}
            </h3>
            <p className="archive-card__meta mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-slate-500">
              {project.context} · {project.category} · {project.date}
            </p>
          </div>
        </div>

        <p className="archive-card__description mt-3 text-sm leading-relaxed text-slate-600">
          {project.description}
        </p>

        {project.statusNote && (
          <p className="project-status-note mt-3 flex items-start gap-2 border px-3 py-2 text-xs font-semibold leading-relaxed">
            <FaInfoCircle className="mt-0.5 flex-shrink-0 text-slate-400" />
            <span>{project.statusNote}</span>
          </p>
        )}

        <div className="mt-4">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </article>
  );
}

export default function ProjectsGrid() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(
    () => (filter === "All" ? projects : projects.filter((project) => project.context === filter)),
    [filter]
  );

  const grouped = useMemo(
    () => ({
      1: filtered.filter(byPriority(1)),
      2: filtered.filter(byPriority(2)),
      3: filtered.filter(byPriority(3)),
    }),
    [filtered]
  );

  return (
    <section id="featured" className="pb-20 pt-24">
      <div className="section-shell">
        <SectionIntro
          eyebrow="Projects"
          title="Things I&rsquo;ve built."
          className="mb-10"
        >
          This includes university research, work projects, and things I have
          made in my own time. Use the filters to narrow the list.
        </SectionIntro>

        <div className="mb-10 reveal">
          <div className="flex flex-wrap gap-2">
            {projectContexts.map((context) => (
              <button
                key={context}
                type="button"
                aria-pressed={filter === context}
                onClick={() => setFilter(context)}
                className={`filter-pill border px-4 py-2 font-montserrat text-sm font-bold transition-all duration-200 ${
                  filter === context
                    ? "border-slate-950 bg-slate-950 text-white"
                    : "border-slate-200/70 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-white/80 hover:text-slate-950"
                }`}
              >
                {context}
              </button>
            ))}
          </div>

        </div>

        {grouped[1].length > 0 && (
          <div className="work-priority-group">
            <PriorityGroupHeader filter={filter} priority={1} count={grouped[1].length} />
            <div className="space-y-8">
              {grouped[1].map((project, index) => (
                <CaseStudyCard key={`${filter}-${project.id}`} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {grouped[2].length > 0 && (
          <div id="projects" className="work-priority-group">
            <PriorityGroupHeader filter={filter} priority={2} count={grouped[2].length} />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {grouped[2].map((project, index) => (
                <SelectedProjectCard key={`${filter}-${project.id}`} project={project} index={index} />
              ))}
            </div>
          </div>
        )}

        {grouped[3].length > 0 && (
          <div className="work-priority-group">
            <PriorityGroupHeader filter={filter} priority={3} count={grouped[3].length} />
            <details className="archive-disclosure">
              <summary className="archive-disclosure__summary">
                <span className="archive-disclosure__lead">
                  <span className="archive-disclosure__lead-title">Project archive</span>
                  <span className="archive-disclosure__lead-count">
                    {grouped[3].length} older {grouped[3].length === 1 ? "project" : "projects"}
                  </span>
                </span>
                <span className="archive-disclosure__action">
                  <span className="disclosure-action__closed">Show older projects</span>
                  <span className="disclosure-action__open">Hide older projects</span>
                </span>
              </summary>
              <div className="archive-disclosure__list">
                {grouped[3].map((project) => (
                  <ArchiveProjectCard key={`${filter}-${project.id}`} project={project} />
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </section>
  );
}
