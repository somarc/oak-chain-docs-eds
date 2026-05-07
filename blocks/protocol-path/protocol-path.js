/**
 * Protocol Path block.
 *
 * Numbered horizontal step cards. Each row is one step; the decorator
 * adds an auto-incrementing index. Wraps onto multiple rows on narrow
 * viewports.
 */
export default function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';
  rows.forEach((row, i) => {
    const cell = row.querySelector(':scope > div') || row;
    const step = document.createElement('div');
    step.className = 'protocol-step';
    const num = document.createElement('span');
    num.className = 'protocol-step-num';
    num.textContent = String(i + 1).padStart(2, '0');
    const text = document.createElement('span');
    text.className = 'protocol-step-text';
    text.textContent = cell.textContent.trim();
    step.append(num, text);
    block.appendChild(step);
  });
}
