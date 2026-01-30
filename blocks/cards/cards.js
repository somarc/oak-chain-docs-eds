import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Cards block structure (David's Model):
  // Each row = one card
  // Row columns: Icon (picture/img) | Title (h2/h3) | Description (p)
  // Or: Icon | Title + Description (combined)
  
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    
    // Move all content from row to list item
    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }
    
    // Classify children: image vs body
    [...li.children].forEach((div) => {
      // Check if this div contains an image/picture (icon)
      if (div.querySelector('picture, img')) {
        div.className = 'cards-card-image';
        // Optimize images (but keep aspect ratio for icons)
        const img = div.querySelector('img');
        if (img && !img.closest('picture')) {
          // If it's a standalone img, wrap in picture for optimization
          const picture = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '128' }]);
          img.replaceWith(picture);
        } else if (div.querySelector('picture')) {
          // Optimize existing picture
          const picture = div.querySelector('picture');
          const img = picture.querySelector('img');
          if (img) {
            picture.replaceWith(createOptimizedPicture(img.src, img.alt || '', false, [{ width: '128' }]));
          }
        }
      } else {
        // This is the body (title + description)
        div.className = 'cards-card-body';
      }
    });
    
    ul.append(li);
  });
  
  block.replaceChildren(ul);
}
