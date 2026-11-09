// Images for "How to Pack Envelopes and Boxes for a Same-Day Courier".
// Run from the repo root: node scripts/blog-images/articles/how-to-pack-for-same-day-courier-las-vegas.js
const { C, text, iconAt, save } = require('../lib');

async function main() {
  // Cover: open box with padding, tape roll, envelope and a Falcon label
  {
    const W = 1600, H = 900;
    let b = `<rect width="${W}" height="${H}" fill="${C.navy}"/>`;
    b += `<path d="M0 650 L${W} 570 L${W} ${H} L0 ${H} Z" fill="${C.navy2}"/>`;
    b += `<g fill="${C.red}"><path d="M110 250h150l-8 20H102z"/><path d="M140 312h120l-8 20H132z"/><path d="M170 374h90l-8 20H162z"/></g>`;
    // open box
    const bx = 420, by = 360, bw = 520, bh = 330;
    b += `<path d="M${bx} ${by} L${bx - 70} ${by - 110} L${bx + 180} ${by - 130} L${bx + 230} ${by} Z" fill="${C.kraftDark}"/>`; // left flap
    b += `<path d="M${bx + bw} ${by} L${bx + bw + 70} ${by - 110} L${bx + bw - 180} ${by - 130} L${bx + bw - 230} ${by} Z" fill="${C.kraftDark}"/>`; // right flap
    // padding (air pillows) peeking out
    for (const [x, y, r] of [[bx + 120, by - 10, 46], [bx + 210, by - 30, 52], [bx + 310, by - 18, 48], [bx + 400, by - 6, 44]])
      b += `<circle cx="${x}" cy="${y}" r="${r}" fill="#E9F0F7" stroke="#C9D6E3" stroke-width="4"/>`;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="8" fill="${C.kraft}"/>`;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="40" fill="${C.kraftDark}" opacity="0.6"/>`;
    // label on the box
    b += `<rect x="${bx + 50}" y="${by + 110}" width="250" height="150" rx="8" fill="#fff"/>`;
    b += iconAt(bx + 62, by + 124, 74);
    b += `<rect x="${bx + 150}" y="${by + 140}" width="120" height="14" rx="7" fill="${C.line}"/>`;
    b += `<rect x="${bx + 150}" y="${by + 168}" width="90" height="14" rx="7" fill="${C.line}"/>`;
    b += `<rect x="${bx + 70}" y="${by + 214}" width="200" height="14" rx="7" fill="${C.line}"/>`;
    // "this side up" arrows
    b += `<g fill="${C.navy}" opacity="0.55"><path d="M${bx + 380} ${by + 150} l22 -34 l22 34 h-12 v40 h-20 v-40z"/><path d="M${bx + 430} ${by + 150} l22 -34 l22 34 h-12 v40 h-20 v-40z"/></g>`;
    // envelope
    const ex = 1010, ey = 390, ew = 400, eh = 270;
    b += `<g transform="rotate(-6 ${ex + ew / 2} ${ey + eh / 2})"><rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" rx="12" fill="#fff"/>`;
    b += `<path d="M${ex} ${ey + 12} L${ex + ew / 2} ${ey + 150} L${ex + ew} ${ey + 12}" fill="none" stroke="${C.line}" stroke-width="8"/>`;
    b += `<circle cx="${ex + ew / 2}" cy="${ey + 150}" r="36" fill="${C.red}"/></g>`;
    // tape roll
    const tx = 1180, ty = 250;
    b += `<circle cx="${tx}" cy="${ty}" r="92" fill="${C.kraftLight}" stroke="${C.kraftDark}" stroke-width="10"/><circle cx="${tx}" cy="${ty}" r="44" fill="${C.navy}"/>`;
    b += `<path d="M${tx + 80} ${ty + 46} L${tx + 190} ${ty + 120} L${tx + 170} ${ty + 150} L${tx + 62} ${ty + 76} Z" fill="${C.kraftLight}" opacity="0.9"/>`;
    await save('blog-packing-guide', b, W, H);
  }

  // Body image: what goes on the label
  {
    const W = 1600, H = 760;
    let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
    b += `<path fill="${C.navy}" d="${text('cond700', 'What to put on the label', 100, 118, 64).d}"/>`;
    // box corner behind the label
    b += `<rect x="100" y="180" width="760" height="520" rx="12" fill="${C.kraft}"/><rect x="100" y="180" width="760" height="60" fill="${C.kraftDark}" opacity="0.6"/>`;
    b += `<rect x="440" y="180" width="70" height="520" fill="${C.kraftLight}" opacity="0.8"/>`;
    // label
    const lx = 170, ly = 290, lw = 620, lh = 360;
    b += `<rect x="${lx}" y="${ly}" width="${lw}" height="${lh}" rx="12" fill="#fff"/>`;
    b += iconAt(lx + 30, ly + 26, 80);
    b += `<path fill="${C.navy}" d="${text('cond800', 'DELIVER TO', lx + 130, ly + 80, 40, { tracking: 0.06 }).d}"/>`;
    const rows = [[ly + 150, 380], [ly + 200, 300], [ly + 250, 240], [ly + 300, 330]];
    rows.forEach(([y, w], i) => {
      b += `<circle cx="${lx + 50}" cy="${y - 7}" r="20" fill="${C.red}"/>`;
      b += `<path fill="#fff" d="${text('cond800', String(i + 1), lx + 50, y + 4, 28, { align: 'middle' }).d}"/>`;
      b += `<rect x="${lx + 90}" y="${y - 16}" width="${w}" height="18" rx="9" fill="${C.line}"/>`;
    });
    // legend
    const items = [
      ['Recipient business', 'Who it is going to'],
      ['Contact name and phone', 'The person receiving it'],
      ['Suite or floor', 'Where to bring it inside'],
      ['Your reference', 'Invoice, PO or file number'],
    ];
    items.forEach(([t, s], i) => {
      const y = 290 + i * 110;
      b += `<circle cx="960" cy="${y + 10}" r="26" fill="${C.red}"/>`;
      b += `<path fill="#fff" d="${text('cond800', String(i + 1), 960, y + 22, 34, { align: 'middle' }).d}"/>`;
      b += `<path fill="${C.navy}" d="${text('cond700', t, 1010, y + 22, 44).d}"/>`;
      b += `<path fill="${C.slate}" d="${text('barlow500', s, 1010, y + 62, 28).d}"/>`;
    });
    await save('blog-packing-label', b, W, H);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
