import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = "src/assets/project-originals";
const outputDir = "src/assets/project-optimized";

const projectImages = [
  "ai-diary",
  "chess-reporter",
  "context-summarization-research",
  "deadline-tracker",
  "drone-relief-software",
  "fittrackr",
  "habit-grower",
  "logportal",
  "note-hero",
  "pathfinding-visualizer",
  "portfolio-site",
  "react-pathfinding-visualizer",
  "snuskoll",
  "thesis-tracker",
  "vim-motions-guide",
];

const sourceFiles = {
  "thesis-tracker": "thesis-tracker.jpg",
};

const icons = [
  "habit-grower-icon",
  "snuskoll-logo",
  "thesis-tracker-icon",
];

const standaloneImages = [
  {
    source: "portrait.png",
    output: "portrait.webp",
    width: 900,
    quality: 86,
  },
];

const formatKb = (bytes) => `${Math.round(bytes / 1024)}KB`;

async function fileSize(filePath) {
  const fileStat = await stat(filePath);
  return fileStat.size;
}

async function writeWebp({ input, output, width, quality }) {
  await sharp(input)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({
      effort: 5,
      quality,
      smartSubsample: true,
    })
    .toFile(output);
}

async function optimizeProjectImage(id) {
  const sourceFile = sourceFiles[id] || `${id}.png`;
  const input = path.join(sourceDir, sourceFile);
  const cardOutput = path.join(outputDir, `${id}-card.webp`);
  const fullOutput = path.join(outputDir, `${id}-full.webp`);

  await writeWebp({
    input,
    output: cardOutput,
    width: 960,
    quality: 84,
  });

  await writeWebp({
    input,
    output: fullOutput,
    width: 1800,
    quality: 88,
  });

  const [inputSize, cardSize, fullSize] = await Promise.all([
    fileSize(input),
    fileSize(cardOutput),
    fileSize(fullOutput),
  ]);

  return `${id}: ${formatKb(inputSize)} -> ${formatKb(cardSize)} card, ${formatKb(fullSize)} full`;
}

async function optimizeIcon(id) {
  const input = path.join(sourceDir, "icons", `${id}.png`);
  const output = path.join(outputDir, "icons", `${id}.webp`);

  await writeWebp({
    input,
    output,
    width: 160,
    quality: 90,
  });

  const [inputSize, outputSize] = await Promise.all([
    fileSize(input),
    fileSize(output),
  ]);

  return `${id}: ${formatKb(inputSize)} -> ${formatKb(outputSize)}`;
}

async function optimizeStandaloneImage({ source, output, width, quality }) {
  const input = path.join(sourceDir, source);
  const outputPath = path.join(outputDir, output);

  await writeWebp({ input, output: outputPath, width, quality });

  const [inputSize, outputSize] = await Promise.all([
    fileSize(input),
    fileSize(outputPath),
  ]);

  return `${output}: ${formatKb(inputSize)} -> ${formatKb(outputSize)}`;
}

await mkdir(outputDir, { recursive: true });
await mkdir(path.join(outputDir, "icons"), { recursive: true });

const results = [];

for (const id of projectImages) {
  results.push(await optimizeProjectImage(id));
}

for (const icon of icons) {
  results.push(await optimizeIcon(icon));
}

for (const image of standaloneImages) {
  results.push(await optimizeStandaloneImage(image));
}

console.log(`Optimized ${results.length} image sources`);
for (const result of results) {
  console.log(`- ${result}`);
}
