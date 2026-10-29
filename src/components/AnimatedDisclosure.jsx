import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion, useSpring } from "motion/react";
import * as m from "motion/react-m";
import { FaArrowDown } from "react-icons/fa";

const heightSpring = {
  stiffness: 430, damping: 40, mass: 0.8,
  restDelta: 0.5, restSpeed: 5,
};

export function DisclosureIndicator({ expanded, className = "" }) {
  const reducedMotion = useReducedMotion();
  return (
    <m.span
      aria-hidden="true"
      className={`disclosure-indicator ${className}`}
      initial={false}
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={reducedMotion ? { duration: 0 } : {
        type: "spring", stiffness: 480, damping: 40, mass: 0.7,
      }}
    >
      <FaArrowDown />
    </m.span>
  );
}

export default function AnimatedDisclosure({
  summary,
  summaryClassName,
  className = "",
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}) {
  const contentId = useId();
  const [expanded, setExpanded] = useState(defaultOpen);
  const detailsRef = useRef(null);
  const summaryRef = useRef(null);
  const contentRef = useRef(null);
  const desiredOpen = useRef(defaultOpen);
  const animating = useRef(false);
  const minimumHeight = useRef(0);
  const targetHeight = useRef(0);
  const onChangeRef = useRef(onOpenChange);
  const reducedMotion = useReducedMotion();
  const reducedRef = useRef(reducedMotion);
  const height = useSpring(0, heightSpring);

  useLayoutEffect(() => { onChangeRef.current = onOpenChange; }, [onOpenChange]);

  const finish = useCallback((open) => {
    const details = detailsRef.current;
    const content = contentRef.current;
    animating.current = false;
    height.jump(height.get());
    details.open = open;
    details.style.removeProperty("height");
    details.style.removeProperty("overflow");
    details.dataset.motion = "idle";
    content.removeAttribute("inert");
    content.removeAttribute("aria-hidden");
  }, [height]);

  const measure = useCallback((open) => {
    const details = detailsRef.current;
    const style = getComputedStyle(details);
    minimumHeight.current = summaryRef.current.getBoundingClientRect().height +
      parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth) +
      parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    if (!open) return minimumHeight.current;

    // Measure intrinsic height once per change, not on every animation frame.
    const previousHeight = details.style.height;
    details.style.height = "auto";
    const naturalHeight = details.getBoundingClientRect().height;
    details.style.height = previousHeight;
    return naturalHeight;
  }, []);

  const changeOpen = useCallback((open, { instant = false, notify = true } = {}) => {
    const details = detailsRef.current;
    const content = contentRef.current;
    const currentHeight = details.getBoundingClientRect().height;
    const interrupted = animating.current;

    desiredOpen.current = open;
    details.dataset.expanded = String(open);
    summaryRef.current.setAttribute("aria-expanded", String(open));
    setExpanded(open);
    if (notify) onChangeRef.current?.(open);

    if (!open && content.contains(document.activeElement)) {
      summaryRef.current.focus({ preventScroll: true });
    }

    if (instant || reducedRef.current) {
      finish(open);
      return;
    }

    // The browser keeps the content rendered until the closing spring settles.
    details.open = true;
    content.inert = !open;
    if (open) content.removeAttribute("aria-hidden");
    else content.setAttribute("aria-hidden", "true");

    targetHeight.current = measure(open);
    if (Math.abs(targetHeight.current - currentHeight) < 0.5) {
      finish(open);
      return;
    }

    details.dataset.motion = open ? "opening" : "closing";
    details.style.overflow = "hidden";
    details.style.height = `${currentHeight}px`;
    if (!interrupted) height.jump(currentHeight);
    animating.current = true;
    height.set(targetHeight.current);
  }, [finish, height, measure]);

  useLayoutEffect(() => {
    reducedRef.current = reducedMotion;
    if (reducedMotion && animating.current) {
      changeOpen(desiredOpen.current, { instant: true, notify: false });
    }
  }, [changeOpen, reducedMotion]);

  useLayoutEffect(() => {
    const details = detailsRef.current;
    const summaryElement = summaryRef.current;
    const content = contentRef.current;
    details.open = desiredOpen.current;
    details.dataset.motion = "idle";

    // Motion values preserve interruption velocity and update DOM height without
    // re-rendering the project cards or course list on each frame.
    const unsubscribe = height.on("change", (value) => {
      if (animating.current) details.style.height = `${Math.max(minimumHeight.current, value)}px`;
    });
    const unsubscribeComplete = height.on("animationComplete", () => {
      if (animating.current) finish(desiredOpen.current);
    });
    const revealImmediately = () => changeOpen(true, { instant: true });
    const nativeToggle = () => {
      if (animating.current && details.open) return;
      if (details.open !== desiredOpen.current || animating.current) {
        changeOpen(details.open, { instant: true });
      }
    };
    const retarget = () => {
      if (!animating.current) return;
      if (Math.abs(measure(desiredOpen.current) - targetHeight.current) > 0.5) {
        changeOpen(desiredOpen.current, { notify: false });
      }
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(retarget);
    observer?.observe(content);
    observer?.observe(summaryElement);
    if (!observer) window.addEventListener("resize", retarget);
    details.addEventListener("toggle", nativeToggle);
    details.addEventListener("portfolio:open-disclosure", revealImmediately);

    return () => {
      animating.current = false;
      height.jump(height.get());
      unsubscribe();
      unsubscribeComplete();
      observer?.disconnect();
      window.removeEventListener("resize", retarget);
      details.removeEventListener("toggle", nativeToggle);
      details.removeEventListener("portfolio:open-disclosure", revealImmediately);
      details.style.removeProperty("height");
      details.style.removeProperty("overflow");
    };
  }, [changeOpen, finish, height, measure]);

  return (
    <details {...props} ref={detailsRef} className={`animated-disclosure ${className}`}
      data-expanded={expanded ? "true" : "false"}>
      <summary ref={summaryRef} className={summaryClassName} aria-expanded={expanded}
        aria-controls={contentId} onClick={(event) => {
          event.preventDefault();
          event.currentTarget.focus({ preventScroll: true });
          changeOpen(!desiredOpen.current);
        }}>
        {summary(expanded)}
      </summary>
      <div ref={contentRef} id={contentId} className="disclosure-content" onFocusCapture={() => {
        if (desiredOpen.current && animating.current) {
          changeOpen(true, { instant: true, notify: false });
        }
      }}>
        {children}
      </div>
    </details>
  );
}
