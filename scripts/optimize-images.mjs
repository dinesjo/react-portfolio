import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const sourceDir = "src/assets/project-originals";
const outputDir = "src/assets/project-optimized";
const techSourceDir = "src/assets";
const techOutputDir = "src/assets/tech-optimized";
const publicDir = "public";

const projectImageVariants = {
  card: [
    { suffix: "card-480", width: 480, quality: 82 },
    { suffix: "card-768", width: 768, quality: 84 },
    { suffix: "card", width: 960, quality: 84 },
  ],
  full: [
    { suffix: "full-960", width: 960, quality: 88 },
    { suffix: "full-1200", width: 1200, quality: 88 },
    { suffix: "full", width: 1800, quality: 88 },
  ],
};

const projectImages = [
  "ai-diary",
  "chess-reporter",
  "context-summarization-research",
  "deadline-tracker",
  "drone-relief-software",
  "fittrackr",
  "habit-grower",
  "logportal",
  "master-thesis-kgqa",
  "note-hero",
  "pathfinding-visualizer",
  "portfolio-site",
  "react-pathfinding-visualizer",
  "snuskoll",
  "thesis-tracker",
  "vim-motions-guide",
];

const sourceFiles = {
  "master-thesis-kgqa": "master-thesis.png",
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

const techImages = [
  { source: "aspnet.png", output: "aspnet.webp" },
  { source: "blazor.png", output: "blazor.webp" },
  { source: "c++.png", output: "cpp.webp" },
  { source: "ChatGPT.png", output: "chatgpt.webp" },
  { source: "csharp.png", output: "csharp.webp" },
  { source: "firebase.png", output: "firebase.webp" },
  { source: "kql.png", output: "kql.webp" },
  { source: "mui.png", output: "mui.webp" },
  { source: "sql.png", output: "sql.webp" },
  { source: "tailwind.png", output: "tailwind.webp" },
  { source: "typescript.png", output: "typescript.webp" },
  { source: "wxwidgets.png", output: "wxwidgets.webp" },
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
  const outputs = Object.values(projectImageVariants)
    .flat()
    .map((variant) => ({
      ...variant,
      output: path.join(outputDir, `${id}-${variant.suffix}.webp`),
    }));

  await Promise.all(outputs.map((variant) => writeWebp({
    input,
    output: variant.output,
    width: variant.width,
    quality: variant.quality,
  })));

  const [inputSize, ...outputSizes] = await Promise.all([
    fileSize(input),
    ...outputs.map((variant) => fileSize(variant.output)),
  ]);

  const sizeSummary = outputs
    .map((variant, index) => `${variant.suffix} ${formatKb(outputSizes[index])}`)
    .join(", ");

  return `${id}: ${formatKb(inputSize)} -> ${sizeSummary}`;
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

async function optimizeTechImage({ source, output }) {
  const input = path.join(techSourceDir, source);
  const outputPath = path.join(techOutputDir, output);

  await writeWebp({
    input,
    output: outputPath,
    width: 96,
    quality: 88,
  });

  const [inputSize, outputSize] = await Promise.all([
    fileSize(input),
    fileSize(outputPath),
  ]);

  return `${output}: ${formatKb(inputSize)} -> ${formatKb(outputSize)}`;
}

async function generateOpenGraphImage() {
  const output = path.join(publicDir, "og-image.png");
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <rect width="1200" height="630" fill="#f6f8fb"/>
      <path d="M0 0h1200v630H0z" fill="url(#grid)"/>
      <circle cx="1040" cy="98" r="230" fill="#ef4d5b" opacity="0.13"/>
      <circle cx="170" cy="548" r="260" fill="#2563eb" opacity="0.12"/>
      <rect x="76" y="76" width="1048" height="478" rx="32" fill="#ffffff" opacity="0.88"/>
      <rect x="76" y="76" width="1048" height="478" rx="32" fill="none" stroke="#d7deea" stroke-width="2"/>
      <rect x="120" y="124" width="96" height="96" rx="18" fill="#172033"/>
      <text x="168" y="188" text-anchor="middle" font-family="Montserrat, Arial, sans-serif" font-size="46" font-weight="800" fill="#ffffff">LD</text>
      <text x="120" y="294" font-family="Montserrat, Arial, sans-serif" font-size="74" font-weight="800" fill="#172033">Linus Dinesjö</text>
      <text x="120" y="364" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="500" fill="#667085">Computer science portfolio</text>
      <text x="120" y="434" font-family="Inter, Arial, sans-serif" font-size="29" font-weight="500" fill="#42526b">Web systems, research tools, and maintainable products.</text>
      <rect x="120" y="484" width="256" height="4" rx="2" fill="#ef4d5b"/>
      <text x="120" y="522" font-family="Montserrat, Arial, sans-serif" font-size="22" font-weight="800" fill="#2563eb" letter-spacing="2">linusdinesjo.github.io</text>
      <defs>
        <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M48 0H0V48" fill="none" stroke="#172033" stroke-opacity="0.035" stroke-width="2"/>
        </pattern>
      </defs>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png({
      compressionLevel: 9,
      adaptiveFiltering: true,
    })
    .toFile(output);

  return `og-image.png: ${formatKb(await fileSize(output))}`;
}

await mkdir(outputDir, { recursive: true });
await mkdir(path.join(outputDir, "icons"), { recursive: true });
await mkdir(techOutputDir, { recursive: true });

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

for (const image of techImages) {
  results.push(await optimizeTechImage(image));
}

results.push(await generateOpenGraphImage());

console.log(`Optimized ${results.length} image sources`);
for (const result of results) {
  console.log(`- ${result}`);
}
