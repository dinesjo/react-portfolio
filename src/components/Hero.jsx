import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { profile } from "../data/profile";
import { focusSection } from "../utils/portfolioNavigation";
import PrimaryButton from "./PrimaryButton";
import HeroPortrait from "./HeroPortrait";

export default function Hero() {
  const [firstName, ...surname] = profile.name.split(" ");
  return (
    <section id="home" tabIndex={-1} aria-labelledby="home-title" className="hero-section">
      <div className="section-shell hero-layout">
        <div className="hero-introduction">
          <p className="hero-role">{profile.role}</p>
          <h1 id="home-title" className="hero-title">
            <span>{firstName}</span>{" "}<span>{surname.join(" ")}</span>
          </h1>
        </div>
        <div className="hero-copy">
          <p className="hero-thesis">{profile.headline}</p>
          <p className="section-copy hero-summary">{profile.summary}</p>
          <div className="hero-actions flex flex-wrap gap-3">
            <PrimaryButton href="#featured" onClick={focusSection}
              className="sharp-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold"
              icon={<FaArrowRight className="text-xs" />} iconPosition="end">View work</PrimaryButton>
            <a href={`mailto:${profile.contact.email}`}
              className="quiet-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold">
              <FaEnvelope className="text-xs" /> Contact
            </a>
          </div>
        </div>
        <HeroPortrait />
        <div className="hero-colophon">
          <p>{profile.education.summary}</p>
          <p className="hero-location">{profile.location}</p>
          <div className="hero-social-links">
            <a href={profile.contact.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"><FaGithub /></a>
            <a href={profile.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"><FaLinkedin /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
