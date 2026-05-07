/**
 * Hero Oak block.
 *
 * Custom hero for the Oak Chain homepage. Six positional cells:
 *   1. Title (rendered with the brand gradient)
 *   2. Tagline
 *   3. Body paragraph
 *   4. Primary CTA link
 *   5. Secondary CTA link
 *   6. Signal chips — bullet-separated short phrases
 */
export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const text = (i) => cells[i]?.textContent.trim() || '';
  const link = (i) => cells[i]?.querySelector('a');

  block.textContent = '';

  const title = document.createElement('h1');
  title.className = 'hero-oak-title';
  title.textContent = text(0);

  const tagline = document.createElement('p');
  tagline.className = 'hero-oak-tagline';
  tagline.textContent = text(1);

  const body = document.createElement('p');
  body.className = 'hero-oak-body';
  body.textContent = text(2);

  const ctas = document.createElement('div');
  ctas.className = 'hero-oak-ctas';
  const primary = link(3);
  if (primary) {
    primary.classList.add('hero-oak-cta', 'hero-oak-cta-primary');
    ctas.appendChild(primary);
  }
  const secondary = link(4);
  if (secondary) {
    secondary.classList.add('hero-oak-cta', 'hero-oak-cta-secondary');
    ctas.appendChild(secondary);
  }

  const chips = document.createElement('div');
  chips.className = 'hero-oak-chips';
  text(5).split(/\s*[·•|]\s*/).filter(Boolean).forEach((phrase) => {
    const chip = document.createElement('span');
    chip.className = 'hero-oak-chip';
    chip.textContent = phrase;
    chips.appendChild(chip);
  });

  block.append(title, tagline, body, ctas, chips);
}
