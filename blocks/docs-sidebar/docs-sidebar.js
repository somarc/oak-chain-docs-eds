/**
 * Docs Sidebar block.
 *
 * Site-wide left-rail navigation for every doc page. Mirrors the
 * VitePress sidebar IA. Auto-injected by scripts.js on every page
 * except the homepage. Highlights the current page with a brand-bar
 * border and brand-soft background.
 */

const SECTIONS = [
  {
    title: 'Why Oak Chain',
    items: [
      { href: '/thesis', label: 'The Thesis' },
      { href: '/bull-case', label: 'Bull Case' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Understanding',
    items: [
      { href: '/how-it-works', label: 'How It Works' },
      { href: '/architecture', label: 'Architecture' },
      { href: '/architecture-system-map', label: 'System Map' },
      { href: '/write-flow-and-content-fabric', label: 'Write Flow + Fabric' },
      { href: '/project-composition', label: 'Project Composition' },
      { href: '/guide/', label: 'Quick Start' },
    ],
  },
  {
    title: 'Core Concepts',
    items: [
      { href: '/guide/consensus', label: 'Consensus Model' },
      { href: '/guide/proposal-flow', label: 'Proposal Flow' },
      { href: '/guide/primary-signals', label: 'Primary Signals' },
      { href: '/guide/economics', label: 'Economic Tiers' },
      { href: '/guide/paths', label: 'Content Paths' },
      { href: '/guide/content-consumption', label: 'Content Consumption' },
      { href: '/guide/binaries', label: 'Binary Storage' },
      { href: '/guide/streaming', label: 'Real-Time Streaming' },
      { href: '/segment-gc', label: 'Segment Store GC' },
    ],
  },
  {
    title: 'Developer Guide',
    items: [
      { href: '/guide/api', label: 'API Reference' },
      { href: '/guide/surface-catalog', label: 'Surface Catalog' },
      { href: '/guide/auth', label: 'Authentication' },
      { href: '/guide/aem-integration', label: 'AEM Integration' },
      { href: '/guide/testnet', label: 'Testnet Guide' },
    ],
  },
  {
    title: 'For Operators',
    items: [
      { href: '/operators/', label: 'Running a Validator' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { href: '/changelog', label: 'Changelog' },
      { href: '/contributing', label: 'Contributing' },
    ],
  },
];

/**
 * Lift a fixed-positioned rail above the footer when the footer scrolls
 * into view, so the rail never overlaps it. Reusable for any fixed-rail
 * block (docs-sidebar, page-toc).
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

export default function decorate(block) {
  block.textContent = '';

  const heading = document.createElement('a');
  heading.href = '/';
  heading.className = 'docs-sidebar-heading';
  heading.textContent = 'Oak Chain Docs';
  block.appendChild(heading);

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  SECTIONS.forEach((section) => {
    const group = document.createElement('div');
    group.className = 'docs-sidebar-group';

    const label = document.createElement('div');
    label.className = 'docs-sidebar-label';
    label.textContent = section.title;
    group.appendChild(label);

    const list = document.createElement('ul');
    section.items.forEach((item) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      const itemPath = item.href.replace(/\/$/, '') || '/';
      if (itemPath === currentPath) {
        li.classList.add('current');
        a.setAttribute('aria-current', 'page');
      }
      li.appendChild(a);
      list.appendChild(li);
    });
    group.appendChild(list);
    block.appendChild(group);
  });

  // Defer until the footer fragment has loaded. If `load` already fired
  // (the sidebar is decorated lazily, often after window.load), call
  // immediately — otherwise wait.
  const lift = () => liftAboveFooter(block);
  if (document.readyState === 'complete') lift();
  else window.addEventListener('load', lift);
}
