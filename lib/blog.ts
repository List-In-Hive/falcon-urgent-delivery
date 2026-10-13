// Blog articles: content/blog/SLUG.md with YAML front matter, published by the Inspirovate admin.
// Every file is validated at build time. Problems fail the build with a clear message.
// No Next.js imports here: scripts/publication-manifest.ts runs this file outside Next.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";

export interface Article {
  title: string;
  slug: string;
  description: string;
  /** Exactly as written in the file (never re-formatted). */
  publishedAt: string;
  status: string;
  coverImage: string;
  coverAlt: string;
  /** Raw Markdown body. */
  body: string;
  file: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// ISO 8601 date-time with a timezone, e.g. 2026-01-15T16:00:00Z or 2026-01-15T08:00:00-08:00
const ISO_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:\d{2})$/;

// JSON schema keeps unquoted dates as plain strings, so publishedAt stays exactly as written.
const matterOptions = {
  engines: { yaml: (s: string) => yaml.safeLoad(s, { schema: yaml.JSON_SCHEMA }) as object },
};

class BlogError extends Error {
  constructor(file: string, message: string) {
    super(`[blog] ${file}: ${message}`);
  }
}

function requireString(data: Record<string, unknown>, key: string, file: string): string {
  const v = data[key];
  if (typeof v !== "string" || v.trim() === "") throw new BlogError(file, `"${key}" is required and must be a non-empty string.`);
  return v;
}

function isLocal(src: string) {
  return src.startsWith("/") && !src.startsWith("//");
}

function checkLocalImage(src: string, file: string, what: string) {
  if (!isLocal(src)) return;
  const clean = decodeURIComponent(src.split(/[?#]/)[0]);
  const abs = path.join(PUBLIC_DIR, clean);
  if (!abs.startsWith(PUBLIC_DIR) || !fs.existsSync(abs)) {
    throw new BlogError(file, `${what} "${src}" was not found in public${clean}.`);
  }
}

function parseFile(name: string): Article {
  const file = `content/blog/${name}`;
  const raw = fs.readFileSync(path.join(CONTENT_DIR, name), "utf8");
  const parsed = matter(raw, matterOptions);
  const data = (parsed.data ?? {}) as Record<string, unknown>;

  const article: Article = {
    title: requireString(data, "title", file),
    slug: requireString(data, "slug", file),
    description: requireString(data, "description", file),
    publishedAt: requireString(data, "publishedAt", file),
    status: requireString(data, "status", file),
    coverImage: requireString(data, "coverImage", file),
    coverAlt: requireString(data, "coverAlt", file),
    body: parsed.content,
    file,
  };
  // Extra fields such as publicationId are allowed and ignored.

  if (!SLUG_RE.test(article.slug)) throw new BlogError(file, `slug "${article.slug}" must be lowercase words joined by hyphens.`);
  if (!ISO_RE.test(article.publishedAt) || Number.isNaN(Date.parse(article.publishedAt))) {
    throw new BlogError(file, `publishedAt "${article.publishedAt}" must be an ISO date-time with a timezone, e.g. "2026-01-15T16:00:00Z".`);
  }
  if (article.body.trim() === "") throw new BlogError(file, "the article body is empty.");

  checkLocalImage(article.coverImage, file, "coverImage");
  const imageRe = /!\[[^\]]*\]\(\s*<?([^\s)>]+)>?(?:\s+"[^"]*")?\s*\)/g;
  for (const m of article.body.matchAll(imageRe)) checkLocalImage(m[1], file, "Body image");

  return article;
}

let cache: { all: Article[] } | null = null;

/** Every article file, validated (drafts and future articles included). */
export function getAllArticles(): Article[] {
  if (cache && process.env.NODE_ENV === "production") return cache.all;
  const files = fs.existsSync(CONTENT_DIR) ? fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort() : [];
  const all = files.map(parseFile);
  const seen = new Map<string, string>();
  for (const a of all) {
    const prev = seen.get(a.slug);
    if (prev) throw new BlogError(a.file, `duplicate slug "${a.slug}" (also used by ${prev}).`);
    seen.set(a.slug, a.file);
  }
  cache = { all };
  return all;
}

/** Public articles only: status "published" and a date that isn't in the future. Newest first. */
export function getArticles(now: Date = new Date()): Article[] {
  return getAllArticles()
    .filter((a) => a.status === "published" && Date.parse(a.publishedAt) <= now.getTime())
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
}

export function getArticle(slug: string): Article | undefined {
  return getArticles().find((a) => a.slug === slug);
}

/** Up to 3 other public articles, newest first. */
export function getRelated(slug: string, limit = 3): Article[] {
  return getArticles()
    .filter((a) => a.slug !== slug)
    .slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", { dateStyle: "long", timeZone: "America/Los_Angeles" }).format(new Date(iso));
}
