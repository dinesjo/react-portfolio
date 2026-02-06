import { useState } from "react";
import { FaCopy, FaCheck, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

export default function Contact() {
  const email = "dinesjo@kth.se";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-iceland text-4xl sm:text-5xl font-bold text-slate-700 dark:text-slate-200 mb-4 reveal">
          Get in Touch
        </h2>
        <p className="text-slate-500 dark:text-slate-400 font-inter mb-10 reveal">
          Interested in collaborating or just want to say hello?
        </p>

        {/* Email card */}
        <div className="glass-card rounded-2xl p-8 mb-10 reveal">
          <p className="text-sm text-slate-400 dark:text-slate-500 font-inter mb-4">
            Send me an email
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="text-xl font-montserrat font-semibold text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 transition-colors"
            >
              {email}
            </a>
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-inter font-semibold text-sm transition-all duration-300 ${
                copied
                  ? "bg-green-500 text-white shadow-md shadow-green-500/25"
                  : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-md hover:shadow-blue-500/25"
              }`}
            >
              {copied ? (
                <>
                  <FaCheck /> Copied!
                </>
              ) : (
                <>
                  <FaCopy /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 reveal">
          <a
            href="https://github.com/dinesjo"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors duration-300"
            title="GitHub"
            aria-label="GitHub profile"
          >
            <FaGithub className="text-xl" />
          </a>
          <a
            href="https://www.linkedin.com/in/dinesjo/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
            title="LinkedIn"
            aria-label="LinkedIn profile"
          >
            <FaLinkedin className="text-xl" />
          </a>
          <a
            href={`mailto:${email}`}
            className="w-12 h-12 flex items-center justify-center rounded-2xl glass-card text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-300"
            title="Email"
            aria-label="Send email"
          >
            <FaEnvelope className="text-xl" />
          </a>
        </div>
      </div>
    </section>
  );
}
