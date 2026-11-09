// Helpers for Falcon blog illustrations: outlined Barlow text, brand icon, van, palette,
// and save(), which writes public/images/NAME.webp plus a PNG preview in scripts/blog-images/out/.
// Usage and style rules: BLOG_AUTOMATION.md, section "Images".
const fs = require('fs');
const { execFileSync } = require('child_process');
const path = require('path');
const opentype = require('opentype.js');
const { Resvg } = require('@resvg/resvg-js');
const sharp = require('sharp');

const ROOT = path.join(__dirname, '..', '..');
const IMAGES = path.join(ROOT, 'public', 'images');
const PREVIEW = path.join(__dirname, 'out');
const FONTS = path.join(__dirname, 'node_modules', '@fontsource');

// Brand palette (same values as the website).
const C = {
  navy: '#0D1B2A',
  navy2: '#16283C', // angled base panels on navy covers
  navy3: '#22374E', // envelope flaps, phone frames on navy
  red: '#D22B24',
  sand: '#F4EFE6',
  white: '#FFFFFF',
  slate: '#5B6B7C',
  line: '#D7D0C3', // text placeholder bars on paper and labels
  kraft: '#C9A26B', // cardboard
  kraftDark: '#B48C55',
  kraftLight: '#E8D3A8', // packing tape
  steel: '#DDE1E6',
  green: '#1F9D55',
};

const FONT_FILES = {
  cond800: 'barlow-condensed/files/barlow-condensed-latin-800-normal.woff',
  cond700: 'barlow-condensed/files/barlow-condensed-latin-700-normal.woff',
  cond600: 'barlow-condensed/files/barlow-condensed-latin-600-normal.woff',
  barlow500: 'barlow/files/barlow-latin-500-normal.woff',
  barlow600: 'barlow/files/barlow-latin-600-normal.woff',
  barlow700: 'barlow/files/barlow-latin-700-normal.woff',
};
const fontCache = {};
function font(key) {
  if (!FONT_FILES[key]) throw new Error(`Unknown font "${key}". Use one of: ${Object.keys(FONT_FILES).join(', ')}`);
  if (!fontCache[key]) {
    const buf = fs.readFileSync(path.join(FONTS, FONT_FILES[key]));
    fontCache[key] = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return fontCache[key];
}

/** Text width in px. tracking is in em (0.1 = 10% of the size between letters). */
function measure(fontKey, str, size, tracking = 0) {
  const f = font(fontKey);
  const glyphs = f.stringToGlyphs(str);
  let w = 0;
  glyphs.forEach((g, i) => {
    w += (g.advanceWidth / f.unitsPerEm) * size;
    if (i < glyphs.length - 1) w += (f.getKerningValue(g, glyphs[i + 1]) / f.unitsPerEm) * size + tracking * size;
  });
  return w;
}

/**
 * Text as an outlined path, so the image never depends on installed fonts.
 * y is the baseline. align: 'start' | 'middle' | 'end'. Returns { d, width }.
 * Use it as: `<path fill="${C.navy}" d="${text('cond800', 'Hello', 100, 200, 64).d}"/>`
 */
function text(fontKey, str, x, y, size, { tracking = 0, align = 'start' } = {}) {
  const f = font(fontKey);
  const width = measure(fontKey, str, size, tracking);
  let cx = align === 'middle' ? x - width / 2 : align === 'end' ? x - width : x;
  let d = '';
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    d += g.getPath(cx, y, size).toPathData(2);
    cx += (g.advanceWidth / f.unitsPerEm) * size;
    if (i < glyphs.length - 1) cx += (f.getKerningValue(g, glyphs[i + 1]) / f.unitsPerEm) * size + tracking * size;
  });
  return { d, width };
}

const stripSvg = (s) => s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>[\s\S]*?<\/title>/, '');
const ICON = stripSvg(fs.readFileSync(path.join(ROOT, 'public/brand/falcon-icon.svg'), 'utf8'));
const ICON_REVERSED = stripSvg(fs.readFileSync(path.join(ROOT, 'public/brand/falcon-icon-reversed.svg'), 'utf8'));

/** Falcon head icon (navy, for light backgrounds), size px square, top-left at x, y. */
const iconAt = (x, y, size) => `<g transform="translate(${x} ${y}) scale(${size / 512})">${ICON}</g>`;
/** White Falcon head icon for navy backgrounds. */
const iconRevAt = (x, y, size) => `<g transform="translate(${x} ${y}) scale(${size / 512})">${ICON_REVERSED}</g>`;

/** Three red speed lines (the logo's motion mark), top-left at x, y; s scales them. */
const speedLines = (x, y, s = 1) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${C.red}"><path d="M0 0h150l-8 20H-8z"/><path d="M30 62h120l-8 20H22z"/><path d="M60 124h90l-8 20H52z"/></g>`;

/** Falcon cargo van (same drawing as the website), 460 x 220 at s = 1, top-left at x, y. */
const van = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <g fill="${C.red}"><path d="M0 96h58l-4 9H-4z"/><path d="M10 122h44l-4 9H6z"/><path d="M22 148h30l-4 9H18z"/></g>
  <ellipse cx="248" cy="196" rx="182" ry="9" fill="#000" opacity="0.22"/>
  <path d="M70 182V54q0-14 14-14h218q12 0 20 9l52 58 40 10q22 6 22 26v39z" fill="#fff" stroke="${C.navy}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M70 166h366v16H70z" fill="${C.navy}"/>
  <path d="M72 138h300l6 10H72z" fill="${C.red}"/>
  <path d="M282 56h18q8 0 13 6l45 50h-76z" fill="${C.navy2}"/>
  <path d="M276 46v120M252 46v120" stroke="${C.navy}" stroke-width="2.5" opacity="0.35"/>
  <path d="M262 122h8M232 122h12" stroke="${C.navy}" stroke-width="4" stroke-linecap="round"/>
  <path d="M352 96h10v14h-10z" fill="${C.navy}"/>
  <path d="M418 122l14 2v12l-18-2z" fill="${C.sand}" stroke="${C.navy}" stroke-width="2"/>
  <path d="M72 70h8v34h-8z" fill="${C.red}"/>
  ${iconAt(84, 62, 60)}
  <path fill="${C.navy}" d="${text('cond800', 'FALCON', 148, 104, 32).d}"/>
  <circle cx="134" cy="182" r="27" fill="${C.navy}"/><circle cx="134" cy="182" r="11" fill="#E9E2D5"/>
  <circle cx="370" cy="182" r="27" fill="${C.navy}"/><circle cx="370" cy="182" r="11" fill="#E9E2D5"/>
</g>`;

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><title>${title}</title>${body}</svg>`;
}

function isCommitted(file) {
  try {
    return execFileSync('git', ['ls-files', '--', file], { cwd: ROOT, encoding: 'utf8' }).trim() !== '';
  } catch {
    return true; // can't tell: treat as taken
  }
}

const NAME_RE = /^blog-[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Render an illustration and save it as public/images/NAME.webp (quality 82),
 * plus scripts/blog-images/out/NAME.png to look at.
 * Covers are 1600 x 900. Body images are 1600 x 760.
 * Refuses to overwrite an image that is already committed (another article's) unless the
 * script is run with --force. Images made in this run (not committed yet) can be re-saved.
 */
async function save(name, body, w, h) {
  if (!NAME_RE.test(name)) throw new Error(`Image name "${name}" must start with "blog-" and use lowercase words joined by hyphens.`);
  if (!(w === 1600 && (h === 900 || h === 760))) throw new Error(`${name}: size must be 1600 x 900 (cover) or 1600 x 760 (body image).`);
  const webp = path.join(IMAGES, `${name}.webp`);
  if (fs.existsSync(webp) && isCommitted(webp) && !process.argv.includes('--force')) {
    throw new Error(`public/images/${name}.webp already belongs to another article. Pick a new name.`);
  }
  const pngBuf = new Resvg(svg(w, h, body, name), { fitTo: { mode: 'width', value: w } }).render().asPng();
  fs.mkdirSync(PREVIEW, { recursive: true });
  fs.writeFileSync(path.join(PREVIEW, `${name}.png`), pngBuf);
  await sharp(pngBuf).webp({ quality: 82 }).toFile(webp);
  console.log(`saved public/images/${name}.webp (${w} x ${h}), preview scripts/blog-images/out/${name}.png`);
}

module.exports = { C, text, measure, iconAt, iconRevAt, speedLines, van, save };
