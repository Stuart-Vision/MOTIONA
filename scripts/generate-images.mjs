/**
 * MOTIONA — original artwork generator.
 *
 * Every image shipped in `public/images` is generated here from seeded geometry,
 * so the project carries no third-party photography and no hotlinked assets.
 * Run with `npm run gen:images`. Output is deterministic: the same seed always
 * produces the same composition, so regenerating never churns the repo.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(process.cwd(), "public", "images");

/* ------------------------------------------------------------------ */
/* Deterministic RNG                                                    */
/* ------------------------------------------------------------------ */

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const makeRandom = (rng) => ({
  float: (min, max) => min + rng() * (max - min),
  int: (min, max) => Math.floor(min + rng() * (max - min + 1)),
  pick: (arr) => arr[Math.floor(rng() * arr.length)],
  chance: (p) => rng() < p,
  shuffle: (arr) => {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  },
});

/* ------------------------------------------------------------------ */
/* Palettes                                                             */
/* ------------------------------------------------------------------ */

const INK = "#111111";
const PAPER = "#F7F7F4";

const PALETTES = {
  ember: { ground: "#FF5A1F", ink: "#1A0B04", tints: ["#FF725E", "#FFC53D", "#FFE9D6", "#7A1F06"] },
  coral: { ground: "#FF725E", ink: "#2A0A06", tints: ["#FF5A1F", "#FFD9CF", "#F7F7F4", "#8E2416"] },
  lime: { ground: "#DFFF3F", ink: "#141A02", tints: ["#111111", "#8FBF12", "#F7F7F4", "#FF5A1F"] },
  violet: { ground: "#6B4EFF", ink: "#0B0630", tints: ["#C9BEFF", "#FF8FB1", "#DFFF3F", "#2A1C7A"] },
  cobalt: { ground: "#2B54F0", ink: "#050C33", tints: ["#9FB6FF", "#F7F7F4", "#FFC53D", "#0F2688"] },
  blush: { ground: "#FF8FB1", ink: "#3A0A1C", tints: ["#FFD9E4", "#FF5A1F", "#111111", "#B23A61"] },
  ochre: { ground: "#FFC53D", ink: "#26190A", tints: ["#FF5A1F", "#F7F7F4", "#8A5C05", "#111111"] },
  pine: { ground: "#0F9B8E", ink: "#04241F", tints: ["#9BE8DE", "#F7F7F4", "#DFFF3F", "#06584F"] },
  ink: { ground: "#151515", ink: "#F7F7F4", tints: ["#FF5A1F", "#DFFF3F", "#6B4EFF", "#3B3B3B"] },
  bone: { ground: "#ECECE8", ink: "#111111", tints: ["#FF5A1F", "#6B6B6B", "#151515", "#FFC53D"] },
  clay: { ground: "#E0603C", ink: "#2B0D04", tints: ["#F2E8DC", "#FFC53D", "#111111", "#8C2F14"] },
  slate: { ground: "#3A3F4B", ink: "#F2F4F8", tints: ["#FF725E", "#9AA3B2", "#DFFF3F", "#1B1F27"] },
};

const PALETTE_KEYS = Object.keys(PALETTES);

/* ------------------------------------------------------------------ */
/* Shared SVG helpers                                                   */
/* ------------------------------------------------------------------ */

/** Print-style grain, baked in at generation time so it costs nothing at runtime. */
const GRAIN_FILTER = `
  <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0.6 0.4 0.2 0 0"/>
  </filter>`;

const VIGNETTE_GRADIENT = `
  <radialGradient id="vig" cx="50%" cy="45%" r="72%">
    <stop offset="55%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.2"/>
  </radialGradient>`;

/* ------------------------------------------------------------------ */
/* Composition styles                                                   */
/* ------------------------------------------------------------------ */

/** Truchet-style modular field of quarter arcs. */
function truchet(r, w, h, p) {
  const cols = r.int(3, 5);
  const cell = w / cols;
  const rows = Math.ceil(h / cell);
  const colours = r.shuffle([p.ink, ...p.tints]).slice(0, 3);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const cx = x * cell;
      const cy = y * cell;
      const fill = r.pick(colours);
      const stroke = cell * r.float(0.14, 0.3);
      const rot = r.int(0, 3) * 90;
      out += `<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${rot} ${(cell / 2).toFixed(1)} ${(cell / 2).toFixed(1)})">`;
      if (r.chance(0.72)) {
        out += `<path d="M0 ${cell / 2} A ${cell / 2} ${cell / 2} 0 0 1 ${cell / 2} 0" fill="none" stroke="${fill}" stroke-width="${stroke.toFixed(1)}"/>`;
        out += `<path d="M${cell} ${cell / 2} A ${cell / 2} ${cell / 2} 0 0 0 ${cell / 2} ${cell}" fill="none" stroke="${fill}" stroke-width="${stroke.toFixed(1)}"/>`;
      } else {
        out += `<path d="M0 0 L ${cell} 0 L 0 ${cell} Z" fill="${fill}" opacity="0.92"/>`;
      }
      out += `</g>`;
    }
  }
  return out;
}

/** Layered horizontal wave bands — landscape/terrain abstraction. */
function strata(r, w, h, p) {
  const bands = r.int(5, 8);
  const colours = r.shuffle([p.ink, ...p.tints]);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let i = 0; i < bands; i += 1) {
    const base = h * (0.22 + (i / bands) * 0.82);
    const amp = h * r.float(0.03, 0.1);
    const seg = w / 3;
    const d = [`M0 ${(base + r.float(-amp, amp)).toFixed(1)}`];
    for (let s = 0; s < 3; s += 1) {
      const x1 = seg * s + seg * 0.5;
      const x2 = seg * (s + 1);
      d.push(`Q ${x1.toFixed(1)} ${(base + r.float(-amp * 2, amp * 2)).toFixed(1)} ${x2.toFixed(1)} ${(base + r.float(-amp, amp)).toFixed(1)}`);
    }
    d.push(`L ${w} ${h} L 0 ${h} Z`);
    out += `<path d="${d.join(" ")}" fill="${colours[i % colours.length]}" opacity="${(0.94 - i * 0.04).toFixed(2)}"/>`;
  }
  // Sun / moon disc
  const rad = w * r.float(0.1, 0.18);
  out += `<circle cx="${(w * r.float(0.25, 0.75)).toFixed(1)}" cy="${(h * r.float(0.16, 0.3)).toFixed(1)}" r="${rad.toFixed(1)}" fill="${r.pick(p.tints)}"/>`;
  return out;
}

/** Concentric rings with an offset cut disc. */
function orbit(r, w, h, p) {
  const cx = w * r.float(0.38, 0.62);
  const cy = h * r.float(0.38, 0.62);
  const max = Math.max(w, h) * 0.62;
  const rings = r.int(7, 12);
  const colours = r.shuffle([p.ink, ...p.tints]);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let i = rings; i > 0; i -= 1) {
    const rad = (max / rings) * i;
    out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${rad.toFixed(1)}" fill="none" stroke="${colours[i % colours.length]}" stroke-width="${(max / rings) * r.float(0.24, 0.58)}" opacity="0.9"/>`;
  }
  const dr = max * r.float(0.16, 0.26);
  out += `<circle cx="${(cx + max * r.float(-0.4, 0.4)).toFixed(1)}" cy="${(cy + max * r.float(-0.4, 0.4)).toFixed(1)}" r="${dr.toFixed(1)}" fill="${p.ink}"/>`;
  return out;
}

/**
 * Cut-paper portrait collage. Deliberately non-representational: a figure is
 * implied by mass, arch and band rather than by drawn features, which keeps the
 * set reading as gallery abstraction instead of illustration.
 */
function figure(r, w, h, p) {
  const colours = r.shuffle([p.ink, ...p.tints]);
  const cx = w * r.float(0.42, 0.6);
  const massR = Math.min(w, h) * r.float(0.26, 0.34);
  const massY = h * r.float(0.36, 0.46);
  const rot = r.int(-14, 14);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;

  // Backdrop panel — full-bleed arch or offset rectangle.
  if (r.chance(0.55)) {
    const pw = w * r.float(0.6, 0.86);
    const px = (w - pw) / 2 + w * r.float(-0.08, 0.08);
    out += `<path d="M ${px.toFixed(1)} ${h} L ${px.toFixed(1)} ${(h * 0.44).toFixed(1)} A ${(pw / 2).toFixed(1)} ${(pw / 2).toFixed(1)} 0 0 1 ${(px + pw).toFixed(1)} ${(h * 0.44).toFixed(1)} L ${(px + pw).toFixed(1)} ${h} Z" fill="${colours[0]}"/>`;
  } else {
    out += `<rect x="${(w * r.float(0.05, 0.2)).toFixed(1)}" y="${(h * r.float(0.08, 0.2)).toFixed(1)}" width="${(w * r.float(0.55, 0.8)).toFixed(1)}" height="${(h * r.float(0.6, 0.84)).toFixed(1)}" fill="${colours[0]}"/>`;
  }

  // Torso band rising out of frame.
  const bandW = massR * r.float(1.1, 1.7);
  out += `<rect x="${(cx - bandW / 2).toFixed(1)}" y="${massY.toFixed(1)}" width="${bandW.toFixed(1)}" height="${(h - massY).toFixed(1)}" fill="${colours[1]}" transform="rotate(${rot} ${cx.toFixed(1)} ${h.toFixed(1)})"/>`;

  // Primary mass.
  out += `<ellipse cx="${cx.toFixed(1)}" cy="${massY.toFixed(1)}" rx="${massR.toFixed(1)}" ry="${(massR * r.float(1.02, 1.24)).toFixed(1)}" fill="${colours[2]}" transform="rotate(${rot} ${cx.toFixed(1)} ${massY.toFixed(1)})"/>`;

  // Crescent counter-form sliced across the mass.
  const cutR = massR * r.float(0.86, 1.05);
  const cutX = cx + massR * r.float(-0.55, 0.55);
  const cutY = massY + massR * r.float(-0.5, 0.35);
  out += `<path d="M ${(cutX - cutR).toFixed(1)} ${cutY.toFixed(1)} A ${cutR.toFixed(1)} ${cutR.toFixed(1)} 0 0 ${r.chance(0.5) ? 1 : 0} ${(cutX + cutR).toFixed(1)} ${cutY.toFixed(1)} Z" fill="${colours[3] ?? p.ink}" transform="rotate(${r.int(-180, 180)} ${cutX.toFixed(1)} ${cutY.toFixed(1)})"/>`;

  // Horizon rules.
  const lines = r.int(1, 3);
  for (let i = 0; i < lines; i += 1) {
    const y = h * r.float(0.2, 0.9);
    out += `<rect x="0" y="${y.toFixed(1)}" width="${w}" height="${(h * r.float(0.004, 0.012)).toFixed(1)}" fill="${p.ink}" opacity="0.7"/>`;
  }

  // Single punctuation dot.
  out += `<circle cx="${(w * r.float(0.14, 0.86)).toFixed(1)}" cy="${(h * r.float(0.12, 0.34)).toFixed(1)}" r="${(massR * r.float(0.12, 0.22)).toFixed(1)}" fill="${r.pick([p.ink, ...p.tints])}"/>`;
  return out;
}

/** Overlapping translucent ellipses. */
function chroma(r, w, h, p) {
  const count = r.int(4, 7);
  const colours = r.shuffle([p.ink, ...p.tints]);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let i = 0; i < count; i += 1) {
    const rx = w * r.float(0.22, 0.46);
    const ry = rx * r.float(0.7, 1.35);
    // Kept opaque enough that overlaps stay chromatic rather than turning grey.
    out += `<ellipse cx="${(w * r.float(0.15, 0.85)).toFixed(1)}" cy="${(h * r.float(0.15, 0.85)).toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="${colours[i % colours.length]}" opacity="${r.float(0.82, 1).toFixed(2)}" transform="rotate(${r.int(-40, 40)} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})"/>`;
  }
  return out;
}

/** Vertical slabs pierced by an arch. */
function monolith(r, w, h, p) {
  const slabs = r.int(3, 6);
  const colours = r.shuffle([p.ink, ...p.tints]);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  let x = 0;
  for (let i = 0; i < slabs; i += 1) {
    const sw = (w / slabs) * r.float(0.7, 1.3);
    const sh = h * r.float(0.45, 1);
    out += `<rect x="${x.toFixed(1)}" y="${(h - sh).toFixed(1)}" width="${sw.toFixed(1)}" height="${sh.toFixed(1)}" fill="${colours[i % colours.length]}" opacity="0.94"/>`;
    x += sw * r.float(0.75, 1.05);
  }
  const aw = w * r.float(0.3, 0.46);
  const ax = (w - aw) / 2 + w * r.float(-0.12, 0.12);
  const ay = h * r.float(0.2, 0.34);
  out += `<path d="M ${ax.toFixed(1)} ${h} L ${ax.toFixed(1)} ${(ay + aw / 2).toFixed(1)} A ${(aw / 2).toFixed(1)} ${(aw / 2).toFixed(1)} 0 0 1 ${(ax + aw).toFixed(1)} ${(ay + aw / 2).toFixed(1)} L ${(ax + aw).toFixed(1)} ${h} Z" fill="${p.ground}"/>`;
  out += `<path d="M ${ax.toFixed(1)} ${h} L ${ax.toFixed(1)} ${(ay + aw / 2).toFixed(1)} A ${(aw / 2).toFixed(1)} ${(aw / 2).toFixed(1)} 0 0 1 ${(ax + aw).toFixed(1)} ${(ay + aw / 2).toFixed(1)} L ${(ax + aw).toFixed(1)} ${h} Z" fill="none" stroke="${p.ink}" stroke-width="${(w * 0.012).toFixed(1)}"/>`;
  return out;
}

/** Diagonal stripe field with a rotated window. */
function prism(r, w, h, p) {
  const angle = r.pick([-45, -30, 30, 45, 60]);
  const gap = w * r.float(0.05, 0.1);
  const colours = r.shuffle([p.ink, ...p.tints]).slice(0, 2);
  const span = Math.hypot(w, h);
  let stripes = "";
  for (let i = -span; i < span * 2; i += gap * 2) {
    stripes += `<rect x="${i.toFixed(1)}" y="${(-span).toFixed(1)}" width="${gap.toFixed(1)}" height="${(span * 3).toFixed(1)}" fill="${colours[0]}"/>`;
  }
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  out += `<g transform="rotate(${angle} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})" opacity="0.92">${stripes}</g>`;
  const sw = Math.min(w, h) * r.float(0.42, 0.62);
  out += `<rect x="${((w - sw) / 2).toFixed(1)}" y="${((h - sw) / 2).toFixed(1)}" width="${sw.toFixed(1)}" height="${sw.toFixed(1)}" fill="${colours[1] ?? p.ink}" transform="rotate(${r.int(-25, 25)} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})"/>`;
  out += `<circle cx="${(w / 2).toFixed(1)}" cy="${(h / 2).toFixed(1)}" r="${(sw * 0.24).toFixed(1)}" fill="${p.ground}"/>`;
  return out;
}

/** Line lattice with a heavy counterweight block and a drawn circle. */
function lattice(r, w, h, p) {
  const step = w / r.int(7, 11);
  const line = Math.max(1.2, w * 0.0022);
  const colours = r.shuffle(p.tints);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;

  let grid = "";
  for (let x = step; x < w; x += step) {
    grid += `<line x1="${x.toFixed(1)}" y1="0" x2="${x.toFixed(1)}" y2="${h}" stroke="${p.ink}" stroke-width="${line}"/>`;
  }
  for (let y = step; y < h; y += step) {
    grid += `<line x1="0" y1="${y.toFixed(1)}" x2="${w}" y2="${y.toFixed(1)}" stroke="${p.ink}" stroke-width="${line}"/>`;
  }
  out += `<g opacity="0.38">${grid}</g>`;

  // Solid block snapped to the grid.
  const bw = step * r.int(3, 5);
  const bh = step * r.int(2, 4);
  const bx = step * r.int(1, Math.max(1, Math.floor(w / step) - 5));
  const by = step * r.int(1, Math.max(1, Math.floor(h / step) - 4));
  out += `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${colours[0]}"/>`;

  // Large drawn circle straddling the block.
  const cr = step * r.float(1.8, 3.2);
  const ccx = bx + bw * r.float(0.2, 1.1);
  const ccy = by + bh * r.float(0.1, 1.6);
  out += `<circle cx="${ccx.toFixed(1)}" cy="${ccy.toFixed(1)}" r="${cr.toFixed(1)}" fill="none" stroke="${p.ink}" stroke-width="${(step * 0.16).toFixed(1)}"/>`;
  out += `<path d="M ${(ccx - cr).toFixed(1)} ${ccy.toFixed(1)} A ${cr.toFixed(1)} ${cr.toFixed(1)} 0 0 1 ${(ccx + cr).toFixed(1)} ${ccy.toFixed(1)} Z" fill="${colours[1] ?? p.ink}"/>`;

  // Diagonal rule across the field.
  out += `<line x1="0" y1="${(h * r.float(0.1, 0.4)).toFixed(1)}" x2="${w}" y2="${(h * r.float(0.6, 0.95)).toFixed(1)}" stroke="${colours[2] ?? p.ink}" stroke-width="${(step * 0.12).toFixed(1)}"/>`;

  // Snapped dot cluster.
  for (let i = 0, n = r.int(4, 8); i < n; i += 1) {
    out += `<circle cx="${(Math.round(r.float(1, w / step - 1)) * step).toFixed(1)}" cy="${(Math.round(r.float(1, h / step - 1)) * step).toFixed(1)}" r="${(step * r.float(0.14, 0.3)).toFixed(1)}" fill="${p.ink}"/>`;
  }
  return out;
}

/** Nested rotating apertures. */
function aperture(r, w, h, p) {
  const cx = w / 2;
  const cy = h / 2;
  const layers = r.int(5, 9);
  const colours = r.shuffle([p.ink, ...p.tints]);
  const base = Math.min(w, h) * 0.94;
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let i = 0; i < layers; i += 1) {
    const size = base * (1 - i / (layers + 1));
    const rot = (i * r.float(12, 30)).toFixed(1);
    if (i % 2 === 0) {
      out += `<rect x="${(cx - size / 2).toFixed(1)}" y="${(cy - size / 2).toFixed(1)}" width="${size.toFixed(1)}" height="${size.toFixed(1)}" fill="${colours[i % colours.length]}" transform="rotate(${rot} ${cx.toFixed(1)} ${cy.toFixed(1)})" opacity="0.95"/>`;
    } else {
      out += `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(size / 2).toFixed(1)}" fill="${colours[i % colours.length]}" opacity="0.95"/>`;
    }
  }
  return out;
}

/** Halftone dot gradient under a hard-edged shape. */
function halftone(r, w, h, p) {
  const colours = r.shuffle([p.ink, ...p.tints]);
  const cols = r.int(14, 22);
  const step = w / cols;
  const rows = Math.ceil(h / step);
  // Dot radius ramps along a random axis, mimicking a screened print gradient.
  const axis = r.pick(["x", "y", "d"]);
  const flip = r.chance(0.5);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  let dots = "";
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const u = x / (cols - 1);
      const v = y / (rows - 1);
      let t = axis === "x" ? u : axis === "y" ? v : (u + v) / 2;
      if (flip) t = 1 - t;
      const rad = step * 0.52 * Math.max(0, Math.min(1, t));
      if (rad < step * 0.03) continue;
      dots += `<circle cx="${(x * step + step / 2).toFixed(1)}" cy="${(y * step + step / 2).toFixed(1)}" r="${rad.toFixed(1)}" />`;
    }
  }
  out += `<g fill="${colours[0]}">${dots}</g>`;

  // Hard shape sitting over the screen.
  if (r.chance(0.5)) {
    const cr = Math.min(w, h) * r.float(0.2, 0.32);
    out += `<circle cx="${(w * r.float(0.3, 0.7)).toFixed(1)}" cy="${(h * r.float(0.3, 0.7)).toFixed(1)}" r="${cr.toFixed(1)}" fill="${colours[1] ?? p.ink}"/>`;
  } else {
    const bw = w * r.float(0.32, 0.56);
    const bh = h * r.float(0.16, 0.3);
    out += `<rect x="${(w * r.float(0.1, 0.45)).toFixed(1)}" y="${(h * r.float(0.25, 0.6)).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" fill="${colours[1] ?? p.ink}" transform="rotate(${r.int(-12, 12)} ${(w / 2).toFixed(1)} ${(h / 2).toFixed(1)})"/>`;
  }
  return out;
}

/** Interlocking ribbon bands. */
function ribbon(r, w, h, p) {
  const colours = r.shuffle([p.ink, ...p.tints]);
  const count = r.int(3, 5);
  let out = `<rect width="${w}" height="${h}" fill="${p.ground}"/>`;
  for (let i = 0; i < count; i += 1) {
    const y = h * ((i + 0.6) / (count + 0.6));
    const thickness = h * r.float(0.08, 0.17);
    const d = `M ${-w * 0.1} ${y.toFixed(1)} C ${(w * 0.25).toFixed(1)} ${(y - h * r.float(0.1, 0.3)).toFixed(1)}, ${(w * 0.72).toFixed(1)} ${(y + h * r.float(0.1, 0.3)).toFixed(1)}, ${(w * 1.1).toFixed(1)} ${y.toFixed(1)}`;
    out += `<path d="${d}" fill="none" stroke="${colours[i % colours.length]}" stroke-width="${thickness.toFixed(1)}" stroke-linecap="round"/>`;
  }
  return out;
}

const STYLES = [truchet, strata, orbit, figure, chroma, monolith, prism, lattice, aperture, halftone, ribbon];
const PORTRAIT_STYLES = [figure, monolith, strata, aperture, truchet, ribbon, halftone];

/* ------------------------------------------------------------------ */
/* Renderer                                                             */
/* ------------------------------------------------------------------ */

function buildSvg({ seed, width, height, palette, style }) {
  const rng = mulberry32(seed);
  const r = makeRandom(rng);
  const p = PALETTES[palette];
  const draw = style ?? r.pick(STYLES);
  const body = draw(r, width, height, p);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>${VIGNETTE_GRADIENT}${GRAIN_FILTER}</defs>
  ${body}
  <rect width="${width}" height="${height}" fill="url(#vig)"/>
  <rect width="${width}" height="${height}" filter="url(#grain)" opacity="0.5"/>
</svg>`;
}

async function render(file, svg, { quality = 82 } = {}) {
  await mkdir(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(svg), { density: 96 })
    .webp({ quality, effort: 5 })
    .toFile(file);
}

/* ------------------------------------------------------------------ */
/* Manifest                                                             */
/* ------------------------------------------------------------------ */

const RATIOS = {
  portrait: [1000, 1333],
  tall: [1000, 1500],
  square: [1200, 1200],
  landscape: [1600, 1000],
  wide: [1800, 900],
  avatar: [320, 320],
};

/** Deterministic style + palette assignment keyed off the file name. */
function planFor(name, ratio, forcedStyle) {
  const seed = hashString(name);
  const r = makeRandom(mulberry32(seed));
  const palette = r.pick(PALETTE_KEYS);
  const pool = ratio === "portrait" || ratio === "tall" ? PORTRAIT_STYLES : STYLES;
  return { seed, palette, style: forcedStyle ?? r.pick(pool) };
}

async function main() {
  const jobs = [];

  const push = (dir, name, ratio, forcedStyle) => {
    const [width, height] = RATIOS[ratio];
    const { seed, palette, style } = planFor(`${dir}/${name}`, ratio, forcedStyle);
    jobs.push({
      file: path.join(ROOT, dir, `${name}.webp`),
      svg: buildSvg({ seed, width, height, palette, style }),
      quality: ratio === "avatar" ? 88 : 82,
    });
  };

  // Artworks — the main library used by hero, stack, collage and marquees.
  const artworkRatios = ["portrait", "square", "tall", "portrait", "square", "landscape"];
  for (let i = 1; i <= 30; i += 1) {
    push("artworks", `artwork-${String(i).padStart(2, "0")}`, artworkRatios[i % artworkRatios.length]);
  }

  // Artists — cover portraits plus small avatars.
  for (let i = 1; i <= 6; i += 1) {
    const n = String(i).padStart(2, "0");
    push("artists", `artist-${n}`, "tall", figure);
    push("artists", `avatar-${n}`, "avatar", figure);
  }

  // Editorial — journal and article imagery.
  for (let i = 1; i <= 8; i += 1) {
    push("editorial", `editorial-${String(i).padStart(2, "0")}`, i % 3 === 0 ? "portrait" : "landscape");
  }

  // Collections — curated set covers.
  for (let i = 1; i <= 6; i += 1) {
    push("collections", `collection-${String(i).padStart(2, "0")}`, i % 2 === 0 ? "square" : "landscape");
  }

  // Social preview card.
  push("", "og-cover", "wide", chroma);

  let done = 0;
  for (const job of jobs) {
    await render(job.file, job.svg, { quality: job.quality });
    done += 1;
    if (done % 10 === 0) process.stdout.write(`  ${done}/${jobs.length}\n`);
  }

  // Monochrome favicon / logo mark reused by the app shell.
  const mark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <rect width="64" height="64" rx="16" fill="${INK}"/>
  <path d="M14 46V18h7l11 17 11-17h7v28h-7V31L32 46 21 31v15z" fill="${PAPER}"/>
</svg>`;
  await writeFile(path.join(process.cwd(), "public", "mark.svg"), mark, "utf8");

  console.log(`Generated ${jobs.length} images into public/images`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
