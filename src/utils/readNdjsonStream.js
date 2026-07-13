const NDJSON_CONTENT_TYPE = "application/x-ndjson";
const MAX_NDJSON_LINE_CHARACTERS = 64_000;

export function isNdjsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().includes(NDJSON_CONTENT_TYPE);
}

export async function readNdjsonStream(response, onEvent) {
  if (!response.body) {
    throw new Error("The assistant response could not be streamed.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const dispatchLine = (line) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    if (trimmed.length > MAX_NDJSON_LINE_CHARACTERS) {
      throw new Error("The assistant returned an invalid stream event.");
    }

    let event;
    try {
      event = JSON.parse(trimmed);
    } catch {
      throw new Error("The assistant returned an invalid stream event.");
    }

    if (!event || typeof event !== "object" || Array.isArray(event)) {
      throw new Error("The assistant returned an invalid stream event.");
    }

    onEvent(event);
  };

  try {
    let streamDone = false;
    while (!streamDone) {
      const { done, value } = await reader.read();
      streamDone = done;
      if (streamDone) continue;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      if (buffer.length > MAX_NDJSON_LINE_CHARACTERS) {
        throw new Error("The assistant returned an invalid stream event.");
      }
      lines.forEach(dispatchLine);
    }

    buffer += decoder.decode();
    if (buffer.trim()) dispatchLine(buffer);
  } finally {
    reader.releaseLock();
  }
}
