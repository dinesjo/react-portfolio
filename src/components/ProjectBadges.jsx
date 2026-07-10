import TechBadge from "./TechBadge";

function MethodBadge({ name }) {
  return (
    <span className="method-badge inline-flex items-center border px-2.5 py-1 font-montserrat text-[0.66rem] font-bold uppercase tracking-[0.08em]">
      {name}
    </span>
  );
}

export default function ProjectBadges({ project, className = "" }) {
  const stack = project.technologies || [];
  const methods = project.methods || [];

  if (stack.length === 0 && methods.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {stack.length > 0 && (
        <div>
          <p className="mb-1.5 font-montserrat text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Stack
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stack.map((tech) => (
              <TechBadge key={tech} name={tech} />
            ))}
          </div>
        </div>
      )}

      {methods.length > 0 && (
        <div>
          <p className="mb-1.5 font-montserrat text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-slate-500">
            Focus
          </p>
          <div className="flex flex-wrap gap-1.5">
            {methods.map((method) => (
              <MethodBadge key={method} name={method} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
