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
}
