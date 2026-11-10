// Images for "Holiday Courier Delivery in Las Vegas: Plan Your Year-End Runs".
// Run from the repo root: node scripts/blog-images/articles/holiday-courier-delivery-las-vegas.js
const { C, text, measure, iconAt, speedLines, save } = require('../lib');

async function main() {
  // Cover: wall calendar with one day circled in red, a labeled box beside it
  {
    const W = 1600, H = 900;
    let b = `<rect width="${W}" height="${H}" fill="${C.navy}"/>`;
    b += `<path d="M0 680 L${W} 590 L${W} ${H} L0 ${H} Z" fill="${C.navy2}"/>`;
    b += speedLines(120, 300, 1.1);
    // calendar
    const cx = 360, cy = 150, cw = 600, ch = 600;
    b += `<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="24" fill="#fff"/>`;
    b += `<path d="M${cx} ${cy + 24} q0 -24 24 -24 h${cw - 48} q24 0 24 24 v116 h-${cw} z" fill="${C.red}"/>`;
    // rings
    for (const x of [cx + 150, cx + cw - 150]) {
      b += `<rect x="${x - 16}" y="${cy - 44}" width="32" height="96" rx="16" fill="${C.navy3}"/>`;
      b += `<circle cx="${x}" cy="${cy + 70}" r="14" fill="${C.navy}" opacity="0.35"/>`;
    }
    // day grid: 5 columns x 4 rows of rounded squares
    const gx = cx + 50, gy = cy + 180, cell = 76, gap = 26;
    const mark = [3, 2];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        const x = gx + c * (cell + gap), y = gy + r * (cell + gap);
        const past = r === 0 || (r === 1 && c < 3);
        b += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="12" fill="${past ? C.line : C.sand}"/>`;
        if (c === mark[0] && r === mark[1]) {
          b += `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="12" fill="${C.navy}"/>`;
          b += `<circle cx="${x + cell / 2}" cy="${y + cell / 2}" r="${cell / 2 + 16}" fill="none" stroke="${C.red}" stroke-width="10"/>`;
        }
      }
    }
    // box with Falcon label
    const bx = 1040, by = 430, bw = 420, bh = 300;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="10" fill="${C.kraft}"/>`;
    b += `<rect x="${bx}" y="${by}" width="${bw}" height="48" fill="${C.kraftDark}" opacity="0.6"/>`;
    b += `<rect x="${bx + bw / 2 - 32}" y="${by}" width="64" height="${bh}" fill="${C.kraftLight}" opacity="0.85"/>`;
    b += `<rect x="${bx + 40}" y="${by + 110}" width="230" height="140" rx="8" fill="#fff"/>`;
    b += iconAt(bx + 52, by + 124, 70);
    b += `<rect x="${bx + 136}" y="${by + 140}" width="110" height="14" rx="7" fill="${C.line}"/>`;
    b += `<rect x="${bx + 136}" y="${by + 168}" width="80" height="14" rx="7" fill="${C.line}"/>`;
    b += `<rect x="${bx + 60}" y="${by + 210}" width="190" height="14" rx="7" fill="${C.line}"/>`;
    await save('blog-holiday-deliveries', b, W, H);
  }

  // Body image: which option fits
  {
    const W = 1600, H = 760;
    let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
    b += `<path fill="${C.navy}" d="${text('cond700', 'Which option fits your delivery', 100, 118, 64).d}"/>`;
    const cards = [
      { label: 'Same Day', lines: ['Order by 2 PM', 'Delivered by the end', 'of the business day'], price: 'From $39', color: C.navy },
      { label: 'Rush / Urgent', lines: ['Picked up and', 'delivered within', '60 to 90 minutes'], price: 'From $49', color: C.red },
      { label: 'By quote', lines: ['Holidays, weekends', 'and after hours', 'Price confirmed by email'], price: 'Request a quote', color: C.slate },
    ];
    const cw = 440, gap = 40, y = 190, ch = 490;
    cards.forEach((c, i) => {
      const x = 100 + i * (cw + gap);
      b += `<rect x="${x}" y="${y}" width="${cw}" height="${ch}" rx="16" fill="#fff"/>`;
      b += `<rect x="${x}" y="${y}" width="${cw}" height="16" rx="8" fill="${c.color}"/>`;
      b += `<path fill="${C.navy}" d="${text('cond800', c.label, x + 40, y + 100, 56).d}"/>`;
      c.lines.forEach((l, j) => {
        const w = measure('barlow500', l, 30);
        if (w > cw - 80) throw new Error(`Line too wide: ${l} (${w})`);
        b += `<path fill="${C.slate}" d="${text('barlow500', l, x + 40, y + 170 + j * 46, 30).d}"/>`;
      });
      b += `<line x1="${x + 40}" y1="${y + 340}" x2="${x + cw - 40}" y2="${y + 340}" stroke="${C.line}" stroke-width="4" stroke-linecap="round"/>`;
      b += `<path fill="${c.color}" d="${text('cond800', c.price, x + 40, y + 420, 50).d}"/>`;
    });
    await save('blog-holiday-deliveries-options', b, W, H);
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
