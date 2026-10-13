const directions = {
  a3: {title:'Previous A3 · Combination contours', src:'a3-scania-combinations.webp', alt:'Previous A3: Scania components grouped by overlapping green solid and red dashed contours', copy:'The chosen subject, colours and reflective floor, with the earlier overlapping group treatment retained for comparison.', note:'The earlier contours show illustrative combinations. A3.1 simplifies their presentation.'},
  a31: {title:'A3.1 · Simple connections', src:'a31-scania-simple-links.webp', alt:'Refined A3: Scania components on a reflective warm floor, with three short green and red relationships and a TRATON GROUP logo at upper right', copy:'Three short, non-crossing links replace the overlapping contours. The components, colours and reflective floor retain A3’s character.', note:'TRATON branding uses the official mark as a reference. The logo is inset to remain readable in the desktop card crop. Coloured relationships are illustrative.'},
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
