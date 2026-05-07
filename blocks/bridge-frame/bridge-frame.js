/**
 * Bridge Frame block.
 *
 * Two-column "what stays familiar | what is introduced" comparison.
 * The first row is treated as the column headers; subsequent rows are
 * paired bridge entries. Visually distinct from data-table — this is a
 * conceptual bridge, not a data grid.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  if (!rows.length) return;

  const head = rows.shift();
  const headCells = [...head.querySelectorAll(':scope > div')];
  const header = document.createElement('div');
  header.className = 'bridge-frame-head';
  headCells.forEach((c) => {
    const slot = document.createElement('div');
    slot.textContent = c.textContent.trim();
    header.appendChild(slot);
  });
  block.appendChild(header);

  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    const bridgeRow = document.createElement('div');
    bridgeRow.className = 'bridge-frame-row';
    if (cells[0]) {
      const old = document.createElement('div');
      old.className = 'bridge-frame-old';
      old.textContent = cells[0].textContent.trim();
      bridgeRow.appendChild(old);
    }
    if (cells[1]) {
      const neu = document.createElement('div');
      neu.className = 'bridge-frame-new';
      neu.textContent = cells[1].textContent.trim();
      bridgeRow.appendChild(neu);
    }
    block.appendChild(bridgeRow);
  });
}
