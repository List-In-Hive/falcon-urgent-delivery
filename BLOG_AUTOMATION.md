# Falcon blog automation

This file is the complete instruction for the scheduled blog run. It runs on the 10th, 20th and 28th of every month, writes **one** new article for falconurgentdelivery.com, publishes it, and reports back. Nobody approves the run, so follow every rule here exactly. When something isn't covered, choose the safer option: publish less, never more.

The site is a Next.js app deployed by Netlify. Pushing to `main` on GitHub publishes the site about a minute later.

## What a run may change

Only these, and only new files except the topics log:

| File | What |
| --- | --- |
| `content/blog/SLUG.md` | the new article |
| `public/images/blog-*.webp` | the article's new images (cover + one body image) |
| `scripts/blog-images/articles/SLUG.js` | the script that draws those images |
| `content/blog-topics.md` | add the new row to the log, remove a used requested topic |

Never change anything else: no code, no prices, no other articles, no existing images, no `package.json`, no settings. If the build only passes by changing something outside this list, stop and report it instead of publishing.

## Steps

### 1. Set up

```bash
npm ci
npm ci --prefix scripts/blog-images
```

### 2. Check this run hasn't already published

Get today's date in Los Angeles with `TZ=America/Los_Angeles date +%Y-%m-%d`. Read `content/blog-topics.md`. If the Published table already has a row with that date, stop and report "Already published today". This keeps a repeated run from posting twice.

### 3. Review the blog

- Read every article in `content/blog/` (skip `sample-article-format.md`, it's a draft format sample).
- Note each article's topic, main search phrase, title, slug, and which internal links it uses.
- Note anything that looks wrong in an existing article (a price or rule that no longer matches `lib/pricing.ts` / `lib/site.ts`, a broken link). **Don't edit it.** List it in your report.

### 4. Pick the topic

1. If **Requested topics** in `content/blog-topics.md` lists a topic (anything other than "(none)"), use the first one.
2. Otherwise choose a new topic from **Topic directions** below that no published article covers. Different angle, different main search phrase, no overlap with an existing title.
3. Prefer the topic most useful right now: seasonal timing (for example the holiday rush in November and December, summer heat in June to August), then industries not yet covered, then how-to guides.

The topic must be something a Las Vegas business owner or office manager would actually search for, and that leads naturally to booking a delivery or asking for a quote.

### 5. Get the facts

The website code is the only source of facts about Falcon. Read these files at the start of every run, because prices and details can change:

- `lib/pricing.ts`: prices, size classes, distance bands, what needs a quote, included value ($100).
- `lib/site.ts`: phone, email, service areas, out-of-state (California and Arizona, by quote), Same Day cutoff, prohibited items.
- `lib/content.ts`: FAQ, industries served.
- `app/page.tsx`, `app/services/page.tsx`, `app/terms/page.tsx`: service promises and policies as worded on the site.

Rules:

- Use only facts stated in those files. Never invent statistics, customer names, quotes or testimonials, years in business, license numbers, guarantees, partner businesses, addresses, delivery counts or response times beyond what the site says.
- General knowledge about Las Vegas is fine when it's well known and stable (Henderson, Summerlin, North Las Vegas, Boulder City, the airport area, I-15, the Strip, summer heat). No traffic numbers, no claims about specific businesses or events.
- No medical, legal, tax or financial advice. For regulated items (prescriptions, specimens, legal filings), describe the logistics only and say the sender follows their own rules.
- Don't promise anything the site doesn't: no tracking app, no photo proof, no signatures unless the site says so, no international or freight service, no food delivery.

### 6. Write the article

**File:** `content/blog/SLUG.md`. The slug is lowercase words joined by hyphens, includes `las-vegas` when it reads naturally, and must not already exist.

**Front matter**, in exactly this shape:

```markdown
---
title: "Title in Title Case, 65 characters or fewer"
slug: "the-slug"
description: "One or two sentences, 120 to 160 characters, saying what the reader gets."
publishedAt: "2026-11-10T17:48:00Z"
status: "published"
coverImage: "/images/blog-the-cover.webp"
coverAlt: "Accurate description of what the cover illustration shows"
---
```

- `publishedAt`: the current time in UTC, to the minute, ending in `Z`. Get it with `date -u +%Y-%m-%dT%H:%M:00Z`. Never a future time, or the article stays hidden.
- `status` is always `"published"`.

**Body:**

- 700 to 1,100 words.
- Opening paragraph with no heading: the problem and what the article covers, with the main search phrase used once, naturally.
- 4 to 7 sections with `##` headings (`###` for sub-points). No `#` headings: the title is the page's only H1.
- Use lists and numbered steps where they help a reader scan. Bold sparingly for key facts like prices and times.
- Exactly one body image, placed after the section it illustrates: `![Accurate alt text](/images/blog-the-detail.webp)`.
- At least 3 internal links with descriptive link text, from these routes only: `/`, `/about`, `/services`, `/testimonials`, `/blog`, `/blog/SLUG` (an existing published article), `/contact`, `/contact?topic=quote`, `/contact?topic=out-of-state`, `/order`, `/terms`, `/privacy`. Link one related article when one fits.
- Close with a short section that tells the reader what to do next: [get a price and book](/order), or [request a quote](/contact?topic=quote) for anything quote-only, or [an out-of-state quote](/contact?topic=out-of-state) for California and Arizona. The phone number may appear as plain text, written exactly as in `lib/site.ts`.
- No raw HTML, no MDX, no external links.

**Voice:** plain, helpful and direct, like the existing articles. US English. Short sentences. Speak to the reader as "you" and to Falcon as "we" or "Falcon". No hype ("revolutionary", "best in town", "unmatched"), no emojis, no exclamation marks, no em dashes. Don't stuff keywords: write for the person, mention the place where it fits.

### 7. Make the images

Every article gets two new images, drawn with the in-repo tool in the same flat style as the existing ones:

- **Cover:** 1600 x 900, named `blog-<short-topic>`.
- **Body image:** 1600 x 760, named `blog-<short-topic>-<detail>`.

Write `scripts/blog-images/articles/SLUG.js` (copy the structure of an existing script in that folder), then run it from the repo root:

```bash
node scripts/blog-images/articles/SLUG.js
```

`save()` writes `public/images/NAME.webp` and a preview at `scripts/blog-images/out/NAME.png`. It refuses names of images that are already committed, so other articles' images can't be overwritten, but you can re-run your own script as often as you need. **Never run another article's script, and never use `--force`.**

`scripts/blog-images/lib.js` gives you: `C` (brand colors), `text()` (outlined Barlow text), `iconAt()` / `iconRevAt()` (Falcon head icon, navy or white), `speedLines()`, `van()` (the Falcon cargo van) and `save()`.

**Style rules:**

- Flat vector shapes only: solid fills, rounded corners, no gradients, no photos, no people, no drop shadows (the van's ground shadow is the only one).
- Brand colors from `C` only. Cardboard boxes use `C.kraft`, `C.kraftDark`, `C.kraftLight`. Paper and label text lines are rounded bars in `C.line`.
- **Covers:** no words. Either a navy background with an angled `C.navy2` base panel, or a sand background with an angled navy band at the top. One clear subject that says the topic at a glance (an object, a vehicle, a document, a box), optionally with the red speed lines, the van or the Falcon icon on a label.
- **Body images:** sand background, a short headline at top left (`text('cond700', …, 100, 118, 64)` in navy), then a simple diagram that explains one idea from the article: steps, a comparison, a checklist, size classes. Labels in `cond800` (navy) with sub-labels in `barlow500` (slate). Every word and number must match the article and the site's facts.
- Keep content at least 80 px from the edges. No text smaller than 26 px. No other company's logo or name.

**Check the previews:** open both PNG previews in `scripts/blog-images/out/` and look at them. Fix your script and re-run it until nothing is cut off or overlapping, every word is spelled right, and the picture clearly matches the topic. Then write `coverAlt` and the body image alt text to describe exactly what's drawn.

### 8. Update the topics log

In `content/blog-topics.md`, add a row at the bottom of **Published**: today's Los Angeles date (`TZ=America/Los_Angeles date +%Y-%m-%d`), slug, topic and main search phrase. If you used a requested topic, remove its line from **Requested topics**, and if the list is then empty, put back the single line `- (none)`.

### 9. Check everything

```bash
npm run lint
npm run typecheck
npm run build
```

- All three must pass. The build fails on a bad front matter field, a duplicate slug, an empty body or a missing image.
- The article page must exist after the build: `ls .next/server/app/blog/SLUG.html`. (The build log stops listing every article once there are many, so check the file, not the log.)
- Re-read the article once against the facts files: every price, time, weight, area and policy must match. Check every internal link is on the allowed list and every `/blog/…` link points to an existing published article.
- `git status` must show only the files allowed above.

If something fails and you can fix it within the allowed files, fix it and check again. If you can't, **don't push**: report what failed.

### 10. Publish

```bash
git add content/blog/SLUG.md content/blog-topics.md public/images/COVER.webp public/images/BODY.webp scripts/blog-images/articles/SLUG.js
git commit -m "Publish article: SLUG"
git push origin HEAD:main
```

Replace `COVER` and `BODY` with your two image names. Check `git status` before committing: only those five files. If the push is rejected because `main` moved, run `git pull --rebase origin main`, run step 9 again, then push.

### 11. Report

End the run with a short report:

- **Published:** the title and `https://www.falconurgentdelivery.com/blog/SLUG` (live about a minute after the push).
- **Topic:** why this topic, and the main search phrase.
- **Images:** what the cover and body image show.
- **Noticed:** anything wrong in existing articles from step 3, or "nothing".

If nothing was published, start the report with **Not published** and the reason.

## Topic directions

Pick angles that aren't covered yet (see the Published table in `content/blog-topics.md`):

- **Industries** (from `lib/content.ts`): medical supplies and DME, lab and clinic runs, dental offices and labs, pharmacies (business to business), title and escrow, legal documents, auto parts. One article per industry, written for that industry's office manager.
- **Areas:** delivering between parts of the valley (Henderson, Summerlin, North Las Vegas, Boulder City, the airport area), and what the 25-mile range and distance bands mean in practice.
- **How-to guides:** choosing Rush or Same Day, packing, labeling, what to have ready when booking, declaring a higher value, sending more than one item, recurring runs.
- **Quote-only services:** over 50 lb or oversized, after-hours, weekend and holiday runs, several stops, round trips, out-of-state deliveries to California and Arizona.
- **Seasonal:** the holiday rush (November and December), end of quarter and year-end paperwork, summer heat and sensitive items (June to August).
- **Comparisons for decision makers:** courier vs. sending your own staff, courier vs. overnight shipping, when same-day delivery is worth it. Stay factual about Falcon; don't name or criticize other companies.

Avoid: anything Falcon doesn't do (food, international, freight), prohibited items as a topic of their own, news or events, and topics already published.
