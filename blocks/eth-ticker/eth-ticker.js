const CACHE_KEY = 'oak-eth-price-v1';
const TTL_MS = 60 * 60 * 1000;
const CURRENCIES = ['usd', 'cad'];
const PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${CURRENCIES.join(',')}`;

let inFlight = false;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCache(prices) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...prices, ts: Date.now() }));
  } catch {
    // localStorage unavailable (private browsing, quota); render still works
  }
}

function isFresh(cache) {
  return Boolean(cache && cache.ts && (Date.now() - cache.ts) < TTL_MS);
}

function formatPrice(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

async function fetchPrice() {
  const res = await fetch(PRICE_URL, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const data = await res.json();
  const eth = data && data.ethereum;
  if (!eth || typeof eth.usd !== 'number' || typeof eth.cad !== 'number') {
    throw new Error('Malformed CoinGecko response');
  }
  return { usd: eth.usd, cad: eth.cad };
}

function render(block, cache, stale) {
  const usd = cache ? formatPrice(cache.usd) : '—';
  const cad = cache ? formatPrice(cache.cad) : '—';
  block.dataset.stale = stale ? 'true' : 'false';
  block.innerHTML = `
    <span class="eth-ticker-symbol" aria-hidden="true">ETH</span>
    <dl class="eth-ticker-rates">
      <div class="eth-ticker-rate">
        <dt>USD</dt>
        <dd>${usd}</dd>
      </div>
      <div class="eth-ticker-rate">
        <dt>CAD</dt>
        <dd>${cad}</dd>
      </div>
    </dl>
  `;
}

async function refresh(block) {
  if (inFlight) return;
  inFlight = true;
  try {
    const fresh = await fetchPrice();
    writeCache(fresh);
    render(block, { ...fresh, ts: Date.now() }, false);
  } catch {
    const cached = readCache();
    render(block, cached, Boolean(cached));
  } finally {
    inFlight = false;
  }
}

function scheduleRefresh(block) {
  const run = () => refresh(block);
  if ('requestIdleCallback' in window) {
    requestIdleCallback(run, { timeout: 2000 });
  } else {
    setTimeout(run, 0);
  }
}

export default async function decorate(block) {
  block.setAttribute('aria-live', 'polite');
  block.setAttribute('aria-atomic', 'true');
  block.setAttribute('aria-label', 'Live ETH price in USD and CAD');

  const cached = readCache();
  render(block, cached, Boolean(cached) && !isFresh(cached));

  if (!isFresh(cached)) {
    scheduleRefresh(block);
  }

  setInterval(() => {
    if (!document.hidden) refresh(block);
  }, TTL_MS);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) return;
    if (!isFresh(readCache())) refresh(block);
  });
}
