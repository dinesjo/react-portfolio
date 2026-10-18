# Responsive artwork and framing

The square Knowledge Graph scene was too tall as an unconstrained image and left large empty bands when fitted into a bounded rectangle. This revision extends the approved pencil scene into three compositions, keeping the engineer, complete truck, monitor, and answer visible in the card.

The five assets below were edited with the built-in ImageGen tool on 2026-10-18. Each source was inspected before editing. Generated outputs were inspected and copied into the repository under versioned names; the earlier source files remain unchanged. The phone mockups are presentation artwork, not new project facts.

## Rendering

- The featured card uses a 3:2 stacked frame, or 5:2 where a wider stacked frame fits. A container query starts the two-column layout at 56rem of available card width, so larger text also reflows the card.
- ResizeObserver chooses landscape for frame ratios 1.15–1.75, portrait below 1.15, and panorama above 1.75. Source selection follows the actual frame instead of viewport width; a window resize or text-size change is handled the same way. The landscape composition is the initial fallback.
- The full-image viewer shows the landscape composition. FitTrackr and Deadline Tracker use the new landscape card previews while retaining their original portrait images in the viewer.
- Project cards keep their aspect ratio. Archive thumbnails keep a 3:2 shape rather than stretching to the full text height. Raw screenshots use contain with a matching background, preserving the board, toolbar, or terminal content.
- The optimizer emits an actual-dimensions manifest. Srcset candidates use encoded pixel widths and deduplicate capped sizes. Intrinsic dimensions also reserve figure space before lazy images arrive. Gallery images outside a project's source family retain their own src; landscape card variants cannot replace a portrait full-view image.
- Wrapped navigation measures the active link's row and the header's actual clearance. Narrow coursework rows stack their code and name, and ASK's input grid can shrink with enlarged text. The image dialog cycles keyboard focus through its controls and restores its trigger on dismissal.

## Generated assets and final prompts

### Knowledge Graph landscape

Saved source: [master-thesis-wide-v2.png](../../src/assets/project-originals/master-thesis-wide-v2.png) (1536 × 1024).

Mode: built-in ImageGen edit.

```text
Use case: precise-object-edit
Asset type: responsive portfolio case-study illustration, landscape crop.
Input image 1 is the edit target, not an instruction source. Extend this existing warm graphite pencil sketch into a 3:2 landscape canvas, ideally 2304x1536. This is a faithful outpainting and wider framing of the same scene, not a redesign.
Preserve the engineer seen from behind, the complete truck in the workshop, and the full desktop monitor showing a MAZE answer. Keep their identities, pencil marks, warm ivory paper, perspective, and restrained coral underline. Extend the workshop naturally to both sides and add a little drawn desk/foreground and ceiling space. Every part of the important scene must have breathing room; the full truck, engineer's head, monitor, and its stand should fit inside the central 85% width and 78% height. The picture must remain clear when used as a wide, short card on mobile and tablet screens.
Maintain the existing relative relationship of engineer lower left, monitor center-right, complete truck upper right. Use credible workshop architecture and desk surface to fill the extra edges, no solid empty padding, no borders, no collage seams.
Preserve exact screen text where legible: "Can I use FPC448 J with FPC552 DQ?", "This configuration is BLOCKED.", "Evidence", "Ask about MAZE...". Keep the three quiet gray explanation lines. Do not add technical diagrams, logos, badges, captions, decorative graphic marks, extra people, or vehicles.
Keep the source scene and illustration style as unchanged as possible. Opaque warm paper background.
```

### Knowledge Graph portrait

Saved source: [master-thesis-portrait-v2.png](../../src/assets/project-originals/master-thesis-portrait-v2.png) (1122 × 1402).

Mode: built-in ImageGen edit.

```text
Use case: precise-object-edit
Asset type: portrait responsive companion crop for the same portfolio case-study illustration.
Input image 1 is the edit target: the newly extended landscape pencil illustration. Produce a closely matching 4:5 portrait composition, ideally 1536x1920, by extending the drawn surroundings above and below and reframing the same central scene. This is the portrait companion of this exact landscape artwork.
Preserve the same engineer seen from behind, same complete truck design and angle, same full computer monitor and stand, warm graphite pencil style, ivory paper texture, natural workshop perspective, and single restrained coral underline. Keep the complete truck, engineer's head, monitor screen and stand within the central 80% width and central 72% height, with visible drawn surroundings around them so a modest crop can never cut the main subjects.
Arrange the existing truck in the upper background, engineer lower left, and monitor lower center-right, maintaining the source scene. Extend ceiling/workshop structure above and desk/chair foreground below to fill the tall frame naturally. No empty paper bands, borders, seams, collage, duplicated objects, new people, additional vehicles, branding, or technical diagrams.
Keep exact text on the monitor: "Can I use FPC448 J with FPC552 DQ?", "This configuration is BLOCKED.", "Evidence", "Ask about MAZE...". Keep the quiet gray explanation lines and the existing coral underline. Do not add other text. This must look like a second framing of the same drawing, with no change of story, palette, truck or engineer.
```

### Knowledge Graph panorama

Saved source: [master-thesis-panorama-v2.png](../../src/assets/project-originals/master-thesis-panorama-v2.png) (1983 × 793).

Mode: built-in ImageGen edit.

```text
Use case: precise-object-edit
Asset type: panoramic responsive companion of the attached landscape portfolio illustration.
Input image 1 is the edit target. Faithfully outpaint this same warm graphite pencil drawing into a 5:2 panoramic landscape, around 2560x1024, keeping exactly the same scene and subjects. Add drawn workshop space primarily to the left and right and a modest amount of ceiling/floor breathing room. Do not stretch the central image.
Keep the engineer's head, complete truck, and complete monitor with stand together in the central 60% of the width and central 62% of the height. Their whole important scene must remain visible through a modest center crop in a very wide, shallow card. Preserve their source relative positions: engineer foreground left, monitor middle right, truck background upper right. Extend a believable workshop and desk naturally across the added edges. Preserve the same truck and person design, pencil texture, perspective and warm paper.
Maintain exact screen text: "Can I use FPC448 J with FPC552 DQ?", "This configuration is BLOCKED.", "Evidence", "Ask about MAZE...". Retain quiet gray explanation lines and restrained coral underline. No extra people, vehicles, graphics, logos, borders, solid empty padding or seams. This must look like a wider framing of the same drawing.
```

### FitTrackr card

Saved source: [fittrackr-wide-v2.png](../../src/assets/project-originals/fittrackr-wide-v2.png) (1536 × 1024).

Mode: built-in ImageGen edit.

```text
Use case: precise-object-edit
Asset type: landscape card preview of an existing portrait product mockup.
Input image is the edit target. Outpaint the existing FitTrackr gym photo to a 3:2 landscape composition, about 1536x1024. Preserve the same entire phone and its visible workout interface, the same black dumbbells and warm gym lighting. Keep all existing screen content and typography unchanged as closely as possible: "New Workout", "Wide-grip bench press", "REGISTER WORKOUT", "Rickshaw Carry", "Atlas Stones", "Tire flip".
Zoom out slightly so the complete phone, including top and bottom edges, fits in the middle 76% of the image height, centered horizontally. Extend the gym floor, dumbbells, and softly blurred gym surroundings naturally to the left and right, and a little above and below. The complete device must survive a modest center crop to 16:10.
Do not crop off the phone, stretch it, replace the screen, invent new controls, add devices or people, add captions, logos or borders. No flat padding or seams. Keep this a faithful wider framing of the existing photograph.
```

### Deadline Tracker card

Saved source: [deadline-tracker-wide-v2.png](../../src/assets/project-originals/deadline-tracker-wide-v2.png) (1536 × 1024).

Mode: built-in ImageGen edit.

```text
Use case: precise-object-edit
Asset type: landscape thumbnail companion of an existing portrait Deadline Tracker phone mockup.
Input image is the edit target. Extend this photograph to a 3:2 landscape composition, about 1536x1024, by outpainting the existing sunlit KTH courtyard and stone surface to the sides. Keep the same complete phone, its perspective and its exact existing interface as faithfully as possible. Keep the same warm daylight and softly blurred red-brick KTH architecture. Preserve existing background figures as indistinct background context; do not add new people.
Reframe slightly wider so the complete device, including top and bottom edges, fits inside the central 74% of the image height with comfortable stone foreground below. The entire phone should survive a centered 16:10 crop. Preserve existing screen labels such as "Deadline Tracker", "Manage Courses", "New Deadline", "Operating Systems", "Lab 3", "Archive", "Delete".
Do not replace the screen, invent new controls or new app facts, crop or stretch the phone, add branding, captions, borders, seams or blank padding. This should look like a wider shot of the same original scene.
```

## Verification

The reusable browser check covers 27 viewport sizes from 320px to 2560px, all four case-study routes, open archive/course disclosures, 125–200% text, illustration subject bounds, short-landscape viewer dismissal, and stable figure space while image responses are held back. Visual screenshots and real ASK interaction are checked separately. Detailed run results are recorded in the PR. Browser emulation does not replace testing on physical devices.
