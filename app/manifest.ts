import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Falcon Urgent Delivery",
    short_name: "Falcon",
    description: "Rush and same-day courier delivery in Las Vegas.",
    start_url: "/",
    display: "standalone",
    background_color: "#0D1B2A",
    theme_color: "#0D1B2A",
    icons: [
      { src: "/android-chrome-192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
