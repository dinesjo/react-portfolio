import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import sharp from "sharp";
import {
  getProjectImageAssetId,
  getArtworkVariant,
  getResponsiveImageCandidates,
  toImageSrcSet,
} from "../src/utils/projectImageSources.js";

test("art direction follows the actual frame when text or layout changes", () => {
  assert.equal(getArtworkVariant(336, 224), "full");
  assert.equal(getArtworkVariant(484, 705), "portrait");
  assert.equal(getArtworkVariant(623, 623), "portrait");
  assert.equal(getArtworkVariant(876, 350), "panorama");
  assert.equal(getArtworkVariant(1096, 731), "full");
  assert.equal(getArtworkVariant(0, 0), "full");
});

test("responsive sources describe encoded pixel widths rather than requested resize widths", () => {
  const candidates = getResponsiveImageCandidates({
    assetId: "example", variant: "full", fallbackSrc: "/large.webp",
    urls: { "example-full-960.webp": "/small.webp", "example-full-1200.webp": "/medium.webp", "example-full.webp": "/large.webp" },
    dimensions: { "example-full-960.webp": { width: 960 }, "example-full-1200.webp": { width: 1122 }, "example-full.webp": { width: 1122 } },
  });
  assert.deepEqual(candidates, [{ src: "/small.webp", width: 960 }, { src: "/medium.webp", width: 1122 }]);
  assert.equal(toImageSrcSet(candidates), "/small.webp 960w, /medium.webp 1122w");
});

test("portrait and panorama sources use their own artwork family", () => {
  for (const variant of ["portrait", "panorama"]) {
    const filename = `example-${variant}.webp`;
    const candidates = getResponsiveImageCandidates({
      assetId: "example", variant, fallbackSrc: `/${filename}`,
      urls: { [filename]: `/${filename}`, "example-full.webp": "/landscape.webp" },
      dimensions: { [filename]: { width: 1120 }, "example-full.webp": { width: 1536 } },
    });
    assert.deepEqual(candidates, [{ src: `/${filename}`, width: 1120 }]);
    assert.equal(toImageSrcSet(candidates), undefined);
  }
});

test("small full-image previews can use a matching smaller encoded candidate", () => {
  const candidates = getResponsiveImageCandidates({
    assetId: "example", variant: "full", fallbackSrc: "/full.webp",
    urls: { "example-card-480.webp": "/small.webp", "example-full.webp": "/full.webp" },
    dimensions: { "example-card-480.webp": { width: 480, height: 320 }, "example-full.webp": { width: 1536, height: 1024 } },
  });
  assert.equal(toImageSrcSet(candidates), "/small.webp 480w, /full.webp 1536w");
});

test("landscape card artwork cannot replace the original portrait in the full-image viewer", () => {
  assert.deepEqual(getResponsiveImageCandidates({
    assetId: "example", variant: "full", fallbackSrc: "/portrait.webp",
    urls: { "example-card-480.webp": "/landscape.webp", "example-full.webp": "/portrait.webp" },
    dimensions: { "example-card-480.webp": { width: 480, height: 320 }, "example-full.webp": { width: 1120, height: 1400 } },
  }), [{ src: "/portrait.webp", width: 1120 }]);
});

test("custom gallery images do not silently acquire the project's first image", () => {
  assert.deepEqual(getResponsiveImageCandidates({
    assetId: "example", variant: "full", fallbackSrc: "/different-gallery-image.webp",
    urls: { "example-full.webp": "/project-preview.webp" },
    dimensions: { "example-full.webp": { width: 1800 } },
  }), []);
});

test("missing or invalid metadata falls back to the image src without a misleading srcset", () => {
  for (const width of [undefined, 0, -1, 1.5, "960"]) {
    assert.deepEqual(getResponsiveImageCandidates({
      assetId: "example", variant: "card", fallbackSrc: "/fallback.webp", urls: {},
      dimensions: { "example-card.webp": { width } },
    }), []);
  }
  assert.equal(toImageSrcSet([]), undefined);
});

test("project aliases and explicit media overrides resolve stable asset names", () => {
  assert.equal(getProjectImageAssetId({ id: "bachelor" }), "context-summarization-research");
  assert.equal(getProjectImageAssetId({ id: "pathvis-react" }), "react-pathfinding-visualizer");
  assert.equal(getProjectImageAssetId({ id: "custom", imageAssetId: "another-family" }), "another-family");
  assert.equal(getProjectImageAssetId({ id: "snuskoll" }), "snuskoll");
});

test("every published project image has dimensions matching its encoded file", async () => {
  const directory = new URL("../src/assets/project-optimized/", import.meta.url);
  const dimensions = JSON.parse(await readFile(new URL("dimensions.json", directory), "utf8"));
  const filenames = (await readdir(directory)).filter((filename) => filename.endsWith(".webp")).sort();
  assert.deepEqual(Object.keys(dimensions).sort(), filenames);
  await Promise.all(filenames.map(async (filename) => {
    const { width, height } = await sharp(new URL(filename, directory).pathname).metadata();
    assert.deepEqual(dimensions[filename], { width, height }, filename);
  }));
});
