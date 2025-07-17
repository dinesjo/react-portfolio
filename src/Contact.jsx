import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { TabTitle } from "./utils/GeneralFunctions";

export default function Contact() {
  const email = "dinesjo@kth.se";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  TabTitle("Contact");

  return (
    <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "calc(100vh - 16rem)" }}>
      <div className="glass p-6 rounded-2xl max-w-2xl text-center space-y-6">
        <h4 className="h4 leading-relaxed">Get in touch by sending me an email:</h4>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            className={`btn-primary text-white flex items-center transition-all duration-200 ${
              copied ? "bg-green-600 hover:bg-green-700" : ""
            }`}
          >
            <FaCopy className="inline-block mr-2" />
            <span>{copied ? "Copied!" : "Copy Email"}</span>
          </button>

          <a href={`mailto:${email}`} className="link text-xl">
            {email}
          </a>
        </div>

        <p className="text-slate-400 text-sm mt-6">I&apos;ll get back to you as soon as possible!</p>
      </div>
    </div>
  );
}
