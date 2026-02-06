export const courses = [
  { code: "SF1671", name: "Mathematics, Basic course, with Discrete Mathematics", year: 1 },
  { code: "DA1600", name: "Writing in the Engineering Profession", year: 1 },
  { code: "DD1337", name: "Programming", year: 1 },
  { code: "SF1624", name: "Algebra and Geometry", year: 1 },
  { code: "DD1338", name: "Algorithms and Data Structures", year: 1 },
  { code: "SF1625", name: "Calculus in One Variable", year: 1 },
  { code: "DH1620", name: "Human-Computer Interaction, Introductory Course", year: 1 },
  { code: "DD1349", name: "Project in Introduction to Computer Science", year: 1 },
  { code: "DD1396", name: "Parallel and Concurrent Programming in Introduction to Computer Science", year: 1 },
  { code: "SF1547", name: "Numerical Methods, Basic Course", year: 1 },
  { code: "SF1626", name: "Calculus in Several Variables", year: 2 },
  { code: "ME1010", name: "Organization and Knowledge-Intensive Work", year: 2 },
  { code: "DD1351", name: "Logic for Computer Scientists", year: 2 },
  { code: "IS1500", name: "Computer Organization and Components", year: 2 },
  { code: "DD1368", name: "Database Technology", year: 2 },
  { code: "DD1369", name: "Software Engineering in Project Form", year: 2 },
  { code: "DD1360", name: "Programming Paradigms", year: 2 },
  { code: "SF1935", name: "Probability Theory and Statistics with Application to Machine Learning", year: 2 },
  { code: "SF1688", name: "Discrete Mathematics", year: 3 },
  { code: "DD2350", name: "Algorithms, Data Structures and Complexity", year: 3 },
  { code: "ID1200", name: "Operating Systems", year: 3 },
  { code: "AL1504", name: "Sustainable Development for Computer Science and Engineering", year: 3 },
  { code: "DA150X", name: "Degree Project in Computer Science and Engineering, First Cycle", year: 3 },
  { code: "DD1388", name: "Program System Construction Using C++", year: 3, optional: true },
  { code: "DH2642", name: "Interaction Programming and the Dynamic Web", year: 3, optional: true },
  { code: "DA2210", name: "Research Methodology for Computer Scientists", year: 4 },
  { code: "IK2218", name: "Protocols and Principles of the Internet", year: 4 },
  { code: "DD2440", name: "Advanced Algorithms", year: 4 },
  { code: "DD2395", name: "Computer Security", year: 4 },
  { code: "DD2380", name: "Artificial Intelligence", year: 4 },
  { code: "ID2216", name: "Developing Mobile Applications", year: 4 },
  { code: "DD2525", name: "Language-Based Security", year: 4 },
  { code: "DD2480", name: "Software Engineering Fundamentals", year: 4 },
  { code: "DD2459", name: "Software Reliability", year: 4 },
  { code: "DD2528", name: "Dependable Autonomous Systems", year: 5 },
  { code: "DD2497", name: "Project course in System Security", year: 5 },
  { code: "DH2643", name: "Advanced Interaction Programming", year: 5 },
  { code: "ID2221", name: "Data-Intensive Computing", year: 5 },
  { code: "DA231X", name: "Degree Project in Computer Science and Engineering (30 credits)", year: 5 },
];

const colorMap = {
  DD: "#4f46e5",
  SF: "#2563eb",
  DH: "#db2777",
  DA: "#ca8a04",
  IS: "#0d9488",
  ME: "#dc2626",
  ID: "#7c3aed",
  AL: "#16a34a",
  IK: "#0891b2",
};

export function getCourseColor(code) {
  const prefix = code.substring(0, 2);
  return colorMap[prefix] || "#64748b";
}

export function getCoursesByYear(year) {
  return courses
    .filter((c) => c.year === year)
    .sort((a, b) => a.code.localeCompare(b.code));
}
