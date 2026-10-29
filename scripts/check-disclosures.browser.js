// Run against the local portfolio, without sending any model requests:
// playwright-cli run-code --filename=scripts/check-disclosures.browser.js
async (page, options = {}) => {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const snapshot = async () => { if (page.domSnapshot) await page.domSnapshot(); };
  const idle = (selector) => page.locator(`${selector}[data-motion='idle']`).waitFor({ state: "visible" });
  const read = (selector) => page.locator(selector).evaluate((element) => ({
    open: element.open,
    expanded: element.dataset.expanded,
    motion: element.dataset.motion,
    inlineHeight: element.style.height,
    overflow: element.style.overflow,
    summaryFocused: document.activeElement === element.querySelector("summary"),
    contentInert: element.querySelector(".disclosure-content").hasAttribute("inert"),
    contentHidden: element.querySelector(".disclosure-content").getAttribute("aria-hidden"),
    contentControls: element.querySelector("summary").getAttribute("aria-controls") === element.querySelector(".disclosure-content").id,
  }));
  const check = async (selector) => {
    const summary = page.locator(`${selector} > summary`);
    await idle(selector);
    if ((await read(selector)).open) {
      await summary.click();
      await snapshot();
      await idle(selector);
    }

    await summary.press("Enter");
    await snapshot();
    await idle(selector);
    let state = await read(selector);
    assert(state.open && state.expanded === "true" && state.contentControls &&
      !state.inlineHeight && !state.overflow && !state.contentInert,
    `${selector}: opening did not restore native automatic sizing: ${JSON.stringify(state)}`);

    await summary.press("Space");
    await snapshot();
    state = await read(selector);
    // The reduced-motion branch can complete before this observation.
    if (state.motion === "closing") {
      assert(state.open && state.expanded === "false" && state.contentInert && state.contentHidden === "true",
        `${selector}: closing content is still interactive.`);
    }
    await idle(selector);
    state = await read(selector);
    assert(!state.open && state.expanded === "false" && state.summaryFocused &&
      !state.inlineHeight && !state.overflow && !state.contentInert,
    `${selector}: closing left stale state: ${JSON.stringify(state)}`);

    // Reversing while the spring is running must honour the latest intent.
    await summary.click();
    await summary.click();
    await summary.click();
    await snapshot();
    await idle(selector);
    assert((await read(selector)).open, `${selector}: an interrupted animation closed the panel again.`);
    await summary.click();
    await summary.click();
    await summary.click();
    await snapshot();
    await idle(selector);
    assert(!(await read(selector)).open, `${selector}: an interrupted animation reopened the panel.`);
  };

  await page.getByRole("button", { name: "All", exact: true }).click();
  await snapshot();
  await page.locator("#projects:not(:has([inert]))").waitFor({ state: "visible" });
  await check(".archive-disclosure");
  await check(".course-record");
  const headerFits = await page.locator(".coursework-collection .collection-group-header--plain")
    .evaluate((element) => element.firstElementChild.getBoundingClientRect().width >= element.getBoundingClientRect().width * 0.9);
  assert(headerFits, "The course-record heading collapsed into the numbered-header column.");

  const navigate = options.navigate ?? page.goto?.bind(page);
  if (navigate) {
    // Derive a real course-year target from the published record.
    const ids = await page.locator(".course-record__year").evaluateAll((elements) => elements.map((element) => element.id));
    const baseUrl = await page.evaluate(() => document.URL.split("#")[0]);
    await navigate(`${baseUrl}#courses-carousel`);
    await snapshot();
    await page.locator(".course-record > summary").click();
    await snapshot();
    await idle(".course-record");
    await page.locator(".course-record > summary").click();
    await navigate(`${baseUrl}#${ids[0]}`);
    await snapshot();
    await page.locator(`#${ids[0]}`).waitFor({ state: "visible" });
    await idle(".course-record");
    const state = await read(".course-record");
    assert(state.open && !state.inlineHeight && !state.contentInert,
      "A source link did not finish the closing accordion before navigation.");
    assert(await page.evaluate((id) => document.activeElement?.id === id, ids[0]),
      "The revealed course year did not receive focus.");
  }
  return { archive: "passed", courses: "passed", keyboard: "passed", interruptions: "passed",
    sourceNavigation: navigate ? "passed" : "not exercised" };
}
