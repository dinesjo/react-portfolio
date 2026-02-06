import { useState } from "react";
import { projects, categories } from "../data/projects";
import TechBadge from "./TechBadge";
import { FaExternalLinkAlt, FaGithub, FaLock } from "react-icons/fa";

export default function ProjectsGrid() {
  const [loaded, setLoaded] = useState({});
  const [filter, setFilter] = useState("All");

  const filtered = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-iceland text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 text-center mb-4 reveal">
          All Projects
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 font-inter mb-16 max-w-2xl mx-auto reveal">
          A collection of projects spanning web development, research, game
          development, and more.
        </p>

        {/* Category filters */}
        <div className="flex justify-center gap-2 mb-10 flex-wrap reveal">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-xl text-sm font-montserrat font-semibold transition-all duration-300 ${
                filter === cat
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "glass-card text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-44">
                {!loaded[project.id] && (
                  <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
                )}
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  onLoad={() => setLoaded((p) => ({ ...p, [project.id]: true }))}
                  className={`w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${!loaded[project.id] ? "opacity-0" : "opacity-100"}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 dark:from-slate-900/60 to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 right-3 flex gap-2">
                  {project.isNew && (
                    <span className="px-2.5 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow">
                      New
                    </span>
                  )}
                  {project.isPrivate && (
                    <span className="px-2.5 py-1 bg-slate-500/80 text-white text-xs font-semibold rounded-full shadow flex items-center gap-1">
                      <FaLock className="text-[10px]" /> Private
                    </span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-montserrat text-lg font-bold text-slate-800 dark:text-white mb-1">
                  {project.title}
                </h3>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-inter mb-3">
                  {project.date}
                </span>

                <p className="text-sm text-slate-500 dark:text-slate-400 font-inter leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 mt-auto">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-500 text-white rounded-xl font-inter font-medium text-xs hover:bg-blue-600 hover:shadow-md transition-all duration-300"
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
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/50 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl font-inter font-medium text-xs hover:bg-white dark:hover:bg-white/20 hover:shadow-md transition-all duration-300 border border-slate-200/40 dark:border-white/10"
                    >
                      <FaGithub />
                      Code
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
