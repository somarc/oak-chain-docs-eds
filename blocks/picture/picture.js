/**
 * Picture block.
 *
 * Renders an <img> client-side from an authored src + optional alt + href +
 * caption, bypassing Helix's image-transform pipeline. Helix's pipeline
 * tries to fetch images from the content-bus and falls back to
 * `src="about:error"` for repo-static paths and DA-uploaded media that
 * aren't dropped via the DA editor.
 *
 * Authoring contract (positional cells):
 *   <div class="picture">
 *     <div><div>/diagrams/oak-chain-write-flow-plate.png</div></div>  src
 *     <div><div>Optional alt text</div></div>                         alt
 *     <div><div><a href="…">…</a></div></div>                         href (optional)
 *     <div><div><em>Optional caption</em></div></div>                 caption (optional)
 *   </div>
 *
 * Empty cells are skipped; positional intent is preserved.
 */
async function svgDimensions(src) {
  if (!src.toLowerCase().split(/[?#]/)[0].endsWith('.svg')) return null;
  try {
    const response = await fetch(src);
    if (!response.ok) return null;
    const source = await response.text();
    const viewBox = source.match(/viewBox=["']\s*[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)["']/i);
    if (viewBox) return { width: Number(viewBox[1]), height: Number(viewBox[2]) };
    const width = source.match(/<svg[^>]*\bwidth=["']([\d.]+)["']/i);
    const height = source.match(/<svg[^>]*\bheight=["']([\d.]+)["']/i);
    if (width && height) return { width: Number(width[1]), height: Number(height[1]) };
  } catch (error) {
    // The image still renders without intrinsic dimensions if metadata probing fails.
  }
  return null;
}

export default async function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const text = (i) => cells[i]?.textContent.trim() || '';
  const linkOf = (i) => cells[i]?.querySelector('a')?.getAttribute('href') || '';
  const captionOf = (i) => cells[i]?.querySelector('em, i')?.innerHTML
    || cells[i]?.innerHTML?.trim()
    || '';

  const src = text(0);
  const alt = text(1);
  const href = linkOf(2);
  const caption = captionOf(3);

  const dimensions = await svgDimensions(src);

  block.textContent = '';
  if (!src) return;

  const figure = document.createElement('figure');

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt;
  img.loading = 'lazy';
  img.decoding = 'async';
  if (dimensions) {
    img.width = dimensions.width;
    img.height = dimensions.height;
  }

  if (href) {
    const a = document.createElement('a');
    a.href = href;
    a.appendChild(img);
    figure.appendChild(a);
  } else {
    figure.appendChild(img);
  }

  if (caption) {
    const cap = document.createElement('figcaption');
    cap.innerHTML = caption;
    figure.appendChild(cap);
  }

  block.appendChild(figure);
}
