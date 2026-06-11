import { courses, getCourseColor } from "../data/courses";
import SectionIntro from "./SectionIntro";

const selectedCodes = ["DD2480", "DD2395", "DD2525", "DD2380", "DD2350", "DH2642"];

const selectedNotes = {
  DD2480: "Engineering process, testing, delivery",
  DD2395: "Systems security and threat modeling",
  DD2525: "Language security and program analysis",
  DD2380: "Search, planning, and evaluation methods",
  DD2350: "Algorithms and complexity fundamentals",
  DH2642: "Modern web interaction patterns",
};

const featured = selectedCodes
  .map((code) => courses.find((course) => course.code === code))
  .filter(Boolean);

export default function CoursesCarousel() {
  return (
    <section id="courses-carousel" className="py-20">
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionIntro
              eyebrow="Coursework"
              title="Courses behind the work."
              index="03"
              className="mb-8"
            >
              These courses map directly to the systems, security, web, and
              algorithm work shown above.
            </SectionIntro>
            <div className="reveal grid grid-cols-2 overflow-hidden rounded-lg border border-slate-300 bg-white">
              {[
                ["5", "study years"],
                [String(courses.length), "courses"],
              ].map(([value, label]) => (
                <div key={label} className="border-r border-slate-200 p-4 last:border-r-0">
                  <p className="font-montserrat text-2xl font-extrabold text-slate-950">
                    {value}
                  </p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((course, index) => {
              const color = getCourseColor(course.code);
              return (
                <article
                  key={course.code}
                  className="surface-card motion-card course-card reveal rounded-lg p-5"
                  style={{
                    transitionDelay: `${index * 0.07}s`,
                    "--course-color": color,
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className="course-card-code rounded-md border px-2.5 py-1 font-mono text-sm font-bold"
                      style={{
                        backgroundColor: `${color}10`,
                        borderColor: `${color}30`,
                        color,
                      }}
                    >
                      {course.code}
                    </span>
                    <span className="font-montserrat text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                      Year {course.year}
                    </span>
                  </div>
                  <h3 className="mt-4 font-montserrat text-lg font-extrabold leading-tight text-slate-950">
                    {course.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    {selectedNotes[course.code]}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
