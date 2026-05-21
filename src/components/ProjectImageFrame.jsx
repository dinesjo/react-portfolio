import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from "react-icons/fa";

const normalizeImages = (project) => {
  if (Array.isArray(project.images) && project.images.length > 0) {
    return project.images.map((image) => {
      if (typeof image === "string") {
        return { src: image, alt: project.title, caption: project.title };
      }

      return {
        src: image.src,
        alt: image.alt || project.title,
        caption: image.caption || project.title,
      };
    });
  }

  return [{
    src: project.imageFull || project.image,
    alt: project.title,
    caption: project.title,
  }];
};

export default function ProjectImageFrame({
  project,
  frameClassName = "",
  imageClassName = "",
  children,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const closeButtonRef = useRef(null);
  const previousFocusRef = useRef(null);

  const images = useMemo(() => normalizeImages(project), [project]);
  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeImage];

  const closeModal = useCallback(() => setIsOpen(false), []);
  const showPrevious = useCallback(
    () => setActiveImage((current) => (current - 1 + images.length) % images.length),
    [images.length]
  );
  const showNext = useCallback(
    () => setActiveImage((current) => (current + 1) % images.length),
    [images.length]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    previousFocusRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeModal();
      if (!hasMultipleImages) return;
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [closeModal, hasMultipleImages, images.length, isOpen, showNext, showPrevious]);

  return (
    <>
      <div className={`relative ${frameClassName}`}>
        {!loaded && (
          <div className="absolute inset-0 z-0 animate-pulse bg-slate-200" />
        )}

        <button
          type="button"
          aria-label={`Open ${project.title} image`}
          onClick={() => {
            setActiveImage(0);
            setIsOpen(true);
          }}
          className="group/image relative z-[1] block h-full w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--coral)] focus-visible:ring-offset-2"
        >
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className={`${imageClassName} ${!loaded ? "opacity-0" : "opacity-100"}`}
          />

          <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-md border border-white/25 bg-slate-950/72 text-white opacity-0 shadow-lg backdrop-blur-sm transition duration-200 group-hover/image:opacity-100 group-focus-visible/image:opacity-100">
            <FaExpand className="text-sm" />
          </span>

          <span className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-slate-950/86 to-slate-950/0 px-4 pb-4 pt-12 text-right font-montserrat text-[0.68rem] font-extrabold uppercase tracking-[0.16em] text-white transition duration-200 group-hover/image:translate-y-0 group-focus-visible/image:translate-y-0">
            View image
          </span>
        </button>

        {children && (
          <div className="pointer-events-none absolute inset-0 z-10">
            {children}
          </div>
        )}
      </div>

      {isOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} image preview`}
          className="fixed inset-0 z-[80] flex items-center justify-center px-3 py-4 sm:px-6"
        >
          <div
            aria-hidden="true"
            onClick={closeModal}
            className="absolute inset-0 cursor-zoom-out bg-slate-950/88 backdrop-blur-md"
          />

          <div className="relative z-10 flex max-h-[calc(100vh-2rem)] w-full max-w-6xl flex-col overflow-hidden rounded-lg border border-white/15 bg-slate-950 shadow-2xl shadow-slate-950/40">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white sm:px-5">
              <div className="min-w-0">
                <p className="font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] text-white/45">
                  Project image
                </p>
                <h3 className="truncate font-montserrat text-base font-extrabold sm:text-lg">
                  {currentImage.caption}
                </h3>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                aria-label="Close image preview"
                onClick={closeModal}
                className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-md border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <FaTimes />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-2 sm:p-4">
              <img
                src={currentImage.src}
                alt={currentImage.alt}
                className="max-h-[calc(100vh-9rem)] max-w-full rounded bg-white object-contain shadow-xl"
              />

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    aria-label="Previous project image"
                    onClick={showPrevious}
                    className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md border border-white/15 bg-slate-950/70 text-white backdrop-blur-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label="Next project image"
                    onClick={showNext}
                    className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md border border-white/15 bg-slate-950/70 text-white backdrop-blur-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className="border-t border-white/10 px-4 py-3 text-center font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-white/55">
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
