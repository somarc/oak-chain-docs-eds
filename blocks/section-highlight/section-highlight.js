/**
 * Section Highlight Block JavaScript
 * Handles highlighted section behavior
 */

export default function decorate(block) {
  // Check for center alignment
  const hasCenter = block.textContent.toLowerCase().includes('center') || 
                   block.classList.contains('center');
  
  if (hasCenter) {
    block.classList.add('center');
  }
  
  // Check for full-width
  const hasFullWidth = block.classList.contains('full-width');
  
  if (hasFullWidth) {
    block.classList.add('full-width');
  }
}
