import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Cards block structure (David's Model):
  // Each row = one card
  // Row columns: Icon (picture/img) | Title (h2/h3) | Description (p) | Link (optional)
  // Structure: Icon | Title + Description | Link
  
  // Check if block has "clickable" option (from block options like "cards (clickable)")
  const isClickable = block.classList.contains('clickable');
  
  if (isClickable) {
    console.log('Cards block: Clickable mode enabled');
  }
  
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    
    // Collect link from row if clickable
    // Structure from DA: icon | title+details (2 columns)
    // Link should be embedded in the title/details column as a link element or URL text
    let cardLink = null;
    if (isClickable) {
      const columns = [...row.children];
      
      // Structure: Column 0 = icon, Column 1 = title+details
      // Link should be in Column 1 (title/details column)
      if (columns.length >= 2) {
        const contentCol = columns[1]; // Title/details column
        
        // Method 1: Look for <a> link element in content column
        const linksInContent = contentCol.querySelectorAll('a');
        if (linksInContent.length > 0) {
          // Use the first link found (or last if multiple - might be at end)
          const linkToUse = linksInContent[linksInContent.length - 1];
          cardLink = {
            href: linkToUse.href,
            text: linkToUse.textContent.trim(),
          };
          console.log('Card link found in content column:', cardLink);
          // Keep the link in content for now - we'll handle removal later if needed
        } else {
          // Method 2: Check if content column text ends with a URL-like pattern
          const contentText = contentCol.textContent.trim();
          // Look for URL patterns at the end of the text
          const urlPattern = /(https?:\/\/[^\s]+|\/[^\s]+)$/;
          const urlMatch = contentText.match(urlPattern);
          
          if (urlMatch) {
            const urlText = urlMatch[1];
            // Make sure it's actually a URL/path, not just part of a word
            if (urlText.startsWith('/') || urlText.startsWith('http')) {
              const linkUrl = urlText.startsWith('http') ? urlText : new URL(urlText, window.location.origin).href;
              cardLink = {
                href: linkUrl,
                text: urlText,
              };
              console.log('Card link found as text at end of content:', cardLink);
              // Remove the URL text from content column
              const textNode = Array.from(contentCol.childNodes).find(node => 
                node.nodeType === Node.TEXT_NODE && node.textContent.includes(urlText)
              );
              if (textNode) {
                textNode.textContent = textNode.textContent.replace(urlText, '').trim();
              }
            }
          }
        }
        
        // Method 3: Search entire row as fallback
        if (!cardLink) {
          const link = row.querySelector('a');
          if (link) {
            cardLink = {
              href: link.href,
              text: link.textContent.trim(),
            };
            console.log('Card link found anywhere in row:', cardLink);
          }
        }
        
        if (!cardLink) {
          const cardTitle = contentCol.querySelector('h2, h3, h4, strong')?.textContent.trim() || 'Unknown';
          console.warn('Clickable card but no link found:', {
            cardTitle: cardTitle,
            structure: 'icon | title+details (2 columns)',
            suggestion: 'Add a link in the title/details column in DA. Either:',
            option1: 'Add link element: <a href="/architecture">Link</a>',
            option2: 'Add URL text at end: "Description text. /architecture"',
            contentPreview: contentCol.textContent.trim().substring(0, 100),
          });
        }
      }
    }
    
    // Move all remaining content from row to list item
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
        
        // If clickable and we found a link, remove duplicate link from body
        // (since the whole card will be wrapped in a link)
        if (isClickable && cardLink) {
          const linksInBody = div.querySelectorAll('a');
          linksInBody.forEach(linkInBody => {
            // If this link matches our card link, remove it but keep text
            if (linkInBody.href === cardLink.href || 
                linkInBody.textContent.trim() === cardLink.href ||
                linkInBody.textContent.trim() === cardLink.text) {
              const linkText = linkInBody.textContent.trim();
              // Replace link with text node
              linkInBody.replaceWith(document.createTextNode(linkText));
            }
          });
        }
      }
    });
    
    // If clickable and we have a link, wrap the entire card content in a link
    if (isClickable && cardLink) {
      const cardLinkEl = document.createElement('a');
      cardLinkEl.href = cardLink.href;
      cardLinkEl.className = 'cards-card-link';
      // Use card title for aria-label if available
      const cardTitle = li.querySelector('h2, h3, h4')?.textContent || cardLink.text || 'Card link';
      cardLinkEl.setAttribute('aria-label', cardTitle);
      
      // Add click tracking
      cardLinkEl.addEventListener('click', (e) => {
        console.log('Card clicked:', {
          title: cardTitle,
          href: cardLink.href,
          timestamp: new Date().toISOString(),
        });
        
        // Track with RUM if available
        if (window.hlx?.rum && window.hlx.rum.isSelected) {
          window.hlx.rum.collector('card-click', {
            title: cardTitle,
            href: cardLink.href,
          });
        }
        
        // Dispatch custom event for analytics
        document.dispatchEvent(new CustomEvent('card-click', {
          detail: {
            title: cardTitle,
            href: cardLink.href,
            block: 'cards',
          },
        }));
      });
      
      // Wrap all content inside the list item
      while (li.firstChild) {
        cardLinkEl.appendChild(li.firstChild);
      }
      li.appendChild(cardLinkEl);
      
      console.log('Clickable card created:', {
        title: cardTitle,
        href: cardLink.href,
      });
    }
    
    ul.append(li);
  });
  
  block.replaceChildren(ul);
}
