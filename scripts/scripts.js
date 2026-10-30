import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  getMetadata,
} from './aem.js';

// Canvas authoring signal, set before any decoration runs.
const params = new URLSearchParams(window.location.search);
const QUICK_EDIT = params.has('quick-edit');
if (QUICK_EDIT) document.documentElement.setAttribute('quick-edit', '');

/** True inside DA Canvas / quick-edit. Gate interaction with it, never content. */
export function isAuthoring() {
  return document.documentElement.hasAttribute('quick-edit');
}

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    // Check if h1 or picture is already inside a hero block
    if (h1.closest('.hero') || picture.closest('.hero')) {
      return; // Don't create a duplicate hero block
    }
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    // auto load `*/fragments/*` references
    const fragments = [...main.querySelectorAll('a[href*="/fragments/"]')].filter((f) => !f.closest('.fragment'));
    if (fragments.length > 0) {
      // eslint-disable-next-line import/no-cycle
      import('../blocks/fragment/fragment.js').then(({ loadFragment }) => {
        fragments.forEach(async (fragment) => {
          try {
            const { pathname } = new URL(fragment.href);
            const frag = await loadFragment(pathname);
            fragment.parentElement.replaceWith(...frag.children);
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Fragment loading failed', error);
          }
        });
      });
    }

    buildHeroBlock(main);
    // eslint-disable-next-line no-use-before-define
    buildDocsLayout(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

/**
 * On every doc page (everything except the homepage), inject the
 * site-wide left-rail docs-sidebar and a right-rail page-toc.
 *
 * Skips fragment mains (nav, footer) so the chrome doesn't get the
 * sidebar accidentally.
 *
 * @param {Element} main The container element
 */
function buildDocsLayout(main) {
  if (main !== document.querySelector('body > main')) return;
  if (window.isErrorPage) return;
  const path = window.location.pathname;
  if (['/', '/index', '/nav', '/footer'].includes(path)) return;
  if (getMetadata('template') === 'landing') return;

  if (!main.querySelector('.docs-sidebar')) {
    const section = document.createElement('div');
    section.append(buildBlock('docs-sidebar', { elems: [] }));
    // Keep authored content first so the real page LCP section owns eager load.
    // The rail is fixed-positioned, so DOM placement does not affect its visual position.
    main.append(section);
  }
  if (!main.querySelector('.page-toc')) {
    const section = document.createElement('div');
    section.append(buildBlock('page-toc', { elems: [] }));
    main.append(section);
  }
}

/**
 * Decorates formatted links to style them as buttons.
 * @param {HTMLElement} main The main container element
 */
function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();

    // quick structural checks
    if (a.querySelector('img') || p.textContent.trim() !== text) return;

    // skip URL display links
    try {
      if (new URL(a.href).href === new URL(text, window.location).href) return;
    } catch { /* continue */ }

    // require authored formatting for buttonization
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;

    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong && em) { // high-impact call-to-action
      a.classList.add('accent');
      const outer = strong.contains(em) ? strong : em;
      outer.replaceWith(a);
    } else if (strong) {
      a.classList.add('primary');
      strong.replaceWith(a);
    } else {
      a.classList.add('secondary');
      em.replaceWith(a);
    }
  });
}

function decorateScrollableRegions(main) {
  main.querySelectorAll('pre').forEach((pre) => {
    pre.tabIndex = 0;
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateScrollableRegions(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    main.id = main.id || 'main-content';
    if (!doc.querySelector('.skip-link')) {
      const skipLink = doc.createElement('a');
      skipLink.className = 'skip-link';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Skip to main content';
      doc.body.prepend(skipLink);
    }
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const header = doc.querySelector('body > header');
  if (header) loadHeader(header);

  const main = doc.querySelector('main');
  if (main) await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  const footer = doc.querySelector('body > footer');
  if (footer) loadFooter(footer);

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 3000);
  // load anything that can be postponed to the latest here
}

export async function loadPage(doc = document) {
  await loadEager(doc);
  await loadLazy(doc);
  loadDelayed();
}

// Load quick-edit ourselves so preview.da.live serves this file unchanged.
if (QUICK_EDIT) {
  let payload = {};
  try {
    const q = params.get('quick-edit');
    payload = q && q !== 'on' ? JSON.parse(decodeURIComponent(q)) : {};
  } catch { /* plain flag */ }
  try {
    // eslint-disable-next-line import/no-unresolved
    const { default: loadQuickEdit } = await import('https://da.live/nx/public/plugins/quick-edit/quick-edit.js');
    await loadQuickEdit(payload, loadPage);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('quick-edit unavailable outside Canvas', error);
  }
}

loadPage();
