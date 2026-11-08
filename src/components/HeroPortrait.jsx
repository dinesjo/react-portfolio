import { useState } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import portraitSrc from "../assets/project-optimized/portrait.webp";
import { profile } from "../data/profile";

const portraitSpring = { stiffness: 120, damping: 22, mass: 0.7 };

export default function HeroPortrait() {
  const reducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const rotateX = useSpring(0, portraitSpring);
  const rotateY = useSpring(0, portraitSpring);
  const resetPosition = () => { rotateX.set(0); rotateY.set(0); };
  const movePortrait = (event) => {
    if (reducedMotion || event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
    const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
    rotateX.set(-y * 4);
    rotateY.set(x * 4);
  };

  return (
    <figure className="hero-portrait" data-color={hovered ? "true" : "false"}>
      <div className="hero-portrait__stage"
        onPointerMove={movePortrait}
        onPointerEnter={(event) => { if (event.pointerType === "mouse") setHovered(true); }}
        onPointerLeave={() => { setHovered(false); resetPosition(); }}
        onPointerCancel={() => { setHovered(false); resetPosition(); }}>
        <m.div className="hero-portrait__image" style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}>
          <img src={portraitSrc} alt={profile.name} width="900" height="900"
            loading="eager" decoding="async" />
        </m.div>
      </div>

    </figure>
  );
}
