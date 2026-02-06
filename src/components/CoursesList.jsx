import { getCoursesByYear, getCourseColor } from "../data/courses";

export default function CoursesList() {
  const years = [1, 2, 3, 4, 5];

  return (
    <section id="courses" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-iceland text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 text-center mb-4 reveal">
          All Courses
        </h2>
        <p className="text-center text-slate-500 dark:text-slate-400 font-inter mb-4 reveal">
          Complete list of courses taken at KTH Stockholm.
        </p>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 font-inter italic mb-16 reveal">
          As of September 2025
        </p>

        <div className="space-y-8">
          {years.map((year) => {
            const yearCourses = getCoursesByYear(year);
            return (
              <div
                key={year}
                className="glass-card rounded-2xl p-6 sm:p-8 reveal"
              >
                {/* Year header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-montserrat text-xl font-bold text-slate-700 dark:text-slate-200">
                      Year {year}
                      {year === 5 && (
                        <span className="text-sm font-normal text-slate-400 dark:text-slate-500 ml-2">
                          &ndash; preliminary
                        </span>
                      )}
                    </h3>
                    {year === 5 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-inter">
                        Started August 2025
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://www.kth.se/student/kurser/program/CDATE/20212/arskurs${year}?l=en`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-inter font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:underline transition-colors"
                  >
                    View on KTH
                  </a>
                </div>

                {/* Course grid */}
                <div className="grid sm:grid-cols-2 gap-3">
                  {yearCourses.map((course) => {
                    const color = getCourseColor(course.code);
                    return (
                      <div
                        key={course.code}
                        className="flex items-start gap-3 py-2 px-3 rounded-xl hover:bg-white/40 dark:hover:bg-white/5 transition-colors duration-200"
                      >
                        <span
                          className="text-xs font-bold font-mono px-2 py-0.5 rounded-md mt-0.5 flex-shrink-0"
                          style={{
                            backgroundColor: `${color}12`,
                            color: color,
                          }}
                        >
                          {course.code}
                        </span>
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-inter leading-snug">
                          {course.name}
                          {course.optional && (
                            <span className="text-slate-400 dark:text-slate-500 italic text-xs ml-1">
                              (elective)
                            </span>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
