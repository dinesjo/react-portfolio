import assert from "node:assert/strict";
import test from "node:test";
import {
  assistantAnswerForAnnouncement,
  assistantAnswerForDisplay,
  nextAssistantStreamStep,
} from "../src/utils/assistantPresentation.js";

test("removes internal citation labels from the live announcement", () => {
  assert.equal(
    assistantAnswerForAnnouncement(
      "**Projects** [S6]\n\n- React\n- *Firebase* [ S11 ].",
    ),
    "Projects React Firebase.",
  );
});

test("removes internal citation labels from visible Markdown", () => {
  assert.equal(
    assistantAnswerForDisplay(
      "**AI-Diary** used React [S6]. It also used Azure [S6, S22].",
    ),
    "**AI-Diary** used React. It also used Azure.",
  );
  assert.equal(
    assistantAnswerForDisplay("Still streaming a citation [S"),
    "Still streaming a citation",
  );
  assert.equal(
    assistantAnswerForDisplay("Still streaming an opening bracket ["),
    "Still streaming an opening bracket",
  );
  assert.equal(
    assistantAnswerForDisplay("Grounded with full-width labels 【S6; S22】."),
    "Grounded with full-width labels.",
  );
});

test("reveals whole words and catches up when the stream queue grows", () => {
  assert.deepEqual(nextAssistantStreamStep("Hello there, visitor."), {
    text: "Hello ",
    delayMs: 22,
  });

  const backlog = `${"word ".repeat(300)}tail`;
  const step = nextAssistantStreamStep(backlog);
  assert.equal(step.text, "word word word word ");
  assert.equal(step.delayMs, 14);
  assert.equal(backlog.startsWith(step.text), true);
});

test("reconstructs an irregular transport chunk without losing text", () => {
  const answer =
    "A complete answer arrives in provider-sized chunks, but reads one phrase at a time.\nNext line.";
  let queue = answer;
  let displayed = "";
  let steps = 0;

  while (queue) {
    const step = nextAssistantStreamStep(queue);
    assert.ok(step.text.length > 0);
    displayed += step.text;
    queue = queue.slice(step.text.length);
    steps += 1;
    assert.ok(steps < 100);
  }

  assert.equal(displayed, answer);
  assert.ok(steps > 1);
});

test("flushes punctuation-only or whitespace-only stream fragments", () => {
  assert.equal(nextAssistantStreamStep("\n\n").text, "\n\n");
  assert.equal(nextAssistantStreamStep("—").text, "—");
});
