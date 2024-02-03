import { TabTitle } from "./utils/GeneralFunctions";
import { FaBook } from "react-icons/fa";

export default function Courses() {
  TabTitle("Courses");

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
    },
    {
      code: "DH2642",
      name: "Interaction Programming and the Dynamic Web",
      year: 3,
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
    } else {
      course.color = "text-gray-500";
    }
  });

  const sortedCourses = courses.sort((a, b) => a.code.localeCompare(b.code));

  return (
    <div className="flex flex-col items-center justify-center w-11/12 mx-auto">
      <h1 className="h1 flex items-end mb-3">
        <FaBook className="inline-block me-5" /> Courses
      </h1>
      <h4 className="h4">Here are most of the courses I have taken at KTH.</h4>
      <h5 className="h5 italic mt-1 text-gray-400">As of 2024-02-01</h5>

      <div>
        {/* Loop year 1-3 */}
        {Array.from({ length: 3 }, (_, i) => i + 1).map((year) => (
          <div key={year}>
            <div className="text-center">
              <h3 className="h3 mt-3 w-100">Year {year}</h3>
              <a
                href={`https://www.kth.se/student/kurser/program/CDATE/20212/arskurs${year}?l=en`}
                target="_blank"
                rel="noopener noreferrer"
                className="link"
              >
                Link to KTH
              </a>
            </div>
            <ul className="mt-2 space-y-2">
              {sortedCourses
                .filter((course) => {
                  return course.year === year;
                })
                .map((course) => (
                  <li
                    key={course.code}
                    style={{ paddingLeft: "4rem", textIndent: "-4rem" }}
                  >
                    <samp className={`${course.color}`}>{course.code}</samp>{" "}
                    <span className="ml-2">{course.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        ))}
        <div>
          <div className="text-center">
            <h3 className="h3 mt-3 w-100">Year 4</h3>
            <p className="text-gray-400">Starts August 2024</p>
          </div>
        </div>
        <div>
          <div className="text-center">
            <h3 className="h3 mt-3 w-100">Year 5</h3>
            <p className="text-gray-400">Starts August 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
