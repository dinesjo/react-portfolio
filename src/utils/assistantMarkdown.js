import { assistantAnswerForDisplay } from "./assistantPresentation.js";

function completeInlineEmphasis(line) {
  if (/^\s*(?:[-+*]|\d+[.)])\s*$/u.test(line)) return "";
  const open = [];
  let output = "";
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === "\\") {
      output += line.slice(index, index + 2);
      index += 1;
      continue;
    }
    if (character !== "*" && character !== "_") {
      output += character;
      continue;
    }
    const marker = line.slice(index).match(character === "*" ? /^\*+/u : /^_+/u)[0];
    const before = line[index - 1] ?? " ";
    const after = line[index + marker.length] ?? " ";
    if (character === "_" && /[\p{L}\p{N}]/u.test(before) && /[\p{L}\p{N}]/u.test(after)) {
      output += marker;
    } else {
      let remaining = marker.length;
      while (/\S/u.test(before) && open.at(-1)?.startsWith(character) && open.at(-1).length <= remaining) {
        const closing = open.pop();
        output += closing;
        remaining -= closing.length;
      }
      if (/\S/u.test(after)) {
        while (remaining > 0) {
          const opening = character.repeat(Math.min(2, remaining));
          open.push(opening);
          output += opening;
          remaining -= opening.length;
        }
      } else if (line.slice(index + marker.length).trim()) {
        output += character.repeat(remaining);
      }
    }
    index += marker.length - 1;
  }
  const trailingSpace = output.match(/\s*$/u)[0];
  return output.slice(0, output.length - trailingSpace.length) + open.reverse().join("") + trailingSpace;
}

// Display projection only: the answer and chat history retain the exact text.
// Complete an unfinished bold/emphasis run so formatting doesn't flash on/off.
export function assistantStreamingMarkdown(value) {
  return assistantAnswerForDisplay(value).split("\n").map(completeInlineEmphasis).join("\n");
}

const INLINE_TEXT_PARENTS = new Set(["p", "li", "strong", "em"]);

// Inline spans fade on mount. Stable parent components and word positions let
// earlier text keep its DOM nodes, animation state, and selection.
export function rehypeAssistantWords() {
  return (tree) => {
    let lastWord;
    const visit = (parent) => {
      if (!parent.children) return;
      parent.children = parent.children.flatMap((child) => {
        if (child.type !== "text" || !INLINE_TEXT_PARENTS.has(parent.tagName)) {
          visit(child);
          return [child];
        }
        return Array.from(child.value.matchAll(/\s+|\S+/gu), ([value]) => {
          if (/^\s/u.test(value)) return { type: "text", value };
          const word = {
            type: "element", tagName: "span",
            properties: { className: ["assistant-word"] },
            children: [{ type: "text", value }],
          };
          lastWord = word;
          return word;
        });
      });
    };
    visit(tree);
    if (lastWord) lastWord.properties.className.push("assistant-word-tail");
  };
}
