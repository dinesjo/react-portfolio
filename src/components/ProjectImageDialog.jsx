import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import * as m from "motion/react-m";

// AnimatePresence keeps this component mounted through its exit animation, so
// the native modal, scroll lock, and focus trap all share the same lifetime.
export default function ProjectImageDialog({
  title,
  onClose,
  onPrevious,
  onNext,
  hasMultipleImages,
  returnFocusRef,
  shellClassName,
  children,
}) {
  const dialogRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    const returnFocusElement = returnFocusRef.current;
    const previousOverflow = document.body.style.overflow;

    if (!dialog.open) dialog.showModal();
    dialog.querySelector("button")?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (hasMultipleImages && event.key === "ArrowLeft") {
        event.preventDefault();
        onPrevious();
      }
      if (hasMultipleImages && event.key === "ArrowRight") {
        event.preventDefault();
        onNext();
      }
      if (event.key !== "Tab") return;

      const controls = [...dialog.querySelectorAll("button:not(:disabled)")];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (first && (!dialog.contains(document.activeElement) ||
        (event.shiftKey && document.activeElement === first) ||
        (!event.shiftKey && document.activeElement === last))) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      }
    };

    dialog.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      dialog.removeEventListener("keydown", onKeyDown);
      if (dialog.open) dialog.close();
      if (returnFocusElement?.isConnected) {
        returnFocusElement.focus({ preventScroll: true });
      }
    };
  }, [hasMultipleImages, onNext, onPrevious, returnFocusRef]);

  return (
    <m.dialog
      ref={dialogRef}
      aria-label={`${title} work image preview`}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      initial="closed"
      animate="open"
      exit="closed"
      className="image-modal-dialog fixed inset-0 z-80 m-0 h-dvh max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent px-3 py-4 sm:px-6"
    >
      <m.div
        aria-hidden="true"
        onClick={onClose}
        variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
        transition={{ duration: reducedMotion ? 0 : 0.18, ease: "easeOut" }}
        className="image-modal-backdrop absolute inset-0 cursor-zoom-out bg-(--ink) backdrop-blur-xs"
      />
      <m.div
        variants={{
          closed: {
            opacity: 0,
            y: reducedMotion ? 0 : 14,
            scale: reducedMotion ? 1 : 0.985,
            transition: { duration: reducedMotion ? 0 : 0.16, ease: "easeOut" },
          },
          open: { opacity: 1, y: 0, scale: 1 },
        }}
        transition={{
          type: "spring", stiffness: 420, damping: 36, mass: 0.8,
          opacity: { duration: reducedMotion ? 0 : 0.16 },
        }}
        className={`image-modal-shell relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden border ${shellClassName}`}
      >
        {children}
      </m.div>
    </m.dialog>
  );
}
