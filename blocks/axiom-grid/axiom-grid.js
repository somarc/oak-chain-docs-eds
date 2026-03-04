/**
 * Axiom Grid Block JavaScript
 * Handles the two-axiom grid layout
 */

export default function decorate(block) {
  // EDS provides structured content from markdown table
  // Each row becomes a card in the grid
  
  const rows = [...block.children];
  
  rows.forEach((row) => {
    // Each row is an axiom card
    row.className = 'axiom-card';
  });
}
