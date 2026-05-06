/**
 * Guide Sidebar block.
 *
 * Renders a fixed left-rail navigation listing every page in /guide/.
 * Auto-injected by scripts.js on any pathname starting with /guide/. The
 * current page is highlighted. Hidden on narrow viewports via CSS.
 */

const SECTIONS = [
  {
    title: 'Start Here',
    items: [
      { href: '/guide/', label: 'Quick Start' },
      { href: '/guide/auth', label: 'Authentication' },
      { href: '/guide/api', label: 'API Reference' },
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
    ],
  },
  {
    title: 'Storage & Streaming',
    items: [
      { href: '/guide/binaries', label: 'Binary Storage' },
      { href: '/guide/streaming', label: 'Real-Time Streaming' },
    ],
  },
  {
    title: 'Integration',
    items: [
      { href: '/guide/aem-integration', label: 'AEM Integration' },
      { href: '/guide/testnet', label: 'Testnet Guide' },
    ],
  },
];

export default function decorate(block) {
  block.textContent = '';

  const heading = document.createElement('div');
  heading.className = 'guide-sidebar-heading';
  heading.textContent = 'Developer Guide';
  block.appendChild(heading);

  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

  SECTIONS.forEach((section) => {
    const group = document.createElement('div');
    group.className = 'guide-sidebar-group';

    const label = document.createElement('div');
    label.className = 'guide-sidebar-label';
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
