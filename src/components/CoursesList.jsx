import { getCoursesByYear, getCourseColor } from "../data/courses";

export default function CoursesList() {
  const years = [1, 2, 3, 4, 5];

  return (
    <section id="courses" className="pb-24 pt-16">
      <div className="section-shell">
        <div className="mb-8 grid gap-6 lg:grid-cols-[0.72fr_1fr] lg:items-end">
          <div className="reveal">
            <span className="section-eyebrow">Full record</span>
            <h2 className="section-title mt-4 text-4xl sm:text-5xl">
              KTH course record.
            </h2>
          </div>
          <div className="reveal lg:justify-self-end">
            <p className="section-copy max-w-2xl">
              Completed and ongoing KTH courses, grouped by study year.
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
              Updated May 2026
            </p>
          </div>
        </div>

        <div className="surface-card reveal overflow-hidden rounded-lg">
          {years.map((year) => {
            const yearCourses = getCoursesByYear(year);
            return (
              <section
                key={year}
                className="grid gap-5 border-b border-slate-200 p-5 last:border-b-0 sm:p-6 lg:grid-cols-[11rem_1fr]"
              >
                <div className="flex items-start justify-between gap-4 lg:block">
                  <div>
                    <p className="font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Study year
                    </p>
                    <h3 className="mt-1 font-montserrat text-2xl font-extrabold text-slate-950">
                      Year {year}
                      {year === 5 && (
                        <span className="ml-2 align-middle text-sm font-semibold text-slate-400">
                          - preliminary
                        </span>
                      )}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {yearCourses.length} courses
                      {year === 5 && " - started August 2025"}
                    </p>
                  </div>
                  <a
                    href={`https://www.kth.se/student/kurser/program/CDATE/20212/arskurs${year}?l=en`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-slate-300 bg-white/70 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-500 hover:text-slate-950 lg:mt-5 lg:inline-flex"
                  >
                    View on KTH
                  </a>
                </div>

                <div className="grid gap-x-4 gap-y-1 sm:grid-cols-2">
                  {yearCourses.map((course) => {
                    const color = getCourseColor(course.code);
                    return (
                      <div
                        key={course.code}
                        className="grid grid-cols-[4.6rem_1fr] items-start gap-3 rounded-md px-2 py-2 transition-colors duration-200 hover:bg-white"
                      >
                        <span
                          className="mt-0.5 w-fit justify-self-start rounded-md border px-2 py-0.5 font-mono text-xs font-bold"
                          style={{
                            backgroundColor: `${color}12`,
                            borderColor: `${color}25`,
                            color: color,
                          }}
                        >
                          {course.code}
                        </span>
                        <span className="text-sm leading-snug text-slate-700 sm:max-w-[22rem]">
                          {course.name}
                          {course.optional && (
                            <span className="ml-1 text-xs italic text-slate-400">
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
      </div>
    </section>
  );
}
