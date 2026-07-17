export default function SectionIntro({
  align = "left",
  eyebrow,
  title,
  titleId,
  children,
  meta,
  className = "",
  reveal = true,
}) {
  const classes = [
    "section-intro",
    align === "right" ? "section-intro--right" : "",
    reveal ? "reveal" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      data-reveal={reveal ? (align === "right" ? "right" : "left") : undefined}
    >
      <div className="section-intro__topline">
        <span className="section-eyebrow">{eyebrow}</span>
      </div>

      <h2
        id={titleId}
        className="section-title section-title__mask mt-4 text-4xl sm:text-5xl"
      >
        <span className="section-title__text">{title}</span>
      </h2>

      <p className="section-copy section-intro__copy text-base">{children}</p>

      {meta && <p className="section-intro__meta">{meta}</p>}
    </div>
  );
}
