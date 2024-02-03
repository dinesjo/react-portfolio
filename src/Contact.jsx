import { useState } from "react";
import { FaCopy, FaEnvelope } from "react-icons/fa";
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="h1 flex items-end mb-3">
        <FaEnvelope className="inline-block me-5" /> Contact
      </h1>
      <h4 className="h4 mb-3">Get in touch by sending me an email:</h4>
      <div className="flex items-center mb-3">
        <button
          onClick={handleCopy}
          className="font-semibold py-1 px-2 rounded bg-indigo-500 hover:bg-indigo-600 transition-all flex items-center"
        >
          <FaCopy className="inline-block mr-1" /> {copied ? "Copied!" : "Copy"}
        </button>
        <a href={`mailto:${email}`} className="link text-lg ms-3">
          {email}
        </a>
      </div>
    </div>
  );
}
