import { useState } from "react";
import { featuredProjects } from "../data/projects";
import TechBadge from "./TechBadge";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

export default function FeaturedProjects() {
  const [loaded, setLoaded] = useState({});

  return (
    <section id="featured" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-iceland text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 text-center mb-4 reveal">
          Featured Projects
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 font-inter mb-16 max-w-2xl mx-auto reveal">
          Apps I actively maintain and develop.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {featuredProjects.map((project, i) => (
            <div
              key={project.id}
              className="glass-card rounded-3xl overflow-hidden group reveal"
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              {/* Image */}
              <div className="relative overflow-hidden h-56 sm:h-64">
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
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-slate-900/80 to-transparent" />

                {/* App icon overlay */}
                {project.icon && (
                  <div className="absolute bottom-4 left-6 w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg p-2 flex items-center justify-center">
                    <img
                      src={project.icon}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-montserrat text-2xl font-bold text-slate-800 dark:text-white">
                    {project.title}
                  </h3>
                  <span className="text-xs font-inter text-slate-400 dark:text-slate-500">
                    {project.date}
                  </span>
                </div>

                <p className="text-slate-500 dark:text-slate-400 font-inter leading-relaxed mb-5">
                  {project.description}
                </p>

                {/* Tech badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3">
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-montserrat font-semibold text-sm hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                    >
                      <FaExternalLinkAlt className="text-xs" />
                      Try it
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 dark:bg-white/10 text-slate-600 dark:text-slate-300 rounded-xl font-montserrat font-semibold text-sm hover:bg-white dark:hover:bg-white/20 hover:shadow-md transition-all duration-300 border border-slate-200/50 dark:border-white/10"
                    >
                      <FaGithub />
                      GitHub
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
