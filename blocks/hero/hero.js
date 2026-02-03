import { decorateButtons } from '../../scripts/aem.js';

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

const stripLinks = (node) => {
  const clone = node.cloneNode(true);
  clone.querySelectorAll('a').forEach((link) => link.remove());
  return normalizeText(clone.textContent || '');
};

const buildTitle = (text) => {
  const titleWrapper = document.createElement('div');
  titleWrapper.className = 'hero-title-wrapper';

  const chainWhenMatch = text.match(/^(Oak\s+Chain)\s*(When.*)$/i)
    || text.match(/^(Oak\s+Chain)(When.*)$/i);

  if (chainWhenMatch) {
    const mainTitle = document.createElement('h1');
    mainTitle.className = 'hero-title';
    mainTitle.textContent = chainWhenMatch[1].trim();

    const subtitle = document.createElement('h2');
    subtitle.className = 'hero-subtitle';
    const subtitleText = chainWhenMatch[2].trim();
    const words = subtitleText.split(' ');
    if (words.length >= 4) {
      const [first, second, ...rest] = words;
      subtitle.innerHTML = `${first} ${second}<br>${rest.join(' ')}`;
    } else {
      subtitle.textContent = subtitleText;
    }

    titleWrapper.appendChild(mainTitle);
    titleWrapper.appendChild(subtitle);
    return titleWrapper;
  }

  const whenIndex = text.search(/When/i);
  if (whenIndex > 0) {
    const mainTitleText = text.substring(0, whenIndex).trim();
    const subtitleText = text.substring(whenIndex).trim();

    const mainTitle = document.createElement('h1');
    mainTitle.className = 'hero-title';
    mainTitle.textContent = mainTitleText;

    const subtitle = document.createElement('h2');
    subtitle.className = 'hero-subtitle';
    const words = subtitleText.split(' ');
    if (words.length >= 4) {
      const [first, second, ...rest] = words;
      subtitle.innerHTML = `${first} ${second}<br>${rest.join(' ')}`;
    } else {
      subtitle.textContent = subtitleText;
    }

    titleWrapper.appendChild(mainTitle);
    titleWrapper.appendChild(subtitle);
    return titleWrapper;
  }

  const titleEl = document.createElement('h1');
  titleEl.className = 'hero-title';
  titleEl.textContent = text;
  titleWrapper.appendChild(titleEl);
  return titleWrapper;
};

export default async function decorate(block) {
  const linksData = [...block.querySelectorAll('a')].map((link) => ({
    href: link.href,
    text: link.textContent.trim(),
    isStrong: link.parentElement?.tagName === 'STRONG',
    isEm: link.parentElement?.tagName === 'EM',
  }));

  const rows = [...block.children];

  const heroWrapper = document.createElement('div');
  heroWrapper.className = 'hero-wrapper';

  const heroContent = document.createElement('div');
  heroContent.className = 'hero-content';

  const heroLogo = document.createElement('div');
  heroLogo.className = 'hero-logo';
  const logoImg = document.createElement('img');
  logoImg.src = '/oak-chain.svg';
  logoImg.alt = 'Ethereum meets Oak';
  logoImg.loading = 'eager';
  logoImg.addEventListener('error', () => {
    logoImg.src = '/public/oak-chain.svg';
  });
  heroLogo.appendChild(logoImg);

  let descriptionFound = false;

  rows.forEach((row, index) => {
    const content = row.firstElementChild;
    if (!content) {
      return;
    }

    if (index === 0) {
      const h1 = content.querySelector('h1') || (content.tagName === 'H1' ? content : null);
      const titleText = normalizeText(h1 ? h1.textContent : content.textContent);
      if (titleText) {
        heroContent.appendChild(buildTitle(titleText));
      }
      return;
    }

    if (index === 1) {
      const rawText = stripLinks(row);
      if (!rawText) {
        return;
      }

      let descText = rawText;
      const titlePatterns = [
        'Oak Chain',
        'When Ethereum Meets Oak',
        'Oak Chain When Ethereum Meets Oak',
      ];
      titlePatterns.forEach((pattern) => {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        descText = descText.replace(regex, '').trim();
      });

      const descMatch = descText.match(/(Two\s+planetary-scale[^.]*\.\s*One\s+inevitable\s+convergence\.?)/i);
      if (descMatch) {
        const [, matchedText] = descMatch;
        descText = matchedText;
      }

      descText = normalizeText(descText);
      if (descText && descText.length > 10) {
        const descEl = document.createElement('p');
        descEl.className = 'hero-description';
        descEl.textContent = descText;
        heroContent.appendChild(descEl);
        descriptionFound = true;
      }
    }
  });

  if (!descriptionFound) {
    const extractedTitle = heroContent.querySelector('.hero-title')?.textContent.trim() || '';
    const extractedSubtitle = heroContent.querySelector('.hero-subtitle')?.textContent.trim() || '';
    const titlePatterns = [
      extractedTitle,
      extractedSubtitle,
      'Oak Chain',
      'When Ethereum Meets Oak',
      'Oak Chain When Ethereum Meets Oak',
    ].filter(Boolean);

    rows.some((row) => {
      let rowText = stripLinks(row);
      if (!rowText) {
        return false;
      }

      titlePatterns.forEach((pattern) => {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        rowText = rowText.replace(regex, '').trim();
      });

      if (rowText && (rowText.includes('planetary') || rowText.includes('convergence') || rowText.includes('systems'))) {
        rowText = normalizeText(rowText);
        const descMatch = rowText.match(/(Two\s+planetary-scale[^.]*\.\s*One\s+inevitable\s+convergence\.?)/i);
        if (descMatch) {
          const [, matchedText] = descMatch;
          rowText = matchedText;
        }

        if (rowText && rowText.length > 10 && rowText.includes('planetary')) {
          const descEl = document.createElement('p');
          descEl.className = 'hero-description';
          descEl.textContent = rowText;
          const titleWrapper = heroContent.querySelector('.hero-title-wrapper');
          if (titleWrapper) {
            titleWrapper.insertAdjacentElement('afterend', descEl);
          } else {
            heroContent.insertBefore(descEl, heroContent.firstChild);
          }
          descriptionFound = true;
          return true;
        }
      }
      return false;
    });
  }

  if (linksData.length > 0) {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'hero-buttons';

    linksData.forEach((linkData, idx) => {
      const link = document.createElement('a');
      link.href = linkData.href;
      link.textContent = linkData.text;
      link.title = linkData.text;

      if (linkData.isStrong || idx === 0) {
        link.className = 'button primary';
      } else if (linkData.isEm) {
        link.className = 'button secondary';
      } else {
        link.className = 'button secondary';
      }

      const p = document.createElement('p');
      p.appendChild(link);
      buttonWrapper.appendChild(p);
    });

    heroContent.appendChild(buttonWrapper);
    decorateButtons(heroContent);
  }

  heroWrapper.appendChild(heroContent);
  heroWrapper.appendChild(heroLogo);

  block.textContent = '';
  block.appendChild(heroWrapper);
}
