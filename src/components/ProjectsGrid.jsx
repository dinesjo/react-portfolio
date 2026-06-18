import { useState } from "react";
import { projects, projectContexts } from "../data/projects";
import ProjectImageFrame from "./ProjectImageFrame";
import SectionIntro from "./SectionIntro";
import TechBadge from "./TechBadge";
import { FaArchive, FaExternalLinkAlt, FaGithub, FaInfoCircle, FaLock } from "react-icons/fa";

export default function ProjectsGrid() {
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.context === filter);

  return (
    <section id="projects" className="py-20">
      <div className="section-shell">
        <SectionIntro
          align="right"
          eyebrow="Selected work"
          title="Work by context."
          index="02"
          className="mb-10"
        >
          A curated set of professional, personal, and academic work, grouped
          so the constraints behind each piece of work are easier to compare.
        </SectionIntro>

        {/* Context filters */}
        <div className="mb-8 flex flex-wrap gap-2 reveal">
          {projectContexts.map((context) => (
            <button
              key={context}
              type="button"
              aria-pressed={filter === context}
              onClick={() => setFilter(context)}
              className={`filter-pill rounded-md border px-4 py-2 text-sm font-montserrat font-bold transition-all duration-200 ${
                filter === context
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-200/70 bg-white/60 text-slate-500 hover:border-slate-300 hover:bg-white/80 hover:text-slate-950"
              }`}
            >
              {context}
            </button>
          ))}
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, index) => {
            const isTwoColumnTail =
              filtered.length > 1 && filtered.length % 2 === 1 && index === filtered.length - 1;
            const isThreeColumnTail =
              filtered.length > 1 && filtered.length % 3 === 1 && index === filtered.length - 1;

            return (
              <article
                key={`${filter}-${project.id}`}
                className={`surface-card motion-card project-card group flex flex-col overflow-hidden rounded-lg ${
                  isTwoColumnTail
                    ? `sm:col-span-2 sm:grid sm:grid-cols-[0.9fr_1.1fr] ${
                        isThreeColumnTail ? "" : "lg:col-span-1 lg:flex lg:flex-col"
                      }`
                    : ""
                } ${
                  isThreeColumnTail
                    ? "lg:col-span-3 lg:grid lg:grid-cols-[0.72fr_1.28fr]"
                    : ""
                }`}
                style={{ animationDelay: `${index * 0.045}s` }}
              >
                {/* Image */}
                <ProjectImageFrame
                  project={project}
                  frameClassName={`overflow-hidden border-b border-slate-200/50 bg-slate-200 ${
                    isTwoColumnTail
                      ? `h-40 sm:h-full sm:min-h-56 sm:border-b-0 sm:border-r sm:border-slate-200/50 ${
                          isThreeColumnTail
                            ? ""
                            : "lg:h-40 lg:min-h-0 lg:border-b lg:border-r-0"
                        }`
                      : "h-40"
                  } ${
                    isThreeColumnTail
                      ? "lg:h-full lg:min-h-64 lg:border-b-0"
                      : ""
                  }`}
                  imageClassName="h-full w-full object-cover transition duration-500 group-hover/image:scale-[1.035]"
                >
                  <div className="absolute left-3 top-3 flex max-w-[calc(100%-4rem)] flex-wrap gap-1.5">
                    <span className="project-tag rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      {project.context}
                    </span>
                    <span className="project-tag rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      {project.category}
                    </span>
                    {project.isNew && (
                      <span className="project-tag rounded-md bg-[var(--coral)] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                        New
                      </span>
                    )}
                    {project.isPrivate && (
                      <span className="project-tag flex items-center gap-1 rounded-md bg-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <FaLock className="text-[10px]" /> Private
                      </span>
                    )}
                    {project.isDecommissioned && (
                      <span className="project-tag flex items-center gap-1 rounded-md bg-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <FaArchive className="text-[10px]" /> Decommissioned
                      </span>
                    )}
                  </div>
                </ProjectImageFrame>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 space-y-2">
                    <h3 className="font-montserrat text-lg font-extrabold leading-tight text-slate-950">
                      {project.title}
                    </h3>
                    <span className="block text-left text-[0.66rem] font-semibold uppercase leading-snug tracking-[0.08em] text-slate-400">
                      {project.date}
                    </span>
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>

                  {project.statusNote && (
                    <p className="mb-4 flex items-start gap-2 rounded-md border border-slate-200/60 bg-slate-50/70 px-3 py-2 text-xs font-semibold leading-relaxed text-slate-600">
                      <FaInfoCircle className="mt-0.5 flex-shrink-0 text-slate-400" />
                      <span>{project.statusNote}</span>
                    </p>
                  )}

                  {/* Tech badges */}
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <TechBadge key={tech} name={tech} />
                    ))}
                  </div>

                  {/* Links */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sharp-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
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
                        className="quiet-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold"
                      >
                        <FaGithub />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
