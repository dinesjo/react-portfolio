export default function ProjectBadges({ project, className = "", showMethods = true }) {
  const stack = project.technologies || [];
  const methods = project.methods || [];

  if (stack.length === 0 && methods.length === 0) return null;

  return (
    <dl className={`project-metadata ${className}`}>
      {stack.length > 0 && (
        <div>
          <dt>Built with</dt>
          <dd>{stack.join(" · ")}</dd>
        </div>
      )}

      {showMethods && methods.length > 0 && (
        <div>
          <dt>Focus</dt>
          <dd>{methods.join(" · ")}</dd>
        </div>
      )}
    </dl>
  );
}
