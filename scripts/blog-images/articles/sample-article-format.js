// Cover for the draft sample article (format reference only, never published).
// Run from the repo root: node scripts/blog-images/articles/sample-article-format.js
const { C, text, iconAt, save } = require('../lib');

async function main() {
  const W = 1600, H = 900;
  let b = `<rect width="${W}" height="${H}" fill="${C.sand}"/>`;
  b += `<rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="24" fill="none" stroke="${C.navy}" stroke-width="6" stroke-dasharray="26 18"/>`;
  b += iconAt(W / 2 - 160, 170, 320);
  b += `<path fill="${C.navy}" d="${text('cond800', 'SAMPLE ARTICLE', W / 2, 640, 96, { align: 'middle', tracking: 0.04 }).d}"/>`;
  b += `<path fill="${C.slate}" d="${text('barlow500', 'Format reference for the Inspirovate admin. Not published.', W / 2, 710, 36, { align: 'middle' }).d}"/>`;
  await save('blog-sample-article', b, W, H);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
