import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  interactionSpring, instantInteraction, stillInteractionVariants,
  interactionArrowVariants, interactionExternalArrowVariants,
} from "../utils/interactionMotion";

// The parent control owns hover/focus/tap; only this decorative arrow moves.
export default function InteractiveArrow({ external = false, className = "", children }) {
  const reducedMotion = useReducedMotion();
  return (
    <m.span aria-hidden="true" className={`interactive-arrow ${className}`}
      variants={reducedMotion ? stillInteractionVariants : external ? interactionExternalArrowVariants : interactionArrowVariants}
      transition={reducedMotion ? instantInteraction : interactionSpring}>
      {children}
    </m.span>
  );
}
