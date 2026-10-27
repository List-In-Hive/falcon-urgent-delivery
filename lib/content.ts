// Site copy that appears on more than one page.

export const faqs: { q: string; a: string }[] = [
  {
    q: "How fast is rush delivery?",
    a: "Rush orders are picked up and delivered within 60 to 90 minutes, anywhere in our service area up to 25 miles.",
  },
  {
    q: "What's the difference between Rush and Same Day?",
    a: "Rush goes right now and arrives in 60 to 90 minutes. Same Day costs less: order by 2 PM and it's delivered by the end of the business day.",
  },
  {
    q: "Will my delivery arrive on time?",
    a: "Yes. On-time delivery is the whole point of Falcon.",
  },
  {
    q: "What can you deliver?",
    a: "Envelopes of any size and packages up to 50 lb: documents, auto parts, medical supplies and equipment, and lab and clinic items. Heavier or larger items by quote.",
  },
  {
    q: "What areas do you serve?",
    a: "Las Vegas, Henderson, Summerlin, North Las Vegas, Boulder City and the airport area, up to 25 miles per trip. Longer runs by quote.",
  },
  {
    q: "How do I pay?",
    a: "By card online through Stripe when you book. For quotes, we email you a secure payment link.",
  },
  {
    q: "Do you deliver after hours and on weekends?",
    a: "Yes, including emergencies. Request a quote and we'll confirm the price.",
  },
  { q: "Do you charge for waiting time?", a: "No." },
  {
    q: "Can I cancel?",
    a: "Yes. You get a full refund if you cancel before pickup. There's no refund after pickup.",
  },
  {
    q: "Are you insured?",
    a: "Yes, we're licensed and insured. Each delivery is covered up to $100 unless a higher value is arranged in advance.",
  },
  {
    q: "What can't you deliver?",
    a: "Hazardous materials, alcohol, explosives, firearms and weapon parts, recreational drugs, money, animals, stolen goods, perishable food or drinks, or anything illegal. The full list is in our Terms of Use.",
  },
];

export const industries: { name: string; line: string; icon: string }[] = [
  { name: "Medical supplies & DME", line: "Supplies and durable medical equipment between suppliers, clinics and offices.", icon: "stethoscope" },
  { name: "Lab and clinic deliveries", line: "Runs between labs, clinics and medical offices.", icon: "flask" },
  { name: "Legal documents", line: "Signed papers and files between law offices and their clients.", icon: "scale" },
  { name: "Auto parts", line: "Parts from dealers and suppliers to repair and body shops.", icon: "wrench" },
  { name: "Dental offices & labs", line: "Cases, impressions and supplies between dental offices and labs.", icon: "smile" },
  { name: "Pharmacies", line: "Business-to-business pharmacy runs across the valley.", icon: "pill" },
  { name: "Title & escrow", line: "Closing documents that have to arrive today.", icon: "file" },
];

// Customer testimonials, in each customer's own words as approved by them.
// Entries with an empty quote are not shown.
export const testimonials: { name: string; company: string; service: string; quote: string }[] = [
  {
    name: "Arman",
    company: "",
    service: "Legal Document Delivery",
    quote:
      "We needed time-sensitive legal documents delivered to a law office across Las Vegas before the end of the business day. Falcon Urgent Delivery responded quickly, picked up the documents within a short timeframe, and completed the delivery exactly as promised. Their communication was professional throughout the process, and we received confirmation immediately after delivery. Excellent service for urgent and confidential documents.",
  },
  {
    name: "Luis",
    company: "",
    service: "Business-to-Business Same-Day Delivery",
    quote:
      "Our company regularly needs contracts, checks, and other important business documents transferred between offices and clients. Falcon Urgent Delivery has been dependable every time. Their drivers are professional, punctual, and careful with sensitive materials. What we appreciate most is the consistent communication and ability to accommodate last-minute same-day requests.",
  },
  {
    name: "Rebecca",
    company: "",
    service: "Last-Minute Emergency Courier",
    quote:
      "We contacted Falcon Urgent Delivery for a last-minute delivery that had to reach a client on the other side of Las Vegas within a very limited timeframe. They handled the request immediately, coordinated the pickup efficiently, and kept us updated until the package was successfully delivered. Their responsiveness and attention to detail made a stressful situation much easier. We would confidently recommend them for urgent courier services.",
  },
];

export const publishedTestimonials = testimonials.filter((t) => t.quote.trim().length > 0);
