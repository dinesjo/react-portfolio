export default function Courses() {
  const courses = [
    {
      code: "SF1671",
      name: "Mathematics, Basic course, with Discrete Mathematics",
      year: 1,
    },
    { code: "DA1600", name: "Writing in the Engineering Profession", year: 1 },
    { code: "DD1337", name: "Programming", year: 1 },
    { code: "SF1624", name: "Algebra and Geometry", year: 1 },
    { code: "DD1338", name: "Algorithms and Data Structures", year: 1 },
    { code: "SF1625", name: "Calculus in One Variable", year: 1 },
    {
      code: "DH1620",
      name: "Human-Computer Interaction, Introductory Course",
      year: 1,
    },
    {
      code: "DD1349",
      name: "Project in Introduction to Computer Science",
      year: 1,
    },
    {
      code: "DD1396",
      name: "Parallel and Concurrent Programming in Introduction to Computer Science",
      year: 1,
    },
    { code: "SF1547", name: "Numerical Methods, Basic Course", year: 1 },
    { code: "SF1626", name: "Calculus in Several Variables", year: 2 },
    {
      code: "ME1010",
      name: "Organization and Knowledge-Intensive Work",
      year: 2,
    },
    { code: "DD1351", name: "Logic for Computer Scientists", year: 2 },
    { code: "IS1500", name: "Computer Organization and Components", year: 2 },
    { code: "DD1368", name: "Database Technology", year: 2 },
    { code: "DD1369", name: "Software Engineering in Project Form", year: 2 },
    { code: "DD1360", name: "Programming Paradigms", year: 2 },
    {
      code: "SF1935",
      name: "Probability Theory and Statistics with Application to Machine Learning",
      year: 2,
    },
    { code: "SF1688", name: "Discrete Mathematics", year: 3 },
    {
      code: "DD2350",
      name: "Algorithms, Data Structures and Complexity",
      year: 3,
    },
    { code: "ID1200", name: "Operating Systems", year: 3 },
    {
      code: "AL1504",
      name: "Sustainable Development for Computer Science and Engineering",
      year: 3,
    },
    {
      code: "DA150X",
      name: "Degree Project in Computer Science and Engineering, First Cycle",
      year: 3,
    },
    {
      code: "DD1388",
      name: "Program System Construction Using C++",
      year: 3,
      optional: true,
    },
    {
      code: "DH2642",
      name: "Interaction Programming and the Dynamic Web",
      year: 3,
      optional: true,
    },
    {
      code: "DA2210",
      name: "Research Methodology for Computer Scienctists",
      year: 4,
    },
    {
      code: "IK2218",
      name: "Protocols and Principles of the Internet",
      year: 4,
    },
    {
      code: "DD2440",
      name: "Advanced Algorithms",
      year: 4,
    },
    {
      code: "DD2395",
      name: "Computer Security",
      year: 4,
    },
    {
      code: "DD2380",
      name: "Artificial Intelligence",
      year: 4,
    },
    {
      code: "ID2216",
      name: "Developing Mobile Applications",
      year: 4,
    },
    {
      code: "DD2525",
      name: "Language-Based Security",
      year: 4,
    },
    {
      code: "DD2480",
      name: "Software Engineering Fundamentals",
      year: 4,
    },
    {
      code: "DD2459",
      name: "Software Reliability",
      year: 4,
    },
    {
      code: "DD2528",
      name: "Dependable Autonomous Systems",
      year: 5,
    },
    {
      code: "DD2497",
      name: "Project course in System Security",
      year: 5,
    },
    {
      code: "DH2643",
      name: "Advanced Interaction Programming",
      year: 5,
    },
    {
      code: "ID2221",
      name: "Data-Intensive Computing",
      year: 5,
    },
    {
      code: "DA231X",
      name: "Degree Project in Computer Science and Engineering (30 credits)",
      year: 5,
    },
  ];

  // Add color to each course
  courses.forEach((course) => {
    if (course.code.startsWith("DD")) {
      course.color = "text-indigo-500";
    } else if (course.code.startsWith("SF")) {
      course.color = "text-blue-500";
    } else if (course.code.startsWith("DH")) {
      course.color = "text-pink-500";
    } else if (course.code.startsWith("DA")) {
      course.color = "text-yellow-500";
    } else if (course.code.startsWith("IS")) {
      course.color = "text-teal-500";
    } else if (course.code.startsWith("ME")) {
      course.color = "text-red-500";
    } else if (course.code.startsWith("ID")) {
      course.color = "text-purple-500";
    } else if (course.code.startsWith("AL")) {
      course.color = "text-green-500";
    } else if (course.code.startsWith("IK")) {
      course.color = "text-cyan-500";
    } else {
      course.color = "text-gray-500";
    }
  });

  const sortedCourses = courses.sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="flex flex-col items-center justify-center max-w-6xl mx-auto">
      <div className="rounded-2xl mb-8 text-center max-w-4xl">
        <h4 className="h4 leading-relaxed">Here are most of the courses I have taken at KTH.</h4>
        <h5 className="h5 italic mt-2 text-slate-400">As of September 2025</h5>
      </div>

      <div className="w-full space-y-8 pb-10">
        {/* Loop years 1-5 */}
        {Array.from({ length: 5 }, (_, i) => i + 1).map((year) => (
          <div key={year} className="glass rounded-2xl p-6">
            <div className="text-center mb-6">
              <h3 className="h3 mb-2">
                Year {year} {year === 5 && <span className="text-lg">&ndash; preliminary</span>}
              </h3>
              <a
                href={`https://www.kth.se/student/kurser/program/CDATE/20212/arskurs${year}?l=en`}
                target="_blank"
                rel="noopener noreferrer"
                className="link font-semibold"
              >
                View on KTH Website
              </a>
              {year === 5 && <p className="text-slate-400 mt-2">Started August 2025</p>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {sortedCourses
                .filter((course) => {
                  return course.year === year;
                })
                .map((course) => (
                  <div key={course.code} style={{ paddingLeft: "4rem", textIndent: "-4rem" }}>
                    <samp className={`${course.color}`}>{course.code}</samp> <span className="ml-1">{course.name}</span>
                    <span className="text-gray-400 italic text-sm ml-1">{course.optional && " (optional course)"}</span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
