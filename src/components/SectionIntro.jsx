export default function SectionIntro({
  align = "left",
  eyebrow,
  title,
  children,
  index,
  meta,
  className = "",
}) {
  const classes = [
    "section-intro",
    align === "right" ? "section-intro--right" : "",
    "reveal",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes}>
      <div className="section-intro__topline">
        {index && (
          <span className="section-intro__index" aria-hidden="true">
            {index}
          </span>
        )}
        <span className="section-eyebrow">{eyebrow}</span>
      </div>

      <h2 className="section-title mt-4 text-4xl sm:text-5xl">{title}</h2>

      <p className="section-copy section-intro__copy text-base">{children}</p>

      {meta && <p className="section-intro__meta">{meta}</p>}
    </div>
  );
}
