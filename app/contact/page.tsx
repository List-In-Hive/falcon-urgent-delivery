import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { PageHero } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Contact Us | Falcon Urgent Delivery" },
  description: "Questions, recurring deliveries or special requests? Email Falcon Urgent Delivery, the Las Vegas rush courier.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Contact Falcon Urgent Delivery"
        intro="Questions, a quote, recurring deliveries or a special request? Send a message and we'll reply by email."
      />
      <section className="py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <Suspense fallback={<p className="text-slate">Loading the form…</p>}>
            <ContactForm />
          </Suspense>
          <aside className="space-y-8 lg:pt-1">
            <div>
              <h2 className="text-2xl">Email</h2>
              <a href={`mailto:${site.email}`} className="mt-2 inline-flex items-center gap-2 text-lg text-red underline underline-offset-4">
                <Mail aria-hidden size={20} />
                {site.email}
              </a>
            </div>
            <div>
              <h2 className="text-2xl">Service area</h2>
              <p className="mt-2 flex items-start gap-2 text-[#2b3a4a]">
                <MapPin aria-hidden size={20} className="mt-1 shrink-0 text-red" />
                {site.areas.join(", ")}
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
                stops, after-hours and weekend runs, and declared values over $100.
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
