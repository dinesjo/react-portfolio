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
              className={`rounded-md border px-4 py-2 text-sm font-montserrat font-bold transition-all duration-200 ${
                filter === context
                  ? "border-slate-950 bg-slate-950 text-white"
                  : "border-slate-300 bg-white/70 text-slate-500 hover:border-slate-500 hover:text-slate-950"
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

            return (
              <article
                key={project.id}
                className={`surface-card group overflow-hidden rounded-lg ${
                  isTwoColumnTail
                    ? "sm:col-span-2 sm:grid sm:grid-cols-[0.9fr_1.1fr] lg:col-span-1 lg:flex lg:flex-col"
                    : "flex flex-col"
                }`}
              >
                {/* Image */}
                <ProjectImageFrame
                  project={project}
                  frameClassName={`overflow-hidden border-b border-slate-200 bg-slate-200 ${
                    isTwoColumnTail
                      ? "h-40 sm:h-full sm:min-h-56 sm:border-b-0 sm:border-r lg:h-40 lg:min-h-0 lg:border-b lg:border-r-0"
                      : "h-40"
                  }`}
                  imageClassName="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
                >
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-md bg-slate-950 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                      {project.context}
                    </span>
                    <span className="rounded-md bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm">
                      {project.category}
                    </span>
                    {project.isNew && (
                      <span className="rounded-md bg-[var(--coral)] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                        New
                      </span>
                    )}
                    {project.isPrivate && (
                      <span className="flex items-center gap-1 rounded-md bg-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <FaLock className="text-[10px]" /> Private
                      </span>
                    )}
                    {project.isDecommissioned && (
                      <span className="flex items-center gap-1 rounded-md bg-slate-700 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
                        <FaArchive className="text-[10px]" /> Decommissioned
                      </span>
                    )}
                  </div>
                </ProjectImageFrame>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <h3 className="font-montserrat text-lg font-extrabold leading-tight text-slate-950">
                      {project.title}
                    </h3>
                    <span className="max-w-24 text-right text-[0.68rem] font-semibold uppercase leading-snug tracking-[0.08em] text-slate-400">
                      {project.date}
                    </span>
                  </div>

                  <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-600">
                    {project.description}
                  </p>

                  {project.statusNote && (
                    <p className="mb-4 flex items-start gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold leading-relaxed text-slate-600">
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
                        className="sharp-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-transform duration-200 hover:-translate-y-0.5"
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
                        className="quiet-button inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold transition-colors duration-200 hover:bg-white"
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
