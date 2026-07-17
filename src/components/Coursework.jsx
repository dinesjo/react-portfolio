import { featuredCourses, getCoursesByYear } from "../data/courses";
import SectionIntro from "./SectionIntro";

const studyYears = [1, 2, 3, 4, 5];

export default function Coursework() {
  const totalCourses = studyYears.reduce(
    (total, year) => total + getCoursesByYear(year).length,
    0,
  );

  return (
    <section
      id="courses-carousel"
      aria-labelledby="coursework-title"
      className="py-20"
    >
      <div className="section-shell">
        <SectionIntro
          eyebrow="Study"
          title="Coursework at KTH."
          titleId="coursework-title"
          className="mb-10"
        >
          Six highlighted courses and the complete study record they come
          from, kept together as one view of my academic foundation.
        </SectionIntro>

        <div className="content-collection coursework-collection">
          <div className="collection-overview reveal" data-reveal="right">
            <div>
              <p className="collection-overview__label">Coursework collection</p>
              <p className="collection-overview__context">
                KTH Computer Science, grouped by study year
              </p>
            </div>
            <div className="collection-overview__stats" aria-label="Coursework summary">
              <span>{featuredCourses.length} highlighted</span>
              <span>{totalCourses} courses</span>
            </div>
          </div>

          <section
            className="collection-group"
            aria-labelledby="highlighted-coursework-title"
          >
            <header className="collection-group-header reveal" data-reveal="left">
              <span className="collection-group-index" aria-hidden="true">
                01
              </span>
              <div>
                <div className="collection-group-title-row">
                  <h3
                    id="highlighted-coursework-title"
                    className="collection-group-title"
                  >
                    Highlighted coursework
                  </h3>
                  <span className="collection-group-count">
                    {featuredCourses.length} courses
                  </span>
                </div>
                <p className="collection-group-copy">
                  A short selection with the clearest connection to the projects
                  and engineering topics above.
                </p>
              </div>
            </header>

            <div className="reveal-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {featuredCourses.map((course) => (
                <article
                  key={course.code}
                  className="surface-card course-card reveal p-5"
                  data-reveal="lift"
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
                </article>
              ))}
            </div>
          </section>

          <section
            id="courses"
            className="collection-group"
            aria-labelledby="course-record-title"
          >
            <header className="collection-group-header reveal" data-reveal="left">
              <span className="collection-group-index" aria-hidden="true">
                02
              </span>
              <div>
                <div className="collection-group-title-row">
                  <h3 id="course-record-title" className="collection-group-title">
                    Complete course record
                  </h3>
                  <span className="collection-group-count">Updated May 2026</span>
                </div>
                <p className="collection-group-copy">
                  All completed and ongoing courses, grouped by study year.
                </p>
              </div>
            </header>

            <details className="course-record reveal" data-reveal="lift">
              <summary className="course-record__summary">
                <span className="course-record__lead">
                  <span className="course-record__lead-title">
                    Browse all {totalCourses} courses
                  </span>
                  <span className="course-record__lead-count">
                    Across {studyYears.length} study years
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
                          <span className="block font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                            Study year
                          </span>
                          <h4
                            id={`courses-year-${year}-title`}
                            className="mt-1 block font-montserrat text-2xl font-extrabold text-slate-950"
                          >
                            Year {year}
                            {year === 5 && (
                              <span className="ml-2 align-middle text-sm font-semibold text-slate-500">
                                - preliminary
                              </span>
                            )}
                          </h4>
                          <span className="mt-1 block text-sm text-slate-500">
                            {yearCourses.length} courses
                            {year === 5 && " - started August 2025"}
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

                      <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                        {yearCourses.map((course) => (
                          <div
                            key={course.code}
                            className="course-row grid grid-cols-[4.6rem_1fr] items-start gap-3 px-2 py-2"
                          >
                            <span className="course-code mt-0.5 w-fit justify-self-start border px-2 py-0.5 font-iceland text-sm font-bold">
                              {course.code}
                            </span>
                            <span className="text-sm leading-snug text-slate-700 sm:max-w-[22rem]">
                              {course.name}
                              {course.optional && (
                                <span className="ml-1 text-xs italic text-slate-500">
                                  (elective)
                                </span>
                              )}
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
