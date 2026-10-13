import type { MetadataRoute } from "next";
import { siteOrigin } from "@/lib/origin";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/driver", "/api/", "/order/success", "/order/cancelled"] },
    sitemap: `${siteOrigin()}/sitemap.xml`,
  };
}
