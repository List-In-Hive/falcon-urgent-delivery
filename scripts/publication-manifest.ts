import { writeFileSync } from "node:fs";
import { getArticles } from "../lib/blog";
import { publicationHash } from "../lib/publication";
writeFileSync("public/publication-manifest.json", JSON.stringify({
  version: 1,
  commit: process.env.COMMIT_REF || null,
  deployId: process.env.DEPLOY_ID || null,
  context: process.env.CONTEXT || "local",
  builtAt: new Date().toISOString(),
  articles: getArticles().map(article => ({
    slug: article.slug, hash: publicationHash(article),
  })),
}, null, 2) + "\n");
