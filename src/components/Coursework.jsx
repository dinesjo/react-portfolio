import { courseRelatedWork, featuredCourses, getCoursesByYear, studyYears } from "../data/courses";
import { profile } from "../data/profile";
import SectionIntro from "./SectionIntro";
import { focusSection } from "../utils/portfolioNavigation";

export default function Coursework() {
  const totalCourses = studyYears.reduce(
    (total, year) => total + getCoursesByYear(year).length,
    0,
  );

  return (
    <section
      id="courses-carousel"
      tabIndex={-1}
      aria-labelledby="coursework-title"
      className="py-20"
    >
      <div className="section-shell">
        <SectionIntro
          eyebrow="Education"
          title="Education at KTH."
          titleId="coursework-title"
          className="mb-10"
        >
          I graduated from KTH in {profile.education.graduation.toLowerCase()}.
          These are highlights from my completed computer science coursework,
          with related projects to explore. All {totalCourses} courses in the
          record below are completed.
        </SectionIntro>

        <div className="content-collection coursework-collection">
          <section
            className="collection-group"
            aria-labelledby="highlighted-coursework-title"
          >
            <h3 id="highlighted-coursework-title" className="sr-only">Highlighted coursework</h3>

            <div className="course-grid reveal-grid grid gap-3">
              {featuredCourses.map((course) => (
                <article
                  key={course.code}
                  className="surface-card course-card reveal p-5"
                  data-reveal="trace"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="course-card-code border px-2.5 py-1 font-iceland text-base font-bold">
                      {course.code}
                    </span>
                    <span className="course-card-meta">Year {course.year}</span>
                  </div>
                  <h4 className="mt-4 font-montserrat text-lg font-extrabold leading-tight text-slate-950">
                    {course.name}
                  </h4>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {course.featuredNote}
                  </p>
                  {(courseRelatedWork[course.code] ?? []).map((related) => (
                    <div key={related.id} className="course-related">
                      <p>{related.note}</p>
                      <a href={`#project-${related.id}`} onClick={focusSection}>
                        Related work: {related.title} <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section
            id="courses"
            tabIndex={-1}
            className="collection-group"
            aria-labelledby="course-record-title"
          >
            <header className="collection-group-header collection-group-header--plain reveal" data-reveal="trace">
              <div>
                <div className="collection-group-title-row">
                  <h3 id="course-record-title" className="collection-group-title">
                    Complete course record
                  </h3>
                  <span className="collection-group-count">Graduated {profile.education.graduation.toLowerCase()}</span>
                </div>
              </div>
            </header>

            <details className="course-record reveal" data-reveal="trace">
              <summary className="course-record__summary">
                <span className="course-record__lead">
                  <span className="course-record__lead-title">
                    Browse all {totalCourses} courses
                  </span>
                  <span className="course-record__lead-count">
                    {totalCourses} completed courses · {studyYears.length} study years
                  </span>
                </span>
                <span className="course-record__action">
                  <span className="disclosure-action__closed">Open record</span>
                  <span className="disclosure-action__open">Close record</span>
                </span>
              </summary>

              <div className="course-record__body">
                {studyYears.map((year) => {
                  const yearCourses = getCoursesByYear(year);

                  return (
                    <section
                      key={year}
                      id={`courses-year-${year}`}
                      tabIndex={-1}
                      aria-labelledby={`courses-year-${year}-title`}
                      className="course-record__year grid gap-5 border-b border-slate-200/60 p-5 last:border-b-0 sm:p-6 lg:grid-cols-[11rem_1fr] lg:gap-6"
                    >
                      <div className="course-record__year-meta flex items-start justify-between gap-4 lg:block">
                        <div className="text-left">
                          <span className="block font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-600">
                            Study year
                          </span>
                          <h4
                            id={`courses-year-${year}-title`}
                            className="mt-1 block font-montserrat text-2xl font-extrabold text-slate-950"
                          >
                            Year {year}
                          </h4>
                          <span className="mt-1 block text-sm text-slate-600">
                            {yearCourses.length} completed courses
                          </span>
                        </div>
                        <a
                          href={`https://www.kth.se/student/kurser/program/CDATE/20212/arskurs${year}?l=en`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="quiet-button inline-flex px-3 py-2 text-xs font-bold lg:mt-5"
                        >
                          View on KTH
                        </a>
                      </div>

                      <div className="course-record__courses grid gap-x-4 gap-y-1">
                        {yearCourses.map((course) => (
                          <div
                            key={course.code}
                            className="course-row grid grid-cols-[4.6rem_minmax(0,1fr)] items-start gap-3 px-2 py-2"
                          >
                            <span className="course-code mt-0.5 w-fit justify-self-start border px-2 py-0.5 font-iceland text-sm font-bold">
                              {course.code}
                            </span>
                            <span className="text-sm leading-snug text-slate-700 sm:max-w-88">
                              {course.name}
                              {course.optional && (
                                <span className="ml-1 text-xs italic text-slate-600">
                                  (elective)
                                </span>
                              )}
                              {(courseRelatedWork[course.code] ?? []).map((related) => (
                                <a
                                  key={related.id}
                                  href={`#project-${related.id}`}
                                  onClick={focusSection}
                                  className="mt-2 block text-xs font-bold underline decoration-slate-300 underline-offset-4 hover:text-slate-950 focus-visible:outline focus-visible:outline-offset-4"
                                >
                                  Related work: {related.title} <span aria-hidden="true">→</span>
                                </a>
                              ))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </details>
          </section>
        </div>
      </div>
    </section>
  );
}
