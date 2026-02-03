import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  // Cards block structure (David's Model):
  // Each row = one card
  // Row columns: Icon (picture/img) | Title (h2/h3) | Description (p) | Link (optional)
  const isClickable = block.classList.contains('clickable');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');

    let cardLink = null;
    if (isClickable) {
      const columns = [...row.children];
      if (columns.length >= 2) {
        const contentCol = columns[1];

        const linksInContent = contentCol.querySelectorAll('a');
        if (linksInContent.length > 0) {
          const linkToUse = linksInContent[linksInContent.length - 1];
          cardLink = {
            href: linkToUse.href,
            text: linkToUse.textContent.trim(),
          };
        } else {
          const contentText = contentCol.textContent.trim();
          const urlPattern = /(https?:\/\/[^\s]+|\/[^\s]+)$/;
          const urlMatch = contentText.match(urlPattern);

          if (urlMatch) {
            const urlText = urlMatch[1];
            if (urlText.startsWith('/') || urlText.startsWith('http')) {
              const linkUrl = urlText.startsWith('http')
                ? urlText
                : new URL(urlText, window.location.origin).href;
              cardLink = {
                href: linkUrl,
                text: urlText,
              };

              const textNode = Array.from(contentCol.childNodes).find((node) => (
                node.nodeType === Node.TEXT_NODE
                && node.textContent.includes(urlText)
              ));
              if (textNode) {
                textNode.textContent = textNode.textContent.replace(urlText, '').trim();
              }
            }
          }
        }

        if (!cardLink) {
          const link = row.querySelector('a');
          if (link) {
            cardLink = {
              href: link.href,
              text: link.textContent.trim(),
            };
          }
        }
      }
    }

    while (row.firstElementChild) {
      li.append(row.firstElementChild);
    }

    [...li.children].forEach((div) => {
      if (div.querySelector('picture, img')) {
        div.className = 'cards-card-image';
        const imgEl = div.querySelector('img');
        if (imgEl && !imgEl.closest('picture')) {
          const picture = createOptimizedPicture(imgEl.src, imgEl.alt || '', false, [{ width: '128' }]);
          imgEl.replaceWith(picture);
        } else if (div.querySelector('picture')) {
          const picture = div.querySelector('picture');
          const pictureImg = picture.querySelector('img');
          if (pictureImg) {
            picture.replaceWith(
              createOptimizedPicture(pictureImg.src, pictureImg.alt || '', false, [{ width: '128' }]),
            );
          }
        }
      } else {
        div.className = 'cards-card-body';

        if (isClickable && cardLink) {
          const linksInBody = div.querySelectorAll('a');
          linksInBody.forEach((linkInBody) => {
            const matchesLink = linkInBody.href === cardLink.href
              || linkInBody.textContent.trim() === cardLink.href
              || linkInBody.textContent.trim() === cardLink.text;
            if (matchesLink) {
              const linkText = linkInBody.textContent.trim();
              linkInBody.replaceWith(document.createTextNode(linkText));
            }
          });
        }
      }
    });

    if (isClickable && cardLink) {
      const cardLinkEl = document.createElement('a');
      cardLinkEl.href = cardLink.href;
      cardLinkEl.className = 'cards-card-link';
      const cardTitle = li.querySelector('h2, h3, h4')?.textContent || cardLink.text || 'Card link';
      cardLinkEl.setAttribute('aria-label', cardTitle);

      cardLinkEl.addEventListener('click', () => {
        if (window.hlx?.rum && window.hlx.rum.isSelected) {
          window.hlx.rum.collector('card-click', {
            title: cardTitle,
            href: cardLink.href,
          });
        }

        document.dispatchEvent(new CustomEvent('card-click', {
          detail: {
            title: cardTitle,
            href: cardLink.href,
            block: 'cards',
          },
        }));
      });

      while (li.firstChild) {
        cardLinkEl.appendChild(li.firstChild);
      }
      li.appendChild(cardLinkEl);
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
