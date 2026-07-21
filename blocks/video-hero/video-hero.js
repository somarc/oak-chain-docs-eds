export function shouldLoadMotionMedia({ reducedMotion = false, saveData = false, effectiveType = '' } = {}) {
  return !reducedMotion && !saveData && !['slow-2g', '2g'].includes(effectiveType);
}

function scheduleVideoLoad(video, source, videoSrc) {
  const load = () => {
    source.src = videoSrc;
    video.load();
    video.play().catch(() => {
      // Autoplay may be disabled by the browser. The poster remains as fallback.
    });
  };
  const schedule = () => {
    if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 1500 });
    else window.setTimeout(load, 0);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, { once: true });
}

export default function decorate(block) {
  let videoSrc;

  [...block.children].some((row) => {
    const link = row.querySelector('a[href]');
    if (link && /\.(mp4|webm|ogg)(\?|#|$)/i.test(link.href)) {
      videoSrc = link.href;
      row.remove();
      return true;
    }
    return false;
  });

  const content = document.createElement('div');
  content.className = 'video-hero-content';
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      while (cell.firstChild) content.append(cell.firstChild);
    });
  });

  const h1 = content.querySelector('h1');
  const first = content.firstElementChild;
  if (h1 && first && first !== h1 && first.tagName === 'H2') {
    const kicker = document.createElement('p');
    kicker.className = 'video-hero-kicker';
    while (first.firstChild) kicker.append(first.firstChild);
    first.replaceWith(kicker);
  } else if (h1 && first && first !== h1 && first.tagName === 'P') {
    first.classList.add('video-hero-kicker');
  }

  block.textContent = '';

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const loadMotion = shouldLoadMotionMedia({
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    saveData: Boolean(connection?.saveData),
    effectiveType: connection?.effectiveType || '',
  });

  if (videoSrc && loadMotion) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'none';
    video.poster = '/default-meta-image.png';
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;

    const source = document.createElement('source');
    const mediaPath = new URL(videoSrc, window.location.href).pathname;
    source.type = mediaPath.endsWith('.webm') ? 'video/webm' : 'video/mp4';
    video.append(source);
    block.append(video);
    block.classList.add('has-video');
    scheduleVideoLoad(video, source, videoSrc);
  }

  block.append(content);
}
