import { getCoursesByYear, getCourseColor } from "../data/courses";
import SectionIntro from "./SectionIntro";

export default function CoursesList() {
  const years = [1, 2, 3, 4, 5];

  return (
    <section id="courses" className="pb-24 pt-16">
      <div className="section-shell">
        <SectionIntro
          align="right"
          eyebrow="Full record"
          title="KTH course record."
          index="04"
          meta="Updated May 2026"
          className="mb-8"
        >
          Completed and ongoing KTH courses, grouped by study year.
        </SectionIntro>

        <div className="surface-card reveal overflow-hidden rounded-lg">
          {years.map((year) => {
            const yearCourses = getCoursesByYear(year);

            return (
              <section
                key={year}
                className="grid gap-5 border-b border-slate-200/60 p-5 last:border-b-0 sm:p-6 lg:grid-cols-[11rem_1fr]"
              >
                <div className="flex items-start justify-between gap-4 lg:block">
                  <div className="text-left">
                    <span className="block font-montserrat text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                      Study year
                    </span>
                    <span className="mt-1 block font-montserrat text-2xl font-extrabold text-slate-950">
                      Year {year}
                      {year === 5 && (
                        <span className="ml-2 align-middle text-sm font-semibold text-slate-400">
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
                    className="rounded-md border border-slate-200/70 bg-white/60 px-3 py-2 text-xs font-bold text-slate-600 transition-colors hover:border-slate-300 hover:bg-white/90 hover:text-slate-950 lg:mt-5 lg:inline-flex"
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
                        className="course-row grid grid-cols-[4.6rem_1fr] items-start gap-3 rounded-md px-2 py-2 transition-colors duration-200 hover:bg-white"
                      >
                        <span
                          className="mt-0.5 w-fit justify-self-start rounded-md border px-2 py-0.5 font-mono text-xs font-bold"
                          style={{
                            backgroundColor: `${color}12`,
                            borderColor: `${color}18`,
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
