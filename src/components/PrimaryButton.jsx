import { useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";
import {
  interactionSpring as spring, interactionPressSpring as pressSpring,
  instantInteraction as instant, interactionFeedback,
  stillInteractionVariants as stillVariants,
  interactionArrowVariants as arrowVariants,
  interactionExternalArrowVariants as externalVariants,
} from "../utils/interactionMotion";
const faceVariants = {
  rest: { x: 0, y: 0 },
  hover: { x: -1, y: -2 },
  pressed: { x: 1, y: 1, transition: pressSpring },
  disabled: { x: 0, y: 0 },
};
const depthVariants = {
  rest: { x: 4, y: 4, opacity: 1 },
  hover: { x: 5, y: 5, opacity: 1 },
  pressed: { x: 3, y: 3, opacity: 0.8, transition: pressSpring },
  disabled: { x: 0, y: 0, opacity: 0 },
};
const stillDepthVariants = {
  rest: { x: 4, y: 4, opacity: 1 }, hover: { x: 4, y: 4, opacity: 1 },
  pressed: { x: 4, y: 4, opacity: 0.65 }, disabled: { x: 0, y: 0, opacity: 0 },
};
const highlightVariants = {
  rest: { opacity: 0 }, hover: { opacity: 1 },
  pressed: { opacity: 0.35 }, disabled: { opacity: 0 },
};

export default function PrimaryButton({
  href, type = "button", className = "", children,
  icon, iconPosition = "start", iconMotion = "arrow", disabled = false,
  onClick, onFocus, onBlur, onKeyDown, onKeyUp, ...props
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pressed, setPressed] = useState(false);
  const controlRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const transition = reducedMotion ? instant : spring;
  const blocked = disabled || props["aria-disabled"] === true || props["aria-disabled"] === "true";
  const state = blocked ? "disabled" : pressed ? "pressed" : hovered || focused ? "hover" : "rest";
  const Control = href ? m.a : m.button;
  const canInteract = () => !blocked && !controlRef.current?.matches(":disabled");
  const animatedIcon = icon && (
    <m.span className="primary-button__icon" aria-hidden="true" transition={transition}
      variants={reducedMotion || iconMotion === "none" ? stillVariants : iconMotion === "external" ? externalVariants : arrowVariants}>
      {icon}
    </m.span>
  );

  return (
    <Control {...props} ref={controlRef} href={href} type={href ? undefined : type}
      disabled={href ? undefined : disabled}
      aria-disabled={blocked || undefined}
      tabIndex={href && blocked ? -1 : props.tabIndex}
      className={`primary-button ${className}`} data-button-state={state}
      initial={false} animate={state}
      onHoverStart={() => { if (canInteract()) setHovered(true); }}
      onHoverEnd={() => setHovered(false)}
      onTapStart={() => { if (canInteract()) setPressed(true); }}
      onTap={() => setPressed(false)} onTapCancel={() => setPressed(false)}
      onPointerDown={(event) => {
        if (event.pointerType) setFocused(false);
        props.onPointerDown?.(event);
      }}
      onFocus={(event) => {
        setFocused(canInteract() && event.currentTarget.matches(":focus-visible"));
        onFocus?.(event);
      }}
      onBlur={(event) => { setFocused(false); setPressed(false); onBlur?.(event); }}
      onKeyDown={(event) => {
        if (canInteract() && (event.key === "Enter" || (!href && event.key === " "))) {
          setFocused(true);
          setPressed(true);
        }
        onKeyDown?.(event);
      }}
      onKeyUp={(event) => {
        if (event.key === "Enter" || event.key === " ") setPressed(false);
        onKeyUp?.(event);
      }}
      onClick={(event) => {
        if (!canInteract()) { event.preventDefault(); return; }
        onClick?.(event);
      }}>
      <m.span aria-hidden="true" className="primary-button__depth" transition={transition} variants={reducedMotion ? stillDepthVariants : depthVariants} />
      <m.span aria-hidden="true" className="primary-button__face" transition={transition} variants={reducedMotion ? stillVariants : faceVariants}>
        <m.span className="primary-button__highlight" variants={highlightVariants}
          transition={reducedMotion ? instant : interactionFeedback} />
      </m.span>
      <m.span className="primary-button__content" transition={transition} variants={reducedMotion ? stillVariants : faceVariants}>
        {iconPosition === "start" && animatedIcon}
        <span className="primary-button__label">{children}</span>
        {iconPosition === "end" && animatedIcon}
      </m.span>
    </Control>
  );
}
