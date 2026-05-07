/**
 * Axiom Grid block.
 *
 * Two-column principle cards. Each row is one axiom. Cell content can be
 * arbitrary markdown (heading, paragraphs, blockquote-style emphasis).
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  rows.forEach((row) => {
    const cell = row.querySelector(':scope > div') || row;
    const card = document.createElement('article');
    card.className = 'axiom-card';
    while (cell.firstChild) card.appendChild(cell.firstChild);
    block.appendChild(card);
  });
}
