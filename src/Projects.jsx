import { FaCertificate, FaLink, FaRoad, FaServer, FaUnity } from "react-icons/fa";

const ProjectCard = ({ children, title, imgsrc, hrefText, href, tags, icon }) => {
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
      <img
        src={imgsrc}
        alt={title}
        className="w-full h-32 sm:h-48 object-cover transition-all duration-300 overflow-hidden"
      />
      <div className="p-6">
        <div className="flex gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag.content}
              className={`text-sm text-white bg-${tag.color}-700 opacity-80 px-2 py-1 rounded-full`}
            >
              {tag.content}
            </span>
          ))}
        </div>
        <h1 className="text-xl font-semibold mb-2">{icon}{title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-3">{children}</p>
        {href && (
          <a
            href={href}
            target="_blank"
            className="rounded text-neutral-50 bg-indigo-500 hover:bg-indigo-600 px-3 py-1 mt-3 inline-block transition-all"
          >
            <FaLink className="inline-block me-2" />
            {hrefText}
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
        <h1 className="text-6xl font-semibold flex justify-center mb-10">
          <FaCertificate className="inline-block me-5" />
          Projects
        </h1>
        <h4 className="text-2xl mb-10">
          Here are some of the projects I have worked on, and which{" "}
          <span className="text-lg text-white bg-gray-700 opacity-80 px-2 py-1 rounded-full">
            technologies
          </span>{" "}
          were used.
        </h4>
        {/* Grid of cards, each one having an image, header and description */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 w-2/3">
          <ProjectCard
            title="3D drone relief software"
            imgsrc="src\assets\drone-software.png"
            href="https://i-conicvision.com/2022/12/15/kth-selected-proposal-from-i-conic-again/"
            hrefText="Read I-CONIC blog"
            tags={[
              { content: "C++", color: "teal" },
              { content: "wxWidgets", color: "lime" },
            ]}
            icon={<FaUnity className="inline-block me-2" />}
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
              { content: "C#", color: "green" },
              { content: "JavaScript", color: "indigo" },
              { content: "KQL", color: "red" },
              { content: "ASP.net", color: "orange" },
            ]}
            icon={<FaServer className="inline-block me-2" />}
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
            tags={[
              { content: "JavaScript", color: "indigo" },
              { content: "HTML", color: "blue" },
              { content: "CSS", color: "pink" },
            ]}
            icon={<FaRoad className="inline-block me-2" />}
          >
            Upper secondary school graduate project (Gymnasie&shy;arbete) where
            I developed a pathfinding visualization website. The project aimed
            to study the most popular pathfinding algorithms and show their
            characteristics in a visual form.
          </ProjectCard>
        </div>
      </div>
    </>
  );
};

export default Projects;
