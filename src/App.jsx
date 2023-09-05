import React from "react";
import { Link } from "react-router-dom";
import { FaHandshake } from "react-icons/fa";

function App() {
  return (
    <>
      {/* Using tailwind CSS, write a simple portfolio website */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-6xl text-center font-semibold mb-3">
          Hello <FaHandshake className="inline-block animate-bounce" />, I'm{" "}
          <span className="text-indigo-600 font-bold">Linus</span>
        </h1>
        <p className="text-2xl">
          This is a portfolio website meant to showcase some of my{" "}
          <Link className="link" to="/projects">
            projects
          </Link>
          .
        </p>
        <p className="text-2xl">
          If you want to get in touch, check out the{" "}
          <Link className="link" to="/contact">
            contact
          </Link>{" "}
          page.
        </p>
        <p className="text-xl mt-5 text-gray-600 dark:text-gray-400">
          I'm a student at <b>KTH</b> Sweden. Persuing a <b>master's degree in Computer Science</b>.
        </p>
      </div>
    </>
  );
}

export default App;
