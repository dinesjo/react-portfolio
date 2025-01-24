import { Link } from "react-router-dom";
import { TabTitle } from "./utils/GeneralFunctions";

export default function Home() {
  TabTitle("Home");

  return (
    <>
      <div className="flex flex-col justify-center pt-56 md:w-1/2">
        <div className="flex justify-center relative mb-3">
          <img
            src="portrait.png"
            alt="Portrait"
            className="w-60 xs:w-72 rounded-full mx-auto absolute bottom-0 transition-all duration-300 outline outline-transparent xs:hover:outline-indigo-500"
          />
          <h1 className="h1 text-indigo-500 z-10" style={{ textShadow: "2px 2px 4px #000000" }}>
            <span className="font-poppins">Linus Dinesjö</span>
          </h1>
        </div>
        <h4 className="h4">
          <b className="text-indigo-500">Welcome!</b> I&apos;m a 4th year student at{" "}
          <span className="text-indigo-500">
            <b>KTH Stockholm</b>
          </span>
          , persuing a master&apos;s degree in Computer Science.
        </h4>
        <h5 className="h5 mt-5 text-gray-400">
          Please check out some of my{" "}
          <Link className="link" to="/projects">
            projects
          </Link>
          , as well as the{" "}
          <Link className="link" to="/courses">
            courses
          </Link>{" "}
          I have taken at KTH. If you want to get in touch, please check out the{" "}
          <Link className="link" to="/contact">
            contact
          </Link>{" "}
          page.
        </h5>
      </div>
    </>
  );
}
