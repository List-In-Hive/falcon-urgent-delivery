// Images for "Same-Day Legal Document Delivery in Las Vegas: A Checklist".
// Run from the repo root: node scripts/blog-images/articles/legal-document-delivery-las-vegas.js
const { C, save } = require('../lib');

async function main() {
  // Cover: signed papers, sealed envelope, red pen
  const W = 1600, H = 900;
  let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
  b += `<path d="M0 0 H${W} V180 L0 300 Z" fill="${C.navy}"/>`;
  const paper = (x, y, rot, lines) => {
    let s = `<g transform="rotate(${rot} ${x + 230} ${y + 300})"><rect x="${x}" y="${y}" width="460" height="600" rx="10" fill="#fff" stroke="#E3DDD2" stroke-width="3"/>`;
    for (let i = 0; i < lines; i++) s += `<rect x="${x + 50}" y="${y + 80 + i * 44}" width="${i % 4 === 3 ? 220 : 360}" height="14" rx="7" fill="${C.line}"/>`;
    return s + '</g>';
  };
  b += paper(330, 200, -8, 9) + paper(380, 170, 3, 9);
  b += `<path d="M450 690 c40 -40 70 30 110 -10 s60 -30 90 10 s40 10 70 -20" stroke="${C.navy}" stroke-width="7" fill="none" stroke-linecap="round" transform="rotate(3 600 680)"/>`;
  const ex = 830, ey = 330, ew = 560, eh = 380;
  b += `<rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" rx="16" fill="${C.navy}"/>`;
  b += `<path d="M${ex} ${ey + 16} L${ex + ew / 2} ${ey + 210} L${ex + ew} ${ey + 16}" fill="none" stroke="${C.navy3}" stroke-width="10"/>`;
  b += `<circle cx="${ex + ew / 2}" cy="${ey + 210}" r="56" fill="${C.red}"/><circle cx="${ex + ew / 2}" cy="${ey + 210}" r="38" fill="none" stroke="#fff" stroke-width="5" opacity="0.7"/>`;
  b += `<g transform="rotate(-35 1180 780)"><rect x="980" y="765" width="380" height="30" rx="15" fill="${C.red}"/><path d="M1360 765 l50 15 l-50 15z" fill="${C.navy}"/><rect x="980" y="765" width="70" height="30" rx="15" fill="${C.navy}"/></g>`;
  await save('blog-legal-documents', b, W, H);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
