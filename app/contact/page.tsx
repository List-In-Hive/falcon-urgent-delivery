import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, MapPin, Phone, Route } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { PageHero } from "@/components/sections";
import { OUT_OF_STATE_HREF, site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | Falcon Urgent Delivery" },
  description: `Call ${site.phone} or send a message. Quotes, recurring deliveries and out-of-state runs to California and Arizona from Falcon Urgent Delivery, the Las Vegas rush courier.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Falcon Urgent Delivery"
        intro="Questions, a quote, recurring deliveries or an out-of-state run? Call us, or send a message and we'll reply by email."
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={site.phoneHref} className="btn btn-red">
            <Phone aria-hidden size={19} /> Call {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="btn btn-ghost-light">
            <Mail aria-hidden size={19} /> Email us
          </a>
        </div>
      </PageHero>
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Suspense fallback={<p className="text-slate">Loading the form…</p>}>
            <ContactForm />
          </Suspense>
          <aside className="space-y-8 lg:pt-1">
            <div>
              <h2 className="text-2xl">Phone</h2>
              <a
                href={site.phoneHref}
                className="mt-2 inline-flex items-center gap-2 text-2xl font-semibold text-red tabular-nums underline underline-offset-4"
              >
                <Phone aria-hidden size={22} />
                {site.phone}
              </a>
            </div>
            <div>
              <h2 className="text-2xl">Email</h2>
              <a
                href={`mailto:${site.email}`}
                className="mt-2 inline-flex items-center gap-2 text-lg text-red underline underline-offset-4 [overflow-wrap:anywhere]"
              >
                <Mail aria-hidden size={20} className="shrink-0" />
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="text-2xl">Service area</h2>
              <p className="mt-2 flex items-start gap-2 text-[#2b3a4a]">
                <MapPin aria-hidden size={20} className="mt-1 shrink-0 text-red" />
                {site.areas.join(", ")}
              </p>
              <p className="mt-3 flex items-start gap-2 text-[#2b3a4a]">
                <Route aria-hidden size={20} className="mt-1 shrink-0 text-red" />
                <span>
                  Out of state: California and Arizona, by quote.{" "}
                  <Link href={OUT_OF_STATE_HREF} className="font-semibold text-red underline underline-offset-4">
                    Request an out-of-state quote
                  </Link>
                </span>
              </p>
            </div>
            {site.hours && (
              <div>
                <h2 className="text-2xl">Hours</h2>
                <p className="mt-2 text-[#2b3a4a]">{site.hours}</p>
              </div>
            )}
            <div>
              <h2 className="text-2xl">Need a quote?</h2>
              <p className="mt-2 text-[#2b3a4a]">
                Choose <strong>Request a quote</strong> as the topic. Quotes cover items over 50 lb, trips over 25 miles, several items or
                stops, after-hours and weekend runs, and declared values over $100. For California or Arizona, choose{" "}
                <strong>Out-of-state delivery</strong>.
              </p>
            </div>
            <div className="rounded-xl bg-sand p-6">
              <h2 className="text-2xl">Need a delivery now?</h2>
              <p className="mt-2 text-[#2b3a4a]">Get your price and book online in a few taps.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/order" className="btn btn-red">
                  Get a Price &amp; Book
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
