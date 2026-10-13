import { site } from "./site";

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Courier service",
  name: "Rush and same-day courier delivery",
  provider: { "@type": "Organization", name: site.name, url: site.url },
  areaServed: [
    { "@type": "City", name: "Las Vegas" },
    { "@type": "City", name: "Henderson" },
    { "@type": "Place", name: "Summerlin" },
    { "@type": "City", name: "North Las Vegas" },
    { "@type": "City", name: "Boulder City" },
  ],
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "USD",
    lowPrice: "39",
    highPrice: "89",
  },
};
