import { createHash } from "node:crypto";
export function publicationHash(article: {
  title: string; slug: string; description: string; publishedAt: string;
  coverImage: string; coverAlt: string; body: string;
}) {
  return createHash("sha256").update(JSON.stringify([
    article.title.trim(), article.slug, article.description.trim(),
    article.publishedAt, article.coverImage, article.coverAlt.trim(),
    article.body.trim(),
  ])).digest("hex");
}
