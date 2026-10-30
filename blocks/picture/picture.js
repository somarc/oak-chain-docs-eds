const KNOWN_DIMENSIONS = {
  'system-map': { width: 1600, height: 1320 },
  landscape: { width: 2800, height: 1600 },
};

/**
 * Picture block.
 *
 * Renders an <img> client-side from an authored src + optional alt + href +
 * caption, bypassing Helix's image-transform pipeline. Authored variants can
 * provide stable intrinsic dimensions for repo-static assets.
 *
 * Authoring contract (positional cells):
 *   <div class="picture system-map">
 *     <div><div>/diagrams/oak-chain-system-map-v2.svg</div></div>  src
 *     <div><div>Optional alt text</div></div>                         alt
 *     <div><div><a href="…">…</a></div></div>                         href (optional)
 *     <div><div><em>Optional caption</em></div></div>                 caption (optional)
 *   </div>
 *
 * Empty cells are skipped; positional intent is preserved. The src, alt and
 * href rows stay in the DOM as [data-config] (editable in Canvas, hidden when
 * published); the authored caption nodes move intact into the figcaption.
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const text = (i) => cells[i]?.textContent.trim() || '';
  const linkOf = (i) => cells[i]?.querySelector('a')?.getAttribute('href') || '';

  const src = text(0);
  const alt = text(1);
  const href = linkOf(2);
  const captionCell = cells[3];
  const dimensions = Object.entries(KNOWN_DIMENSIONS)
    .find(([variant]) => block.classList.contains(variant))?.[1];

  cells.slice(0, 3).forEach((cell) => { cell.parentElement.dataset.config = ''; });
  if (!src) return;

  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = block.classList.contains('system-map') ? 'eager' : 'lazy';
  img.decoding = 'async';
  if (block.classList.contains('system-map')) img.fetchPriority = 'high';
  if (dimensions) {
    img.width = dimensions.width;
    img.height = dimensions.height;
  }

  if (href) {
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.append(img);
    figure.append(anchor);
  } else {
    figure.append(img);
  }

  if (captionCell?.textContent.trim()) {
    const figcaption = document.createElement('figcaption');
    figcaption.append(...captionCell.childNodes);
    captionCell.parentElement.remove();
    figure.append(figcaption);
  }

  block.append(figure);
}
