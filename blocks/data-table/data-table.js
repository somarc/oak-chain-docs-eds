/**
 * Data Table block.
 *
 * Helix normalizes every <table> in authored content into a div-block where
 * the first cell of the first row becomes the block's class. To prevent
 * each table from becoming a different one-off block (.class, .property,
 * .tier, etc.), the converter prepends a "Data Table" row to every table
 * so Helix consistently labels them all `data-table`. This decorator
 * reads the resulting nested-div structure and renders a real <table>:
 *
 *   <div class="data-table">
 *     <div><div>Data Table</div></div>     ← title row (consumed)
 *     <div><div>Header A</div><div>Header B</div></div>  ← <thead>
 *     <div><div>cell</div><div>cell</div></div>          ← <tbody> rows
 *     …
 *   </div>
 */
function moveChildren(from, to) {
  while (from.firstChild) to.append(from.firstChild);
}

function precedingHeading(block) {
  const section = block.closest('.section');
  if (!section) return null;
  return [...section.querySelectorAll('h1, h2, h3, h4, h5, h6')]
    // eslint-disable-next-line no-bitwise
    .filter((heading) => heading.compareDocumentPosition(block) & Node.DOCUMENT_POSITION_FOLLOWING)
    .at(-1) || null;
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length < 2) return;

  // Drop the title row that exists only to anchor the class name.
  rows.shift();

  const headerCells = [...(rows.shift()?.children || [])];
  const bodyRows = rows;

  const table = document.createElement('table');
  const heading = precedingHeading(block);
  if (heading) {
    if (!heading.id) heading.id = `table-heading-${Math.random().toString(36).slice(2, 9)}`;
    block.setAttribute('role', 'region');
    block.setAttribute('aria-labelledby', heading.id);
    block.tabIndex = 0;
    const caption = document.createElement('caption');
    caption.className = 'visually-hidden';
    caption.textContent = heading.textContent.trim();
    table.append(caption);
  }

  if (headerCells.length) {
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    headerCells.forEach((cell) => {
      const th = document.createElement('th');
      th.scope = 'col';
      moveChildren(cell, th);
      tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
  }

  if (bodyRows.length) {
    const tbody = document.createElement('tbody');
    bodyRows.forEach((row) => {
      const tr = document.createElement('tr');
      [...row.children].forEach((cell) => {
        const td = document.createElement('td');
        moveChildren(cell, td);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  block.textContent = '';
  block.appendChild(table);
}
