const fullVariants = [
  { suffix: "full-960", width: 960, quality: 88 },
  { suffix: "full-1200", width: 1200, quality: 88 },
  { suffix: "full", width: 1800, quality: 88 },
];

export const projectImageVariants = {
  card: [
    { suffix: "card-480", width: 480, quality: 82 },
    { suffix: "card-768", width: 768, quality: 84 },
    { suffix: "card", width: 960, quality: 84 },
  ],
  full: fullVariants,
  portrait: [
    { suffix: "portrait-480", width: 480, quality: 86 },
    { suffix: "portrait-768", width: 768, quality: 88 },
    { suffix: "portrait", width: 1120, quality: 88 },
  ],
  panorama: fullVariants.map((variant) => ({ ...variant, suffix: variant.suffix.replace("full", "panorama") })),
};

const projectImageAssetIds = {
  bachelor: "context-summarization-research",
  drone: "drone-relief-software",
  "pathvis-react": "react-pathfinding-visualizer",
  pathvis: "pathfinding-visualizer",
  this: "portfolio-site",
  vim: "vim-motions-guide",
};

export const getProjectImageAssetId = (project) =>
  project.imageAssetId || projectImageAssetIds[project.id] || project.id;

export function getArtworkVariant(width, height) {
  if (!(width > 0 && height > 0)) return "full";
  const ratio = width / height;
  return ratio < 1.15 ? "portrait" : ratio > 1.75 ? "panorama" : "full";
}

export function getResponsiveImageCandidates({ assetId, variant, fallbackSrc, urls, dimensions }) {
  const fullSize = dimensions[`${assetId}-full.webp`];
  const matchingSmallVariants = projectImageVariants.card.slice(0, 2).filter(({ suffix }) => {
    const size = dimensions[`${assetId}-${suffix}.webp`];
    return size?.height > 0 && fullSize?.height > 0 &&
      Math.abs((size.width / size.height) / (fullSize.width / fullSize.height) - 1) < 0.01;
  });
  const variants = variant === "full"
    ? [...matchingSmallVariants, ...projectImageVariants.full]
    : projectImageVariants[variant] || [];
  const familyUrls = variants.map(({ suffix }) => urls[`${assetId}-${suffix}.webp`]).filter(Boolean);
  // A gallery image may belong to a different family from the project preview.
  if (fallbackSrc && familyUrls.length && !familyUrls.includes(fallbackSrc)) return [];

  const seenWidths = new Set();
  return variants.flatMap(({ suffix }) => {
    const filename = `${assetId}-${suffix}.webp`;
    const src = urls[filename] || (suffix === variant ? fallbackSrc : undefined);
    const width = dimensions[filename]?.width;
    if (!src || !Number.isInteger(width) || width <= 0 || seenWidths.has(width)) return [];
    seenWidths.add(width);
    return [{ src, width }];
  }).sort((first, second) => first.width - second.width);
}

export const toImageSrcSet = (candidates) => candidates.length > 1
  ? candidates.map(({ src, width }) => `${src} ${width}w`).join(", ")
  : undefined;
