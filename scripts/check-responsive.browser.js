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
    [799, 900], [800, 900], [844, 320], [1279, 800], [1280, 800], [1440, 900], [1920, 1080], [2560, 1440],
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
  const loadImage = async (image) => {
    await image.scrollIntoViewIfNeeded();
    // Firefox can reject decode() before a newly visible lazy image starts loading.
    await page.waitForFunction((element) => element.complete && element.naturalWidth > 0, await image.elementHandle());
    await image.evaluate((element) => element.decode());
    await settle();
  };

  // Subject bounds recorded from the approved artwork, independent of the CSS slot.
  const checkArtwork = async (label) => {
    const image = page.locator(".featured-case-image--art-directed img");
    if (!await image.count()) return;
    await loadImage(image);
    const result = await image.evaluate((element) => {
      const frame = element.closest("button").getBoundingClientRect();
      const box = element.getBoundingClientRect();
      const scale = Math.max(box.width / element.naturalWidth, box.height / element.naturalHeight);
      const width = element.naturalWidth * scale;
      const height = element.naturalHeight * scale;
      const left = box.left + (box.width - width) / 2;
      const top = box.top + (box.height - height) / 2;
      return {
        variant: element.currentSrc.includes("portrait") ? "portrait" : element.currentSrc.includes("panorama") ? "panorama" : "landscape",
        fit: getComputedStyle(element).objectFit,
        crop: [(frame.left - left) / width, (frame.top - top) / height, (frame.right - left) / width, (frame.bottom - top) / height],
      };
    });
    const subjects = {
      landscape: [[0.50, 0.08, 0.84, 0.42], [0.16, 0.28, 0.37, 0.64], [0.42, 0.44, 0.82, 0.90]],
      portrait: [[0.47, 0.27, 0.86, 0.49], [0.13, 0.41, 0.41, 0.65], [0.415, 0.51, 0.895, 0.81]],
      panorama: [[0.53, 0.09, 0.77, 0.46], [0.30, 0.31, 0.44, 0.64], [0.47, 0.47, 0.74, 0.94]],
    };
    assert(result.fit === "cover", `${label}: artwork is letterboxed.`);
    for (const [left, top, right, bottom] of subjects[result.variant]) {
      const [cropLeft, cropTop, cropRight, cropBottom] = result.crop;
      assert(left >= cropLeft - 0.02 && top >= cropTop - 0.02 && right <= cropRight + 0.02 && bottom <= cropBottom + 0.02,
        `${label}: ${result.variant} crops the truck, engineer's head, or monitor: ${JSON.stringify(result.crop)}`);
    }
  };

  const checkLayout = async (label) => {
    await settle();
    const problems = await page.evaluate(() => {
      const visible = (element) => element.getClientRects().length > 0 &&
        getComputedStyle(element).visibility !== "hidden";
      const describe = (element) => `${element.tagName}: ${element.textContent.trim().slice(0, 80)}`;
      const viewportWidth = document.documentElement.clientWidth;
      const overflow = [...document.querySelectorAll("main *, nav *")].filter((element) => {
        // The indicator animates within the clipped navigation; links are checked separately.
        if (!visible(element) || element.closest(".sr-only") || element.matches(".site-nav__indicator")) return false;
        const bounds = element.getBoundingClientRect();
        return bounds.width > 0 && (bounds.left < -1 || bounds.right > viewportWidth + 1);
      });
      const clippedText = [...document.querySelectorAll("main p, main h1, main h2, main h3, main h4, main th, main td, main .course-row > span, main button:not(.work-image-trigger), nav a")]
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

  const checkLargerText = async (label, withArtwork = false) => {
    for (const width of [320, 390, 768, 1180]) {
      await page.setViewportSize({ width, height: 900 });
      for (const fontSize of [20, 24, 32]) {
        await page.evaluate((size) => { document.documentElement.style.fontSize = `${size}px`; }, fontSize);
        await checkLayout(`${label} ${width}px, ${fontSize}px text`);
        if (withArtwork) await checkArtwork(`${label} ${width}px, ${fontSize}px text`);
      }
      await page.evaluate(() => document.documentElement.style.removeProperty("font-size"));
    }
  };

  const checkImageLoading = async () => {
    let release;
    const gate = new Promise((resolve) => { release = resolve; });
    const delayImage = async (route) => { await gate; await route.continue(); };
    await page.route("**/*.webp", delayImage);
    try {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator("#detail-title").waitFor();
      const frame = page.locator(".detail-image-frame");
      await frame.scrollIntoViewIfNeeded();
      const before = await frame.boundingBox();
      assert(before.width > 150 && before.height > 100, "Case-study figure collapses before its image loads.");
      release();
      await loadImage(frame.locator("img"));
      const after = await frame.boundingBox();
      assert(Math.abs(before.width - after.width) < 1 && Math.abs(before.height - after.height) < 1,
        "Loading a case-study image changes its reserved frame.");
    } finally {
      release();
      await page.unroute("**/*.webp", delayImage);
    }
  };

  try {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(baseUrl);
    await page.locator(".priority-case-card").first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const caseRoutes = await page.locator('.case-card-actions > a[href^="#/work/"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    assert(caseRoutes.length > 0, "No case studies found; check the starting URL.");

    // Open disclosures so their contents participate in the layout checks.
    await page.locator(".archive-disclosure > summary").click();
    await page.locator(".course-record > summary").click();
    for (const image of await page.locator("main img").all()) {
      await loadImage(image);
    }

    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await checkLayout(`Portfolio ${width}×${height}`);
      await checkArtwork(`Artwork ${width}×${height}`);
      const cards = await page.locator(".priority-case-card").evaluateAll((elements) =>
        elements.map((element) => {
          const card = element.getBoundingClientRect();
          const image = element.querySelector(".featured-case-image").getBoundingClientRect();
          const content = element.querySelector(".priority-case-card__content").getBoundingClientRect();
          return { width: card.width, imageWidth: image.width, imageHeight: image.height, imageTop: image.top, contentTop: content.top };
        }));
      for (const card of cards) {
        if (width >= 1024 || card.imageWidth < card.width * 0.6) {
          assert(card.imageWidth < card.width * 0.6 && Math.abs(card.imageTop - card.contentTop) < 2,
            `${width}×${height}: a case study lost its two-column layout.`);
        } else {
          assert(card.imageHeight <= Math.max(240, height),
            `${width}×${height}: stacked artwork dominates the viewport.`);
        }
      }
    }

    await checkLargerText("Portfolio", true);

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
      await checkLargerText(route);
      await checkImageLoading();
    }
    assert(runtimeErrors.length === 0, `Browser errors: ${runtimeErrors.join("; ")}`);
    return { viewports: viewports.length, caseStudies: caseRoutes.length, layoutChecks: viewports.length * (caseRoutes.length + 1), largerTextChecks: 12 * (caseRoutes.length + 1), artworkChecks: viewports.length + 12, imageLoadingChecks: caseRoutes.length, viewerChecks: 4, runtimeErrors };
  } finally {
    await page.evaluate(() => document.documentElement.style.removeProperty("font-size"));
    page.off("pageerror", onPageError);
    await page.goto(baseUrl);
    await page.emulateMedia({ reducedMotion: null });
  }
}
