/**
 * Bridge Frame block: a two-column spec table.
 *
 * "What stays familiar | What is introduced". The first row holds the
 * column heads; each later row is one paired entry. The decorator only
 * classifies the authored rows and cells (and exposes table semantics),
 * so Canvas keeps the editor identity of every cell.
 */
export default function decorate(block) {
  const [head, ...rows] = [...block.children];
  if (!head) return;
  block.setAttribute('role', 'table');

  head.classList.add('bridge-frame-head');
  head.setAttribute('role', 'row');
  [...head.children].forEach((cell) => cell.setAttribute('role', 'columnheader'));

  rows.forEach((row) => {
    row.classList.add('bridge-frame-row');
    row.setAttribute('role', 'row');
    const [old, added] = [...row.children];
    old?.classList.add('bridge-frame-old');
    added?.classList.add('bridge-frame-new');
    [...row.children].forEach((cell) => cell.setAttribute('role', 'cell'));
  });
}
