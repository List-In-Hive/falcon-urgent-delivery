import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileCTA from "@/components/MobileCTA";
import { site } from "@/lib/site";

const barlow = localFont({
  src: [
    { path: "./fonts/barlow-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "./fonts/barlow-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "./fonts/barlow-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = localFont({
  src: [
    { path: "./fonts/barlow-condensed-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-700-normal.woff2", weight: "700", style: "normal" },
    { path: "./fonts/barlow-condensed-latin-800-normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-barlow-condensed",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Rush Courier Delivery in Las Vegas | Falcon Urgent Delivery", template: "%s | Falcon Urgent Delivery" },
  description:
    "Rush and same-day courier for Las Vegas, Henderson and Summerlin businesses. Delivered in 60–90 minutes. Get your price and book online.",
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Falcon Urgent Delivery, rush courier in Las Vegas" }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0D1B2A",
  width: "device-width",
  initialScale: 1,
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/android-chrome-512.png`,
  email: site.email,
  areaServed: ["Las Vegas, NV", "Henderson, NV", "Summerlin, NV", "North Las Vegas, NV", "Boulder City, NV"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-navy"
        >
          Skip to content
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileCTA />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
      </body>
    </html>
  );
}
