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
      // Try multiple ways to find the description text
      let descText = '';
      let descElement = null;
      
      // Get all text content from the row, excluding links
      const rowText = row.textContent.trim();
      const hasLinks = row.querySelectorAll('a').length > 0;
      
      // Method 1: Check if content is a <p> tag
      if (content.tagName === 'P') {
        descElement = content;
        descText = content.textContent.trim();
      }
      // Method 2: Look for <p> inside content
      else if (content.querySelector('p')) {
        descElement = content.querySelector('p');
        descText = descElement.textContent.trim();
      }
      // Method 3: Extract text from row, excluding link text
      else {
        // Get text content, but exclude link text
        const tempDiv = row.cloneNode(true);
        tempDiv.querySelectorAll('a').forEach(link => link.remove());
        descText = tempDiv.textContent.trim();
        
        // Also check if content itself has text
        if (!descText && content.textContent.trim()) {
          descText = content.textContent.trim();
        }
      }
      
      // Filter out button text and links
      const buttonTexts = ['The Thesis', 'How It Works', 'Run a Validator'];
      const isButtonText = buttonTexts.some(btn => descText === btn || descText.includes(btn));
      
      // Only add description if we found valid text
      if (descText && descText.length > 0 && !isButtonText && !descText.match(/^https?:\/\//)) {
        if (descElement && descElement.tagName === 'P') {
          // Use existing <p> element
          descElement.className = 'hero-description';
          heroContent.appendChild(descElement);
        } else {
          // Create new <p> element
          const descEl = document.createElement('p');
          descEl.className = 'hero-description';
          descEl.textContent = descText;
          heroContent.appendChild(descEl);
        }
        console.log('Hero block - Description added:', descText);
        descriptionFound = true;
      } else {
        console.warn('Hero block - No description found in row', index, 'Row text:', rowText, 'Content text:', content.textContent.trim());
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
    rows.forEach((row, index) => {
      const rowText = row.textContent.trim();
      // Look for description text pattern
      if (rowText && (rowText.includes('planetary') || rowText.includes('convergence') || rowText.includes('systems'))) {
        // Make sure it's not button text
        if (!rowText.match(/^(The Thesis|How It Works|Run a Validator)$/i)) {
          const descEl = document.createElement('p');
          descEl.className = 'hero-description';
          descEl.textContent = rowText;
          // Insert after title wrapper
          const titleWrapper = heroContent.querySelector('.hero-title-wrapper');
          if (titleWrapper) {
            titleWrapper.insertAdjacentElement('afterend', descEl);
          } else {
            heroContent.insertBefore(descEl, heroContent.querySelector('.hero-buttons') || heroContent.firstChild);
          }
          descriptionFound = true;
          console.log('Hero block - Description found in row', index, ':', rowText);
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
