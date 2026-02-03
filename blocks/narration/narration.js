const normalizeKey = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const extractText = (element) => (element ? element.textContent.trim() : '');

const extractUrl = (element) => {
  if (!element) return '';
  const link = element.querySelector('a');
  if (link?.href) return link.href;

  const audio = element.querySelector('audio');
  if (audio) {
    const direct = audio.getAttribute('src');
    if (direct) return new URL(direct, window.location.href).href;
    const source = audio.querySelector('source');
    if (source?.getAttribute('src')) {
      return new URL(source.getAttribute('src'), window.location.href).href;
    }
  }

  const text = element.textContent.trim();
  if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('/'))) {
    return new URL(text, window.location.href).href;
  }
  return '';
};

const mimeFromUrl = (url) => {
  const clean = url.split('?')[0].split('#')[0];
  const ext = clean.split('.').pop()?.toLowerCase();
  const map = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    flac: 'audio/flac',
    aac: 'audio/aac',
    opus: 'audio/opus',
  };
  return map[ext] || '';
};

const pickFirst = (map, keys) => keys.find((key) => map.has(key));

export default function decorate(block) {
  const rows = [...block.children];
  const fields = new Map();

  rows.forEach((row) => {
    const cols = [...row.children];
    if (cols.length < 2) return;
    const key = normalizeKey(cols[0].textContent || '');
    if (!key) return;
    fields.set(key, cols[1]);
  });

  const titleKey = pickFirst(fields, ['title', 'heading', 'name']);
  const descriptionKey = pickFirst(fields, ['description', 'summary', 'text', 'body']);
  const audioKey = pickFirst(fields, ['audio', 'audio-url', 'audio-src', 'src', 'url']);
  const transcriptKey = pickFirst(fields, ['transcript', 'transcript-url', 'transcript-link', 'transcript-path']);
  const noteKey = pickFirst(fields, ['note', 'disclaimer']);

  const titleText = titleKey ? extractText(fields.get(titleKey)) : '';
  const audioUrl = audioKey ? extractUrl(fields.get(audioKey)) : '';
  const transcriptUrl = transcriptKey ? extractUrl(fields.get(transcriptKey)) : '';
  const transcriptText = transcriptKey ? extractText(fields.get(transcriptKey)) : '';

  const card = document.createElement('div');
  card.className = 'narration-card';

  const header = document.createElement('div');
  header.className = 'narration-header';
  if (titleText) {
    const title = document.createElement('h3');
    title.className = 'narration-title';
    title.textContent = titleText;
    header.append(title);
  }

  const meta = document.createElement('div');
  meta.className = 'narration-meta';
  const badge = document.createElement('span');
  badge.className = 'narration-badge';
  badge.textContent = 'AI-generated voice';
  meta.append(badge);

  if (header.children.length) card.append(header);
  card.append(meta);

  if (descriptionKey) {
    const description = document.createElement('div');
    description.className = 'narration-description';
    const source = fields.get(descriptionKey);
    while (source.firstChild) {
      description.append(source.firstChild);
    }
    card.append(description);
  }

  const player = document.createElement('div');
  player.className = 'narration-player';

  if (audioUrl) {
    const audio = document.createElement('audio');
    audio.controls = true;
    audio.preload = 'none';
    const source = document.createElement('source');
    source.src = audioUrl;
    const mime = mimeFromUrl(audioUrl);
    if (mime) source.type = mime;
    audio.append(source);
    audio.append(document.createTextNode('Your browser does not support the audio element.'));
    player.append(audio);
  } else {
    const placeholder = document.createElement('div');
    placeholder.className = 'narration-placeholder';
    placeholder.textContent = 'Narration audio not available yet.';
    player.append(placeholder);
  }

  const actions = document.createElement('div');
  actions.className = 'narration-actions';
  if (transcriptUrl) {
    const transcript = document.createElement('a');
    transcript.className = 'narration-transcript';
    transcript.href = transcriptUrl;
    transcript.textContent = transcriptText && transcriptText !== transcriptUrl ? transcriptText : 'View transcript';
    actions.append(transcript);
  }

  if (actions.children.length) player.append(actions);
  card.append(player);

  if (noteKey) {
    const note = document.createElement('div');
    note.className = 'narration-note';
    const source = fields.get(noteKey);
    while (source.firstChild) {
      note.append(source.firstChild);
    }
    card.append(note);
  }

  block.replaceChildren(card);
  block.dataset.blockStatus = 'loaded';
}
