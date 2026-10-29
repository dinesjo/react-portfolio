import { useLayoutEffect, useRef } from "react";
import { AnimatePresence, useIsPresent, useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";

const stageSpring = {
  stiffness: 420, damping: 38, mass: 0.8,
  restDelta: 0.5, restSpeed: 5,
};

function StageView({ children }) {
  const isPresent = useIsPresent();
  const reducedMotion = useReducedMotion();

  return (
    <m.div
      className="assistant-stage-view"
      aria-hidden={isPresent ? undefined : true}
      inert={isPresent ? undefined : ""}
      style={isPresent ? undefined : { position: "absolute", inset: "0 0 auto" }}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : -4, transition: {
        opacity: { duration: reducedMotion ? 0 : 0.1 },
        y: { duration: reducedMotion ? 0 : 0.1 },
      } }}
      transition={reducedMotion ? { duration: 0 } : {
        opacity: { duration: 0.14 },
        y: { type: "spring", stiffness: 440, damping: 36, mass: 0.65 },
      }}
    >
      {children}
    </m.div>
  );
}

// Only the suggestions/conversation handoff changes this frame's height.
// The transcript has its own stable scroll area, so token updates never spring
// the composer or scale the text the visitor is reading.
export default function AssistantStage({ conversation, children }) {
  const stageRef = useRef(null);
  const contentRef = useRef(null);
  const previousView = useRef(conversation);
  const naturalHeight = useRef(0);
  const animating = useRef(false);
  const reducedMotion = useReducedMotion();
  const height = useSpring(0, stageSpring);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const content = contentRef.current;
    const finish = () => {
      animating.current = false;
      height.jump(height.get());
      stage.style.removeProperty("height");
      stage.style.removeProperty("overflow");
      stage.dataset.motion = "idle";
      naturalHeight.current = content.getBoundingClientRect().height;
    };
    const onResize = () => {
      const nextHeight = content.getBoundingClientRect().height;
      if (Math.abs(nextHeight - naturalHeight.current) < 0.5) return;
      naturalHeight.current = nextHeight;
      if (animating.current) height.set(nextHeight);
    };
    const unsubscribe = height.on("change", (value) => {
      if (animating.current) stage.style.height = `${Math.max(0, value)}px`;
    });
    const unsubscribeComplete = height.on("animationComplete", finish);
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onResize);
    observer?.observe(content);
    if (!observer) window.addEventListener("resize", onResize);
    naturalHeight.current = content.getBoundingClientRect().height;
    stage.dataset.motion = "idle";

    return () => {
      animating.current = false;
      height.jump(height.get());
      unsubscribe();
      unsubscribeComplete();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      stage.style.removeProperty("height");
      stage.style.removeProperty("overflow");
    };
  }, [height]);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    const nextHeight = contentRef.current.getBoundingClientRect().height;
    const changed = previousView.current !== conversation;
    previousView.current = conversation;

    if (reducedMotion) {
      animating.current = false;
      height.jump(nextHeight);
      stage.style.removeProperty("height");
      stage.style.removeProperty("overflow");
      stage.dataset.motion = "idle";
    } else if (changed) {
      const from = animating.current ? stage.getBoundingClientRect().height : naturalHeight.current;
      if (Math.abs(from - nextHeight) >= 0.5) {
        if (!animating.current) height.jump(from);
        stage.style.height = `${from}px`;
        stage.style.overflow = "hidden";
        stage.dataset.motion = "switching";
        animating.current = true;
        height.set(nextHeight);
      } else {
        animating.current = false;
        height.jump(nextHeight);
        stage.style.removeProperty("height");
        stage.style.removeProperty("overflow");
        stage.dataset.motion = "idle";
      }
    }
    naturalHeight.current = nextHeight;
  }, [conversation, height, reducedMotion]);

  return (
    <div ref={stageRef} className="assistant-stage">
      <div ref={contentRef} className="assistant-stage-content">
        <AnimatePresence initial={false}>
          <StageView key={conversation ? "conversation" : "suggestions"}>
            {children}
          </StageView>
        </AnimatePresence>
      </div>
    </div>
  );
}
