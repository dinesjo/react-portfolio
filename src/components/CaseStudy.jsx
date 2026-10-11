import { FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaGithub } from "react-icons/fa";
import ProjectImageFrame from "./ProjectImageFrame";
import ProjectBadges from "./ProjectBadges";

export default function CaseStudy({ project, nextProject }) {
  const study = project.caseStudy;
  return (
    <article className="case-detail section-shell" aria-labelledby="detail-title">
      <a href={`#project-${project.id}`} className="detail-back"><FaArrowLeft aria-hidden="true" /> Back to projects</a>
      <header className="case-detail__header">
        <p className="section-eyebrow">{project.context} · {project.category}</p>
        <h1 id="detail-title" tabIndex={-1} className="section-title">{project.title}</h1>
        <p className="case-detail__subtitle">{study.subtitle}</p>
        <dl className="case-detail__facts"><div><dt>My role</dt><dd>{study.role}</dd></div><div><dt>Period</dt><dd>{project.date}</dd></div></dl>
      </header>
      {study.result && <div className="case-result case-result--detail"><strong>{study.result.value}</strong><div><p>{study.result.label}</p><span>{study.result.context}</span></div></div>}
      <div className="case-detail__layout">
        <div className="case-detail__body">
          {study.sections.map((section) => <section key={section.title} className="case-detail__section">
            <h2>{section.title}</h2>
            {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.points && <ul>{section.points.map((point) => <li key={point}>{point}</li>)}</ul>}
            {section.comparison && (
              <table className="benchmark-table">
                <caption>{section.comparisonCaption}</caption>
                <thead>
                  <tr>
                    <th scope="col">Approach</th>
                    <th scope="col">Verdict accuracy</th>
                    <th scope="col">Median response time</th>
                  </tr>
                </thead>
                <tbody>
                  {section.comparison.map((row) => (
                    <tr key={row.approach}>
                      <th scope="row">{row.approach}</th>
                      <td>{row.accuracy}</td>
                      <td>{row.medianLatency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {section.architecture && <ol className="architecture-flow" aria-label="Application architecture"><li><strong>Blazor WebAssembly</strong><span>Browser interface</span></li><li><strong>ASP.NET API</strong><span>Shared DTO contracts</span></li><li><strong>Supabase</strong><span>Authentication and data</span></li></ol>}
          </section>)}
        </div>
        <aside className="case-detail__aside"><ProjectBadges project={project} />
          <div className="detail-external-links">
            {project.links.live && <a className="quiet-button" href={project.links.live} target="_blank" rel="noopener noreferrer"><FaExternalLinkAlt aria-hidden="true" /> {project.links.liveText || "Try the app"}</a>}
            {project.links.github && <a className="quiet-button" href={project.links.github} target="_blank" rel="noopener noreferrer"><FaGithub aria-hidden="true" /> View source</a>}
          </div>
        </aside>
      </div>
      <figure className="case-detail__figure"><ProjectImageFrame project={project} displayImageSrc={project.imageFull} frameClassName="detail-image-frame" imageClassName="w-full h-full object-contain" imageSizes="(min-width: 1180px) 1100px, calc(100vw - 48px)" /><figcaption>{study.imageCaption}</figcaption></figure>
      <footer className="case-detail__footer"><a href="#featured" className="detail-back"><FaArrowLeft aria-hidden="true" /> All projects</a>{nextProject && <a href={`#/work/${nextProject.id}`} className="detail-next"><span>Next case study<strong>{nextProject.title}</strong></span><FaArrowRight aria-hidden="true" /></a>}</footer>
    </article>
  );
}
