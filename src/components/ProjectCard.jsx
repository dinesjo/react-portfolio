import {
  FaBootstrap,
  FaCalendarDay,
  FaCss3Alt,
  FaGithub,
  FaHtml5,
  FaJsSquare,
  FaLink,
  FaPython,
  FaReact,
  FaTwitter,
  FaUnity,
} from "react-icons/fa";
import aspnetImg from "../assets/aspnet.png";
import blazorImg from "../assets/blazor.png";
import cppImg from "../assets/c++.png";
import chatgptImg from "../assets/ChatGPT.png";
import csharpImg from "../assets/csharp.png";
import firebaseImg from "../assets/firebase.png";
import mui from "../assets/mui.png";
import sqlImg from "../assets/sql.png";
import tailwindImg from "../assets/tailwind.png";
import typescriptImg from "../assets/typescript.png";
import wxwidgetsImg from "../assets/wxwidgets.png";

const COLOR_MAP = {
  "c++": "teal",
  wxwidgets: "lime",
  "c#": "green",
  javascript: "indigo",
  sql: "sky",
  "asp.net": "purple",
  html: "blue",
  css: "pink",
  react: "cyan",
  "tailwind css": "emerald",
  bootstrap: "purple",
  python: "cyan",
  "twitter api": "blue",
  unity: "lime",
  "joy ui": "blue",
  "material ui": "blue",
  firebase: "yellow",
  typescript: "sky",
  chatgpt: "green",
  blazor: "purple",
};

const ICON_MAP = {
  javascript: <FaJsSquare className="inline-block me-2" />,
  html: <FaHtml5 className="inline-block me-2" />,
  css: <FaCss3Alt className="inline-block me-2" />,
  react: <FaReact className="inline-block me-2" />,
  bootstrap: <FaBootstrap className="inline-block me-2" />,
  python: <FaPython className="inline-block me-2" />,
  "twitter api": <FaTwitter className="inline-block me-2" />,
  unity: <FaUnity className="inline-block me-2" />,
  "tailwind css": <img src={tailwindImg} className="inline-block me-2 w-3" />,
  "c++": <img src={cppImg} className="inline-block me-2 w-5" />,
  "c#": <img src={csharpImg} className="inline-block me-2 w-5" />,
  wxwidgets: <img src={wxwidgetsImg} className="inline-block me-2 w-5" />,
  sql: <img src={sqlImg} className="inline-block me-2 w-5" />,
  "asp.net": <img src={aspnetImg} className="inline-block me-2 w-5" />,
  "joy ui": <img src={mui} className="inline-block me-2 w-5" />,
  "material ui": <img src={mui} className="inline-block me-2 w-5" />,
  firebase: <img src={firebaseImg} className="inline-block me-2 w-5" />,
  typescript: <img src={typescriptImg} className="inline-block me-2 w-5" />,
  chatgpt: <img src={chatgptImg} className="inline-block me-2 w-5 rounded-full" />,
  blazor: <img src={blazorImg} className="inline-block me-2 w-5" />,
};

export default function ProjectCard({
  children,
  title,
  imgsrcs,
  hrefText,
  href,
  tags,
  icon,
  githubhref,
  date,
  minimal = false,
  color = "sky",
  iconSrc,
}) {
  // Only allow Tailwind-supported colors
  const colorMap = {
    sky: {
      bg: "bg-sky-500",
      bgBtn: "bg-sky-600",
      bgBtnHover: "hover:bg-sky-700",
      border: "border-sky-200",
      text: "text-sky-700",
      textDark: "dark:text-sky-300",
      gradFrom: "from-sky-50/80",
      gradVia: "via-white/90",
      gradTo: "to-sky-100/80",
      borderDark: "dark:border-sky-700",
    },
    lime: {
      bg: "bg-lime-500",
      bgBtn: "bg-lime-600",
      bgBtnHover: "hover:bg-lime-700",
      border: "border-lime-200",
      text: "text-lime-700",
      textDark: "dark:text-lime-300",
      gradFrom: "from-lime-50/80",
      gradVia: "via-white/90",
      gradTo: "to-lime-100/80",
      borderDark: "dark:border-lime-700",
    },
    slate: {
      bg: "bg-slate-500",
      bgBtn: "bg-slate-600",
      bgBtnHover: "hover:bg-slate-700",
      border: "border-slate-200",
      text: "text-slate-700",
      textDark: "dark:text-slate-300",
      gradFrom: "from-slate-50/80",
      gradVia: "via-white/90",
      gradTo: "to-slate-100/80",
      borderDark: "dark:border-slate-700",
    },
    // Add more colors as needed
  };
  const c = colorMap[color] || colorMap["sky"];

  if (minimal) {
    const CardContent = (
      <>
        <div
          className={`absolute -top-6 left-1/2 -translate-x-1/2 ${c.bg} text-white rounded-full p-2 shadow-lg border-4 border-white dark:border-slate-900 flex items-center justify-center`}
          style={{ width: 40, height: 40 }}
        >
          {iconSrc ? (
            <img src={iconSrc} alt="logo" className="w-7 h-7 object-contain" />
          ) : (
            <FaLink className="text-xl" />
          )}
        </div>
        <span className={`font-bold text-base ${c.text} ${c.textDark} mt-6 mb-1 tracking-wide drop-shadow-sm`}>
          {title}
        </span>
        <span className="sr-only">{hrefText}</span>
      </>
    );

    return href ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative bg-gradient-to-br ${c.gradFrom} ${c.gradVia} ${c.gradTo} border ${c.border} ${c.borderDark} rounded-2xl shadow-lg px-3 py-3 flex flex-col items-center max-w-[14rem] transition hover:scale-105 hover:shadow-2xl duration-200 group cursor-pointer outline-none focus:ring-2 focus:ring-${color}-400`}
        tabIndex={0}
        aria-label={title}
      >
        {CardContent}
      </a>
    ) : (
      <div
        className={`relative bg-gradient-to-br ${c.gradFrom} ${c.gradVia} ${c.gradTo} border ${c.border} ${c.borderDark} rounded-2xl shadow-lg px-3 py-3 flex flex-col items-center max-w-[14rem] transition hover:scale-105 hover:shadow-2xl duration-200 group`}
      >
        {CardContent}
      </div>
    );
  }

  return (
    <div
      className="glass rounded-3xl shadow-xl overflow-hidden card-hover"
      onMouseOver={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1)";
      }}
    >
      {/* IMAGE */}
      <img
        src={imgsrcs}
        alt={title}
        className={`w-full h-40 sm:h-60 object-cover transition-all duration-300 overflow-y-auto ${
          href && "xs:cursor-pointer"
        }`}
        onClick={() => {
          if (href && window.innerWidth > 768) window.open(href, "_blank"); // hack to prevent mobile click
        }}
      />

      <div className="p-6">
        {/* TAGS */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-sm text-gray-200 bg-${
                COLOR_MAP[tag.toLowerCase()]
              }-700 px-2 py-1 rounded-full whitespace-nowrap items-center flex font-semibold`}
            >
              {ICON_MAP[tag.toLowerCase()]}
              {tag}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h5 className="text-xl font-semibold mb-2 flex items-center font-montserrat">
          {icon}
          {title}
        </h5>

        {/* DESCRIPTION */}
        <p className="text-gray-400 mb-3 font-light">{children}</p>

        {/* LINKS */}
        <div className="flex flex-col gap-3 sm:items-center sm:flex-row my-5">
          {/* DYNAMIC LINK */}
          {href && (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="btn-primary font-montserrat text-white flex items-center justify-center mx-auto"
            >
              <FaLink className="inline-block me-2" />
              <span>{hrefText}</span>
            </a>
          )}
          {/* GITHUB LINK */}
          {githubhref && (
            <a
              href={githubhref}
              target="_blank"
              rel="noreferrer"
              title="View on GitHub"
              className="font-montserrat mx-auto px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-2 group"
            >
              <FaGithub className="text-xl group-hover:scale-110 transition-transform" />
              <span className="text-lg font-medium">{githubhref.split("/").pop()}</span>
            </a>
          )}
        </div>
        {/* FOOTER with date */}
        {date && (
          <div className="font-montserrat text-gray-400 text-sm font-semibold flex">
            <FaCalendarDay className="inline-block me-2 text-lg" />
            {date}
          </div>
        )}
      </div>
    </div>
  );
}
