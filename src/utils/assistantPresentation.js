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

export function nextAssistantStreamStep(value) {
  const queue = String(value ?? "");
  if (!queue) return { text: "", delayMs: 0 };

  const wordsPerStep = queue.length > 1_200 ? 4 : queue.length > 600 ? 2 : 1;
  let offset = 0;

  for (let index = 0; index < wordsPerStep && offset < queue.length; index += 1) {
    const match = queue.slice(offset).match(/^\s*\S+\s*/u);
    if (!match) break;
    offset += match[0].length;
  }

  if (offset === 0) offset = queue.length;

  return {
    text: queue.slice(0, offset),
    delayMs: queue.length > 1_200 ? 14 : queue.length > 600 ? 18 : 22,
  };
}
