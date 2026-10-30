/**
 * Protocol Path block: an assembly sequence.
 *
 * Each row is one step. The decorator only classifies the authored rows
 * and cells (and exposes list semantics); step numbers, the rail and its
 * tick marks are CSS, so Canvas keeps the editor identity of every step.
 */
export default function decorate(block) {
  block.setAttribute('role', 'list');
  [...block.children].forEach((row) => {
    row.classList.add('protocol-step');
    row.setAttribute('role', 'listitem');
    row.querySelector(':scope > div')?.classList.add('protocol-step-text');
  });
}
