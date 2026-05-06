/**
 * Model Card block.
 *
 * Renders a bordered, gradient-tinted card for describing one of Oak Chain's
 * deployment models. Authoring contract: heading, paragraphs, optional nested
 * `integration-path` block, lists.
 */
export default function decorate(block) {
  // Unwrap the single inner cell so its children sit directly in the block.
  const inner = block.querySelector(':scope > div > div');
  if (inner) {
    while (inner.firstChild) block.appendChild(inner.firstChild);
    inner.parentElement?.remove();
  }
}
