import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Lift a fixed-positioned rail above the footer when the footer scrolls into
 * view, so the rail never overlaps it. Reused by the sidebar and page TOC.
 * @param {Element} rail Fixed rail element
 */
export function liftAboveFooter(rail) {
  const footer = document.querySelector('body > footer');
  if (!footer || typeof IntersectionObserver === 'undefined') return;
  let raf = 0;
  const update = () => {
    const rect = footer.getBoundingClientRect();
    const overlap = Math.max(0, window.innerHeight - rect.top);
    rail.style.bottom = overlap > 0 ? `${overlap}px` : '0';
  };
  const obs = new IntersectionObserver(() => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }, { threshold: [0, 0.01, 0.5, 1] });
  obs.observe(footer);
  window.addEventListener('scroll', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
}

function directLink(item) {
  return item.querySelector(':scope > p > a, :scope > a');
}

function navSections(fragment) {
  const rootList = fragment.querySelector('ul');
  if (!rootList) return [];
  const flatItems = [];
  const sections = [];

  [...rootList.children].forEach((item) => {
    if (item.tagName !== 'LI') return;
    const link = directLink(item);
    const nested = [...item.children].find((child) => child.tagName === 'UL');
    if (!nested) {
      if (link) flatItems.push({ href: link.getAttribute('href'), label: link.textContent.trim() });
      return;
    }

    const items = [...nested.children]
      .filter((child) => child.tagName === 'LI')
      .map((child) => child.querySelector('a[href]'))
      .filter(Boolean)
      .map((anchor) => ({ href: anchor.getAttribute('href'), label: anchor.textContent.trim() }));

    const overviewHref = link?.getAttribute('href');
    if (overviewHref && overviewHref !== '#' && !items.some((entry) => entry.href === overviewHref)) {
      items.unshift({ href: overviewHref, label: `${link.textContent.trim()} overview` });
    }
    if (items.length) sections.push({ title: link?.textContent.trim() || 'Documentation', items });
  });

  if (flatItems.length) sections.unshift({ title: 'Documentation', items: flatItems });
  return sections;
}

function renderSections(block, sections) {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  sections.forEach((section) => {
    const group = document.createElement('div');
    group.className = 'docs-sidebar-group';

    const label = document.createElement('div');
    label.className = 'docs-sidebar-label';
    label.textContent = section.title;
    group.append(label);

    const list = document.createElement('ul');
    section.items.forEach((item) => {
      const li = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = item.href;
      anchor.textContent = item.label;
      const itemPath = new URL(anchor.href, window.location.href).pathname.replace(/\/$/, '') || '/';
      if (itemPath === currentPath) {
        li.classList.add('current');
        anchor.setAttribute('aria-current', 'page');
      }
      li.append(anchor);
      list.append(li);
    });
    group.append(list);
    block.append(group);
  });
}

/**
 * Builds the docs rail from the same DA-authored fragment as the primary nav.
 * Presentation stays in code; labels, routes and hierarchy remain in DA.
 * @param {Element} block Sidebar block
 */
export default async function decorate(block) {
  block.textContent = '';

  const heading = document.createElement('a');
  heading.href = '/';
  heading.className = 'docs-sidebar-heading';
  heading.textContent = 'Oak Chain Docs';
  block.append(heading);

  try {
    const navMeta = getMetadata('nav');
    const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
    const fragment = await loadFragment(navPath);
    const sections = navSections(fragment);
    if (!sections.length) throw new Error('Shared navigation has no documentation links');
    renderSections(block, sections);
  } catch (error) {
    const fallback = document.createElement('p');
    const link = document.createElement('a');
    link.href = '/guide/';
    link.textContent = 'Browse the developer guide';
    fallback.append(link);
    block.append(fallback);
  }

  const lift = () => liftAboveFooter(block);
  if (document.readyState === 'complete') lift();
  else window.addEventListener('load', lift, { once: true });
}
