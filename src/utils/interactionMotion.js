// Small, interruptible interactions share the primary buttons' firm spring.
// CSS color/opacity feedback uses the same easing in --ease-interaction.
export const interactionSpring = { type: "spring", stiffness: 460, damping: 34, mass: 0.65 };
export const interactionPressSpring = { type: "spring", stiffness: 680, damping: 42, mass: 0.6 };
export const instantInteraction = { duration: 0 };
export const interactionFeedback = { duration: 0.18, ease: [0.16, 1, 0.3, 1] };

export const stillInteractionVariants = {
  rest: { x: 0, y: 0 }, hover: { x: 0, y: 0 },
  pressed: { x: 0, y: 0 }, disabled: { x: 0, y: 0 },
};
export const interactionArrowVariants = {
  rest: { x: 0, y: 0 }, hover: { x: 2.5, y: 0 },
  pressed: { x: 0, y: 0 }, disabled: { x: 0, y: 0 },
};
export const interactionExternalArrowVariants = {
  ...interactionArrowVariants, hover: { x: 1.5, y: -1.5 },
};
