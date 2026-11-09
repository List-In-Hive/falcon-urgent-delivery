// Images for "Auto Parts Delivery in Las Vegas: Keep Your Bays Moving".
// Run from the repo root: node scripts/blog-images/articles/auto-parts-delivery-las-vegas.js
const { C, text, iconAt, save } = require('../lib');

async function main() {
  // Cover: brake rotor with a red caliper, labeled parts box, wrench
  {
    const W = 1600, H = 900;
    let b = `<rect width="${W}" height="${H}" fill="${C.navy}"/>`;
    b += `<path d="M0 640 L${W} 560 L${W} ${H} L0 ${H} Z" fill="${C.navy2}"/>`;
    const rx = 520, ry = 420;
    b += `<circle cx="${rx}" cy="${ry}" r="270" fill="#C9CED6"/><circle cx="${rx}" cy="${ry}" r="250" fill="${C.steel}"/>`;
    for (let i = 0; i < 24; i++) {
      const a = (i * Math.PI * 2) / 24;
      b += `<circle cx="${(rx + Math.cos(a) * 200).toFixed(1)}" cy="${(ry + Math.sin(a) * 200).toFixed(1)}" r="9" fill="#AEB5BF"/>`;
    }
    b += `<circle cx="${rx}" cy="${ry}" r="135" fill="#AEB5BF"/><circle cx="${rx}" cy="${ry}" r="112" fill="#C9CED6"/>`;
    for (let i = 0; i < 5; i++) {
      const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
      b += `<circle cx="${(rx + Math.cos(a) * 70).toFixed(1)}" cy="${(ry + Math.sin(a) * 70).toFixed(1)}" r="16" fill="${C.navy}"/>`;
    }
    b += `<circle cx="${rx}" cy="${ry}" r="34" fill="${C.navy}"/>`;
    b += `<path d="M${rx + 150} ${ry - 190} q120 40 130 190 l-70 0 q-10 -100 -90 -130 z" fill="${C.red}"/>`;
    const bx = 900, by = 380, bw = 420, bh = 300;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="${C.kraft}"/><rect x="${bx}" y="${by}" width="${bw}" height="70" fill="${C.kraftDark}"/>`;
    b += `<rect x="${bx + bw / 2 - 30}" y="${by}" width="60" height="${bh}" fill="${C.kraftLight}" opacity="0.8"/>`;
    b += `<rect x="${bx + 40}" y="${by + 170}" width="150" height="80" rx="6" fill="#fff"/>`;
    b += iconAt(bx + 48, by + 176, 68);
    b += `<g transform="rotate(-30 1250 300)"><rect x="1080" y="282" width="300" height="36" rx="18" fill="${C.steel}"/><circle cx="1395" cy="300" r="48" fill="${C.steel}"/><path d="M1395 270 l30 0 l0 60 l-30 0 z" fill="${C.navy}"/></g>`;
    b += `<g fill="${C.red}"><path d="M120 300h120l-8 20H112z"/><path d="M140 360h100l-8 20H132z"/><path d="M160 420h80l-8 20H152z"/></g>`;
    await save('blog-auto-parts', b, W, H);
  }

  // Body image: what fits in each size class, with starting prices
  {
    const W = 1600, H = 760, base = 560;
    let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
    b += `<rect x="80" y="${base}" width="1440" height="6" rx="3" fill="${C.line}"/>`;
    b += `<rect x="170" y="${base - 170}" width="260" height="170" rx="10" fill="#fff" stroke="${C.navy}" stroke-width="6"/><path d="M170 ${base - 164} L300 ${base - 80} L430 ${base - 164}" fill="none" stroke="${C.navy}" stroke-width="6"/>`;
    b += `<rect x="620" y="${base - 260}" width="320" height="260" rx="8" fill="${C.kraft}"/><rect x="620" y="${base - 260}" width="320" height="56" fill="${C.kraftDark}"/><rect x="755" y="${base - 260}" width="50" height="260" fill="${C.kraftLight}" opacity="0.8"/>`;
    b += `<rect x="1110" y="${base - 380}" width="380" height="380" rx="8" fill="${C.kraft}"/><rect x="1110" y="${base - 380}" width="380" height="70" fill="${C.kraftDark}"/><rect x="1270" y="${base - 380}" width="60" height="380" fill="${C.kraftLight}" opacity="0.8"/>`;
    const label = (cx, t1, t2) =>
      `<path fill="${C.navy}" d="${text('cond800', t1, cx, base + 80, 52, { align: 'middle' }).d}"/><path fill="${C.slate}" d="${text('barlow500', t2, cx, base + 130, 32, { align: 'middle' }).d}"/>`;
    b += label(300, 'Envelope', 'Any size, from $39');
    b += label(780, 'Medium box', 'Up to 25 lb, from $49');
    b += label(1300, 'Big box', '25 to 50 lb, from $59');
    await save('blog-package-sizes', b, W, H);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
