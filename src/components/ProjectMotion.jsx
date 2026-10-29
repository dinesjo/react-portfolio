import { forwardRef, useLayoutEffect } from "react";
import { useAnimationControls, useIsPresent, usePresenceData, useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

const layoutSpring = { type: "spring", stiffness: 480, damping: 44, mass: 0.9 };

// popLayout needs the ref on the element it removes from the grid's flow.
export const ProjectMotionCard = forwardRef(function ProjectMotionCard({
  projectId,
  index,
  revision,
  crossfade = false,
  reflow = true,
  children,
}, ref) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  const presence = usePresenceData();
  const instant = reducedMotion || presence?.instant;
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    if (!present) return;

    // Tall case studies can change position by several screens. A short
    // crossfade keeps their text and artwork legible at the destination.
    if (crossfade && !instant) controls.set({ opacity: 0, y: 8 });
    controls.start({
      opacity: 1,
      y: 0,
      transition: instant ? { duration: 0 } : {
        y: layoutSpring,
        opacity: { duration: 0.24, ease: "easeOut", delay: Math.min(index, 3) * 0.025 },
      },
    });
  }, [controls, crossfade, index, instant, present, revision]);

  return (
    <m.div
      ref={ref}
      className="project-motion-card"
      data-project-id={projectId}
      data-present={present ? "true" : "false"}
      inert={present ? undefined : ""}
      aria-hidden={present ? undefined : true}
      layout={instant || !reflow ? false : "position"}
      layoutDependency={revision}
      initial={instant ? false : { opacity: 0, y: 10 }}
      animate={controls}
      exit={{ opacity: 0, y: instant ? 0 : -5,
        transition: { duration: instant ? 0 : 0.12, ease: "easeIn" } }}
      transition={{ layout: instant ? { duration: 0 } : layoutSpring }}
    >
      {children}
    </m.div>
  );
});

export const ProjectMotionGroup = forwardRef(function ProjectMotionGroup({
  priority,
  revision,
  children,
}, ref) {
  const present = useIsPresent();
  const reducedMotion = useReducedMotion();
  const presence = usePresenceData();
  const instant = reducedMotion || presence?.instant;

  return (
    <m.section
      ref={ref}
      className="collection-group"
      aria-labelledby={`project-group-${priority}-title`}
      inert={present ? undefined : ""}
      aria-hidden={present ? undefined : true}
      layout={instant ? false : "position"}
      layoutDependency={revision}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: instant ? 0 : 0.12 } }}
      transition={{ layout: instant ? { duration: 0 } : layoutSpring }}
    >
      {children}
    </m.section>
  );
});
