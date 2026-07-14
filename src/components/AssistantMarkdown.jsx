import ReactMarkdown from "react-markdown";
import { assistantAnswerForDisplay } from "../utils/assistantPresentation";

const ALLOWED_ELEMENTS = ["p", "strong", "em", "ol", "ul", "li", "br"];

export default function AssistantMarkdown({ content }) {
  return (
    <div className="assistant-message-content">
      <ReactMarkdown
        allowedElements={ALLOWED_ELEMENTS}
        unwrapDisallowed
        skipHtml
        components={{
          p: ({ children }) => <p>{children}</p>,
          ol: ({ children }) => (
            <ol className="assistant-answer-list">{children}</ol>
          ),
          ul: ({ children }) => (
            <ul className="assistant-answer-list assistant-answer-list-unordered">
              {children}
            </ul>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => <strong>{children}</strong>,
          em: ({ children }) => <em>{children}</em>,
        }}
      >
        {assistantAnswerForDisplay(content)}
      </ReactMarkdown>
    </div>
  );
}
