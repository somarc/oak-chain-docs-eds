const INDEX_URL = '/query-index.json';
const MAX_RESULTS = 8;
const MIN_QUERY_LEN = 2;

let indexPromise = null;

async function loadIndex() {
  if (!indexPromise) {
    indexPromise = fetch(INDEX_URL)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((j) => j.data || [])
      .catch(() => []);
  }
  return indexPromise;
}

function score(entry, q) {
  const ql = q.toLowerCase();
  const title = (entry.title || '').toLowerCase();
  const desc = (entry.description || '').toLowerCase();
  const content = (entry.content || '').toLowerCase();
  let s = 0;
  if (title.startsWith(ql)) s += 70;
  else if (title.includes(ql)) s += 50;
  if (desc.includes(ql)) s += 15;
  let count = 0;
  let idx = content.indexOf(ql);
  while (idx !== -1 && count < 5) {
    count += 1;
    idx = content.indexOf(ql, idx + ql.length);
  }
  s += count * 3;
  return s;
}

function snippet(text, q) {
  if (!text) return '';
  const ql = q.toLowerCase();
  const idx = text.toLowerCase().indexOf(ql);
  if (idx === -1) return `${text.slice(0, 120)}${text.length > 120 ? '…' : ''}`;
  const start = Math.max(0, idx - 50);
  const end = Math.min(text.length, idx + ql.length + 80);
  return `${start > 0 ? '…' : ''}${text.slice(start, end)}${end < text.length ? '…' : ''}`;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function highlight(text, q) {
  if (!text || !q) return escapeHtml(text || '');
  const safe = escapeHtml(text);
  const ql = q.toLowerCase();
  const lower = safe.toLowerCase();
  let out = '';
  let i = 0;
  while (i < safe.length) {
    const idx = lower.indexOf(ql, i);
    if (idx === -1) {
      out += safe.slice(i);
      break;
    }
    out += `${safe.slice(i, idx)}<mark>${safe.slice(idx, idx + ql.length)}</mark>`;
    i = idx + ql.length;
  }
  return out;
}

export default async function decorate(block) {
  block.innerHTML = '';

  const root = document.createElement('div');
  root.className = 'search-root';

  const inputWrap = document.createElement('div');
  inputWrap.className = 'search-input-wrap';

  const input = document.createElement('input');
  input.type = 'search';
  input.placeholder = 'Search docs…';
  input.className = 'search-input';
  input.autocomplete = 'off';
  input.spellcheck = false;
  input.setAttribute('role', 'combobox');
  input.setAttribute('aria-label', 'Search documentation');
  input.setAttribute('aria-autocomplete', 'list');
  input.setAttribute('aria-expanded', 'false');
  input.setAttribute('aria-controls', 'search-listbox');

  const kbd = document.createElement('span');
  kbd.className = 'search-kbd';
  kbd.textContent = '⌘K';

  inputWrap.append(input, kbd);

  const listbox = document.createElement('ul');
  listbox.id = 'search-listbox';
  listbox.className = 'search-results';
  listbox.setAttribute('role', 'listbox');

  root.append(inputWrap, listbox);
  block.append(root);

  let activeIdx = -1;
  let lastQ = '';

  function setActive(i) {
    const items = [...listbox.querySelectorAll('li[role="option"]')];
    if (items.length === 0) return;
    items.forEach((li) => li.classList.remove('active'));
    activeIdx = ((i % items.length) + items.length) % items.length;
    items[activeIdx].classList.add('active');
    input.setAttribute('aria-activedescendant', items[activeIdx].id);
    items[activeIdx].scrollIntoView({ block: 'nearest' });
  }

  function close() {
    block.classList.remove('search-open');
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    activeIdx = -1;
  }

  async function runSearch() {
    const q = input.value.trim();
    if (q === lastQ) return;
    lastQ = q;
    activeIdx = -1;
    listbox.innerHTML = '';
    if (q.length < MIN_QUERY_LEN) {
      close();
      return;
    }
    const idx = await loadIndex();
    const matches = idx
      .map((e) => ({ e, s: score(e, q) }))
      .filter((m) => m.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, MAX_RESULTS)
      .map((m) => m.e);

    if (matches.length === 0) {
      const li = document.createElement('li');
      li.className = 'search-empty';
      li.textContent = `No results for "${q}"`;
      listbox.append(li);
    } else {
      matches.forEach((e, i) => {
        const li = document.createElement('li');
        li.setAttribute('role', 'option');
        li.id = `search-opt-${i}`;
        const a = document.createElement('a');
        a.href = e.path;
        a.innerHTML = `
          <div class="search-result-title">${highlight(e.title || e.path, q)}</div>
          <div class="search-result-snippet">${highlight(snippet(e.description || e.content || '', q), q)}</div>
          <div class="search-result-path">${escapeHtml(e.path)}</div>
        `;
        li.append(a);
        listbox.append(li);
      });
    }
    block.classList.add('search-open');
    input.setAttribute('aria-expanded', 'true');
  }

  let debounce;
  input.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(runSearch, 100);
  });

  input.addEventListener('focus', () => {
    loadIndex();
    if (input.value.trim().length >= MIN_QUERY_LEN) {
      block.classList.add('search-open');
      input.setAttribute('aria-expanded', 'true');
    }
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(activeIdx + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(activeIdx - 1);
    } else if (e.key === 'Enter' && activeIdx >= 0) {
      e.preventDefault();
      const items = listbox.querySelectorAll('li[role="option"] a');
      if (items[activeIdx]) window.location.assign(items[activeIdx].href);
    } else if (e.key === 'Escape') {
      input.value = '';
      lastQ = '';
      listbox.innerHTML = '';
      close();
      input.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) close();
  });

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
}
