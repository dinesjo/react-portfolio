const directions = {
  current: {title:'Original · Poster composition', src:'original-overview.webp', alt:'Original overview, with truck assembly between two charts', copy:'The original overview put the industrial illustration between two small charts. Contain framing preserved the text but left blank bands in the desktop card.', note:'Archived original asset, retained for comparison with the selected refinement.'},
  a: {title:'A · Industrial cutaway', src:'a-industrial-cutaway.webp', alt:'Large exploded truck assembly with subtle graph relationships', copy:'A closer, larger assembly with the graph woven into the components. The strongest fit for the existing project card.', note:'Conceptual mechanical and graph relationships; this is an illustration, not a verified engineering drawing.'},
  b: {title:'B · Graph and answer', src:'b-graph-and-answer.webp', alt:'Illustrative graph with three options in one blocking combination and an evidence panel', copy:'Show the question and the complete blocking combination behind the answer. Best as a full-width explanatory figure.', note:'A conceptual workspace, not an implemented application screenshot or a real MAZE graph. The text needs the full image width.'},
  c: {title:'C · Research cover', src:'c-research-cover.webp', alt:'Dark editorial research cover with accuracy and median response time for three approaches', copy:'An editorial cover that leads with the practical result and retains the three-way benchmark comparison.', note:'Values match the case study: dense 77.1% / 5.34 s; hybrid 96.4% / 5.45 s; graph agent 98.2% / 21.62 s. This is a thesis benchmark, not production validation.'},
};
const preview = document.querySelector('#preview');
const mainImage = document.querySelector('#main-image');
const controls = document.querySelector('#card-controls');
const fill = document.querySelector('#fill-frame');
document.querySelectorAll('[data-direction]').forEach(button => button.addEventListener('click', () => {
  const key = button.dataset.direction;
  const direction = directions[key];
  document.querySelectorAll('[data-direction]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  mainImage.src = direction.src;
  mainImage.alt = direction.alt;
  document.querySelector('#direction-title').textContent = direction.title;
  document.querySelector('#direction-copy').textContent = direction.copy;
  document.querySelector('#direction-note').textContent = direction.note;
  document.querySelector('#asset-link').href = direction.src;
  fill.checked = key !== 'current';
  preview.dataset.fill = String(fill.checked);
}));
document.querySelectorAll('[data-view]').forEach(button => {
  if (button.tagName !== 'BUTTON') return;
  button.addEventListener('click', () => {
    document.querySelectorAll('button[data-view]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    preview.dataset.view = button.dataset.view;
    controls.hidden = button.dataset.view !== 'card';
  });
});
fill.addEventListener('change', () => { preview.dataset.fill = String(fill.checked); });
