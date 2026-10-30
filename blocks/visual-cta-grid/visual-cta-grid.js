/**
 * Visual CTA Grid block: an index of destinations.
 *
 * Authoring contract: each row is one entry with a strong-wrapped link
 * (the title) followed by descriptive text.
 *
 *   <div class="visual-cta-grid">
 *     <div><div>
 *       <strong><a href="…">Open the full explainer</a></strong>
 *       View the complete interactive page…
 *     </div></div>
 *   </div>
 *
 * The decorator only classifies: authored rows, cells and links stay in
 * place so Canvas keeps their editor identity. Numbering, rules and the
 * trailing arrow are CSS.
 */
export default function decorate(block) {
  block.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    row.classList.add('visual-cta-item');
    row.setAttribute('role', 'listitem');
    const cell = row.querySelector(':scope > div');
    cell?.classList.add('visual-cta-body');
    const link = (cell || row).querySelector('a[href]');
    if (!link) return;
    link.classList.add('visual-cta-link');
    (link.closest('strong') || link).classList.add('visual-cta-title');
  });
}
