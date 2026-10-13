// Canonical origin for the blog. On Netlify, process.env.URL is the site's main URL (the primary
// domain once one is set), never a deploy-preview URL. Elsewhere, an optional SITE_URL is used.
const FALLBACK = "https://www.falconurgentdelivery.com";

export function siteOrigin(): string {
  const raw =
    process.env.NETLIFY === "true" && process.env.URL
      ? process.env.URL
      : process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || FALLBACK;
  return raw.replace(/\/+$/, "");
}
