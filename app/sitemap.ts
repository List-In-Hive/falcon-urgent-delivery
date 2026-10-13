import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog";
import { siteOrigin } from "@/lib/origin";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = siteOrigin();
  const pages = ["", "/services", "/order", "/about", "/testimonials", "/contact", "/blog", "/privacy", "/terms"];
  const main: MetadataRoute.Sitemap = pages.map((p) => ({
    url: `${origin}${p}`,
    changeFrequency: p === "" || p === "/services" || p === "/blog" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/services" || p === "/order" ? 0.9 : 0.5,
  }));
  const posts: MetadataRoute.Sitemap = getArticles().map((a) => ({
    url: `${origin}/blog/${a.slug}`,
    lastModified: a.publishedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));
  return [...main, ...posts];
}
