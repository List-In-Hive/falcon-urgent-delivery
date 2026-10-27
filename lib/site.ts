export const site = {
  name: "Falcon Urgent Delivery",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://www.falconurgentdelivery.com").replace(/\/$/, ""),
  email: "wahi.kachichyan@gmail.com",
  owner: "Wahi Kachichyan",
  experienceYears: 10,
  // Business hours are not confirmed yet. Set a string like "Mon–Fri, 8 AM–6 PM" to show it in the footer and contact page.
  hours: null as string | null,
  areas: ["Las Vegas", "Henderson", "Summerlin", "North Las Vegas", "Boulder City", "Airport area"],
  rushWindow: "60 to 90 minutes",
  sameDayCutoff: "2 PM",
};

export const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export const prohibitedItems = [
  "Hazardous materials",
  "Alcohol",
  "Explosives",
  "Firearms, weapons and weapon parts",
  "Recreational drugs",
  "Money",
  "Animals",
  "Stolen goods",
  "Perishable food or beverages",
  "Anything illegal",
];
