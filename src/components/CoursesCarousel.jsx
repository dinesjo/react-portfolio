import { courses } from "../data/courses";
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
              eyebrow="KTH coursework"
              title="Courses I&rsquo;ve found useful."
              className="mb-8"
            >
              A few courses that connect directly to the projects and topics
              above.
            </SectionIntro>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((course) => {
              return (
                <article
                  key={course.code}
                  className="surface-card course-card reveal p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="course-card-code border px-2.5 py-1 font-iceland text-base font-bold">
                      {course.code}
                    </span>
                    <span className="course-card-meta">Year {course.year}</span>
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
