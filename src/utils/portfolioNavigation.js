export function focusSection(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const href = event.currentTarget.getAttribute("href");
  if (!href?.startsWith("#") || href.startsWith("#/")) return;
  const target = document.getElementById(href.slice(1));
  target?.focus({ preventScroll: true });
}

export function getPortfolioView(hash) {
  if (hash.startsWith("#/work/")) return { type: "case-study", id: hash.slice(7) };
  return { type: "home" };
}
