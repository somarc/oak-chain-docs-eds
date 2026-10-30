/* eslint-env node */
/* eslint-disable no-console -- a build script reports what it wrote */
/**
 * Generator for blocks/exploded-commit/exploded-commit.svg.
 *
 * Draws one content write as an isometric exploded view with the Anatomy kit
 * (iso-kit.mjs from the anatomy agent skill). Run:
 *
 *   node tools/exploded-commit/build.mjs
 *
 * The kit is read from $ANATOMY_KIT, or ~/.agents/skills/anatomy/kit/iso-kit.mjs.
 * The output is a static SVG with no styles and no text: every fill and stroke
 * comes from classes that blocks/exploded-commit/exploded-commit.css maps to the
 * site tokens. Layers are <g data-layer="1..5"> (1 = top), painted 5 → 1.
 * The root carries data-anchors: the screen y of each layer's leader where it
 * meets the right edge of the viewBox, so the block can place its HTML labels.
 */
import { writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, '../../blocks/exploded-commit/exploded-commit.svg');
const KIT = process.env.ANATOMY_KIT || join(homedir(), '.agents/skills/anatomy/kit/iso-kit.mjs');
const k = await import(pathToFileURL(KIT).href);

const AZIMUTH = 45;
const SCALE = 1.04;
const PAD = 14;
const LEADER = 46; // screen units from the object's right edge to the viewBox edge
// The leader runs on past the viewBox edge toward the HTML label (shown on desktop only).
const TAIL = 18;
const MARGIN = 9; // clear screen space above and below each leader
const MIN_GAP = 20; // world units between one layer's top and the next layer's base
const MIN_SPACING = 50; // screen units between neighbouring leaders, room for a label
const SEPARATION = 14; // screen units the upper layer's lowest corner clears the lower top centre

// ---------------------------------------------------------------- helpers
const unit = {
  origin: [0, 0], scale: SCALE, azimuth: AZIMUTH, elevation: 30,
};

function makeDraw(P) {
  const at = (p) => k.iso(p, P);
  const solid = (paths, material, opts = {}) => k.solidSvg(paths, { className: `ec-${material}`, ...opts });
  const line = (d, tone = 'lo', opts = {}) => k.lineSvg(d, { tone, ...opts });
  const dots = (pts, opts = {}) => k.dotsSvg(pts.map(at), opts);
  const screw = (x, y, z, r = 1.5) => line(k.ring(x, y, r, z, P, 14), 'lo') + dots([[x, y, z]], { size: 0.45, tone: 'mid' });
  const group = (material, body) => `<g class="ec-${material}">${body}</g>`;
  const floorDepth = ([x, y]) => k.depthOf([x, y, 0], P);
  const byDepth = (pts) => [...pts].sort((a, b) => floorDepth(a) - floorDepth(b));
  return {
    at, solid, line, dots, screw, group, byDepth,
  };
}

// --------------------------------------------------------------- layers
// Each builder takes the projection and its base z, and returns the SVG body
// plus the geometry the layout needs (outline points, top face, axis point).

const SLAB = {
  x: -80, y: -62, w: 160, d: 124, r: 6,
};
const PLATE_H = 11;
const SPACER_H = 2.4;
const STORES = 3;

function storage(P, z0) {
  const {
    solid, line, dots, screw, group, byDepth,
  } = makeDraw(P);
  const out = [];
  const feetZ = z0 - 10;
  const trayZ = z0 - 6;
  out.push(`<path class="iso-halo" d="${k.haloOf(k.insetPlan(SLAB, -4), feetZ, 2, P)}"/>`);
  let steel = '';
  byDepth(k.corners(SLAB, 18)).forEach(([x, y]) => {
    steel += solid(k.cylinder(x, y, 7, feetZ, 1.4, P, 28), 'steel', { tone: 'lo' });
    steel += solid(k.cylinder(x, y, 5.2, feetZ + 1.4, 2.6, P, 28), 'steel', { tone: 'mid' });
  });
  steel += solid(k.slabOf(SLAB, trayZ, 6, P, 8, 1.2), 'steel', { tone: 'mid' });
  steel += k.corners(SLAB, 2.6).map(([x, y]) => screw(x, y, z0, 1.1)).join('');
  out.push(group('steel', steel));

  const plate = k.insetPlan(SLAB, 4.5);
  const spacer = k.insetPlan(SLAB, 8);
  const tabXs = [-46, 0, 46];
  let z = z0;
  for (let i = 0; i < STORES; i += 1) {
    if (i > 0) {
      out.push(group('steel', solid(k.slabOf(spacer, z, SPACER_H, P, 6), 'steel', { tone: 'lo', crease: 'none' })));
      z += SPACER_H;
    }
    const base = z;
    const seams = [3, 5.5, 8].map((s) => k.sideSeam(plate, base + s, P, 6)).join('');
    out.push(group('ivory', solid(k.slabOf(plate, z, PLATE_H, P, 6, 0.6), 'ivory', {
      tone: 'hi',
      crease: 'lo',
      inner: line(seams, 'faint'),
    })));
    // this store's index tab, under its validator's tile, on the front (+y) face
    const tab = {
      x: tabXs[i] - 6, y: plate.y + plate.d, w: 12, d: 2.6, r: 0.8,
    };
    out.push(group('steel', solid(k.slabOf(tab, z + 2.5, 6, P, 3, 0.3), 'steel', { tone: 'mid' })
      + dots([[tabXs[i], tab.y + tab.d, z + 5.5]], { size: 0.5, tone: 'hi' })));
    z += PLATE_H;
  }
  const top = z;
  // segment records on the top plate: a groove, and record boundaries groove to groove
  const groove = k.insetPlan(plate, 5);
  let records = line(k.planOutline(groove, top, P, 6), 'lo');
  const widths = [9, 14, 6, 11, 8, 17, 7, 12, 10, 5, 13, 9];
  let x = groove.x + 3;
  widths.forEach((wd) => {
    x += wd;
    if (x < groove.x + groove.w - 4) {
      records += line(k.lineOnTop([x, groove.y], [x, groove.y + groove.d], top, P), 'faint');
    }
  });
  // one index row across the records, groove to groove
  records += line(k.lineOnTop([groove.x, groove.y + 12], [groove.x + groove.w, groove.y + 12], top, P), 'faint');
  records += k.corners(plate, 2.4).map(([px, py]) => dots([[px, py, top]], { size: 0.45, tone: 'lo' })).join('');
  out.push(group('ivory', records));

  const outline = [...k.boxCorners(SLAB, feetZ, z0), ...k.boxCorners(plate, z0, top)];
  return {
    svg: out.join(''), outline, top, topPlan: plate, axis: [0, 0, top], base: z0, anchorAt: [plate.x + plate.w, plate.y, top],
  };
}

const TILE_W = 44;
const TILE_D = 48;
const TILE_H = 10;
const TILE_GAP = 4;
const CARRIER = {
  x: -76, y: -29, w: 152, d: 58, r: 4,
};

function ordering(P, z0) {
  const {
    solid, line, dots, screw, group,
  } = makeDraw(P);
  const carrierH = 3;
  const zt = z0 + carrierH;
  const top = zt + TILE_H;
  let steel = solid(k.slabOf(CARRIER, z0, carrierH, P, 6, 0.6), 'steel', { tone: 'mid' });
  steel += [[CARRIER.x + 3, 0], [CARRIER.x + CARRIER.w - 3, 0]].map(([x, y]) => screw(x, y, zt, 1.1)).join('');
  const tiles = [0, 1, 2].map((i) => ({
    x: -(3 * TILE_W + 2 * TILE_GAP) / 2 + i * (TILE_W + TILE_GAP),
    y: -TILE_D / 2,
    w: TILE_W,
    d: TILE_D,
    r: 3,
  }));
  tiles.forEach((t) => {
    const cx = t.x + t.w / 2;
    const plug = {
      x: cx - 7, y: t.y + t.d, w: 14, d: 2.4, r: 0.8,
    };
    let body = solid(k.slabOf(t, zt, TILE_H, P, 4, 0.8), 'steel', {
      tone: 'hi', crease: 'lo', inner: line(k.sideSeam(t, zt + 3, P, 4), 'faint'),
    });
    // connector on the front (+y) face
    body += solid(k.slabOf(plug, zt + 3.4, 4, P, 3, 0.3), 'steel', { tone: 'mid' });
    body += dots([[cx - 3.5, plug.y + plug.d, zt + 5.4], [cx + 3.5, plug.y + plug.d, zt + 5.4]], { size: 0.45, tone: 'hi' });
    const groove = k.insetPlan(t, 3.5);
    body += line(k.planOutline(groove, top, P, 4), 'lo');
    // vent slots: closed outlines, nothing ends in the open
    [0, 1, 2, 3].forEach((v) => {
      body += line(k.planOutline({
        x: t.x + 22 + v * 4.6, y: t.y + 9, w: 1.8, d: 18, r: 0.9,
      }, top, P, 3), 'lo');
    });
    body += k.corners(t, 7).map(([x, y]) => screw(x, y, top, 1.2)).join('');
    // a small label well with two rule lines
    const well = {
      x: t.x + 22, y: t.y + 31, w: 16, d: 8, r: 1,
    };
    body += line(k.planOutline(well, top, P, 3), 'faint');
    body += line(k.lineOnTop([well.x + 2.5, well.y + 3], [well.x + 12, well.y + 3], top, P), 'lo', { free: true });
    body += line(k.lineOnTop([well.x + 2.5, well.y + 5.4], [well.x + 9, well.y + 5.4], top, P), 'lo', { free: true });
    steel += body;
    // status pip: brass, the tile is live
    steel += group('brass', solid(k.cylinder(t.x + 11, t.y + 22, 2.6, top, 1.2, P, 20), 'brass', { tone: 'hi' }));
  });
  // bus bars bridging neighbours: the cluster
  let bars = '';
  [0, 1].forEach((i) => {
    const gapX = tiles[i].x + tiles[i].w;
    const bar = {
      x: gapX - 6, y: -4, w: TILE_GAP + 12, d: 8, r: 1.2,
    };
    bars += solid(k.slabOf(bar, top, 1.6, P, 3, 0.3), 'steel', { tone: 'hi' });
    bars += dots([[bar.x + 2.6, 0, top + 1.6], [bar.x + bar.w - 2.6, 0, top + 1.6]], { size: 0.5, tone: 'hi' });
  });
  const outline = [
    ...k.boxCorners(CARRIER, z0, zt),
    ...tiles.flatMap((t) => k.boxCorners(t, zt, top)),
  ];
  const last = tiles[2];
  return {
    svg: group('steel', steel + bars), outline, top, topPlan: CARRIER, axis: [0, 0, top + 1.6], base: z0, anchorAt: [last.x + last.w, last.y, top],
  };
}

const COIN_R = 27;
const COIN_SIDES = 16;

function settlement(P, z0) {
  const { line, solid, group } = makeDraw(P);
  const h = 5.5;
  const top = z0 + h;
  const rot = Math.PI / COIN_SIDES;
  const poly = (r) => Array.from({ length: COIN_SIDES }, (_, i) => {
    const a = rot + (i / COIN_SIDES) * Math.PI * 2;
    return [r * Math.cos(a), r * Math.sin(a)];
  });
  const outer = poly(COIN_R);
  const inner = poly(20);
  let body = solid(k.extrude(outer, z0, h, P, { bevel: 0.7 }), 'brass', {
    tone: 'hi', crease: 'lo', inner: line(k.ringSeam(outer, z0 + h / 2, P), 'faint'),
  });
  // facet lines from each outer top vertex to the raised centre's foot
  body += line(outer.map((p, i) => k.lineOnTop(p, inner[i], top, P)).join(''), 'lo');
  body += solid(k.extrude(inner, top, 1.4, P, { bevel: 0.4 }), 'brass', { tone: 'hi', crease: 'lo' });
  body += line(k.onTop(poly(13), top + 1.4, P, true), 'faint');
  body += solid(k.cylinder(0, 0, 3.4, top + 1.4, 0.8, P, 20), 'brass', { tone: 'mid' });
  const outline = outer.flatMap(([x, y]) => [[x, y, z0], [x, y, top]]);
  const screenX = (p) => k.iso([p[0], p[1], top], P)[0];
  const right = outer.reduce((best, p) => (screenX(p) > screenX(best) ? p : best));
  return {
    svg: group('brass', body), outline, top, topRing: outer, axis: [0, 0, top + 2.2], base: z0, anchorAt: [right[0], right[1], top],
  };
}

const SEAL_PLATE = {
  x: -37, y: -37, w: 74, d: 74, r: 6,
};

function signature(P, z0) {
  const {
    line, solid, screw, group,
  } = makeDraw(P);
  const h = 4.5;
  const top = z0 + h;
  let body = solid(k.slabOf(SEAL_PLATE, z0, h, P, 8, 0.8), 'brass', { tone: 'mid', crease: 'lo' });
  // brushed finish: straight grain across the plate, edge to edge on the straight run
  let grain = '';
  const last = SEAL_PLATE.y + SEAL_PLATE.d - SEAL_PLATE.r - 1;
  for (let y = SEAL_PLATE.y + SEAL_PLATE.r + 1; y <= last; y += 2.6) {
    grain += k.lineOnTop([SEAL_PLATE.x, y], [SEAL_PLATE.x + SEAL_PLATE.w, y], top, P);
  }
  body += line(grain, 'faint');
  body += k.corners(SEAL_PLATE, 7).map(([x, y]) => screw(x, y, top, 1.7)).join('');
  // the seal: a knurled signet boss with a rosette of ticks
  const bossH = 4;
  const bt = top + bossH;
  body += solid(k.cylinder(0, 0, 22, top, bossH, P, 64, 0.6), 'brass', {
    tone: 'hi', crease: 'lo', inner: line(k.knurl(0, 0, 22, top, bt, 90, P, 0.5), 'lo'),
  });
  body += line(k.ring(0, 0, 18.5, bt, P, 64), 'lo');
  const ticks = k.radialTicks(0, 0, 18.5, 48, 4, bt, [1.3, 3], P);
  body += line(ticks.minor, 'faint') + line(ticks.major, 'lo');
  body += line(k.ring(0, 0, 9.5, bt, P, 48), 'lo');
  body += solid(k.cylinder(0, 0, 5.5, bt, 1.4, P, 32, 0.3), 'brass', { tone: 'hi', crease: 'lo' });
  const outline = [...k.boxCorners(SEAL_PLATE, z0, top), [0, 0, bt]];
  return {
    svg: group('brass', body), outline, top, topPlan: SEAL_PLATE, axis: [0, 0, bt + 1.4], base: z0, anchorAt: [SEAL_PLATE.x + SEAL_PLATE.w, SEAL_PLATE.y, top],
  };
}

const CARD = {
  x0: -28, x1: 28, y0: -36, y1: 36, fold: 13,
};

function documentCard(P, z0) {
  const {
    line, solid, dots, group,
  } = makeDraw(P);
  const h = 2.6;
  const top = z0 + h;
  const {
    x0, x1, y0, y1, fold,
  } = CARD;
  const ring = [[x0, y0], [x1 - fold, y0], [x1, y0 + fold], [x1, y1], [x0, y1]];
  let body = solid(k.extrude(ring, z0, h, P, { bevel: 0.5 }), 'ivory', {
    tone: 'hi', crease: 'lo', inner: line(k.ringSeam(ring, z0 + h / 2, P), 'faint'),
  });
  // property rows: a title rule and ruled lines (they stand for printed text)
  const rows = [[-20, 0, 'mid', -27], [-16, 10, 'lo', -17], [-16, 4, 'lo', -11], [-16, 14, 'lo', -5], [-16, 6, 'lo', 1], [-16, 12, 'lo', 7], [-16, 8, 'lo', 13]];
  rows.forEach(([xs, xe, tone, y]) => {
    body += line(k.lineOnTop([xs, y], [xe, y], top, P), tone, { free: true });
  });
  // the node glyph: a ring with a branch to each property row
  body += line(k.ring(-21.5, -17, 1.4, top, P, 14), 'mid');
  body += line(k.onTop([[-21.5, -15.6], [-21.5, 13]], top, P), 'lo');
  body += line([-11, -5, 1, 7, 13].map((y) => k.lineOnTop([-21.5, y], [-18, y], top, P)).join(''), 'lo', { free: 'end' });
  body += dots([[-21.5, -17, top]], { size: 0.5, tone: 'hi' });
  // a hash strip along the foot of the card (the node's content address)
  const strip = {
    x: -22, y: 22, w: 44, d: 7, r: 1,
  };
  body += line(k.planOutline(strip, top, P, 3), 'lo');
  const t = k.topTicks(strip.x + 2, strip.x + strip.w - 2, 2, 4, strip.y, top, [2.4, 4.2], P);
  body += line(t.minor, 'faint') + line(t.major, 'lo');
  // the folded corner: a flap lying on the card, the mirror of the cut
  const flap = [[x1 - fold, y0], [x1, y0 + fold], [x1 - fold, y0 + fold]];
  body += solid(k.extrude(flap, top, 0.6, P), 'ivory ec-flap', { tone: 'mid', crease: 'lo' });
  const outline = ring.flatMap(([x, y]) => [[x, y, z0], [x, y, top]]);
  return {
    svg: group('ivory', body), outline, top, topPlan: null, axis: [0, 0, top], base: z0, anchorAt: [x1, y0 + fold, top],
  };
}

// --------------------------------------------------------------- layout
const BUILDERS = [documentCard, signature, settlement, ordering, storage]; // top → bottom

// Screen polygon (convex hull) of a set of world points.
function hull(points, P) {
  const pts = points.map((p) => k.iso(p, P)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower = [];
  const upper = [];
  pts.forEach((p) => {
    while (lower.length >= 2 && cross(lower.at(-2), lower.at(-1), p) <= 0) lower.pop();
    lower.push(p);
  });
  [...pts].reverse().forEach((p) => {
    while (upper.length >= 2 && cross(upper.at(-2), upper.at(-1), p) <= 0) upper.pop();
    upper.push(p);
  });
  return [...lower.slice(0, -1), ...upper.slice(0, -1)];
}

// Vertical extent of a polygon over the screen columns x >= from.
function spanRight(poly, from) {
  let min = Infinity;
  let max = -Infinity;
  poly.forEach((a, i) => {
    const b = poly[(i + 1) % poly.length];
    for (let s = 0; s <= 40; s += 1) {
      const x = a[0] + ((b[0] - a[0]) * s) / 40;
      const y = a[1] + ((b[1] - a[1]) * s) / 40;
      if (x >= from) {
        min = Math.min(min, y);
        max = Math.max(max, y);
      }
    }
  });
  return [min, max];
}

// Neighbouring layers keep room for a label between their leaders, and the
// upper one's lowest corner stays above the lower one's top centre.
function clearOf(low, poly, anchor) {
  const lowestUp = Math.max(...poly.map((p) => p[1]));
  return low.anchor[1] - anchor[1] >= MIN_SPACING && lowestUp <= low.centre[1] - SEPARATION;
}

function layout(P) {
  const placed = []; // bottom → top
  let z = 0;
  [...BUILDERS].reverse().forEach((build, index) => {
    let candidate = index === 0 ? 0 : z + MIN_GAP;
    for (let guard = 0; guard < 400; guard += 1) {
      const layer = build(P, candidate);
      const poly = hull(layer.outline, P);
      const anchor = k.iso(layer.anchorAt, P);
      const clear = placed.every((low) => {
        const [lowTop] = spanRight(low.poly, anchor[0] - 4);
        const [, highBottom] = spanRight(poly, low.anchor[0] - 4);
        return lowTop > anchor[1] + MARGIN && highBottom < low.anchor[1] - MARGIN;
      }) && (!placed.length || clearOf(placed[placed.length - 1], poly, anchor));
      if (clear) {
        placed.push({
          ...layer, poly, anchor, centre: k.iso(layer.axis, P),
        });
        z = layer.top;
        break;
      }
      candidate += 1;
    }
  });
  return placed.reverse(); // top → bottom
}

// First pass at a unit origin to measure, then shift into the viewBox.
const measured = layout(unit);
const allPts = measured.flatMap((l) => l.poly);
const minX = Math.min(...allPts.map((p) => p[0]));
const maxX = Math.max(...allPts.map((p) => p[0]));
const minY = Math.min(...allPts.map((p) => p[1]));
const maxY = Math.max(...allPts.map((p) => p[1]));
const WIDTH = Math.ceil(maxX - minX + PAD + LEADER);
const HEIGHT = Math.ceil(maxY - minY + PAD * 2 + 10);
const P = { ...unit, origin: [PAD - minX, PAD - minY] };
const layers = layout(P);

// --------------------------------------------------------------- assemble
const { cosE, k: kScale } = k.cameraOf(P);
const round = (v) => Math.round(v * 10) / 10;

// Resting (assembled) bases: each layer sits on the one below it.
const bottomUp = [...layers].reverse();
const rest = [];
bottomUp.forEach((layer, i) => {
  if (i === 0) rest.push(layer.base);
  else rest.push(rest[i - 1] + (bottomUp[i - 1].top - bottomUp[i - 1].base) + 0.6);
});

const body = [];
bottomUp.forEach((layer, i) => {
  const number = layers.length - i; // 5 … 1
  const collapse = round((layer.base - rest[i]) * cosE * kScale);
  const draw = makeDraw(P);
  let extra = '';
  const above = bottomUp[i + 1];
  if (above) {
    // soft contact shadow of the layer above, clipped to this layer's top face
    const shadowPlan = above.topPlan || {
      x: -COIN_R, y: -COIN_R, w: COIN_R * 2, d: COIN_R * 2, r: COIN_R,
    };
    const face = layer.topPlan
      ? k.slabOf(layer.topPlan, layer.top, 0.01, P).fill
      : k.extrude(layer.topRing, layer.top, 0.01, P).fill;
    const id = `ec-shadow-${number}`;
    extra += `<clipPath id="${id}"><path d="${face}"/></clipPath>`;
    extra += `<g clip-path="url(#${id})"><path class="ec-shadow" d="${k.haloOf(k.insetPlan(shadowPlan, 4), layer.top, 0.01, P)}"/></g>`;
    // the axis leader: from this layer's top centre up into the layer above
    const from = layer.axis;
    const to = [0, 0, above.base];
    extra += `<g class="ec-axis">${draw.line(k.segment(from, to, P), 'faint')}${draw.dots([from], { size: 0.9, tone: 'mid' })}</g>`;
  }
  // the label leader: from the layer's right corner past the viewBox edge
  const [ax, ay] = layer.anchor;
  const leader = `<g class="ec-leader"><path d="M${round(ax)} ${round(ay)}H${WIDTH + TAIL}"/><circle class="ec-anchor" cx="${round(ax)}" cy="${round(ay)}" r="1.6"/></g>`;
  body.push(`<g class="ec-layer" data-layer="${number}" style="--ec-collapse:${collapse}px">${layer.svg}${extra}${leader}</g>`);
});

const anchors = layers.map((l) => `${round(l.anchor[1])}`).join(' ');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" class="ec-svg" aria-hidden="true" focusable="false" data-anchors="${anchors}">${body.join('')}</svg>\n`;
writeFileSync(OUT, svg);
console.log(`wrote ${OUT}: ${WIDTH}x${HEIGHT}, ${svg.length} bytes, anchors y = ${anchors}`);
console.log('collapse px:', bottomUp.map((l, i) => round((l.base - rest[i]) * cosE * kScale)).join(' '));
