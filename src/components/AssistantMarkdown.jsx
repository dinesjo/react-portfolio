import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { assistantAnswerForDisplay } from "../utils/assistantPresentation";
import { assistantStreamingMarkdown, rehypeAssistantWords } from "../utils/assistantMarkdown";

const ALLOWED_ELEMENTS = ["p", "strong", "em", "ol", "ul", "li", "br", "span"];
const REHYPE_PLUGINS = [rehypeAssistantWords];
const markdownComponents = {
  ol: ({ children }) => <ol className="assistant-answer-list">{children}</ol>,
  ul: ({ children }) => <ul className="assistant-answer-list assistant-answer-list-unordered">{children}</ul>,
};

const AssistantMarkdown = memo(function AssistantMarkdown({ content, streaming = false }) {
  return (
    <div className="assistant-message-content">
      <ReactMarkdown
        allowedElements={ALLOWED_ELEMENTS}
        unwrapDisallowed
        skipHtml
        components={markdownComponents}
        rehypePlugins={REHYPE_PLUGINS}
      >
        {streaming ? assistantStreamingMarkdown(content) : assistantAnswerForDisplay(content)}
      </ReactMarkdown>
    </div>
  );
});

export default AssistantMarkdown;
