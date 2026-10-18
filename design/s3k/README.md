# S3K Interrupt Capabilities

Added to the selected projects on 16 October 2026. This is an academic group project from KTH DD2497 (Project course in System Security), developed in November–December 2025.

The entry is now in the Project archive as part of a more focused main selection.
Its DD2497 connection and ASK source remain available; in-page links reveal the
archived entry automatically.

## Source review

Reviewed `cseas002/syssec-group7` through GitHub CLI and a temporary clone, at commit `f69d1b7` on `main`. The repository is private. The README lists Linus Dinesjö among the team, and Linus confirmed the collaboration. The portfolio describes the team's work without assigning individual implementation ownership.

The main evidence is `projects/interrupt_demo/REPORT.md`, checked against `kernel/src/cap_interrupt.c`, `kernel/src/interrupt.c`, the interrupt syscall handlers in `kernel/src/syscall.c`, the user-space API, and the two-process interrupt demo. The implementation introduces an interrupt capability type, range-based derivation and revocation operations, capability checks at registration/wait/acknowledgement, pending interrupt state, and a blocking wait/wake path. Other repository exercises cover UART input and capability-based process loading.

This was a source review; the kernel was not rebuilt or booted. The portfolio summary presents an experimental extension and demo programs, without claiming comprehensive security verification, measured latency, successful integration of every demo, or adoption by upstream S3K. The proposal's additional ideas are not treated as completed features.

## Public references

- [Upstream S3K](https://github.com/kth-step/s3k): the experimental capability-based separation kernel for embedded RISC-V; background on spatial and temporal partitioning, PMP, and capabilities. The card's “About S3K” link points here, rather than presenting upstream as the team's source code.
- [KTH STEP separation kernel research](https://kth-step.github.io/projects/separation-kernel/): research context.
- [KTH DD2497](https://www.kth.se/student/kurser/kurs/DD2497?l=en): course context.

## Artwork

The current portfolio uses an approved pencil-and-ink revision to match the other
course-project illustrations. Its source is
`src/assets/project-originals/s3k-interrupts-sketch-v2.png`; the earlier selected
render remains available below. The final generation and cleanup prompts are
recorded in [the course-project revision notes](../course-projects/revisions/PROMPTS.md).

Draft A, “Kernel and interrupt routing,” was selected on 16 October 2026 and installed as `src/assets/project-originals/s3k-interrupts.png`, from `design/s3k/a-kernel-routing.png`. It was generated with the built-in imagegen tool. All six responsive WebP derivatives are produced by `scripts/optimize-images.mjs`.

The processor, separated execution regions, and controlled interrupt route are a conceptual illustration of the software project, rather than an exact architecture diagram or an actual S3K processor. The only text is “S3K” on the central die. The image works in the wide card crop and the full-image viewer.

[Accepted generation prompt](DRAFT_PROMPTS.md#a--kernel-and-interrupt-routing) · [Image comparison](variants.html).

DD2497 now replaces DD2525 in the highlighted courses, linking to this group project as concrete related work.

The earlier sculptural-compartment image is preserved as `original-compartments.webp` for comparison. Its generation prompt follows.

### Original artwork prompt

```text
Use case: stylized-concept
Asset type: abstract editorial cover for a computer science portfolio project about extending S3K, an experimental RISC-V separation kernel, with capability-controlled interrupt handling.
Primary request: a restrained, abstract image with no text that evokes isolated software partitions and a carefully delegated signal. This is a conceptual illustration, not an exact architecture diagram.
Subject: one small sculptural computing structure made of three separate solid compartments, divided by substantial dark walls and narrow open gaps, arranged side by side on a thin common foundation. Each compartment contains a single simple geometric core. A single fine muted-coral signal path enters through one small deliberate gateway and terminates at just one core; the other compartments remain separate and quiet. Let the isolation, gate and single signal carry the idea without literal labels.
Style/medium: refined architectural model rendered in 3D, matte mineral and brushed dark metal, subtle translucent inserts, precise geometry, soft tactile shadows; calm editorial quality and no visual clutter.
Scene/backdrop: continuous warm ivory studio ground and background, fitting a light portfolio with charcoal typography and restrained coral accents.
Composition/framing: landscape 3:2. Moderately elevated three-quarter view. Compact sculpture centered in the middle horizontal half of the canvas, all meaningful geometry safely inside the central 70 percent so it remains readable when cropped to a wide project-card thumbnail. Generous breathing space, strong silhouette, no small technical details.
Lighting/mood: soft natural studio light, grounded contact shadows, measured and robust.
Text: none.
Constraints: no words, letters, numbers, logos, code, labels, diagram arrows, UI panels, metrics, shields, padlocks, hacker imagery, neon, glowing circuit-board cliches, decorative networks or watermark. Do not imply formal verification or a real hardware product.
```
