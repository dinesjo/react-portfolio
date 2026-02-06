import {
  FaReact,
  FaJsSquare,
  FaHtml5,
  FaCss3Alt,
  FaPython,
  FaUnity,
  FaBootstrap,
  FaTwitter,
  FaFlask,
} from "react-icons/fa";

import aspnetImg from "../assets/aspnet.png";
import blazorImg from "../assets/blazor.png";
import cppImg from "../assets/c++.png";
import chatgptImg from "../assets/ChatGPT.png";
import csharpImg from "../assets/csharp.png";
import firebaseImg from "../assets/firebase.png";
import muiImg from "../assets/mui.png";
import sqlImg from "../assets/sql.png";
import tailwindImg from "../assets/tailwind.png";
import typescriptImg from "../assets/typescript.png";
import wxwidgetsImg from "../assets/wxwidgets.png";
import kqlImg from "../assets/kql.png";

const techConfig = {
  React: { icon: FaReact, color: "#0ea5e9" },
  JavaScript: { icon: FaJsSquare, color: "#ca8a04" },
  HTML: { icon: FaHtml5, color: "#ea580c" },
  CSS: { icon: FaCss3Alt, color: "#2563eb" },
  Python: { icon: FaPython, color: "#2563eb" },
  Unity: { icon: FaUnity, color: "#374151" },
  Bootstrap: { icon: FaBootstrap, color: "#7c3aed" },
  "Twitter API": { icon: FaTwitter, color: "#0ea5e9" },
  Research: { icon: FaFlask, color: "#2563eb" },
  "ASP.NET": { image: aspnetImg, color: "#6d28d9" },
  Blazor: { image: blazorImg, color: "#6d28d9" },
  "C++": { image: cppImg, color: "#0369a1" },
  ChatGPT: { image: chatgptImg, color: "#16a34a" },
  "C#": { image: csharpImg, color: "#16a34a" },
  Firebase: { image: firebaseImg, color: "#ca8a04" },
  "Material UI": { image: muiImg, color: "#2563eb" },
  "Joy UI": { image: muiImg, color: "#2563eb" },
  SQL: { image: sqlImg, color: "#0369a1" },
  "Tailwind CSS": { image: tailwindImg, color: "#0891b2" },
  TypeScript: { image: typescriptImg, color: "#2563eb" },
  wxWidgets: { image: wxwidgetsImg, color: "#16a34a" },
  KQL: { image: kqlImg, color: "#0369a1" },
};

export default function TechBadge({ name }) {
  const config = techConfig[name];
  const color = config?.color || "#64748b";

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-inter whitespace-nowrap"
      style={{
        backgroundColor: `${color}12`,
        color: color,
        border: `1px solid ${color}25`,
      }}
    >
      {config?.image && (
        <img src={config.image} alt="" className="w-3.5 h-3.5 object-contain" />
      )}
      {config?.icon && <config.icon className="text-sm" />}
      {name}
    </span>
  );
}
