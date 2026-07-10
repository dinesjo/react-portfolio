import { getCoursesByYear } from "../data/courses";
import SectionIntro from "./SectionIntro";

export default function CoursesList() {
  const years = [1, 2, 3, 4, 5];
  const totalCourses = years.reduce(
    (total, year) => total + getCoursesByYear(year).length,
    0,
  );

  return (
    <section id="courses" className="pb-24 pt-16">
      <div className="section-shell">
        <SectionIntro
          align="right"
          eyebrow="Course list"
          title="My KTH courses."
          meta="Updated May 2026"
          className="mb-8"
        >
          My completed and ongoing courses, grouped by study year.
        </SectionIntro>

        <details className="course-record reveal">
          <summary className="course-record__summary">
            <span className="course-record__lead">
              <span className="course-record__lead-title">Course record</span>
              <span className="course-record__lead-count">
                {totalCourses} courses across {years.length} study years
              </span>
            </span>
            <span className="course-record__action">
              <span className="disclosure-action__closed">Show all courses</span>
              <span className="disclosure-action__open">Hide all courses</span>
            </span>
          </summary>

          <div className="course-record__body">
            {years.map((year) => {
              const yearCourses = getCoursesByYear(year);

              return (
                <section
                  key={year}
                  className="course-record__year grid gap-5 border-b border-slate-200/60 p-5 last:border-b-0 sm:p-6 lg:grid-cols-[11rem_1fr] lg:gap-6"
                >
                  <div className="course-record__year-meta flex items-start justify-between gap-4 lg:block">
                    <div className="text-left">
                      <span className="block font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-500">
                        Study year
                      </span>
                      <span className="mt-1 block font-montserrat text-2xl font-extrabold text-slate-950">
                        Year {year}
                        {year === 5 && (
                          <span className="ml-2 align-middle text-sm font-semibold text-slate-500">
                            - preliminary
                          </span>
                        )}
                      </span>
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
                    {yearCourses.map((course) => {
                      return (
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
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        </details>
      </div>
    </section>
  );
}
