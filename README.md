# Falcon Urgent Delivery website

Next.js site for Falcon Urgent Delivery (Las Vegas rush courier), built by Inspirovate Creatives.

- **Pages:** Home, About, Services & Pricing, Testimonials, Blog, Contact (including quote requests), Order (price calculator, pay by Stripe payment link), Privacy Policy, Terms of Use, 404.
- **Stack:** Next.js 16 (App Router, TypeScript), Tailwind CSS 4, Netlify Forms, Stripe Payment Links.

## Run it locally

```bash
npm install
cp .env.example .env.local     # fill in what you have; everything is optional locally
npm run dev                    # http://localhost:3000
```

Locally, without Netlify:

- **Forms:** submissions are logged in the browser console instead of sent.
- **Pay Now:** opens Falcon's live Stripe payment link for that price. Don't complete a payment while testing unless you mean to.

Other commands: `npm run build` (production build, runs the blog manifest first), `npm run lint` and `npm run typecheck`.

## Deploy to Netlify

1. Push this folder to a Git repo and create a Netlify site from it. Alternatively, run `netlify deploy --build` with the Netlify CLI. Netlify detects Next.js automatically; `netlify.toml` sets the build command and Node 22.
2. In **Site configuration > Environment variables**, add the values from `.env.example`.
3. **Forms:** turn on form detection, then deploy. Netlify should list two forms: `order` and `contact`. Under **Forms > Submission notifications**, add an email notification to `info@falconurgentdelivery.com`. One notification for "any form" covers both; add one per form if they should go to different people.
4. **Domain:** add `www.falconurgentdelivery.com` as the primary domain, so the bare domain redirects to www. The client points DNS to Netlify.

### The two forms

| Form | Page | What it is | Email subject |
| --- | --- | --- | --- |
| `order` | `/order` | Paid bookings only. Sent when the customer clicks Pay, just before the Stripe payment link opens, with the Order ID | "New order FUD-…: $59, awaiting payment" |
| `contact` | `/contact` | Messages and quote requests. Choosing the topic "Request a quote" changes the subject | "New quote request from …" or "New contact message" |

Deliveries that need a quote (over 50 lb, over 25 miles, several items, after hours, declared value over $100) can't be paid on `/order`. Its button opens `/contact?topic=quote` with the topic selected and the customer's choices filled into the message. Every "Request a Quote" button on the site uses the same link.

Both forms have a field named `email`, so hitting **Reply** on a Netlify notification answers the customer directly.

### Why forms work this way

Netlify ignores form attributes inside Next.js pages. Forms are registered by the static file `public/__forms.html`, and the site POSTs submissions to `/__forms.html` (see `lib/netlify-forms.ts`). **If you add or rename a form field, update `public/__forms.html` too**, or Netlify drops that field. Reference: <https://opennext.js.org/netlify/forms>.

## Stripe (payment links)

Payments use Stripe Payment Links from Falcon's own Stripe account. There are no Stripe keys in the website or in Netlify.

- **6 links, one per price** ($39, $49, $59, $69, $79, $89), all named "Courier Delivery". They are in `lib/payment-links.ts`. The build fails if any price in `lib/pricing.ts` has no link.
- `/api/checkout` recalculates the price on the server, creates the Order ID and returns the link for that price. The browser's price is display only.
- The link opens with the customer's email filled in and the Order ID attached as `client_reference_id`.
- In each link's settings, **After the payment** redirects to `https://www.falconurgentdelivery.com/order/success`. That page thanks the customer and shows their Order ID.
- **Dispatch rule:** the Netlify "order" email arrives first, with status "awaiting payment". Dispatch only after Stripe's payment email, matched by the customer's email and the amount.
- **New price?** Falcon creates a link in Stripe; add it to `lib/payment-links.ts`.
- **Quotes:** Falcon makes a one-time payment link per quote in the Stripe Dashboard.
- In the Stripe Dashboard, turn on customer receipts for successful payments and refunds, and email notifications for successful payments.

## Blog

The blog is at `/blog`, with one page per article at `/blog/SLUG`. The Inspirovate admin publishes to it.

- **Articles** are Markdown files in `content/blog/SLUG.md`. **Images** are WebP files in `public/images/`.
- Each file starts with front matter:

```markdown
---
title: "A helpful article title"
slug: "a-helpful-article-title"
description: "A clear factual summary of the article."
publishedAt: "2026-01-15T16:00:00Z"
status: "published"
coverImage: "/images/hero.webp"
coverAlt: "An accurate description of the image"
---

Opening paragraph.

## A section

Text with [an internal link](/services).

![Supporting image description](/images/supporting-photo.webp)
```

Rules:

- **What's public:** only `status: "published"` articles whose `publishedAt` isn't in the future appear in the list, get a page, and go in the sitemap. Anything else is hidden, including `draft`. A future-dated article appears on the first build after its date.
- **File name:** name each file after its slug (`content/blog/a-helpful-article-title.md`). Two files with the same slug fail the build.
- **`publishedAt`:** kept exactly as written. It must be an ISO date-time with a timezone.
- **Extra fields:** a `publicationId` field (or any other extra field) is allowed.
- **Build checks:** the build fails on a missing field, a duplicate slug, an empty body, or a local image that isn't in `public/`.
- **Markdown only:** no MDX, and raw HTML is skipped. Use `##` and `###` for headings; the title is the page's only H1.
- **Related articles:** each article page shows the 2–3 newest other articles.
- **Sample:** `content/blog/sample-article-format.md` is a clearly marked sample with `status: "draft"`, so it never appears on the site.

**Publication hash and manifest:**

- `npm run build` first runs `prebuild`, which writes `public/publication-manifest.json` with each public article's slug and hash (`lib/publication.ts`).
- Each article page has the same hash on `<article data-publication-hash="…">`, so the admin can confirm the deploy is live.
- The manifest is generated on every build and ignored by git.

**Canonical URLs:**

- On Netlify, the origin comes from `process.env.URL`, the site's main URL and never a deploy preview.
- Elsewhere, it comes from `SITE_URL`.

## Editing content

| What | Where |
| --- | --- |
| Email, service areas, owner, **business hours** (hidden until set) | `lib/site.ts` |
| Prices and quote-only rules | `lib/pricing.ts` |
| FAQ, industries, **testimonials** | `lib/content.ts` |
| Blog articles and images | `content/blog/`, `public/images/` |
| Prohibited items | `lib/site.ts` |
| Privacy Policy, Terms of Use | `app/privacy/page.tsx`, `app/terms/page.tsx` |
| Logo and icons | `public/brand/`, `app/icon.svg`, `app/favicon.ico`, `app/apple-icon.png` |

The Testimonials section stays hidden on the home page until a quote is added. Each quote must be the customer's own words, approved by them.

## Open items before launch

- [ ] Business hours: set `site.hours` in `lib/site.ts`
- [ ] After-hours, weekend and holiday surcharge (until then, these are quote only)
- [x] Testimonial quotes from Arman, Luis and Rebecca (in `lib/content.ts`; confirm each person approved the wording)
- [ ] Whether lab specimens are accepted: "hazardous materials" is prohibited, so the Terms need a clear exception if they are
- [x] Client's Stripe account and the 6 payment links (in `lib/payment-links.ts`)
- [x] Domain DNS pointed to Netlify (GoDaddy)
- [ ] SSL certificate for falconurgentdelivery.com and www (Netlify: Domain management > HTTPS)
- [ ] Client approval of the policies and an attorney review of the Privacy Policy and Terms of Use
- [ ] Owner bio wording on the About page

## Project structure

```text
app/                pages, API routes (app/api), sitemap, robots, manifest, icons, fonts
  api/checkout      server pricing, Order ID, picks the Stripe payment link
components/         header, footer, price widget, order form, page sections
lib/                pricing, payment links, validation, site copy,
                    blog loader (blog.ts), publication hash (publication.ts), canonical origin (origin.ts)
content/blog/       blog articles (Markdown)
scripts/            publication-manifest.ts (runs before every build)
public/__forms.html Netlify Forms registration (keep in sync with the forms)
public/brand/       logo files
public/images/      blog images (WebP)
```
