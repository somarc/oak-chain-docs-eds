/**
 * Comparison Table Block JavaScript
 * Handles comparison table styling and structure
 */

export default function decorate(block) {
  // Find the table within the block
  const table = block.querySelector('table');
  
  if (!table) {
    return;
  }
  
  // Check if it's a two-column table
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.children.length === 2) {
    block.classList.add('two-column');
  }
  
  // Add striped class if specified (can be controlled via metadata)
  const hasStriped = block.classList.contains('striped');
  if (hasStriped) {
    table.classList.add('striped');
  }
  
  // Wrap table for responsive scrolling (already handled by container)
  // Just ensure proper structure
}
