// Images for "Rush vs. Same-Day Delivery in Las Vegas: How to Choose".
// Run from the repo root: node scripts/blog-images/articles/rush-vs-same-day-delivery-las-vegas.js
const { C, text, van, save } = require('../lib');

async function main() {
  // Cover: clock with the rush window in red, van speeding below
  {
    const W = 1600, H = 900;
    let b = `<rect width="${W}" height="${H}" fill="${C.navy}"/>`;
    b += `<path d="M0 690 L${W} 600 L${W} ${H} L0 ${H} Z" fill="${C.navy2}"/>`;
    b += `<path d="M0 760 L${W} 670" stroke="${C.sand}" stroke-width="6" stroke-dasharray="60 46" opacity="0.5"/>`;
    const cx = 1180, cy = 300, r = 200;
    b += `<circle cx="${cx}" cy="${cy}" r="${r + 26}" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="${C.sand}"/>`;
    b += `<path d="M${cx} ${cy} L${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx + r} ${cy} Z" fill="${C.red}" opacity="0.9"/>`;
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      const x1 = cx + Math.sin(a) * (r - 18), y1 = cy - Math.cos(a) * (r - 18), x2 = cx + Math.sin(a) * (r - 46), y2 = cy - Math.cos(a) * (r - 46);
      b += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${C.navy}" stroke-width="${i % 3 ? 6 : 12}" stroke-linecap="round"/>`;
    }
    b += `<line x1="${cx}" y1="${cy}" x2="${cx + 120}" y2="${cy - 70}" stroke="${C.navy}" stroke-width="16" stroke-linecap="round"/>`;
    b += `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - 150}" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>`;
    b += `<circle cx="${cx}" cy="${cy}" r="18" fill="${C.navy}"/>`;
    b += `<rect x="${cx - 34}" y="${cy - r - 72}" width="68" height="40" rx="8" fill="#fff"/>`;
    b += van(120, 430, 1.55);
    await save('blog-rush-vs-same-day', b, W, H);
  }

  // Body image: the two delivery windows
  {
    const W = 1600, H = 760;
    let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
    b += `<path fill="${C.navy}" d="${text('cond700', 'Two ways to send it across town', 100, 120, 64).d}"/>`;
    const lane = (y, label, sub, x0, x1, color) => {
      let s = `<rect x="100" y="${y}" width="1400" height="150" rx="16" fill="#fff"/>`;
      s += `<path fill="${C.navy}" d="${text('cond800', label, 140, y + 62, 46).d}"/>`;
      s += `<path fill="${C.slate}" d="${text('barlow500', sub, 140, y + 108, 28).d}"/>`;
      s += `<line x1="${x0}" y1="${y + 75}" x2="${x1}" y2="${y + 75}" stroke="${color}" stroke-width="22" stroke-linecap="round"/>`;
      s += `<circle cx="${x0}" cy="${y + 75}" r="22" fill="#fff" stroke="${color}" stroke-width="10"/>`;
      s += `<circle cx="${x1}" cy="${y + 75}" r="30" fill="${color}"/><path d="M${x1 - 13} ${y + 75} l9 10 l17 -20" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
      return s;
    };
    b += lane(200, 'Rush / Urgent', 'Picked up and delivered in 60 to 90 minutes', 960, 1170, C.red);
    b += lane(420, 'Same Day', 'Order by 2 PM, delivered by the end of the business day', 960, 1430, C.navy);
    b += `<path fill="${C.slate}" d="${text('barlow500', 'Pickup', 960, 650, 26, { align: 'middle' }).d}"/>`;
    b += `<path fill="${C.slate}" d="${text('barlow500', 'Delivered', 1170, 650, 26, { align: 'middle' }).d}"/>`;
    b += `<path fill="${C.slate}" d="${text('barlow500', 'End of day', 1430, 650, 26, { align: 'middle' }).d}"/>`;
    await save('blog-delivery-windows', b, W, H);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
