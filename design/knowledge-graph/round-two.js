const directions = {
  a: {title:'Original A · Industrial cutaway', src:'a-industrial-cutaway.webp', alt:'Original A: unbranded exploded truck assembly with mostly green graph relationships', copy:'The selected first-round styling, retained here for comparison with the Scania variations.', note:'The earlier concept has an unbranded cab and more loosely interpreted mechanical shapes.'},
  a1: {title:'A1 · Relationship lines', src:'a1-scania-relationships.webp', alt:'Scania branded cab, inline-six engine, separate gearbox and two-axle chassis with green solid and red dashed links', copy:'The closest continuation of A: Scania branding, more faithful component shapes, and alternating green solid and red dashed relationships.', note:'Component shapes follow Scania product references. The coloured relationships are illustrative, not actual MAZE rules or certified Scania compatibility constraints.'},
  a2: {title:'A2 · Assembly layers', src:'a2-scania-assembly.webp', alt:'Scania cab and separate engine and gearbox raised above their positions on a two-axle tractor chassis', copy:'An orderly exploded assembly. The cab, engine and gearbox sit close to their mounting positions, with short red and green links between the layers.', note:'My preferred direction for a clear mechanical story. Scania reference shapes guide the parts; the red and green connections remain illustrative.'},
  a3: {title:'A3 · Combination contours', src:'a3-scania-combinations.webp', alt:'Scania cab and chassis with separate engine, gearbox and fuel tank grouped by green solid and red dashed contours', copy:'Subtle solid green and dashed red regions group several parts into combinations, avoiding a web of individual connections.', note:'The contours explore how to show complete combinations. The component groupings are illustrative, not actual Scania incompatibility rules.'},
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
  fill.checked = true;
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
