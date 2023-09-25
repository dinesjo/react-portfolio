import { Link } from "react-router-dom";
import { FaHandshake } from "react-icons/fa";
import { TabTitle } from "./utils/GeneralFunctions";

export default function Home() {
  TabTitle("Home");

  return (
    <>
      {/* Using tailwind CSS, write a simple portfolio website */}
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="h1 mb-3">
          Hello <FaHandshake className="inline-block animate-bounce" />, my name
          is <span className="text-indigo-600 font-bold">Linus</span>
        </h1>
        <h4 className="h4">
          This is a portfolio website meant to showcase some of my{" "}
          <Link className="link" to="/projects">
            projects
          </Link>
          .
          <br />
          If you want to get in touch, check out the{" "}
          <Link className="link" to="/contact">
            contact
          </Link>{" "}
          page.
        </h4>
        <h5 className="h5 mt-5 text-gray-600 dark:text-gray-400">
          I&apos;m a student at <b>KTH</b> Sweden. Persuing a{" "}
          <b>master&apos;s degree in Computer Science</b>.
        </h5>
      </div>
    </>
  );
}
