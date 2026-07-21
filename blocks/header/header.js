import { getMetadata, loadCSS } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const isDesktop = window.matchMedia('(min-width: 900px)');

function setDropdownExpanded(toggle, expanded) {
  const item = toggle.closest('.nav-drop');
  if (!item) return;
  item.dataset.expanded = String(expanded);
  toggle.setAttribute('aria-expanded', String(expanded));
  const label = item.querySelector(':scope > p > a, :scope > a')?.textContent.trim() || 'navigation';
  toggle.setAttribute('aria-label', `${expanded ? 'Close' : 'Open'} ${label} menu`);
}

function closeDropdowns(navSections, except = null) {
  navSections?.querySelectorAll('.nav-drop-toggle').forEach((toggle) => {
    if (toggle !== except) setDropdownExpanded(toggle, false);
  });
}

function setMenuExpanded(nav, expanded) {
  const button = nav.querySelector('.nav-hamburger button');
  const navSections = nav.querySelector('.nav-sections');
  nav.dataset.expanded = String(expanded);
  button.setAttribute('aria-expanded', String(expanded));
  button.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
  document.body.style.overflowY = (!expanded && !isDesktop.matches) ? 'hidden' : '';
  if (!isDesktop.matches && !expanded) closeDropdowns(navSections);
}

function closeOnEscape(event) {
  if (event.key !== 'Escape') return;
  const nav = document.getElementById('nav');
  const navSections = nav?.querySelector('.nav-sections');
  const openDropdown = navSections?.querySelector('.nav-drop-toggle[aria-expanded="true"]');
  if (openDropdown && isDesktop.matches) {
    setDropdownExpanded(openDropdown, false);
    openDropdown.focus();
  } else if (nav && !isDesktop.matches && nav.dataset.expanded === 'true') {
    setMenuExpanded(nav, false);
    nav.querySelector('.nav-hamburger button')?.focus();
  }
}

function closeOnFocusLost(event) {
  const nav = event.currentTarget;
  if (nav.contains(event.relatedTarget)) return;
  closeDropdowns(nav.querySelector('.nav-sections'));
  if (!isDesktop.matches) setMenuExpanded(nav, false);
}

function decorateDropdowns(navSections) {
  if (!navSections) return;
  navSections.querySelectorAll(':scope .default-content-wrapper > ul > li').forEach((item, index) => {
    const submenu = item.querySelector(':scope > ul');
    if (!submenu) return;

    item.classList.add('nav-drop');
    item.dataset.expanded = 'false';
    submenu.id = submenu.id || `nav-submenu-${index + 1}`;

    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'nav-drop-toggle';
    toggle.setAttribute('aria-controls', submenu.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span class="nav-drop-toggle-icon" aria-hidden="true"></span>';
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      closeDropdowns(navSections, toggle);
      setDropdownExpanded(toggle, !expanded);
    });

    submenu.before(toggle);
    setDropdownExpanded(toggle, false);
  });
}

/**
 * Loads and decorates the shared DA navigation fragment.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-label', 'Primary navigation');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  ['brand', 'sections', 'tools'].forEach((name, index) => {
    nav.children[index]?.classList.add(`nav-${name}`);
  });

  const navBrand = nav.querySelector('.nav-brand');
  const brandLink = navBrand?.querySelector('.button');
  if (brandLink) {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';
  }

  const navSections = nav.querySelector('.nav-sections');
  decorateDropdowns(navSections);

  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-expanded="false" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => {
    setMenuExpanded(nav, nav.dataset.expanded !== 'true');
  });
  nav.prepend(hamburger);

  setMenuExpanded(nav, isDesktop.matches);
  isDesktop.addEventListener('change', (event) => {
    closeDropdowns(navSections);
    setMenuExpanded(nav, event.matches);
  });
  window.addEventListener('keydown', closeOnEscape);
  nav.addEventListener('focusout', closeOnFocusLost);

  const navTools = nav.querySelector('.nav-tools');
  if (navTools) {
    const searchBlock = document.createElement('div');
    searchBlock.className = 'search';
    navTools.prepend(searchBlock);
    Promise.all([
      import('../search/search.js'),
      loadCSS(`${window.hlx.codeBasePath}/blocks/search/search.css`),
    ]).then(([{ default: decorateSearch }]) => decorateSearch(searchBlock));

    const tickerBlock = document.createElement('div');
    tickerBlock.className = 'eth-ticker';
    navTools.prepend(tickerBlock);
    Promise.all([
      import('../eth-ticker/eth-ticker.js'),
      loadCSS(`${window.hlx.codeBasePath}/blocks/eth-ticker/eth-ticker.css`),
    ]).then(([{ default: decorateTicker }]) => decorateTicker(tickerBlock));
  }

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
