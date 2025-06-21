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
};

export default function ProjectCard({ children, title, imgsrcs, hrefText, href, tags, icon, githubhref, date }) {
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
              className="btn-primary text-white flex items-center justify-center mx-auto"
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
              className="mx-auto px-4 py-3 rounded-xl text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-700/10 dark:hover:bg-slate-700/50 transition-all duration-200 flex items-center gap-2 group"
            >
              <FaGithub className="text-xl group-hover:scale-110 transition-transform" />
              <span className="text-lg font-medium">{githubhref.split("/").pop()}</span>
            </a>
          )}
        </div>
        {/* FOOTER with date */}
        {date && (
          <div className="text-gray-400 text-sm font-semibold flex">
            <FaCalendarDay className="inline-block me-2 text-lg" />
            {date}
          </div>
        )}
      </div>
    </div>
  );
}
