# Scania cutaway variations — round two

Generated with the built-in imagegen tool on 13 October 2026. The user selected the first round's A styling and requested three Scania-branded variations with more accurate component shapes and red/green or alternative combination visualizations.

Open [the comparison](http://127.0.0.1:8080/design/knowledge-graph/preview.html). It includes original A, A1, A2 and A3, with full artwork and project-card framing. No production asset or consuming code has been changed.

## Files

- `a1-scania-relationships.webp`: closest to original A, with branded cab, separate engine and gearbox, and curved green solid / red dashed relationships.
- `a2-scania-assembly.webp`: layered exploded assembly, with components near their mounting positions. Recommended for the clearest mechanical composition.
- `a3-scania-combinations.webp`: solid green and dashed red contours around groups of components, exploring complete combinations instead of individual graph edges.

All three are 1448 × 1086 pixels. Generated PNG sources remain in the built-in imagegen output directory; the project previews are high-quality WebP copies.

## Accuracy work and limits

Official Scania images guided the cab/front branding, Super 13-litre inline-six engine, G33-type Opticruise gearbox, modular chassis and D-shaped aluminium tank. The prompts specify a consistent 4x2 tractor, with one steer axle and one rear drive axle. The selected renders were visually checked for those broad shapes and component counts. A1's first render duplicated the gearbox, which was removed with a targeted edit. A3's first render duplicated the diesel tank, which was also removed with a targeted edit.

These are generated editorial illustrations, not CAD exports, verified bill-of-materials drawings or exact depictions of a thesis vehicle. Detailed dimensions, connectors and every small fitting are not validated. Red/green paths and groups are illustrative and do not assert that the depicted production Scania components are incompatible or that these are real MAZE constraints. Green solid and red dashed styles avoid relying on colour alone.

## Official references

- [Scania Super powertrain](https://www.scania.com/group/en/home/products-and-services/trucks/super-powertrain.html)
- [Scania R-series specifications](https://www.scania.com/uk/en/home/products/trucks/r-series/r-series-specifications.html)
- [Super 13-litre engine image](https://www.scania.com/adobe/dynamicmedia/deliver/dm-aid--675171cb-ae15-4d4b-8b97-ee815a461687/21105-101.png?preferwebp=true&quality=85)
- [Opticruise gearbox image](https://www.scania.com/adobe/dynamicmedia/deliver/dm-aid--f074fba6-5ccc-4926-8fbd-7e376e1d6c50/21106-005.png?preferwebp=true&quality=85)
- [Modular chassis image](https://www.scania.com/adobe/dynamicmedia/deliver/dm-aid--2276aa2a-136b-46df-8ee4-aa014d416019/21140-001.png?preferwebp=true&quality=85)
- [Scania truck-front reference](https://www.scania.com/adobe/dynamicmedia/deliver/dm-aid--b9969560-cf12-49ae-8d8b-9bcac5a1c926/super-11-13.jpg?preferwebp=true&quality=90)

Reference images were downloaded to `/tmp/kg-scania-reference/` for generation guidance. They are not shipped as standalone project assets.

## First round

[Original comparison](round-one.html) and [original generation prompts](ROUND_ONE_PROMPTS.md). The first-round images remain available.

## Generation prompts

### A1 — relationship lines

```text
Use case: stylized-concept
Asset type: portfolio case-study cover draft A1, "Scania · relationship lines".
Primary request: Create a new version of the prior industrial cutaway styling with Scania branding, more faithful mechanical shapes, and a balanced mixture of green and red graph relationships. The image is an illustrative case-study cover, not a technical blueprint.
Input images: Image 1 is the prior draft, a STYLE AND DENSITY reference only. Images 2, 3, 4, 5 are official Scania PRODUCT GEOMETRY references: Super 13-litre INLINE SIX engine, Opticruise gearbox, modular chassis layout, and actual branded truck-front styling. Give these official references priority over the prior draft's mechanical shapes. Correct the prior draft's V-shaped engine appearance, duplicated gearbox and incomplete front axle.
Canvas: high resolution 4:3 landscape, warm off-white full-bleed backdrop, premium precise industrial CGI, matte realistic steel, aluminium and rubber, restrained soft shadows, gentle daylight. Large components occupy about 85% of the image. Keep the main Scania cab and engine within the central 75% so a square centre crop remains useful; outer extremities may extend near edges. No outer border or poster frame.
Composition: a large white next-generation Scania R-series Highline cab floats at upper left in three-quarter front view, with authentic SCANIA lettering centred on the grille below the windscreen, the small normal Scania griffin badge in its usual place, correct characteristic front lamps and grille. Use exactly one separate Scania Super 13-litre inline-six engine at lower left/centre, with six cylinders in a single row, narrow long black top cover, turbo and pipework consistent with the reference, silver sump, pale multi-blade front fan. No V8, no extra transmission attached to this engine. Exactly one separate compact silver Scania G33-type Opticruise gearbox with ribbed cast aluminium casing and bellhousing, reference-faithful proportions, in the middle-right. Exactly one black ladder-frame 4x2 tractor chassis below/right: front steering axle with one wheel on each side, one rear drive axle with dual tyres on each side, propeller shaft, suspension, rear fifth-wheel coupling; no phantom axles or missing front axle. Include a realistic black cooling pack and one D-shaped aluminium diesel tank near their normal positions, slightly separated from the chassis. Omit seats, dashboard, battery, giant disconnected exhaust pipe and other clutter.
Relations: connect selected components with FIVE clearly separated fine curved paths through the empty spaces: THREE forest-green SOLID connections and TWO muted red DASHED connections, alternating in the composition rather than nearly all green. Use tiny hollow ring endpoints only where a relationship meets a component. No large graph circles. These depict illustrative compatibility/constraint relationships, not physical hoses, so avoid running lines through metal, wheels or the engine. Keep connections visible but secondary to the actual parts. No neon, no glow, no dense web.
Text: only the authentic uppercase brand word "SCANIA" on the truck itself. No captions, labels, charts, metrics, legends, promotional text, screen chrome, badges, menus or standalone corner logos. Prioritize believable Scania details, mechanically coherent proportions and a calm crop-friendly composition.
```

### A1 — correction

```text
Use case: precise-object-edit
Asset type: corrected portfolio draft A1
Image 1 is the EDIT TARGET. Image 2 is the official Scania engine geometry reference. Image 3 is the official Scania gearbox geometry reference.
Keep the entire image 1 composition, Scania cab branding, white background, lighting, chassis, tank, radiator, separate upper-right gearbox, and relationship lines unchanged. Make exactly one mechanical correction:
The engine at the left currently has a SECOND gearbox attached at its rear/right end, visually recognizable as the long ribbed silver transmission extending behind the six-cylinder engine block. REMOVE that attached transmission completely. Keep the inline-six engine itself. The engine should end immediately at its normal short circular flywheel housing behind the engine block, as an engine-only unit; use Image 2 as the exact reference for its body proportions and rear termination. Do NOT remove the engine crankcase or sump. Do NOT shorten the six-cylinder engine block. Show one engine-only unit on the left and ONE gearbox total in the entire image, the existing separate upper-right reference-faithful G33 gearbox.
Place the existing nearby green relationship endpoint against the newly exposed engine flywheel edge if necessary. Preserve all other elements. No extra components, no additional text, no charts, no duplicate gearbox anywhere.
```

### A2 — assembly layers

```text
Use case: stylized-concept
Asset type: portfolio cover draft A2, "Scania · assembly layers".
Primary request: A restrained full-bleed industrial exploded view showing a coherent Scania truck assembly in layers, with green and red combination relationships integrated into the view. This is a new composition within the same refined white-background mechanical styling, not an infographic.
Input images: Images 1, 2, 3, 4 are OFFICIAL Scania geometry references: engine-only Super 13-litre inline-six unit, one Opticruise gearbox, modular chassis with its real side tanks and mounting layout, and actual Scania cab/front branding. Image 5 is a STYLE reference only. Its component placement is NOT to be copied; the new composition must be a coherent aligned exploded assembly rather than disconnected catalogue parts.
Canvas: 4:3 landscape, high resolution, warm off-white backdrop fills canvas, matte detailed steel, realistic aluminium and rubber, soft warm studio daylight and delicate grounding shadows. No external margins, frames, charts or labels.
Composition: three-quarter front-left overhead view, entire assembly running diagonally from the front at lower-left toward the rear at upper-right. Make the truck large, filling 85% of the canvas, central Scania grille safely within a square centre crop. Base layer: one complete black 4x2 tractor ladder chassis, exactly TWO axles: one front steer axle with single tyres, one rear drive axle with twin tyres on each side. Visible front tyres are essential. Rear fifth-wheel coupling above the drive axle. Keep its normal black cooling pack and one D-shaped aluminium fuel tank mounted near their correct locations. Expose clear empty central rails where the raised powertrain would fit.
Middle layer: exactly ONE reference-faithful Scania Super inline-six engine suspended just above its actual forward mounting position, facing the cooling pack, and exactly ONE compact ribbed silver G33-type Opticruise gearbox suspended behind the engine in line with it. The engine is an engine-only unit ending at a short circular flywheel housing, NO gearbox attached. The only gearbox sits separately behind it, its bellhousing toward the engine. Keep engine, gearbox and chassis on the same longitudinal assembly axis and close to correct relative scale. Engine and gearbox should be visually distinct, not duplicated. Driveshaft remains along the chassis centreline leading toward the rear differential.
Upper layer: one white Scania next-generation R-series Highline cab raised vertically above its normal front mounts, only enough separation to reveal the engine. The large authentic uppercase word "SCANIA" appears naturally on the front below the windscreen, normal small griffin badge, correct lighting and grille shapes. Keep the cab in the centre upper region, not pinned to the left edge. No floating seats or dashboard.
Relationship treatment: four thin clean paths in visible empty space between layers, alternating green SOLID, muted red DASHED, green SOLID, muted red DASHED, with subtle hollow attachment rings. Use straight/rounded-elbow paths and short branches that visually tie THREE components into one group, emphasizing a combination rather than a network of unrelated dots. No line intersects a metal surface or a tyre. The red and green lines are conceptual graph relationships, not hoses or a claim that this Scania model's standard engine and gearbox are incompatible.
Keep the physical assembly the protagonist. No extra text except truck branding, no oversized circles, no UI, no promotional logo corners, no glow or neon. Avoid phantom axles, V8 engines, duplicate engines or duplicate transmissions. Aim for the clear structural logic of a carefully made scale model.
```

### A3 — combination contours

```text
Use case: stylized-concept
Asset type: portfolio cover draft A3, "Scania · combination contours".
Primary request: Explore a quieter alternative to point-to-point graph lines: use two subtle ground-plane contours that group truck components into whole combinations. Retain premium realistic exploded Scania components, full-bleed warm white styling and no data text.
Input images: Images 1–4 are official Scania product geometry references: engine-only Super 13-litre INLINE SIX, G33 Opticruise gearbox, modular chassis/tank layout, authentic truck fronts. Image 5 is the previous industrial style reference only. Official geometry takes priority. This is a NEW composition. Do not copy the previous image's fake V engine, duplicated transmission, missing steer axle, seats or dashboard.
Canvas: landscape 4:3, high resolution, warm ivory background with subtle real material shading, highly detailed photorealistic industrial model photography/CGI, matte steel and aluminium, realistic rubber, soft daylight and delicate contact shadows. Artwork fills the canvas without a border. Components are large with deliberate breathing room, not tiny parts on an empty poster. Crop-safe central placement for the main cab and recognizable engine.
Physical scene: Arrange one large white next-generation Scania R-series Highline cab above/front of one complete black 4x2 tractor chassis, viewed three-quarter from the front-left with slightly more overhead angle than a catalogue shot. Authentic "SCANIA" lettering naturally centred on the cab-front panel below the windscreen; small normal griffin badge, correct grille and lamps. The chassis has ONE front steering axle with single wheels and ONE rear drive axle with dual wheels each side, real suspension, ladder rails, a centre prop shaft and rear fifth-wheel coupling. No missing front wheels, no third axle. Separate the cab enough that it feels like a modular configuration being assembled.
In the foreground, three clearly distinguished modules are shown alongside the chassis, correctly scaled: ONE Scania Super inline-six engine-only unit with six cylinders in a single row and front multi-blade cooling fan, reference-faithful turbo pipework and sump; ONE separate compact ribbed aluminium G33-type gearbox, large circular bellhousing at the engine end; ONE D-shaped aluminium diesel tank. The engine ends at its SHORT circular flywheel housing, no transmission attached. ONE gearbox total in the whole picture. A modest black cooling pack stays attached at the front of the chassis. Keep the engine and gearbox close to their physically plausible mounting orientations.
Combination visualization, not a network: draw one very thin muted forest-green solid closed contour on the ground plane that loosely groups the ENGINE, GEARBOX and CHASSIS mounting region. Draw a second muted red DASHED closed contour that loosely groups the CAB, GEARBOX and FUEL TANK as another complete combination. The two organic rounded contours may overlap in empty space, like elegant Venn regions around the bases of objects, showing that a part can belong to more than one combination. Each contour has a barely perceptible translucent tinted fill, at most 4% opacity, so components remain realistic. Do not turn contours into circles around each object, glowing holograms, physical pipes, mats or large coloured plinths. No point-to-point graph edges and no graph nodes. Both contours must be clearly visible, balanced, secondary to the components and easily distinguished by solid versus dashed line style.
The colours represent illustrative logical groupings, not certified Scania configuration constraints. No explanatory text anywhere; no legend, no labels, no charts, no numbers, no standalone logos. Truck branding is the only writing. Avoid neon, fantasy mechanical details, duplicate transmissions, inaccurate wheel counts and disconnected clutter.
```

### A3 — correction

```text
Use case: precise-object-edit
Asset type: corrected portfolio draft A3
Image 1 is the edit target; image 2 is the official Scania chassis geometry reference.
Keep all of image 1 unchanged except one duplication correction. There are currently TWO silver diesel tanks: one attached to the visible side of the chassis between the axles, and one larger separate diesel tank in the right foreground. REMOVE ONLY the attached silver diesel tank on the chassis. Leave its normal empty mounting location visible: black ladder rail, two realistic black support brackets and straps/support mounting points. This should show a clean empty bay where the separate foreground tank could fit.
KEEP the large separate foreground D-shaped aluminium tank unchanged. KEEP the Scania branded white cab unchanged. KEEP the engine-only inline-six and the sole separate G33 gearbox unchanged. KEEP both front and rear axles and all wheels, fifth wheel, cooling pack, other chassis details, green solid contour, red dashed contour, lighting, background and camera unchanged. Do not replace the removed tank with another cylinder, exhaust unit or a new tank. Do not add another engine or gearbox. One visible separate diesel tank total.
```
