# Taskeroo public app and device demo

Public app: https://taskeroo-frontend.onrender.com

The owner supplied the real KTH-board and login screenshots and requested a
photorealistic laptop-and-phone demo, matching the portfolio's other app images.
The built-in image generation tool composites those screens into a staged device
mockup. The physical scene is generated; the supplied screenshots are the screen
content references. This is not a photograph of a runtime test session.

- The owner's KTH board screenshot was used on the laptop.
- The owner's login screenshot was used on the phone.
- `src/assets/project-originals/taskeroo-device-demo.png`: final original.
- `scripts/optimize-images.mjs`: selects this source for Taskeroo's responsive WebPs.

Reference screenshots and discarded variants remain in the local review workspace;
the PR includes the approved original and its responsive derivatives.

The public URL redirected to `/login` in the Codex browser on 16 October 2026,
displaying the matching Taskeroo welcome text and Continue with Google button.
No sign-in or authenticated board action was performed. The deployed app is
public; the source repository remains private and is not linked on the card.

Group attribution and course dates remain in the shared project record. ASK
receives the public app link and source-visibility note from that same record.

## Generation prompt

Mode: built-in image generation; screenshot compositing / product mockup.

```text
Use case: compositing / product-mockup
Asset type: photorealistic on-device portfolio project hero, landscape 3:2.
Input image 1: exact screen-content reference for the laptop, the real Taskeroo KTH board.
Input image 2: exact screen-content reference for the phone, the real Taskeroo login page.
Input image 3: photographic style reference only, the existing HabitGrower portfolio image. Do not copy its app or green UI.
Primary request: create a polished, believable product photograph of one open laptop and one upright smartphone together on a dark warm wooden desk, in the same restrained photographic family as image 3. The laptop sits slightly behind and to the left, the phone stands beside it on the right, overlapping only the keyboard edge, never obscuring the laptop screen. Use near-frontal screens with a gentle natural perspective so both interfaces remain readable. Soft directional light, realistic black glass and brushed metal, subtle contact shadows, shallow softly blurred neutral background. No people or extra devices.
Laptop screen: faithfully place the real interface from image 1 onto its display, preserving the white top navigation with Taskeroo's mark and L avatar, burgundy background, heading KTH, and the four white panels To Do / In Progress / Done / About. Preserve the red task cards and visible wording: Get married, Understand cache invalidation., Excel as a software engineer, Get a job, Graduate; About says Tracking studies and other stuff. Crop only excess empty burgundy space below the board to fit the laptop display; do not shrink the board to a tiny thumbnail or redesign its UI. Include the Delete Board control as part of the screenshot.
Phone screen: faithfully place image 2 onto the portrait display. Keep its burgundy background and centered off-white login card, real two-bar logo and Taskeroo wordmark, welcome sentence, Use your Google account to continue, and the red Continue with Google button. Preserve the screenshot's colors and proportions; do not invent a different login form or add credentials.
Composition: both devices and their important screen content centered in a compact horizontal group, with the laptop board and the phone's login card in the middle horizontal band. Leave breathing room around the devices. The image will be center-cropped to a wide portfolio card, so prioritize the real app screens over empty tabletop or a tall background.
Constraints: photorealism, accurate perspective-mapped screenshots, crisp screen detail, no glare hiding the app, no sketch/pencil styling, no floating UI, no added labels, captions, banners, watermarks, or fictional app content.
```
