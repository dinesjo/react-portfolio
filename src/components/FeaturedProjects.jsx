import { featuredProjects } from "../data/projects";
import ProjectImageFrame from "./ProjectImageFrame";
import TechBadge from "./TechBadge";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const caseStudyNotes = {
  "master-thesis-kgqa": [
    "Turns graph-encoded configuration constraints into questions people can ask in ordinary language",
    "Evaluates whether the system can reliably tell when product configurations work together or conflict",
    "Shows a search-based approach can be a strong practical default, answering correctly in 96.4% of benchmark cases",
    "Shows direct graph querying can be slightly more accurate and easier to audit, but is slower and more expensive to run",
  ],
  snuskoll: [
    "Full-stack PWA built with ASP.NET, Blazor, PostgreSQL, and Tailwind",
    "Real product catalog with search, filters, ratings, and favorites",
    "Covers product data, user ratings, and a relational backend",
  ],
};

const overlayStyles = {
  light: {
    container:
      "border-white/60 bg-white/60 text-slate-950 shadow-xl shadow-slate-950/20 backdrop-blur-md",
    label: "text-slate-600",
    icon: "bg-white/70",
  },
  dark: {
    container:
      "border-white/25 bg-slate-950/78 text-white shadow-xl shadow-slate-950/20 backdrop-blur-sm",
    label: "text-white/60",
    icon: "bg-white",
  },
};

export default function FeaturedProjects() {
  return (
    <section id="featured" className="pb-14 pt-24">
      <div className="section-shell">
        <div className="mb-12 grid gap-6 lg:grid-cols-[0.78fr_1fr] lg:items-end">
          <div className="reveal">
            <span className="section-eyebrow">Selected work</span>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl">
              Current projects, in detail.
            </h2>
          </div>
          <p className="section-copy reveal max-w-2xl text-base lg:justify-self-end">
            Two current projects: one research thesis on industrial knowledge
            graph question answering and one full-stack product. Together they
            show how I handle evaluation design, data access, and maintainable
            implementation.
          </p>
        </div>

        <div className="space-y-8">
          {featuredProjects.map((project, i) => {
            const overlayTone = project.featuredOverlayTone || project.imageOverlayTone;
            const overlayStyle = overlayStyles[overlayTone] || overlayStyles.dark;

            return (
              <article
                key={project.id}
                className="surface-card group reveal overflow-hidden rounded-lg"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className={`grid lg:grid-cols-[1.06fr_0.94fr] ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <ProjectImageFrame
                    project={project}
                    frameClassName="min-h-72 overflow-hidden border-b border-slate-200 bg-slate-900 lg:border-b-0 lg:border-r"
                    imageClassName="h-full min-h-72 w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                  >
                    <div className={`absolute bottom-4 left-4 flex items-center gap-3 rounded-md border px-3 py-2 ${overlayStyle.container}`}>
                      {project.icon && (
                        <img
                          src={project.icon}
                          alt=""
                          className={`h-8 w-8 rounded p-1 object-contain ${overlayStyle.icon}`}
                        />
                      )}
                      <div>
                        <p className={`font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.16em] ${overlayStyle.label}`}>
                          Active project
                        </p>
                        <p className="text-sm font-semibold">{project.date}</p>
                      </div>
                    </div>
                  </ProjectImageFrame>

                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--coral)]">
                      Case study 0{i + 1}
                    </p>
                    <h3 className="mt-3 font-montserrat text-3xl font-extrabold leading-tight text-slate-950">
                      {project.title}
                    </h3>
                    <p className="section-copy mt-4">
                      {project.featuredDescription || project.description}
                    </p>

                    <ul className="mt-6 space-y-3">
                      {(caseStudyNotes[project.id] || []).map((note) => (
                        <li key={note} className="flex gap-3 text-sm text-slate-700">
                          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[var(--coral)]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <TechBadge key={tech} name={tech} />
                      ))}
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sharp-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold transition-transform duration-200 hover:-translate-y-0.5"
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
                        className="quiet-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold transition-colors duration-200 hover:bg-white"
                      >
                        <FaGithub />
                        GitHub
                      </a>
                    )}
                  </div>
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
