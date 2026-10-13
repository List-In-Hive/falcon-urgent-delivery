import type { Metadata } from "next";
import Faq from "@/components/Faq";
import { CtaBand, Industries, PageHero, PriceTable, ProhibitedList, SectionHeading, ServicesList } from "@/components/sections";
import { serviceSchema } from "@/lib/schema";
import { INCLUDED_VALUE } from "@/lib/pricing";

export const metadata: Metadata = {
  title: { absolute: "Courier Services & Pricing | Falcon Urgent Delivery" },
  description:
    "Flat courier prices from $39. Rush delivery in 60–90 minutes and same-day service across Las Vegas. Envelopes to 50 lb packages.",
  alternates: { canonical: "/services" },
};

const carry = [
  { name: "Envelope", detail: "Any size" },
  { name: "Medium box", detail: "Up to 25 lb" },
  { name: "Big box", detail: "25 to 50 lb" },
  { name: "Over 50 lb or oversized", detail: "By quote, up to 1,500 lb per trip" },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero title="Courier services & pricing" intro="Flat prices. No waiting-time fees. Pay online when you book." />

      <section className="py-16 md:py-24" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeading id="services-title" title="Services" />
          <ServicesList />
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24" aria-labelledby="prices-title">
        <div className="container-x">
          <SectionHeading
            id="prices-title"
            title="Prices"
            intro="One item, one way, by driving miles from pickup to drop-off. Rush prices in red."
          />
          <PriceTable />
          <dl className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <dt className="font-semibold">Rush / Urgent</dt>
              <dd className="text-[#2b3a4a]">Picked up and delivered within 60 to 90 minutes.</dd>
            </div>
            <div>
              <dt className="font-semibold">Same Day</dt>
              <dd className="text-[#2b3a4a]">Order by 2 PM, delivered by the end of the business day.</dd>
            </div>
            <div>
              <dt className="font-semibold">By quote</dt>
              <dd className="text-[#2b3a4a]">
                Over 50 lb or oversized, over 25 miles, more than one item, several stops or round trips, after-hours, weekend and
                holiday deliveries, and declared values over ${INCLUDED_VALUE}.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Coverage</dt>
              <dd className="text-[#2b3a4a]">Every delivery is covered up to ${INCLUDED_VALUE}. Higher values are arranged in advance by quote.</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="carry-title">
        <div className="container-x">
          <SectionHeading id="carry-title" title="What we carry" />
          <ul className="grid gap-px overflow-hidden rounded-xl bg-line ring-1 ring-line sm:grid-cols-2 lg:grid-cols-4">
            {carry.map((c) => (
              <li key={c.name} className="bg-white p-6">
                <p className="font-display text-2xl font-bold">{c.name}</p>
                <p className="mt-1 text-slate">{c.detail}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24" aria-labelledby="industries-title">
        <div className="container-x">
          <SectionHeading id="industries-title" title="Industries we serve" />
          <Industries detailed />
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="prohibited-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <h2 id="prohibited-title" className="text-4xl md:text-5xl">
              What we can&apos;t carry
            </h2>
            <p className="mt-4 text-slate">We may refuse any item that isn&apos;t safe or legal to transport.</p>
          </div>
          <ProhibitedList />
        </div>
      </section>

      <section id="faq" className="bg-sand py-16 md:py-24" aria-labelledby="faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <h2 id="faq-title" className="text-4xl md:text-5xl">
            Questions
          </h2>
          <Faq withSchema />
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
