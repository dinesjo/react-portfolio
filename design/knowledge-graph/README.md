# A3.1 — simple connections and TRATON branding

Refined with the built-in imagegen tool on 13 October 2026. The user preferred A3's subject, colours and slightly reflective floor, and requested simple component links in place of overlapping groups plus a TRATON logo at top right.

## Current draft

- Image: `a31-scania-simple-links.webp` — 1448 × 1086 pixels.
- [Interactive comparison](http://127.0.0.1:8080/design/knowledge-graph/preview.html) — previous A3 versus A3.1, with full artwork and project-card views.

The refinement retains A3's Scania-branded cab, two-axle tractor chassis, inline-six engine-only unit, sole separate gearbox and separate diesel tank. It removes both closed contours and their tinted regions, retaining a continuous warm reflective floor. Three short, non-crossing links indicate the cab/chassis and engine/gearbox relationships in green, and the gearbox/tank relationship in dashed red. The relationships are illustrative, not certified compatibility constraints or real MAZE rules.

TRATON GROUP branding was guided by the official angular mark and the original case-study artwork. A targeted follow-up moves it farther inward within the upper-right area so that a square centre crop keeps the full logo. It is incorporated into the image itself.

## Accepted implementation

A3.1 is now installed as `src/assets/project-originals/master-thesis.png`, using the generated PNG source rather than a re-encoded preview. The existing optimizer regenerates all six responsive Knowledge Graph WebP assets. The project card fills its image frame at wide desktop widths; at 1024–1279 pixels it uses a full-width image above the text to protect the branding and links. Mobile also shows the entire composition. The case-study image has no inner padding or height cap. The caption and image alt text describe the new illustration. The previous poster is retained in `original-overview.webp` for comparison.

## References

- Edit target: `a3-scania-combinations.webp`.
- Original branding style reference: `original-overview.webp`.
- [Official TRATON logo media page](https://traton.com/en/newsroom/media-center/mediacenterresults.html?filter=logo&from=0&size=12&sort=relevance&teaser=4a5ad131-708c-45df-87bf-8750eb7c5a28&type=photos).
- [Official TRATON GROUP logo image used for geometry](https://traton.com/.imaging/mte/tab-theme/standardLandscape-XL/dam/01_Unternehmen/00_Landing-Page/02_Teaser/traton-group-logo-white-rgbpng/jcr%3Acontent/traton-group-logo-white-rgbpng).
- [Scania references and round-two prompts](ROUND_TWO_PROMPTS.md).

These remain generated editorial illustrations, not exact CAD or verified bills of materials. The main component shapes and counts have been visually reviewed.

## Earlier rounds

[Scania variations](round-two.html) · [first-round concepts](round-one.html) · [first-round prompts](ROUND_ONE_PROMPTS.md).

## Edit prompt

```text
Use case: precise-object-edit
Asset type: refined portfolio cover A3.1 — Scania components with simple relationships and TRATON branding.
Input images: Image 1 is the EDIT TARGET, the chosen A3 illustration. Image 2 is an OFFICIAL TRATON GROUP logo geometry reference (white lettering on transparent background); image 3 is the original case-study cover as a branding-placement/style reference only. Do NOT copy its graphs, charts, mechanical parts or overall poster layout.
Primary request: Keep the chosen A3 subject, camera, component placement, material colours, warm slightly reflective floor, lighting, soft contact shadows and subtle reflections. Replace the overlapping coloured group outlines with a very small number of obvious simple component-to-component relationships, and add TRATON GROUP branding at upper right.
Preserve all physical objects exactly as in image 1: the white SCANIA branded cab, complete black two-axle 4x2 tractor chassis, single engine-only inline-six unit, one separate G33-style gearbox, one separate aluminium fuel tank, normal black radiator, correct front steering wheels and rear dual wheels. No new parts, no changes to mechanical geometry or counts, no duplicate tanks or gearboxes.
Remove COMPLETELY the large green and red closed contours and their tinted region fills. Restore a continuous natural warm ivory floor underneath, with the original slightly polished / softly reflective finish, keeping the subtle component reflections. No overlapping groupings and no large enclosing arcs.
Add EXACTLY THREE short elegant relationship lines in the existing empty gaps, thin enough to remain secondary but readable:
1. A subdued forest-green SOLID connection from the lower/right edge of the Scania cab to the front region of the chassis.
2. A subdued forest-green SOLID connection between the nearest edges of the engine and the separate gearbox in the foreground.
3. A subdued warm red DASHED connection between the nearest edges of the gearbox and the separate fuel tank.
Each is one clean simple stroke with at most one soft bend. Lines must have unambiguous component endpoints, remain outside component silhouettes, never cross one another or run through an object. Place lines slightly above the floor in image space so they read as fine diagram connections rather than physical cables. At most tiny understated endpoint dots, no large ring nodes, arrows, glows or additional graph network. They illustrate conceptual relations, not verified Scania incompatibilities.
Branding: in the empty TOP-RIGHT area, add a clean modest dark charcoal/navy TRATON GROUP lockup matching the exact official angular letterforms of image 2 and the compact presentation of the original. "TRATON" above smaller widely spaced "GROUP". Match the proper distinctive angular A glyph, do not render an ordinary font approximation or misspell the name. Logo approx 15% of canvas width. Place it at about 70–86% of canvas width and 5–12% of canvas height, with generous clear space, to keep the full logo inside a square centre crop. It should feel like the top-right branding of a polished case-study illustration, not a huge headline. No solid background plaque, no border, no extra standalone Scania logo.
Output: same 4:3 landscape dimensions and full-bleed composition as image 1. No charts, labels, metrics, captions or extra text. Preserve the aesthetically calm industrial image and reflective floor. Make only the relationship cleanup and logo addition described above.
```

## Logo inset correction

```text
Use case: precise-object-edit
Image 1 is the edit target.
Make ONE change only: move the existing top-right TRATON GROUP logo LEFT by approximately 150 pixels on this 1448-pixel-wide image, without changing its typography, colour, scale, proportions or vertical position.
The logo currently extends almost to the right edge. Its new rightmost edge must be at approximately x=1250 pixels, leaving approximately 198 pixels of blank warm background to its right. Its leftmost edge should be around x=1000 pixels. Keep the top edge at approximately y=58 pixels. This keeps it in the upper-right part of the artwork but inside the centre square crop.
Erase its old position cleanly to the continuous original warm background. Do not add another logo. One TRATON GROUP logo total.
Keep ALL other pixels and all scene elements unchanged: Scania branding, cab geometry and position, chassis, engine-only inline-six, one gearbox, one fuel tank, reflective floor, lighting, reflections, shadows and exactly three short relationship links. Preserve the logo's existing correct angular letterforms. No new text, no extra curves or lines, no mechanical changes.
```
