// Run against an open local portfolio without sending any model requests:
// playwright-cli run-code --filename=scripts/check-project-filters.browser.js
async (page) => {
  const assert = (condition, message) => {
    if (!condition) throw new Error(message);
  };
  const controls = page.getByRole("group", { name: "Filter projects by context" });
  const settle = () => page.locator("#projects:not(:has([inert]))").waitFor({ state: "visible" });
  // domSnapshot is available when this check is run through the in-app browser.
  const snapshot = async () => { if (page.domSnapshot) await page.domSnapshot(); };
  const settleScroll = async () => {
    const deadline = Date.now() + 4000;
    let previous = null;
    let stable = 0;
    while (stable < 4 && Date.now() < deadline) {
      const current = await page.evaluate(() => document.scrollingElement.scrollTop);
      stable = current === previous ? stable + 1 : 0;
      previous = current;
      await new Promise((resolve) => setTimeout(resolve, 30));
    }
    assert(stable === 4, "The browser did not finish positioning the focused control.");
  };
  const select = async (filter) => {
    const button = controls.getByRole("button", { name: filter, exact: true });
    // Browser automation brings its target into view. Finish that positioning
    // before measuring whether the filter operation itself moves the page.
    await button.press("Shift");
    await settleScroll();
    const before = await controls.evaluate((element) => {
      const box = element.getBoundingClientRect();
      return { top: box.top, scroll: document.scrollingElement.scrollTop,
        visible: box.top >= 0 && box.bottom <= document.documentElement.clientHeight };
    });
    await button.click();
    await snapshot();
    await settle();
    if (before.visible) {
      const top = await controls.evaluate((element) => element.getBoundingClientRect().top);
      assert(Math.abs(before.top - top) <= 1,
        `${filter}: filtering moved the toolbar in the viewport (${before.top} → ${top}, scroll ${before.scroll}).`);
    }
  };

  await select("All");
  // Derive the inventory and ordering from the published page, not fixed counts.
  const inventory = await page.locator("#projects article").evaluateAll((articles) => articles.map((article) => ({
    id: article.id,
    context: (article.querySelector(".project-kind, .archive-card__meta")?.textContent ?? "").trim().split("·")[0].trim(),
    textFirst: article.querySelector(".case-study-layout")?.classList.contains("case-study-layout--text-first"),
  })));
  const filters = await controls.getByRole("button").allTextContents();
  assert(inventory.length > 0 && filters.length > 1, "Project inventory or filters are missing.");
  let transitions = 0;

  for (const from of filters) {
    await select(from);
    for (const to of filters) {
      await select(to);
      const expected = inventory.filter((project) => to === "All" || project.context === to);
      const actual = await page.locator("#projects .collection-group:not([aria-hidden]) .project-motion-card[data-present='true'] > article")
        .evaluateAll((articles) => articles.map((article) => ({
          id: article.id,
          textFirst: article.querySelector(".case-study-layout")?.classList.contains("case-study-layout--text-first"),
        })));
      assert(JSON.stringify(actual.map((project) => project.id)) === JSON.stringify(expected.map((project) => project.id)),
        `${from} → ${to}: wrong projects or ordering.`);
      assert(actual.every((project, index) => project.textFirst === expected[index].textFirst),
        `${from} → ${to}: a case-study image switched sides.`);
      const selected = await page.locator(".project-filter-controls [aria-pressed='true']").allTextContents();
      assert(selected.length === 1 && selected[0].trim() === to, `${to}: incorrect selection semantics.`);
      const status = await page.locator("#projects [role='status']").textContent();
      assert(status.trim().startsWith(`${expected.length} `), `${to}: result announcement is stale.`);
      assert(await controls.getByRole("button", { name: to, exact: true })
        .evaluate((button) => document.activeElement === button), `${to}: filter lost keyboard focus.`);
      transitions += 1;
      await select(from);
    }
  }

  await select("All");
  await controls.getByRole("button", { name: "All", exact: true }).press("Tab");
  await snapshot();
  assert(await controls.getByRole("button", { name: "Professional", exact: true })
    .evaluate((button) => document.activeElement === button), "Filter tab order changed.");
  await controls.getByRole("button", { name: "Professional", exact: true }).press("Enter");
  await snapshot();
  await settle();
  assert(await page.locator("#projects").evaluate((element) => element.dataset.filter === "Professional"),
    "Enter did not activate the focused filter.");
  await controls.getByRole("button", { name: "Professional", exact: true }).press("Tab");
  await snapshot();
  await controls.getByRole("button", { name: "Personal", exact: true }).press("Space");
  await snapshot();
  await settle();
  assert(await page.locator("#projects").evaluate((element) => element.dataset.filter === "Personal"),
    "Space did not activate the focused filter.");

  await select("All");
  const disclosure = page.locator(".archive-disclosure");
  if (!await disclosure.evaluate((element) => element.open)) {
    await page.locator(".archive-disclosure > summary").click();
    await snapshot();
  }
  await select("Professional");
  await select("Personal");
  assert(await disclosure.evaluate((element) => element.open), "Filtering discarded the open archive state.");

  // A real course link must recover a project that the active filter hides.
  await page.locator('.course-grid a[href="#project-s3k-interrupts"]').click();
  await snapshot();
  await page.locator("#project-s3k-interrupts").waitFor({ state: "visible" });
  await settle();
  const navigation = await page.evaluate(() => ({
    filter: document.getElementById("projects").dataset.filter,
    focus: document.activeElement?.id,
    archiveOpen: document.querySelector(".archive-disclosure").open,
    opacity: getComputedStyle(document.getElementById("project-s3k-interrupts").parentElement).opacity,
  }));
  assert(navigation.filter === "All" && navigation.focus === "project-s3k-interrupts" &&
    navigation.archiveOpen && Number(navigation.opacity) === 1,
  `Source navigation did not immediately reveal its target: ${JSON.stringify(navigation)}`);

  await select("All");
  return { transitions, inventory: inventory.length, keyboard: "passed", archiveState: "preserved", sourceNavigation: "passed" };
}
