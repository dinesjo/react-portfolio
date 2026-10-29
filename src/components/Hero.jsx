import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import portraitSrc from "../assets/project-optimized/portrait.webp";
import { profile } from "../data/profile";
import { focusSection } from "../utils/portfolioNavigation";
import PrimaryButton from "./PrimaryButton";

export default function Hero() {
  return (
    <section
      id="home"
      tabIndex={-1}
      aria-labelledby="home-title"
      className="hero-section relative px-6 pb-16 pt-32 sm:pt-40"
    >
      <div className="section-shell hero-layout grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
        <div className="hero-copy">
          <span className="section-eyebrow hero-sequence-step hero-sequence-step--kicker">
            {profile.role}
          </span>
          <h1
            id="home-title"
            className="section-title hero-title mt-6 max-w-4xl"
          >
            <span className="hero-title__text hero-sequence-step hero-sequence-step--title">
              {profile.name}
            </span>
          </h1>
          <p className="hero-thesis hero-sequence-step hero-sequence-step--thesis mt-6 max-w-2xl font-montserrat text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
            {profile.headline}
          </p>
          <p className="section-copy hero-sequence-step hero-sequence-step--summary mt-4 max-w-2xl text-base sm:text-lg">
            {profile.summary}
          </p>

          <div className="hero-actions hero-sequence-step hero-sequence-step--actions mt-8 flex flex-wrap gap-3">
            <PrimaryButton
              href="#featured"
              onClick={focusSection}
              className="sharp-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold"
              icon={<FaArrowRight className="text-xs" />} iconPosition="end"
            >
              View work
            </PrimaryButton>
            <a
              href={`mailto:${profile.contact.email}`}
              className="quiet-button inline-flex items-center gap-2 px-5 py-3 font-montserrat text-sm font-bold"
            >
              <FaEnvelope className="text-xs" /> Contact
            </a>
          </div>


        </div>

        <aside
          className="surface-card hero-brief-card hero-card-enter overflow-hidden"
        >
          <div className="hero-brief-card__body grid grid-cols-1 items-stretch gap-0 sm:grid-cols-[0.78fr_1.22fr]">
            <div
              className="hero-portrait overflow-hidden bg-slate-200"
            >
              <img
                src={portraitSrc}
                alt={profile.name}
                width="900"
                height="900"
                loading="eager"
                decoding="async"
                className="portrait-img h-full w-full object-cover"
              />
            </div>
            <div className="flex min-w-0 flex-col justify-between border-t border-slate-200/60 p-4 sm:border-l sm:border-t-0 sm:p-5">
              <div>
                <p className="font-montserrat text-xs font-extrabold uppercase tracking-widest text-slate-600">
                  Current work
                </p>
                <p className="mt-3 text-lg font-bold leading-tight text-slate-950 sm:text-2xl">
                  {profile.employment.summary}
                </p>
              </div>
              <div className="mt-6">
                <p className="hero-location mb-3 font-iceland text-base uppercase tracking-[0.08em] text-slate-500">
                  {profile.location}
                </p>
                <div className="flex gap-2">
                  <a
                    href={profile.contact.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub profile"
                    className="quiet-button flex h-11 w-11 items-center justify-center"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href={profile.contact.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn profile"
                    className="quiet-button flex h-11 w-11 items-center justify-center"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
