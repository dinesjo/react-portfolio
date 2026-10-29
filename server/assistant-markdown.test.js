import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { assistantStreamingMarkdown, rehypeAssistantWords } from "../src/utils/assistantMarkdown.js";

const render = (content) => renderToStaticMarkup(createElement(ReactMarkdown, {
  skipHtml: true, rehypePlugins: [rehypeAssistantWords],
}, content));

test("renders incomplete emphasis without flashing raw formatting markers", () => {
  for (const content of ["**Industrial Knowledge", "**Industrial Knowledge ", "**Industrial Knowledge*", "**Industrial Knowledge**"]) {
    const html = render(assistantStreamingMarkdown(content));
    assert.ok(html.includes("<strong>"), html);
    assert.ok(!html.includes("*"), html);
    assert.match(html, /Knowledge<\/span><\/strong>/u);
  }
  assert.equal(assistantStreamingMarkdown("An *unfinished phrase "), "An *unfinished phrase* ");
  assert.equal(assistantStreamingMarkdown("***Bold and italic***"), "***Bold and italic***");
  assert.equal(assistantStreamingMarkdown("**Bold *and italic***"), "**Bold *and italic***");
});

test("keeps completed formatting, escaped markers, and identifier underscores intact", () => {
  for (const content of ["**A complete name** is clear.", "This is *emphasis*.", "__Another name__", "source_record_id", "A \\*literal\\* marker", "2 * 3 is 6."]) {
    assert.equal(assistantStreamingMarkdown(content), content);
  }
  assert.equal(assistantStreamingMarkdown("First paragraph.\n\n- "), "First paragraph.\n\n");
  assert.equal(assistantStreamingMarkdown("First paragraph.\n\n2. "), "First paragraph.\n\n");
  assert.equal(assistantStreamingMarkdown("**Research** [S6]"), "**Research**");
});

test("word spans preserve paragraph/list semantics, whitespace, and safe text", () => {
  const html = render("A **bold name** here.\n\n- First item\n- Second item\n\n<script>bad()</script>");
  assert.match(html, /^<p>/u);
  assert.ok(html.includes("<ul>"));
  assert.equal((html.match(/<li>/gu) || []).length, 2);
  assert.equal((html.match(/assistant-word-tail/gu) || []).length, 1);
  assert.ok(html.includes('assistant-word assistant-word-tail">item</span>'));
  assert.ok(!html.includes("script"));
  assert.equal(html.replace(/<[^>]+>/gu, "").replace(/\s+/gu, " ").trim(), "A bold name here. First item Second item");
});
