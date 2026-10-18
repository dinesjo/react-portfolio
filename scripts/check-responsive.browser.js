// Run with Playwright CLI against an already-open local or deployed portfolio:
// playwright-cli run-code --filename=scripts/check-responsive.browser.js
// This checks browser layout without sending questions to the model provider.
async (page) => {
  const baseUrl = page.url().split("#")[0];
  const viewports = [
    [320, 568], [320, 256], [360, 800], [375, 667], [390, 844],
    [414, 896], [480, 800], [600, 800], [639, 800], [640, 800],
    [700, 900], [768, 1024], [820, 1180], [844, 390], [960, 720],
    [1023, 768], [1024, 768], [1040, 780], [1180, 820],
    [1279, 800], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440],
  ];
  const runtimeErrors = [];
  const onPageError = (error) => runtimeErrors.push(error.message);
  page.on("pageerror", onPageError);

  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const settle = () => page.evaluate(() => new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  }));

  const checkLayout = async (label) => {
    await settle();
    const problems = await page.evaluate(() => {
      const visible = (element) => element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden";
      const describe = (element) => `${element.tagName}: ${element.textContent.trim().slice(0, 80)}`;
      const viewportWidth = document.documentElement.clientWidth;
      const overflow = [...document.querySelectorAll("main *, nav *")].filter((element) => {
        if (!visible(element) || element.closest(".sr-only")) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && (bounds.left < -1 || bounds.right > viewportWidth + 1);
      });
      const clippedText = [...document.querySelectorAll("main p, main h1, main h2, main h3, main h4, main th, main td, nav a")]
        .filter((element) => visible(element) && element.clientWidth > 1 &&
          !element.closest(".sr-only") && element.scrollWidth > element.clientWidth + 2);
      return {
        pageOverflows: document.documentElement.scrollWidth > viewportWidth + 1,
        overflow: overflow.map(describe),
        clippedText: clippedText.map(describe),
      };
    });
    assert(!problems.pageOverflows && !problems.overflow.length && !problems.clippedText.length,
      `${label}: ${JSON.stringify(problems)}`);
  };

  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(baseUrl);
    await page.locator(".priority-case-card").first().waitFor();
    const caseRoutes = await page.locator('.case-card-actions > a[href^="#/work/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert(caseRoutes.length > 0, "No case studies found; check the starting URL.");

    // Open disclosures so their contents participate in the layout checks.
    await page.locator(".archive-disclosure > summary").click();
    await page.locator(".course-record > summary").click();

    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await checkLayout(`Portfolio ${width}×${height}`);
      const cards = await page.locator(".priority-case-card").evaluateAll((elements) =>
        elements.map((element) => {
          const card = element.getBoundingClientRect();
          const image = element.querySelector(".featured-case-image").getBoundingClientRect();
          const content = element.querySelector(".priority-case-card__content").getBoundingClientRect();
          return { width: card.width, imageWidth: image.width, imageHeight: image.height, imageTop: image.top, contentTop: content.top };
        }));
      for (const card of cards) {
        if (width >= 1024) {
          assert(card.imageWidth < card.width * 0.6 && Math.abs(card.imageTop - card.contentTop) < 2,
            `${width}×${height}: a case study lost its two-column layout.`);
        } else {
          assert(card.imageHeight <= Math.max(240, height * 0.65),
            `${width}×${height}: stacked artwork dominates the viewport.`);
        }
      }
    }

    // The viewer must stay dismissible on both portrait and short landscape screens.
    for (const [width, height] of [[320, 256], [390, 844], [844, 390], [1180, 820]]) {
      await page.setViewportSize({ width, height });
      const trigger = page.locator(".priority-case-card .work-image-trigger").first();
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await dialog.waitFor();
      await settle();
      const fits = await dialog.evaluate((element) => {
        const shell = element.querySelector(".image-modal-shell");
        const bounds = shell.getBoundingClientRect();
        const close = element.querySelector('button[aria-label="Close image preview"]').getBoundingClientRect();
        return bounds.top >= 0 && bounds.bottom <= innerHeight &&
          shell.scrollHeight <= shell.clientHeight + 1 && close.width >= 44 && close.height >= 44 &&
          document.elementFromPoint(close.x + close.width / 2, close.y + close.height / 2)?.closest("button")?.getAttribute("aria-label") === "Close image preview";
      });
      assert(fits, `${width}×${height}: image viewer or close control is clipped.`);
      await page.keyboard.press("Escape");
      assert(await trigger.evaluate((element) => document.activeElement === element), "Viewer did not restore focus.");
      assert(await page.evaluate(() => document.body.style.overflow !== "hidden"), "Viewer left scrolling locked.");
    }

    for (const route of caseRoutes) {
      await page.goto(`${baseUrl}${route}`);
      await page.locator("#detail-title").waitFor();
      for (const [width, height] of viewports) {
        await page.setViewportSize({ width, height });
        await checkLayout(`${route} ${width}×${height}`);
      }
    }
    assert(runtimeErrors.length === 0, `Browser errors: ${runtimeErrors.join("; ")}`);
    return { viewports: viewports.length, caseStudies: caseRoutes.length, layoutChecks: viewports.length * (caseRoutes.length + 1), viewerChecks: 4, runtimeErrors };
  } finally {
    page.off("pageerror", onPageError);
    await page.goto(baseUrl);
    await page.emulateMedia({ reducedMotion: null });
  }
}
