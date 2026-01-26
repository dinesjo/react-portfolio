import { useState } from "react";
import { FaCopy } from "react-icons/fa";

export default function Contact() {
  const email = "dinesjo@kth.se";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 mb-24" style={{ minHeight: "16rem" }}>
      <div className="glass p-6 rounded-2xl max-w-2xl text-center space-y-6 scroll-animate">
        <h4 className="h4 leading-relaxed">Get in touch by sending me an email:</h4>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCopy}
            className={`px-6 py-3 rounded-xl font-semibold font-montserrat flex items-center justify-center text-white transition-all duration-200 hover:scale-[1.03] hover:shadow-xl ${
              copied
                ? "bg-green-600 hover:shadow-green-500/40"
                : "bg-gradient-to-r from-indigo-500 to-indigo-700 hover:shadow-indigo-500/40"
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
