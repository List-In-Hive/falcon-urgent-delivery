import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Clock, ShieldCheck, Snowflake } from "lucide-react";
import PriceWidget from "@/components/PriceWidget";
import VanIllustration from "@/components/VanIllustration";
import ServiceAreaMap from "@/components/ServiceAreaMap";
import Faq from "@/components/Faq";
import {
  CheckList,
  CtaBand,
  HowItWorks,
  Industries,
  SectionHeading,
  ServicesList,
  TestimonialsGrid,
  reasons,
} from "@/components/sections";
import { publishedTestimonials } from "@/lib/content";
import { serviceSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Rush Courier Delivery in Las Vegas | Falcon Urgent Delivery" },
  description:
    "Rush and same-day courier for Las Vegas, Henderson and Summerlin businesses. Delivered in 60–90 minutes. Get your price and book online.",
  alternates: { canonical: "/" },
};

const trust = [
  { icon: ShieldCheck, label: "Licensed & insured" },
  { icon: Clock, label: "10 years of experience" },
  { icon: Snowflake, label: "Air-conditioned van" },
  { icon: Camera, label: "Photo proof of delivery" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="edge-angle bg-navy pb-24 pt-10 text-white md:pb-32 md:pt-16">
        <div className="container-x grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          <div className="lg:pt-6">
            <h1 className="text-[3rem] leading-[0.98] sm:text-[4.25rem] lg:text-[5.25rem]">
              Urgent courier delivery in Las Vegas, in 60 to 90 minutes.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
              Rush and same-day pickup and delivery for businesses across Las Vegas, Henderson and Summerlin. Envelopes to 50 lb
              packages, in an air-conditioned van, on time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/order" className="btn btn-red">
                Get a Price &amp; Book
              </Link>
              <Link href="/contact?topic=quote" className="btn btn-ghost-light">
                Request a Quote
              </Link>
            </div>
            <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-white/90">
              {trust.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2.5">
                  <Icon aria-hidden size={20} className="shrink-0 text-red" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <PriceWidget />
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24" aria-labelledby="services-title">
        <div className="container-x">
          <SectionHeading
            id="services-title"
            title="Four ways to get it there"
            intro="Flat prices for standard deliveries, and a quick quote for everything else."
          />
          <ServicesList />
          <p className="mt-6">
            <Link href="/services" className="font-semibold text-red underline underline-offset-4 hover:text-red-dark">
              See the full price table
            </Link>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-sand py-16 md:py-24" aria-labelledby="how-title">
        <div className="container-x">
          <SectionHeading id="how-title" title="How it works" />
          <HowItWorks />
        </div>
      </section>

      {/* What we deliver */}
      <section className="py-16 md:py-24" aria-labelledby="deliver-title">
        <div className="container-x">
          <SectionHeading id="deliver-title" title="What we deliver" intro="From a one-ounce envelope to 50 lb packages." />
          <Industries />
        </div>
      </section>

      {/* Why Falcon */}
      <section className="bg-navy py-16 text-white md:py-24" aria-labelledby="why-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 id="why-title" className="text-4xl md:text-5xl">
              Why businesses call Falcon
            </h2>
            <div className="mt-8">
              <CheckList items={reasons} dark />
            </div>
          </div>
          <VanIllustration className="w-full max-w-xl justify-self-center" />
        </div>
      </section>

      {/* Service area */}
      <section className="py-16 md:py-24" aria-labelledby="area-title">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 id="area-title" className="text-4xl md:text-5xl">
              Across the Las Vegas valley
            </h2>
            <p className="mt-4 text-lg text-slate">Up to 25 miles per trip. Longer runs by quote.</p>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-lg">
              {site.areas.map((a) => (
                <li key={a} className="flex items-center gap-3">
                  <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-red" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
          <ServiceAreaMap />
        </div>
      </section>

      {/* Testimonials (shown once real quotes are added in lib/content.ts) */}
      {publishedTestimonials.length > 0 && (
        <section className="bg-sand py-16 md:py-24" aria-labelledby="reviews-title">
          <div className="container-x">
            <SectionHeading id="reviews-title" title="What our customers say" />
            <TestimonialsGrid />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-16 md:py-24" aria-labelledby="faq-title">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <h2 id="faq-title" className="text-4xl md:text-5xl">
              Questions
            </h2>
            <p className="mt-4 text-slate">
              More answers on the{" "}
              <Link href="/services#faq" className="text-red underline underline-offset-4">
                Services page
              </Link>
              .
            </p>
          </div>
          <Faq limit={6} />
        </div>
      </section>

      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
    </>
  );
}
