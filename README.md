## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server with hot module replacement:

```bash
npm run dev
```

### Build

Create a production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## Tailwind CSS

Tailwind CSS is integrated into the Vite build pipeline through PostCSS. No separate watch or build commands are needed:

- **Development**: Tailwind is automatically processed when running `npm run dev`
- **Production**: Tailwind is automatically built and optimized when running `npm run build`

The Tailwind configuration can be found in `tailwind.config.js`, and PostCSS settings are in `postcss.config.js`.
