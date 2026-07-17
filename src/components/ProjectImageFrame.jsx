import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from "react-icons/fa";

const projectImageModules = import.meta.glob("../assets/project-optimized/*.webp", {
  eager: true,
  import: "default",
});

const projectImageUrls = Object.fromEntries(
  Object.entries(projectImageModules).map(([path, url]) => [path.split("/").pop(), url])
);

const projectImageAssetIds = {
  bachelor: "context-summarization-research",
  drone: "drone-relief-software",
  "pathvis-react": "react-pathfinding-visualizer",
  pathvis: "pathfinding-visualizer",
  this: "portfolio-site",
  vim: "vim-motions-guide",
};

const responsiveImageVariants = {
  card: [
    { suffix: "card-480", width: 480 },
    { suffix: "card-768", width: 768 },
    { suffix: "card", width: 960 },
  ],
  full: [
    { suffix: "full-960", width: 960 },
    { suffix: "full-1200", width: 1200 },
    { suffix: "full", width: 1800 },
  ],
};

const getProjectImageAssetId = (project) =>
  project.imageAssetId || projectImageAssetIds[project.id] || project.id;

const getResponsiveCandidates = (project, variant, fallbackSrc) => {
  const assetId = getProjectImageAssetId(project);
  const seen = new Set();

  return (responsiveImageVariants[variant] || [])
    .map(({ suffix, width }) => {
      const src = projectImageUrls[`${assetId}-${suffix}.webp`] ||
        (suffix === variant ? fallbackSrc : undefined);

      if (!src || seen.has(src)) return null;
      seen.add(src);

      return { src, width };
    })
    .filter(Boolean);
};

const toSrcSet = (candidates) =>
  candidates.length > 1
    ? candidates.map(({ src, width }) => `${src} ${width}w`).join(", ")
    : undefined;

const normalizeImages = (project) => {
  if (Array.isArray(project.images) && project.images.length > 0) {
    return project.images.map((image) => {
      if (typeof image === "string") {
        return {
          src: image,
          previewSrc: image,
          alt: project.title,
          caption: project.title,
        };
      }

      return {
        src: image.src,
        previewSrc: image.previewSrc || image.thumbnail || image.src,
        alt: image.alt || project.title,
        caption: image.caption || project.title,
      };
    });
  }

  return [{
    src: project.imageFull || project.image,
    previewSrc: project.image,
    alt: project.title,
    caption: project.title,
  }];
};

const imageOverlayStyles = {
  light: {
    expand:
      "border-white/70 bg-[var(--paper-strong)]/94 text-slate-950",
    modalShell:
      "border-white/30 bg-[var(--paper-strong)] shadow-2xl shadow-slate-950/30",
    modalHeader: "border-slate-200/70 text-slate-950",
    modalKicker: "text-[var(--coral)]",
    modalClose:
      "border-slate-300/70 bg-transparent text-slate-950 hover:bg-slate-950/5 focus-visible:ring-slate-950",
    modalPager:
      "border-white/70 bg-[var(--paper-strong)]/94 text-slate-950 hover:bg-white focus-visible:ring-slate-950",
    modalCounter: "border-slate-200/60 text-slate-500",
  },
  dark: {
    expand:
      "border-white/20 bg-[var(--ink)]/92 text-white",
    modalShell:
      "border-white/30 bg-[var(--paper-strong)] shadow-2xl shadow-slate-950/30",
    modalHeader: "border-slate-200/70 text-slate-950",
    modalKicker: "text-[var(--coral)]",
    modalClose:
      "border-slate-300/70 bg-transparent text-slate-950 hover:bg-slate-950/5 focus-visible:ring-slate-950",
    modalPager:
      "border-white/70 bg-[var(--paper-strong)]/94 text-slate-950 hover:bg-white focus-visible:ring-slate-950",
    modalCounter: "border-slate-200/60 text-slate-500",
  },
};

export default function ProjectImageFrame({
  project,
  displayImageSrc,
  frameClassName = "",
  imageClassName = "",
  imageSizes = "(min-width: 1024px) 50vw, (min-width: 640px) 50vw, calc(100vw - 48px)",
  children,
}) {
  const [loaded, setLoaded] = useState(false);
  const [loadedFullImages, setLoadedFullImages] = useState(() => new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const previewImageRef = useRef(null);
  const closeButtonRef = useRef(null);
  const dialogRef = useRef(null);
  const previousFocusRef = useRef(null);

  const images = useMemo(() => normalizeImages(project), [project]);
  const overlayTone = project.imageOverlayTone || project.featuredOverlayTone;
  const overlayStyle = imageOverlayStyles[overlayTone] || imageOverlayStyles.dark;
  const hasMultipleImages = images.length > 1;
  const currentImage = images[activeImage];
  const hasPreviewImage = currentImage.previewSrc && currentImage.previewSrc !== currentImage.src;
  const isFullImageLoaded =
    !hasPreviewImage || loadedFullImages.has(currentImage.src);
  const displaySrc = displayImageSrc || project.image;
  const displayVariant = displaySrc === project.imageFull ? "full" : "card";
  const displaySrcSet = toSrcSet(
    getResponsiveCandidates(project, displayVariant, displaySrc)
  );
  const currentImageSrcSet = toSrcSet(
    getResponsiveCandidates(project, "full", currentImage.src)
  );

  const closeModal = useCallback(() => setIsOpen(false), []);
  const markFullImageReady = useCallback((src, imageElement) => {
    const markReady = () => setLoadedFullImages((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });

    if (typeof imageElement.decode === "function") {
      imageElement
        .decode()
        .catch(() => undefined)
        .then(() => window.requestAnimationFrame(markReady));
      return;
    }

    markReady();
  }, []);
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
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    closeButtonRef.current?.focus();

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (hasMultipleImages && event.key === "ArrowLeft") showPrevious();
      if (hasMultipleImages && event.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (dialog?.open) dialog.close();
      window.removeEventListener("keydown", onKeyDown);
      previousFocusRef.current?.focus?.();
    };
  }, [closeModal, hasMultipleImages, images.length, isOpen, showNext, showPrevious]);

  useEffect(() => {
    setLoaded(false);

    const imageElement = previewImageRef.current;
    if (imageElement?.complete && imageElement.naturalWidth > 0) {
      setLoaded(true);
    }
  }, [displaySrc]);

  return (
    <>
      <div className={`relative ${frameClassName}`}>
        {!loaded && (
          <div className="absolute inset-0 z-0 animate-pulse bg-slate-200" />
        )}

        <button
          type="button"
          aria-label={`Open ${project.title} work image`}
          onClick={() => {
            setActiveImage(0);
            setIsOpen(true);
          }}
          className="work-image-trigger group/image relative z-[1] block h-full w-full cursor-zoom-in overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--coral)]"
        >
          <img
            ref={previewImageRef}
            src={displaySrc}
            srcSet={displaySrcSet}
            sizes={displaySrcSet ? imageSizes : undefined}
            alt={project.title}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={`${imageClassName} ${!loaded ? "opacity-0" : "opacity-100"}`}
          />

          <span className={`work-image-expand absolute right-4 top-4 grid h-9 w-9 place-items-center border opacity-0 transition duration-200 group-hover/image:opacity-100 group-focus-visible/image:opacity-100 ${overlayStyle.expand}`}>
            <FaExpand className="text-sm" />
          </span>
        </button>

        {children && (
          <div className="pointer-events-none absolute inset-0 z-10">
            {children}
          </div>
        )}
      </div>

      {isOpen && createPortal(
        <dialog
          ref={dialogRef}
          aria-label={`${project.title} work image preview`}
          onCancel={(event) => {
            event.preventDefault();
            closeModal();
          }}
          className="image-modal-dialog fixed inset-0 z-[80] m-0 h-[100dvh] max-h-none w-screen max-w-none items-center justify-center border-0 bg-transparent px-3 py-4 sm:px-6"
        >
          <div
            aria-hidden="true"
            onClick={closeModal}
            className="image-modal-backdrop absolute inset-0 cursor-zoom-out bg-[var(--ink)]/95 backdrop-blur-sm"
          />

          <div className={`image-modal-shell relative z-10 flex max-h-[calc(100dvh-2rem)] w-full max-w-6xl flex-col overflow-hidden border ${overlayStyle.modalShell}`}>
            <div className={`flex items-center justify-between gap-4 border-b px-4 py-3 sm:px-5 ${overlayStyle.modalHeader}`}>
              <div className="min-w-0">
                <p className={`font-montserrat text-xs font-extrabold uppercase tracking-[0.18em] ${overlayStyle.modalKicker}`}>
                  Work image
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
                className={`image-modal-control grid h-11 w-11 flex-shrink-0 place-items-center border transition focus:outline-none focus-visible:ring-2 ${overlayStyle.modalClose}`}
              >
                <FaTimes />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center bg-[linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%),linear-gradient(45deg,rgba(255,255,255,0.04)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.04)_75%)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] p-2 sm:p-4">
              <div key={currentImage.src} className="relative max-h-[calc(100dvh-9rem)] max-w-full">
                {hasPreviewImage && !isFullImageLoaded && (
                  <img
                    src={currentImage.previewSrc}
                    alt=""
                    aria-hidden="true"
                    className="work-modal-image max-h-[calc(100dvh-9rem)] max-w-full bg-white object-contain shadow-xl"
                  />
                )}

                <img
                  src={currentImage.src}
                  srcSet={currentImageSrcSet}
                  sizes={currentImageSrcSet ? "(min-width: 1152px) 1152px, calc(100vw - 2rem)" : undefined}
                  alt={currentImage.alt}
                  aria-hidden={hasPreviewImage && !isFullImageLoaded ? "true" : undefined}
                  decoding="async"
                  onLoad={(event) => markFullImageReady(currentImage.src, event.currentTarget)}
                  className={`${
                    hasPreviewImage && !isFullImageLoaded
                      ? "absolute inset-0 h-full w-full opacity-0"
                      : "max-h-[calc(100dvh-9rem)] max-w-full"
                  } work-modal-image bg-white object-contain shadow-xl`}
                />
              </div>

              {hasMultipleImages && (
                <>
                  <button
                    type="button"
                    aria-label="Previous work image"
                    onClick={showPrevious}
                    className={`modal-pager image-modal-control absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border transition focus:outline-none focus-visible:ring-2 ${overlayStyle.modalPager}`}
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    type="button"
                    aria-label="Next work image"
                    onClick={showNext}
                    className={`modal-pager image-modal-control absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border transition focus:outline-none focus-visible:ring-2 ${overlayStyle.modalPager}`}
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {hasMultipleImages && (
              <div className={`border-t px-4 py-3 text-center font-montserrat text-xs font-bold uppercase tracking-[0.16em] ${overlayStyle.modalCounter}`}>
                {activeImage + 1} / {images.length}
              </div>
            )}
          </div>
        </dialog>,
        document.body
      )}
    </>
  );
}
