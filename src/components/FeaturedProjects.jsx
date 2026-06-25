import { featuredProjects } from "../data/projects";
import ProjectBadges from "./ProjectBadges";
import ProjectImageFrame from "./ProjectImageFrame";
import SectionIntro from "./SectionIntro";
import { FaExternalLinkAlt, FaGithub } from "react-icons/fa";

const caseStudyNotes = {
  "master-thesis-kgqa": [
    "Turns graph-encoded configuration constraints into questions people can ask in ordinary language",
    "Evaluates whether the system can reliably tell when product configurations work together or conflict",
    "Shows a search-based approach can be a strong practical default, answering correctly in 96.4% of benchmark cases",
    "Shows direct graph querying can be slightly more accurate and easier to audit, but is slower and more expensive to run",
  ],
  snuskoll: [
    "Splits the product into a Blazor WebAssembly frontend, ASP.NET API, shared DTOs, and Dockerized services",
    "Uses Supabase for authentication and product/user data, with contract tests around authorization boundaries",
    "Supports catalog search, filters, personal ratings, favorites, wishlists, random discovery, and recent public reviews",
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
        <SectionIntro
          eyebrow="Featured work"
          title="Current work, in detail."
          index="01"
          className="mb-12"
        >
          A closer look at current work, from industrial knowledge graph
          question answering to a full-stack product. Both show how I
          approach evaluation design, data access, and maintainable
          software boundaries.
        </SectionIntro>

        <div className="space-y-8">
          {featuredProjects.map((project, i) => {
            const overlayTone = project.featuredOverlayTone || project.imageOverlayTone;
            const overlayStyle = overlayStyles[overlayTone] || overlayStyles.dark;

            return (
              <article
                key={project.id}
                className="surface-card motion-card group reveal overflow-hidden rounded-lg"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                <div className={`grid lg:grid-cols-[1.06fr_0.94fr] ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                  <ProjectImageFrame
                    project={project}
                    displayImageSrc={project.imageFull || project.image}
                    frameClassName="min-h-72 overflow-hidden border-b border-slate-200/30 bg-slate-900 lg:border-b-0"
                    imageClassName="h-full min-h-72 w-full object-cover transition duration-500 group-hover/image:scale-[1.025]"
                    imageSizes="(min-width: 1180px) 626px, (min-width: 1024px) 52vw, calc(100vw - 48px)"
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
                          Active work
                        </p>
                        <p className="text-sm font-semibold">{project.date}</p>
                      </div>
                    </div>
                  </ProjectImageFrame>

                <div className="flex flex-col justify-between p-6 sm:p-8">
                  <div>
                    <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--coral)]">
                      Work spotlight 0{i + 1}
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

                    <ProjectBadges project={project} className="mt-6" />
                  </div>

                  <div className="mt-8 flex flex-wrap gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sharp-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold"
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
                        className="quiet-button inline-flex items-center gap-2 px-5 py-2.5 font-montserrat text-sm font-bold"
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
