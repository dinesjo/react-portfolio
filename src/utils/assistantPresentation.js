const INTERNAL_CITATION_GROUP =
  /\s*(?:\[|【|［)\s*S\d+(?:\s*[,;]\s*S\d+)*\s*(?:\]|】|］)/gi;
const TRAILING_PARTIAL_CITATION =
  /\s*(?:\[|【|［)\s*(?:S(?:\d+(?:\s*[,;]\s*S\d*)?)?)?\s*$/i;

export function assistantAnswerForDisplay(value) {
  return String(value ?? "")
    .replace(INTERNAL_CITATION_GROUP, "")
    .replace(TRAILING_PARTIAL_CITATION, "")
    .replace(/[ \t]+([,.;:!?])/g, "$1");
}

export function assistantAnswerForAnnouncement(value) {
  return assistantAnswerForDisplay(value)
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^\s*(?:[-+*]|\d+[.)])\s+/gm, "")
    .replace(/\*\*([^*\n]+)\*\*/g, "$1")
    .replace(/__([^_\n]+)__/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/gm, "$1$2")
    .replace(/(^|[^_])_([^_\n]+)_(?!_)/gm, "$1$2")
    .replace(/`([^`\n]+)`/g, "$1")
    .replace(/\s*\n+\s*/g, " ")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .trim();
}

export function nextAssistantStreamStep(value, { complete = true, instant = false } = {}) {
  const queue = String(value ?? "");
  if (!queue) return { text: "", delayMs: 0 };

  const wordsPerStep = instant ? Infinity : queue.length > 1_200 ? 5 : queue.length > 480 ? 3 : 1;
  let offset = 0;

  for (let index = 0; index < wordsPerStep && offset < queue.length; index += 1) {
    const match = queue.slice(offset).match(/^\s*\S+(?:\s+|$)/u);
    if (!match) break;
    // Wait for the boundary of a transport chunk's unfinished word. The next
    // delta or final event resumes the queue; no polling timer is needed.
    if (!complete && !/\s$/u.test(match[0])) break;
    offset += match[0].length;
  }

  if (offset === 0 && /^\s+$/u.test(queue)) offset = queue.length;
  if (offset === 0) return { text: "", delayMs: 0 };

  const text = queue.slice(0, offset);
  let delayMs = instant ? 0 : queue.length > 1_200 ? 14 : queue.length > 480 ? 18 : 26;
  if (!instant && queue.length <= 480) {
    if (/\n\s*\n$/u.test(text)) delayMs += 28;
    else if (/[.!?][\u201d\u2019"')]*\s*$/u.test(text)) delayMs += 18;
    else if (/[,;:]\s*$/u.test(text)) delayMs += 8;
  }
  return { text, delayMs };
}
