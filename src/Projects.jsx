import {
  FaCertificate,
  FaChess,
  FaChessBoard,
  FaGithub,
  FaLink,
  FaMapPin,
  FaMusic,
  FaRoad,
  FaServer,
  FaUnity,
} from "react-icons/fa";

const ProjectCard = ({
  children,
  title,
  imgsrc,
  hrefText,
  href,
  tags,
  icon,
  githubhref,
}) => {
  const colorMap = {
    "c++": "teal",
    wxwidgets: "lime",
    "c#": "green",
    javascript: "indigo",
    kql: "red",
    "asp.net": "orange",
    html: "blue",
    css: "pink",
    react: "cyan",
    "tailwind css": "emerald",
    bootstrap: "purple",
    python: "amber",
    "twitter api": "fuchsia",
    unity: "lime",
  };

  return (
    <div
      className="bg-slate-700 rounded-lg shadow-md overflow-hidden"
      onMouseOver={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1.05)";
      }}
      onMouseOut={(e) => {
        e.currentTarget.querySelector("img").style.transform = "scale(1)";
      }}
    >
      {/* IMAGE */}
      <img
        src={imgsrc}
        alt={title}
        className={`w-full h-32 sm:h-48 object-cover transition-all duration-300 overflow-hidden ${
          href && "cursor-pointer"
        }`}
        onClick={() => {
          if (href) window.open(href, "_blank");
        }}
      />

      <div className="p-6">
        {/* TAGS */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`text-sm text-gray-200 bg-${
                colorMap[tag.toLowerCase()]
              }-700 bg-opacity-60 px-2 py-1 rounded-full whitespace-nowrap`}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* TITLE */}
        <h1 className="text-xl font-semibold mb-2">
          {icon}
          {title}
        </h1>

        {/* DESCRIPTION */}
        <p className="text-gray-600 dark:text-gray-400 mb-3">{children}</p>

        {/* LINK */}
        {href && (
          <a
            href={href}
            target="_blank"
            className="rounded-lg text-neutral-50 bg-indigo-500 hover:bg-indigo-600 px-3 py-1 mt-3 inline-block transition-all"
          >
            <FaLink className="inline-block me-2" />
            {hrefText}
          </a>
        )}

        {/* GITHUB LINK */}
        {githubhref && (
          <a
            href={githubhref}
            target="_blank"
            title="View on GitHub"
            className="px-3 py-1 float-right mb-4"
          >
            <FaGithub className="inline-block text-4xl hover:text-gray-400 transition-all" />
          </a>
        )}
      </div>
    </div>
  );
};

const Projects = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-20">
        {/* TITLE */}
        <h1 className="h1 flex justify-center mb-10">
          <FaCertificate className="inline-block me-5" />
          Projects
        </h1>

        {/* SUBTITLE */}
        <h3 className="h3 mb-10 w-3/4">
          Here are some of the projects I have worked on, and which{" "}
          <span className="text-lg text-gray-200 bg-slate-500 bg-opacity-60 px-2 py-1 rounded-full">
            technologies
          </span>{" "}
          were used.
        </h3>

        {/* Grid of cards, each one having an image, header and description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-11/12 xs:w-2/3 mb-5">
          <ProjectCard
            title="3D drone relief software"
            imgsrc="src\assets\drone-software.png"
            href="https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/"
            hrefText="Read I-CONIC blog"
            githubhref={"https://github.com/I-CONIC-Vision-AB/iconic-measure"}
            tags={["C++", "wxWidgets"]}
            icon={<FaUnity className="inline-block me-2 text-lime-600" />}
          >
            In a collaborative effort with seven other KTH students, we
            developed a user-friendly interface for an existing 3D drone
            software for{" "}
            <a
              href="https://i-conicvision.com/"
              target="_blank"
              className="text-blue-400 hover:text-blue-500 hover:underline"
            >
              I-CONIC
            </a>
            . The software is used to plan and execute drone missions for
            disaster relief operations, and their software is part of a larger
            United Nations-funded project.
          </ProjectCard>
          <ProjectCard
            title="Log Portal"
            imgsrc="src\assets\log-portal.png"
            tags={[
              "C#",
              "KQL",
              "ASP.NET",
              "JavaScript",
              "Bootstrap",
              "HTML",
              "CSS",
            ]}
            icon={<FaServer className="inline-block me-2 text-emerald-500" />}
          >
            I provided{" "}
            <a
              href="https://www.bravida.se/en/"
              target="_blank"
              className="text-emerald-500 hover:text-emerald-600 hover:underline"
            >
              Bravida
            </a>{" "}
            a solution for viewing their Azure Logic App logs. On top of this I
            provided an API solution to remotely toggle automations, offloading
            their developers from scheduling maintence. The product is also
            intended for the support team to keep track of orders.
          </ProjectCard>
          <ProjectCard
            title="Pathfinging Visualization"
            imgsrc="src\assets\path-vis.png"
            href="https://linusdinesjo.github.io/pathfinding-vis/"
            hrefText="Try Yourself"
            githubhref={"https://github.com/linusdinesjo/pathfinding-vis"}
            tags={["JavaScript", "HTML", "CSS"]}
            icon={<FaRoad className="inline-block me-2 text-blue-500" />}
          >
            Upper secondary school graduate project (Gymnasie&shy;arbete) where
            I developed a pathfinding visualization website. The project aimed
            to study the most popular pathfinding algorithms and show their
            characteristics in a visual form.
          </ProjectCard>
          <ProjectCard
            title="This Website"
            imgsrc="src\assets\this.png"
            githubhref="https://github.com/linusdinesjo/react-portfolio"
            tags={["React", "Tailwind CSS", "JavaScript", "HTML", "CSS"]}
            icon={<FaMapPin className="inline-block text-red-500 me-2" />}
          >
            This portfolio website is my first project using React and Tailwind
            CSS. I wanted to learn these technologies and decided to make a
            portfolio website to showcase my projects.
          </ProjectCard>
          <ProjectCard
            title="Chess Reporter"
            imgsrc="src\assets\chess-reporter.png"
            href="https://twitter.com/ChessReporter/"
            hrefText="View on X (Formerly Twitter)"
            githubhref="https://gits-15.sys.kth.se/wver/projinda-twitter-bot"
            tags={["Python", "Twitter API"]}
            icon={<FaChess className="inline-block me-2 text-amber-700" />}
          >
            A Twitter bot that posts Python-generated GIFs of high-profile chess
            games. The project was part of the course{" "}
            <a
              href="https://www.kth.se/student/kurser/kurs/DD1349?periods=6&startterm=20221&l=en"
              target="_blank"
              className="link"
            >
              DD1349
            </a>
            .
          </ProjectCard>
          <ProjectCard
            title="Note Hero"
            imgsrc="src\assets\note-hero.png"
            tags={["Unity", "C#"]}
            icon={<FaMusic className="inline-block me-2 text-purple-500" />}
          >
            A rhythm game inspired by Guitar Hero. After interviewing music
            teachers I, along with other students, developed a game to help
            gamify music theory. The game used a mobile device's microphone to
            detect a players real-life instrument. The project was part of the
            course{" "}
            <a
              href="https://www.kth.se/student/kurser/kurs/DH1620?periods=6&startterm=20221&l=en"
              target="_blank"
              className="link"
            >
              DH1620
            </a>
            .
          </ProjectCard>
        </div>
      </div>
    </>
  );
};

export default Projects;