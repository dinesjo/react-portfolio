import assert from "node:assert/strict";
import test from "node:test";
import { projectRecords } from "../src/data/projectRecords.js";
import { compareProjectRecency } from "../src/utils/projectOrdering.js";

test("orders ongoing work first, then completed work by end date, preserving ties", () => {
  const projects = [
    { id: "older-completion", timeline: { start: "2025-08", end: "2025-09" } },
    { id: "older-ongoing", timeline: { start: "2024-04", end: null } },
    { id: "newer-completion", timeline: { start: "2023-01", end: "2026-01" } },
    { id: "newer-ongoing", timeline: { start: "2025-07", end: null } },
    { id: "tied-completion", timeline: { start: "2024-01", end: "2026-01" } },
  ];

  assert.deepEqual(projects.sort(compareProjectRecency).map((project) => project.id), [
    "newer-ongoing",
    "older-ongoing",
    "newer-completion",
    "tied-completion",
    "older-completion",
  ]);
});

test("every selected project supplies a valid month-precision timeline", () => {
  const month = /^\d{4}-(0[1-9]|1[0-2])$/;
  for (const project of projectRecords.filter((item) => item.priority === 2)) {
    assert.match(project.timeline?.start ?? "", month, `${project.id}: missing start`);
    if (project.timeline.end === null) {
      assert.match(project.date, /present|ongoing/i, `${project.id}: inconsistent status`);
    } else {
      assert.match(project.timeline.end ?? "", month, `${project.id}: missing end`);
      assert.ok(project.timeline.end >= project.timeline.start, `${project.id}: inverted dates`);
    }
  }
});
