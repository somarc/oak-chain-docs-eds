import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 900px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .default-content-wrapper > ul > li').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (expanded || isDesktop.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  toggleAllNavSections(navSections, expanded || isDesktop.matches ? 'false' : 'true');
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
        drop.addEventListener('focus', focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener('focusout', closeOnFocusLost);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
    nav.removeEventListener('focusout', closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  if (navBrand) {
    // Remove button classes from brand link
    const brandLink = navBrand.querySelector('a');
    if (brandLink) {
      brandLink.classList.remove('button', 'primary', 'secondary', 'brand');
      const buttonContainer = brandLink.closest('.button-container');
      if (buttonContainer) {
        buttonContainer.classList.remove('button-container');
      }
    }
  }

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    // Remove button classes from nav links (EDS auto-converts single links to buttons)
    navSections.querySelectorAll('a.button').forEach((link) => {
      link.classList.remove('button', 'primary', 'secondary', 'brand');
      const buttonContainer = link.closest('.button-container');
      if (buttonContainer) {
        buttonContainer.classList.remove('button-container');
      }
    });

    // Ensure list structure is correct - find the ul and ensure li items are properly separated
    const navList = navSections.querySelector(':scope .default-content-wrapper > ul');
    if (navList) {
      // Get all links first
      const allLinks = navList.querySelectorAll('a');
      
      // If we have links but they're not in separate li elements, restructure
      if (allLinks.length > 0) {
        // Check if links are direct children or in li elements
        const directLinkChildren = Array.from(navList.children).filter(child => child.tagName === 'A');
        
        if (directLinkChildren.length > 0 || allLinks.length !== navList.querySelectorAll('li').length) {
          // Restructure: create new ul with proper li structure
          const newUl = document.createElement('ul');
          allLinks.forEach((link) => {
            const li = document.createElement('li');
            // Clone the link to preserve attributes
            const clonedLink = link.cloneNode(true);
            li.appendChild(clonedLink);
            newUl.appendChild(li);
          });
          
          // Replace the old ul
          navList.parentNode.replaceChild(newUl, navList);
          newUl.classList.add(...navList.classList);
        }
      }

      // Ensure each li contains exactly one link and has proper spacing
      const finalList = navSections.querySelector(':scope .default-content-wrapper > ul') || newUl;
      if (finalList) {
        finalList.querySelectorAll('li').forEach((li) => {
          const links = li.querySelectorAll('a');
          if (links.length > 1) {
            // If multiple links in one li, split them
            links.forEach((link, linkIndex) => {
              if (linkIndex > 0) {
                const newLi = document.createElement('li');
                newLi.appendChild(link);
                li.parentNode.insertBefore(newLi, li.nextSibling);
              }
            });
          }
          
          // Ensure link is block-level and properly styled
          const link = li.querySelector('a');
          if (link) {
            link.style.display = 'block';
            link.style.whiteSpace = 'nowrap';
            link.style.margin = '0';
            link.style.padding = '0.5em 0';
          }
          
          // Ensure li has proper spacing
          li.style.margin = '0';
          li.style.padding = '0';
          li.style.display = 'flex';
          li.style.alignItems = 'center';
        });
      }
    }

    navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((navSection) => {
      if (navSection.querySelector('ul')) navSection.classList.add('nav-drop');
      navSection.addEventListener('click', () => {
        if (isDesktop.matches) {
          const expanded = navSection.getAttribute('aria-expanded') === 'true';
          toggleAllNavSections(navSections);
          navSection.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        }
      });
    });
  }

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener('change', () => toggleMenu(nav, navSections, isDesktop.matches));

  // Ensure nav sections are visible on desktop
  if (isDesktop.matches && navSections) {
    navSections.style.display = 'block';
    navSections.style.visibility = 'visible';
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
