import { decorateButtons } from '../../scripts/aem.js';

export default async function decorate(block) {
  // Hero block structure from EDS content (David's Model):
  // Row 1: Title (h1) - "Oak ChainWhen Ethereum Meets Oak" (all in one h1)
  // Row 2: Description (p) - "Two planetary-scale systems. One inevitable convergence."
  // Row 3+: Buttons (links - need to be decorated)
  
  // IMPORTANT: Collect all links BEFORE clearing block content
  const allLinks = block.querySelectorAll('a');
  // Debug: log links found
  console.log('Hero block - Links found:', allLinks.length, Array.from(allLinks).map(l => ({
    text: l.textContent.trim(),
    href: l.href,
    parent: l.parentElement.tagName,
  })));
  
  const linksData = Array.from(allLinks).map(link => ({
    href: link.href,
    text: link.textContent.trim(),
    parent: link.parentElement,
    isStrong: link.parentElement.tagName === 'STRONG',
    isEm: link.parentElement.tagName === 'EM',
  }));
  
  const rows = [...block.children];
  
  // Create two-column layout wrapper
  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'hero-wrapper';
  
  // Left column: text content
  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';
  
  // Right column: logo
  const heroLogo = document.createElement('div');
  heroLogo.className = 'hero-logo';
  const logoImg = document.createElement('img');
  // Public assets are served from root in EDS
  logoImg.src = '/oak-chain.svg';
  logoImg.alt = 'Ethereum meets Oak';
  logoImg.loading = 'eager';
  logoImg.onerror = function() {
    // Fallback if SVG doesn't load - try alternative path
    this.src = '/public/oak-chain.svg';
  };
  heroLogo.appendChild(logoImg);
  
  // Debug: log row structure
  console.log('Hero block - Rows found:', rows.length);
  rows.forEach((row, index) => {
    console.log(`Row ${index}:`, row.innerHTML.substring(0, 200), 'Text:', row.textContent.trim().substring(0, 100));
  });
  
  // Track if description was found
  let descriptionFound = false;
  
  // Process rows
  rows.forEach((row, index) => {
    const content = row.firstElementChild;
    if (!content) {
      // If no firstElementChild, check if row itself has text content
      const rowText = row.textContent.trim();
      // Check if this looks like the description (contains "planetary" or "convergence")
      if (rowText && (rowText.includes('planetary') || rowText.includes('convergence') || rowText.includes('systems'))) {
        const descEl = document.createElement('p');
        descEl.className = 'hero-description';
        descEl.textContent = rowText;
        heroContent.appendChild(descEl);
        descriptionFound = true;
        console.log('Hero block - Description found in empty row:', rowText);
      }
      return;
    }
    
    if (index === 0) {
      // First row: Title - split "Oak Chain" and "When Ethereum Meets Oak"
      const h1 = content.querySelector('h1') || (content.tagName === 'H1' ? content : null);
      if (h1) {
        const titleText = h1.textContent.trim();
        
        // Split title: "Oak ChainWhen Ethereum Meets Oak" (no space between Chain and When)
        // Try multiple patterns to handle variations
        let chainWhenMatch = titleText.match(/^(Oak\s+Chain)\s*(When.*)$/i);
        if (!chainWhenMatch) {
          chainWhenMatch = titleText.match(/^(Oak\s+Chain)(When.*)$/i);
        }
        
        if (chainWhenMatch) {
          // Create title wrapper
          const titleWrapper = document.createElement('div');
          titleWrapper.className = 'hero-title-wrapper';
          
          // "Oak Chain" part - medium blue gradient
          const mainTitle = document.createElement('h1');
          mainTitle.className = 'hero-title';
          mainTitle.textContent = chainWhenMatch[1].trim(); // "Oak Chain"
          
          // "When Ethereum Meets Oak" part - split into lines
          const subtitle = document.createElement('h2');
          subtitle.className = 'hero-subtitle';
          const subtitleText = chainWhenMatch[2].trim(); // "When Ethereum Meets Oak"
          // Split into "When Ethereum" and "Meets Oak"
          const words = subtitleText.split(' ');
          if (words.length >= 4) {
            // "When Ethereum" on first line, "Meets Oak" on second
            subtitle.innerHTML = `${words[0]} ${words[1]}<br>${words.slice(2).join(' ')}`;
          } else {
            subtitle.textContent = subtitleText;
          }
          
          titleWrapper.appendChild(mainTitle);
          titleWrapper.appendChild(subtitle);
          heroContent.appendChild(titleWrapper);
        } else {
          // Fallback: try to find "When" in the text
          const whenIndex = titleText.search(/When/i);
          if (whenIndex > 0) {
            const mainTitleText = titleText.substring(0, whenIndex).trim();
            const subtitleText = titleText.substring(whenIndex).trim();
            
            const titleWrapper = document.createElement('div');
            titleWrapper.className = 'hero-title-wrapper';
            
            const mainTitle = document.createElement('h1');
            mainTitle.className = 'hero-title';
            mainTitle.textContent = mainTitleText;
            
            const subtitle = document.createElement('h2');
            subtitle.className = 'hero-subtitle';
            const words = subtitleText.split(' ');
            if (words.length >= 4) {
              subtitle.innerHTML = `${words[0]} ${words[1]}<br>${words.slice(2).join(' ')}`;
            } else {
              subtitle.textContent = subtitleText;
            }
            
            titleWrapper.appendChild(mainTitle);
            titleWrapper.appendChild(subtitle);
            heroContent.appendChild(titleWrapper);
          } else {
            // Last resort: use as-is
            h1.className = 'hero-title';
            heroContent.appendChild(h1);
          }
        }
      } else {
        // No h1 found, check if content has the text
        const text = content.textContent.trim();
        const whenIndex = text.search(/When/i);
        if (whenIndex > 0) {
          const mainTitleText = text.substring(0, whenIndex).trim();
          const subtitleText = text.substring(whenIndex).trim();
          
          const titleWrapper = document.createElement('div');
          titleWrapper.className = 'hero-title-wrapper';
          
          const mainTitle = document.createElement('h1');
          mainTitle.className = 'hero-title';
          mainTitle.textContent = mainTitleText;
          
          const subtitle = document.createElement('h2');
          subtitle.className = 'hero-subtitle';
          const words = subtitleText.split(' ');
          if (words.length >= 4) {
            subtitle.innerHTML = `${words[0]} ${words[1]}<br>${words.slice(2).join(' ')}`;
          } else {
            subtitle.textContent = subtitleText;
          }
          
          titleWrapper.appendChild(mainTitle);
          titleWrapper.appendChild(subtitle);
          heroContent.appendChild(titleWrapper);
        } else {
          const titleEl = document.createElement('h1');
          titleEl.className = 'hero-title';
          titleEl.textContent = text;
          heroContent.appendChild(titleEl);
        }
      }
    } else if (index === 1) {
      // Second row: Description - "Two planetary-scale systems. One inevitable convergence."
      // Extract description text, EXCLUDING any link/button text
      let descText = '';
      let descElement = null;
      
      // Clone the row to safely remove links without affecting original
      const tempRow = row.cloneNode(true);
      // Remove all links from the clone
      tempRow.querySelectorAll('a').forEach(link => link.remove());
      // Get text content after removing links
      descText = tempRow.textContent.trim();
      
      // Method 1: Check if content is a <p> tag (and doesn't contain links)
      if (content.tagName === 'P' && !content.querySelector('a')) {
        descElement = content;
        // Use textContent which excludes link text
        descText = content.textContent.trim();
      }
      // Method 2: Look for <p> inside content that doesn't contain links
      else if (content.querySelector('p:not(:has(a))')) {
        descElement = content.querySelector('p:not(:has(a))');
        descText = descElement.textContent.trim();
      }
      // Method 3: Use the cloned row text (already has links removed)
      else if (descText) {
        // descText already set from cloned row above
      }
      
      // Clean up: remove any button text and title text that might have been included
      // Get all link texts to exclude them
      const linkTexts = Array.from(row.querySelectorAll('a')).map(link => link.textContent.trim());
      linkTexts.forEach(linkText => {
        // Remove the link text from description if present
        descText = descText.replace(new RegExp(linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim();
      });
      
      // Remove title patterns if they appear in description
      const titlePatterns = ['Oak Chain', 'When Ethereum Meets Oak', 'Oak Chain When Ethereum Meets Oak'];
      titlePatterns.forEach(pattern => {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        descText = descText.replace(regex, '').trim();
      });
      
      // Extract just the description part (starting from "Two planetary-scale")
      const descMatch = descText.match(/(Two\s+planetary-scale[^.]*\.\s*One\s+inevitable\s+convergence\.?)/i);
      if (descMatch) {
        descText = descMatch[1];
      }
      
      // Clean up extra whitespace
      descText = descText.replace(/\s+/g, ' ').trim();
      
      // Only add description if we found valid text (not empty, not just button text)
      if (descText && descText.length > 0 && descText.length > 10) {
        if (descElement && descElement.tagName === 'P' && !descElement.querySelector('a')) {
          // Use existing <p> element (no links)
          descElement.className = 'hero-description';
          heroContent.appendChild(descElement);
        } else {
          // Create new <p> element with cleaned text
          const descEl = document.createElement('p');
          descEl.className = 'hero-description';
          descEl.textContent = descText;
          heroContent.appendChild(descEl);
        }
        console.log('Hero block - Description added:', descText);
        descriptionFound = true;
      } else {
        console.warn('Hero block - No description found in row', index, 'Cleaned text:', descText);
      }
    } else {
      // Remaining rows: Links that will become buttons
      // These are collected above, we'll process them after clearing
    }
  });
  
  // Assemble layout
  heroWrapper.appendChild(heroContent);
  heroWrapper.appendChild(heroLogo);
  
  // Clear block and add new structure
  block.textContent = '';
  block.appendChild(heroWrapper);
  
  // Fallback: If description wasn't found, search all original rows for it
  if (!descriptionFound) {
    console.log('Hero block - Description not found at index 1, searching all rows...');
    
    // Get the title text that we already extracted (to exclude it from description)
    const extractedTitle = heroContent.querySelector('.hero-title')?.textContent.trim() || '';
    const extractedSubtitle = heroContent.querySelector('.hero-subtitle')?.textContent.trim() || '';
    const titlePatterns = [
      extractedTitle,
      extractedSubtitle,
      'Oak Chain',
      'When Ethereum Meets Oak',
      'Oak Chain When Ethereum Meets Oak',
    ].filter(Boolean);
    
    rows.forEach((row, index) => {
      // Clone row and remove links to get clean text
      const tempRow = row.cloneNode(true);
      tempRow.querySelectorAll('a').forEach(link => link.remove());
      let rowText = tempRow.textContent.trim();
      
      // Remove title text patterns from the row text
      titlePatterns.forEach(titlePattern => {
        if (titlePattern) {
          // Remove title pattern (case insensitive, handle variations)
          const regex = new RegExp(titlePattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          rowText = rowText.replace(regex, '').trim();
        }
      });
      
      // Look for description text pattern
      if (rowText && (rowText.includes('planetary') || rowText.includes('convergence') || rowText.includes('systems'))) {
        // Get link texts to exclude
        const linkTexts = Array.from(row.querySelectorAll('a')).map(link => link.textContent.trim());
        let cleanText = rowText;
        // Remove link texts
        linkTexts.forEach(linkText => {
          cleanText = cleanText.replace(new RegExp(linkText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), '').trim();
        });
        cleanText = cleanText.replace(/\s+/g, ' ').trim();
        
        // Extract just the description part (starting from "Two planetary-scale")
        const descMatch = cleanText.match(/(Two\s+planetary-scale[^.]*\.\s*One\s+inevitable\s+convergence\.?)/i);
        if (descMatch) {
          cleanText = descMatch[1];
        }
        
        // Only add if we have meaningful text left and it looks like the description
        if (cleanText && cleanText.length > 10 && cleanText.includes('planetary')) {
          const descEl = document.createElement('p');
          descEl.className = 'hero-description';
          descEl.textContent = cleanText;
          // Insert after title wrapper
          const titleWrapper = heroContent.querySelector('.hero-title-wrapper');
          if (titleWrapper) {
            titleWrapper.insertAdjacentElement('afterend', descEl);
          } else {
            heroContent.insertBefore(descEl, heroContent.querySelector('.hero-buttons') || heroContent.firstChild);
          }
          descriptionFound = true;
          console.log('Hero block - Description found in row', index, ':', cleanText);
        }
      }
    });
  }
  
  // Now recreate buttons from collected links
  if (linksData.length > 0) {
    console.log('Hero block - Recreating buttons:', linksData.length);
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'hero-buttons';
    
    linksData.forEach((linkData, idx) => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.textContent = linkData.text;
      link.title = linkData.text; // Required by decorateButtons
      
      // Apply button decoration based on parent element
      // First button is typically primary (wrapped in <strong>)
      if (linkData.isStrong || idx === 0) {
        link.className = 'button primary';
      } else if (linkData.isEm) {
        link.className = 'button secondary';
      } else {
        link.className = 'button secondary'; // Default to secondary for hero
      }
      
      // Wrap in paragraph for proper button decoration
      const p = document.createElement('p');
      p.appendChild(link);
      buttonWrapper.appendChild(p);
    });
    
    // Add buttons to hero content
    heroContent.appendChild(buttonWrapper);
    
    // Re-decorate buttons to ensure proper styling
    decorateButtons(heroContent);
  } else {
    console.warn('Hero block - No links found to create buttons');
  }
}
