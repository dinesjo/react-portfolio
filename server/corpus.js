import { courses } from "../src/data/courses.js";
import { profile } from "../src/data/profile.js";
import { projectRecords } from "../src/data/projectRecords.js";

function joinList(items) {
  return items?.length ? items.join(", ") : "Not specified";
}

function projectLifecycle(project) {
  if (project.isDecommissioned) return "decommissioned";
  if (/present/i.test(project.date)) return "ongoing";
  return "completed or historical";
}

function publicProjectLinks(project) {
  return Object.entries(project.links ?? {})
    .filter(([key, value]) => (key === "live" || key === "github") && value)
    .map(([key, value]) => `${key}: ${value}`);
}

function buildProfileChunk() {
  return {
    id: "profile:linus-dinesjo",
    title: profile.name,
    type: "profile",
    href: "#home",
    keywords: [
      profile.name,
      profile.role,
      profile.location,
      "KTH",
      "computer science",
      "master's thesis",
      "contact",
      "email",
      "GitHub",
      "LinkedIn",
    ],
    text: [
      `Name: ${profile.name}.`,
      `Role: ${profile.role}.`,
      `Headline: ${profile.headline}`,
      `Public summary: ${profile.summary}`,
      `Current focus: ${profile.currentFocus}`,
      `Location: ${profile.location}.`,
      `Public contact: ${profile.contact.email}; GitHub ${profile.contact.github}; LinkedIn ${profile.contact.linkedin}.`,
    ].join("\n"),
  };
}

function buildProjectChunk(project) {
  const links = publicProjectLinks(project);
  const visibility = project.isPrivate
    ? "private project with only this public summary available"
    : "publicly described project";

  return {
    id: `project:${project.id}`,
    title: project.title,
    type: "project",
    href: `#project-${project.id}`,
    keywords: [
      project.id,
      project.title,
      project.category,
      project.context,
      ...project.technologies,
      ...project.methods,
      ...(project.isPrivate ? ["private", "professional", "work"] : []),
      ...(projectLifecycle(project) === "ongoing" ? ["current", "ongoing"] : []),
    ],
    text: [
      `Project: ${project.title}.`,
      `Context: ${project.context}. Category: ${project.category}. Dates: ${project.date}.`,
      `Lifecycle: ${projectLifecycle(project)}. Visibility: ${visibility}.`,
      `Summary: ${project.description}`,
      project.featuredDescription ? `Additional published summary: ${project.featuredDescription}` : "",
      `Technologies: ${joinList(project.technologies)}.`,
      `Methods and focus areas: ${joinList(project.methods)}.`,
      project.highlights?.length
        ? `Published highlights: ${project.highlights.join("; ")}.`
        : "",
      project.statusNote ? `Status note: ${project.statusNote}` : "",
      links.length ? `Public links: ${links.join("; ")}.` : "",
      project.isPrivate
        ? "Boundary: do not infer confidential responsibilities or implementation details beyond this published text."
        : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

function buildCourseChunk(year) {
  const yearCourses = courses.filter((course) => course.year === year);
  const courseLines = yearCourses.map((course) => {
    const details = [
      course.optional ? "elective" : "",
      course.featuredNote ? `portfolio note: ${course.featuredNote}` : "",
    ].filter(Boolean);
    return `- ${course.code}: ${course.name}${details.length ? ` (${details.join("; ")})` : ""}`;
  });

  return {
    id: `courses:year-${year}`,
    title: `KTH coursework — study year ${year}`,
    type: "course",
    href: `#courses-year-${year}`,
    keywords: [
      "KTH",
      "course",
      "courses",
      "coursework",
      "education",
      `study year ${year}`,
      ...yearCourses.flatMap((course) => [
        course.code,
        course.name,
        course.featuredNote ?? "",
      ]),
    ].filter(Boolean),
    text: [
      `KTH computer science coursework for study year ${year}.`,
      year === 5
        ? "Status: year 5 is preliminary and includes completed or ongoing courses; the portfolio does not state individual completion or grades."
        : "Status: the portfolio presents its course record as completed and ongoing; it does not state individual completion or grades.",
      ...courseLines,
    ].join("\n"),
  };
}

export const portfolioChunks = [
  buildProfileChunk(),
  ...projectRecords.map(buildProjectChunk),
  ...[1, 2, 3, 4, 5].map(buildCourseChunk),
];

export const corpusStats = {
  sourceCount: portfolioChunks.length,
  projectCount: projectRecords.length,
  courseCount: courses.length,
  lastUpdated: "May 2026",
};
