# Knowledge Graph image directions

Drafts generated with the built-in imagegen tool on 13 October 2026. The existing production image and its references are unchanged.

Open `preview.html` through the local portfolio dev server at `/design/knowledge-graph/preview.html`. The comparison includes the current artwork, three concepts, a full-image view, and a project-card view with both fill and contain modes. Desktop card dimensions approximate the current 623 by 623 pixel frame. Use the full-image view to read the text-heavy drafts.

## A — Industrial cutaway

Closest to the existing direction. Enlarges the mechanical assembly and removes the charts. Best candidate for the current project card because the image tolerates a crop. Illustrative mechanical and graph relationships; not a verified engineering drawing.

## B — Graph and answer

Focuses on the complete blocking-combination concept. A conceptual workspace/diagram, not an implemented application screenshot or a real MAZE graph. Better as a full-width case-study figure than as a cropped card.

## C — Research cover

An editorial cover using the exact accuracy and median response-time values in the current case-study data. Better at full width; cropping would remove text. The benchmark does not establish production reliability.

## Framing finding

The current desktop card explicitly uses `object-fit: contain`, unlike the cover fit on the other case-study cards. The current source is 4:3 while the desktop media frame is approximately square. This explains the blank bands. The detail image also has one rem of padding. A final implementation should select a crop-safe cover (or a separate cover composition), then remove those extra margins for this project. Choosing a concept is still pending.

## Generation prompts

### A

```text
Use case: stylized-concept
Asset type: draft portfolio case-study cover, variant A: Industrial cutaway.
Primary request: Create a new refined industrial visualization of truck-component compatibility research. Image 1 is a subject reference only, not an edit target. Rebuild the composition.
Canvas: landscape 4:3, high resolution. Full bleed, image artwork fills the entire canvas, no border or poster margin. Close-up three-quarter overhead view of a white European heavy truck with its cab, chassis, engine, transmission and fuel tank separated in a physically coherent exploded assembly. The assembly fills roughly 85% of the canvas, with parts deliberately extending toward the edges. Cab large and dominant, detailed mechanical parts, realistic restrained engineering visualization, matte materials, soft shadows. Warm off-white background matching a refined editorial portfolio.
Connect a small selection of the mechanical parts using fine curved graph relationship lines and tiny ring nodes. Use desaturated teal for ordinary graph relationships, one muted terracotta relationship to suggest a constraint. The graph is integrated into the physical arrangement and visually readable, never an indiscriminate web of glowing dots.
Style: premium industrial CGI with an architectural model sensibility, clean and precise, subtle depth and warm light. Not an infographic. Keep it calm, elegant, industrial, credible.
Constraints: no charts, no numbers, no captions, no logos, no writing anywhere including on truck. No brand emblems, no gradients for their own sake, no HUD, no dashboard, no floating user-interface cards, no decorative status labels, no border, no laptop or screen bezel. The central composition must also look strong in a narrow project card; it should be more immediate and less cluttered than the reference. This is an illustrative conceptual cover, not an actual MAZE graph or engineering blueprint.
```

### B

```text
Use case: ui-mockup
Asset type: draft portfolio case-study cover, variant B: Graph and answer.
Primary request: Design a polished, full-bleed conceptual research workspace showing how a natural-language truck-component compatibility question is grounded in a knowledge graph. This is an illustrative concept, not a screenshot of an existing application.
Canvas: landscape 4:3. Artwork/UI occupies the entire image edge to edge with no external margin, no browser frame, no laptop, no screen bezel.
Layout: warm off-white background, deep navy typography, restrained terracotta selection lines, muted blue-grey secondary edges. Large main graph area on the left two thirds; a clearly integrated plain evidence panel on the right third, separated by a thin rule. No disconnected floating cards. This must look like an elegant serious research tool, with a readable graph that tells one simple story rather than a decorative network.
At the top of the main graph use a large, clear serif heading, exactly: "Can these components be used together?" Under it a small line exactly: "An illustrative compatibility question".
Graph: Use approximately ten circular ring nodes and thin relationships. Three selected large nodes form a triangle and are visibly grouped together inside one translucent warm grey oval outline, representing a single complete blocking combination, not three independent pairwise incompatibilities. Label these three nodes exactly: "Option A", "Option B", "Option C". Inside the oval, below the nodes, the label exactly: "Blocking combination". Surround with a handful of smaller secondary nodes, sparse and muted, no extra text. Give the main graph generous size and readable spacing, extending near the lower and left edges for an immersive full-canvas composition.
Right panel: small all-caps label exactly "GRAPH EVIDENCE", large restrained serif title exactly "One complete match." A fine terracotta line. Then exactly: "All three options belong to the same blocking combination." Beneath, a short list with exactly "Option A", "Option B", "Option C", using simple typographic rows, no green checkmark dots. At bottom a small note exactly: "Illustrative example".
Style: meticulous typesetting, premium editorial software design, quiet hierarchy, very subtle material depth around graph nodes, no neon, no cyberpunk, no giant AI emblem, no decorative ready/online labels, no unrelated menus, no logos, no arbitrary statistics, no fake code. Make the graph read clearly at thumbnail size and the text legible when opened.
```

### C

```text
Use case: productivity-visual
Asset type: draft portfolio case-study cover, variant C: Research cover.
Primary request: Create a beautifully typeset editorial research cover for industrial knowledge graph question answering. The artwork must be immersive and full bleed, occupying a landscape 4:3 canvas edge to edge. No outer white margin, no frame, no browser, no laptop, no logos.
Background: deep midnight navy, matte with very subtle paper texture, warm ivory typography, restrained copper/terracotta and desaturated teal accents. Quiet scientific publication style, strong typographic hierarchy.
Upper left: small uppercase label exactly "INDUSTRIAL KNOWLEDGE GRAPH QA". Beneath it a very large editorial serif headline exactly "Exact matches." on one line or two, then exactly "Better answers." Display a very large number exactly "96.4%" and a restrained label exactly "Hybrid retrieval verdict accuracy".
Upper right: an elegant dimensional graph built from a small set of floating matte metal component abstractions inspired by engine, gearbox, chassis, fuel tank and truck cab, suspended among thin precise connecting lines. Architectural-model quality, soft directional lighting, no neon, no glowing network, no fantasy spaceship. These form an intelligent industrial graph that extends toward the upper and right edges. The graph connects and partly overlaps the type area without obscuring any text. Use sparse ring nodes and subtle copper selected relationships. Illustration should take about 40% of the canvas and balance the strong typesetting.
Lower portion: separated from main area by a hairline rule, three evenly spaced text columns, typeset cleanly. Small heading above columns exactly "VERDICT ACCURACY / MEDIAN RESPONSE TIME".
Column 1 exact lines: "Dense retrieval" then "77.1%" then "5.34 s".
Column 2 exact lines: "Hybrid retrieval" then "96.4%" then "5.45 s". Underline this column with a small copper rule to show the thesis's practical default.
Column 3 exact lines: "SPARQL graph agent" then "98.2%" then "21.62 s".
At bottom left small exact footer: "280 questions · thesis benchmark". At bottom right small exact footer: "Illustrative research cover".
Constraints: all text verbatim, no extra metrics, no invented bar charts or boxplots, no error bars, no badges, no ready/online labels, no decorative colored status dots, no interface menus. Reflect only these benchmark values, do not imply production validation. The image must be readable and compelling as a portfolio project cover and at fullscreen size. Typography stays within a modest safe inset; illustration fills to canvas edges.
```
