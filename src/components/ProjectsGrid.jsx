import { useEffect, useId, useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import { projects, projectContexts } from "../data/projects";
import { compareProjectRecency } from "../utils/projectOrdering";
import ProjectBadges from "./ProjectBadges";
import ProjectImageFrame from "./ProjectImageFrame";
import SectionIntro from "./SectionIntro";
import { ProjectMotionCard, ProjectMotionGroup } from "./ProjectMotion";
import AnimatedDisclosure, { DisclosureIndicator } from "./AnimatedDisclosure";
import {
  FaArchive,
  FaArrowRight,
  FaExternalLinkAlt,
  FaGithub,
  FaInfoCircle,
  FaLock,
} from "react-icons/fa";

const priorityGroups = {
  1: {
    title: "Case studies",
    copy:
      "Projects with more detail about the problem, what I built, and the result.",
  },
  2: {
    title: "Selected projects",
    copy:
      "Ongoing work first, then completed projects from newest to oldest.",
  },
  3: {
    title: "Project archive",
    copy:
      "Course projects, experiments, and apps I no longer maintain.",
  },
};

const byPriority = (priority) => (project) => (project.priority || 2) === priority;

function ProjectTags({ project, className = "" }) {
  return (
    <div className={`project-kind ${className}`}>
      <span>{project.context} · {project.category}</span>
      {project.isPrivate && (
        <span className="inline-flex items-center gap-1">
          <FaLock className="text-[10px]" /> Private
        </span>
      )}
      {project.isDecommissioned && (
        <span className="inline-flex items-center gap-1">
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
    ? "sharp-button inline-flex min-h-11 items-center gap-1.5 px-3 py-2 text-xs font-bold"
    : "sharp-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold";
  const secondaryClass = compact
    ? "quiet-button inline-flex min-h-11 items-center gap-1.5 px-3 py-2 text-xs font-bold"
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

function PriorityGroupHeader({ priority, count, settled }) {
  const group = priorityGroups[priority];

  return (
    <header className={`collection-group-header reveal ${settled ? "revealed reveal-complete" : ""}`} data-reveal="trace">
      <span className="collection-group-index" aria-hidden="true">
        {String(priority).padStart(2, "0")}
      </span>
      <div>
        <div className="collection-group-title-row">
          <h3
            id={`project-group-${priority}-title`}
            className="collection-group-title"
          >
            {group.title}
          </h3>
          <span className="collection-group-count">
            {count} {count === 1 ? "project" : "projects"}
          </span>
        </div>
        <p className="collection-group-copy">
          {group.copy}
        </p>
      </div>
    </header>
  );
}

function CaseStudyCard({ project, index, settled }) {
  const keepFullImage = project.featuredImageFit === "contain";
  return (
    <article
      id={`project-${project.id}`}
      tabIndex={-1}
      aria-labelledby={`project-${project.id}-title`}
      className={`surface-card priority-case-card group reveal overflow-hidden rounded-lg ${settled ? "revealed reveal-complete" : ""} ${
        index % 2 === 1
          ? "priority-case-card--text-left"
          : "priority-case-card--text-right"
      }`}
      data-reveal="case-study"
    >
      <div className={`case-study-layout ${index % 2 === 1 ? "case-study-layout--text-first" : ""}`}>
        <ProjectImageFrame
          project={project}
          displayImageSrc={project.imageFull || project.image}
          responsiveArtwork
          frameClassName={`case-study-media featured-case-image overflow-hidden ${project.imagePortrait ? "featured-case-image--art-directed" : ""} ${keepFullImage ? "featured-case-image--uncropped" : ""}`}
          imageClassName="block w-full"
          imageSizes="(min-width: 1288px) 624px, (min-width: 1024px) 50vw, calc(100vw - 48px)"
        />

        <div className="priority-case-card__content flex flex-col justify-between">
          <div>
            <ProjectTags project={project} className="mb-5" />
            <h4
              id={`project-${project.id}-title`}
              className="case-card-title font-montserrat font-extrabold leading-tight text-slate-950"
            >
              {project.title}
            </h4>
            <p className="section-copy mt-4">
              {project.featuredDescription || project.description}
            </p>
            <p className="project-date">{project.date}</p>

            {project.caseStudy?.result && <div className="case-result"><strong>{project.caseStudy.result.value}</strong><div><p>{project.caseStudy.result.label}</p><span>{project.caseStudy.result.context}</span></div></div>}

            {project.highlights?.length > 0 && (
              <ul className="mt-6 space-y-3">
                {project.highlights.slice(0, 2).map((note) => (
                  <li key={note} className="flex gap-3 text-sm text-slate-700">
                    <span className="project-bullet mt-2 shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            )}

            {project.statusNote && (
              <p className="project-status-note mt-6 flex items-start gap-2 border px-3 py-2 text-xs font-semibold leading-relaxed">
                <FaInfoCircle className="mt-0.5 shrink-0 text-slate-400" />
                <span>{project.statusNote}</span>
              </p>
            )}

            <ProjectBadges project={project} showMethods={false} className="mt-6" />
          </div>

          <div className="case-card-actions mt-6">
            <a href={`#/work/${project.id}`} className="sharp-button inline-flex items-center gap-2 px-4 py-3 text-sm font-bold">Read case study <FaArrowRight aria-hidden="true" /></a>
            <ProjectLinks project={project} compact />
          </div>
        </div>
      </div>
    </article>
  );
}

function SelectedProjectCard({ project, settled }) {
  return (
    <article
      id={`project-${project.id}`}
      tabIndex={-1}
      aria-labelledby={`project-${project.id}-title`}
      className={`surface-card project-card group reveal flex flex-col overflow-hidden rounded-lg ${settled ? "revealed reveal-complete" : ""}`}
      data-reveal="trace"
    >
      <ProjectImageFrame
        project={project}
        frameClassName="project-card-image overflow-hidden border-b border-slate-200/50 bg-slate-200"
        imageClassName="h-full w-full object-cover"
        imageSizes="(min-width: 1300px) 400px, (min-width: 1040px) 32vw, (min-width: 700px) 50vw, calc(100vw - 48px)"
      />

      <div className="flex flex-1 flex-col p-5">
        <ProjectTags project={project} className="mb-3" />
        <div className="project-card__heading mb-4 border-b pb-3">
          <div className="space-y-2">
            <h4
              id={`project-${project.id}-title`}
              className="font-montserrat text-lg font-extrabold leading-tight text-slate-950"
            >
              {project.title}
            </h4>
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
            <FaInfoCircle className="mt-0.5 shrink-0 text-slate-400" />
            <span>{project.statusNote}</span>
          </p>
        )}

        <ProjectBadges project={project} showMethods={false} className="mb-5" />

        <div className="mt-auto">
          <ProjectLinks project={project} compact />
        </div>
      </div>
    </article>
  );
}

function ArchiveProjectCard({ project }) {
  return (
    <article
      id={`project-${project.id}`}
      tabIndex={-1}
      aria-labelledby={`project-${project.id}-title`}
      className="archive-card group grid overflow-hidden sm:grid-cols-[11.5rem_1fr] lg:grid-cols-[13rem_1fr]"
    >
      <ProjectImageFrame
        project={project}
        frameClassName="archive-card-media overflow-hidden"
        imageClassName="h-full w-full object-cover"
        imageSizes="(min-width: 1024px) 188px, (min-width: 640px) 164px, calc(100vw - 48px)"
      />

      <div className="flex min-w-0 flex-col p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h4
              id={`project-${project.id}-title`}
              className="font-montserrat text-base font-extrabold leading-tight text-slate-950"
            >
              {project.title}
            </h4>
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
            <FaInfoCircle className="mt-0.5 shrink-0 text-slate-400" />
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

const caseStudyOrder = projects.filter(byPriority(1)).map((project) => project.id);
const filterProjects = (filter) => filter === "All"
  ? projects
  : projects.filter((project) => project.context === filter);

export default function ProjectsGrid() {
  const layoutId = useId();
  const reducedMotion = useReducedMotion();
  const [selection, setSelection] = useState({ filter: "All", previous: "All", revision: 0, instant: false });
  const [archiveOpen, setArchiveOpen] = useState(false);
  const { filter, revision } = selection;
  const settled = revision > 0;
  const presence = { instant: selection.instant || reducedMotion };

  useEffect(() => {
    const revealProject = (event) => {
      if (event.detail?.targetId?.startsWith("project-")) {
        // Source links must be able to reveal and focus their target immediately.
        setSelection((previous) => ({ filter: "All", previous: previous.filter,
          revision: previous.revision + 1, instant: true }));
      }
    };
    window.addEventListener("portfolio:reveal-source", revealProject);
    return () => window.removeEventListener("portfolio:reveal-source", revealProject);
  }, []);

  const filtered = useMemo(() => filterProjects(filter), [filter]);
  const grouped = useMemo(() => ({
    1: filtered.filter(byPriority(1)),
    2: filtered.filter(byPriority(2)).sort(compareProjectRecency),
    3: filtered.filter(byPriority(3)),
  }), [filtered]);
  const previousCases = filterProjects(selection.previous).filter(byPriority(1));

  const changeFilter = (nextFilter) => {
    setSelection((previous) => previous.filter === nextFilter ? previous : {
      filter: nextFilter, previous: previous.filter,
      revision: previous.revision + 1, instant: false,
    });
  };

  return (
    <section id="featured" tabIndex={-1} className="pb-20 pt-8">
      <div className="section-shell">
        <SectionIntro eyebrow="Projects" title="Things I&rsquo;ve built." className="mb-5">
          Research, professional tools, and personal apps. Explore the work below.
        </SectionIntro>

        <LayoutGroup id={layoutId}>
          <div className="project-filters mb-4 reveal" data-reveal="trace">
            <div className="project-filter-controls flex flex-wrap gap-2" role="group" aria-label="Filter projects by context">
              {projectContexts.map((context) => (
                <button
                  key={context}
                  type="button"
                  aria-pressed={filter === context}
                  onClick={(event) => {
                    event.currentTarget.focus({ preventScroll: true });
                    changeFilter(context);
                  }}
                  className="filter-pill border px-4 py-2 font-montserrat text-sm font-bold"
                >
                  {filter === context && (
                    <m.span
                      aria-hidden="true"
                      className="project-filter-indicator"
                      layoutId="active-filter"
                      initial={false}
                      style={{
                        borderTopLeftRadius: 1, borderTopRightRadius: 7,
                        borderBottomRightRadius: 1, borderBottomLeftRadius: 1,
                        boxShadow: "4px 4px 0 rgba(233, 79, 55, 0.2)",
                      }}
                      transition={presence.instant ? { duration: 0 } : {
                        type: "spring", stiffness: 560, damping: 44, mass: 0.7,
                      }}
                    />
                  )}
                  <span className="filter-pill__label">{context}</span>
                </button>
              ))}
            </div>
          </div>

          <div id="projects" className="content-collection work-collection" data-filter={filter}>
            <p className="sr-only" role="status" aria-atomic="true">
              {filtered.length} {filter === "All" ? "" : `${filter.toLowerCase()} `}projects
            </p>

            <AnimatePresence initial={false} mode="popLayout" custom={presence}>
              {[1, 2, 3].map((priority) => grouped[priority].length > 0 && (
                <ProjectMotionGroup key={priority} priority={priority} revision={revision}>
                  <PriorityGroupHeader priority={priority} count={grouped[priority].length} settled={settled} />

                  {priority === 1 && (
                    <div className="project-case-list">
                      <AnimatePresence initial={false} mode="popLayout" custom={presence}>
                        {grouped[1].map((project, index) => (
                          <ProjectMotionCard key={project.id} projectId={project.id} index={index} revision={revision} reflow={false}
                            crossfade={settled && previousCases.some((item) => item.id === project.id) &&
                              previousCases.findIndex((item) => item.id === project.id) !== index}>
                            <CaseStudyCard project={project} index={caseStudyOrder.indexOf(project.id)} settled={settled} />
                          </ProjectMotionCard>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {priority === 2 && (
                    <div className="project-grid reveal-grid grid gap-5">
                      <AnimatePresence initial={false} mode="popLayout" custom={presence}>
                        {grouped[2].map((project, index) => (
                          <ProjectMotionCard key={project.id} projectId={project.id} index={index} revision={revision}>
                            <SelectedProjectCard project={project} settled={settled} />
                          </ProjectMotionCard>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}

                  {priority === 3 && (
                    <AnimatedDisclosure className={`archive-disclosure reveal ${settled ? "revealed reveal-complete" : ""}`}
                      data-reveal="trace" defaultOpen={archiveOpen} onOpenChange={setArchiveOpen}
                      summaryClassName="archive-disclosure__summary" summary={(expanded) => <>
                        <span className="archive-disclosure__lead">
                          <span className="archive-disclosure__lead-title">
                            Browse {grouped[3].length} earlier {grouped[3].length === 1 ? "project" : "projects"}
                          </span>
                          <span className="archive-disclosure__lead-count">Kept here for reference</span>
                        </span>
                        <span className="archive-disclosure__action">
                          {expanded ? "Close archive" : "Open archive"}
                          <DisclosureIndicator expanded={expanded} />
                        </span>
                      </>}>
                      <div className="archive-disclosure__list">
                        <AnimatePresence initial={false} mode="popLayout" custom={presence}>
                          {grouped[3].map((project, index) => (
                            <ProjectMotionCard key={project.id} projectId={project.id} index={index} revision={revision}>
                              <ArchiveProjectCard project={project} />
                            </ProjectMotionCard>
                          ))}
                        </AnimatePresence>
                      </div>
                    </AnimatedDisclosure>
                  )}
                </ProjectMotionGroup>
              ))}
            </AnimatePresence>
          </div>
        </LayoutGroup>
      </div>
    </section>
  );
}
