import type { Metadata } from "next";
import Link from "next/link";
import VanIllustration from "@/components/VanIllustration";
import { CheckList, CtaBand, PageHero } from "@/components/sections";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "About Us | Falcon Urgent Delivery, Las Vegas Courier" },
  description: "10 years of experience delivering on time. Meet the Las Vegas courier built for businesses that can't wait.",
  alternates: { canonical: "/about" },
};

const promise = [
  { title: "On time", text: "The delivery window we give you is the one we keep." },
  { title: "Careful handling", text: "Documents, parts and medical supplies ride in a clean, air-conditioned van." },
  { title: "Clear, flat pricing", text: "You see the price before you book. No waiting-time fees." },
  { title: "Proof of every delivery", text: "A photo, the time and the recipient's name, sent to your email." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        title="10 years of getting it there on time"
        intro="Falcon Urgent Delivery is a Las Vegas courier built for businesses that can't wait."
      />

      <section className="py-16 md:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl md:text-5xl">Founded by {site.owner}</h2>
            <p className="mt-5 max-w-[60ch] text-lg text-[#2b3a4a]">
              After {site.experienceYears} years of experience, {site.owner} started Falcon Urgent Delivery to give Las Vegas businesses a courier
              they can count on: fast pickup, careful handling and on-time delivery.
            </p>
            <p className="mt-4 max-w-[60ch] text-lg text-[#2b3a4a]">
              We come to you, pick up your item, and deliver it straight to your recipient in an air-conditioned van. Rush orders arrive in{" "}
              {site.rushWindow}.
            </p>
          </div>
          <div className="rounded-xl bg-navy p-8 md:p-10">
            <VanIllustration className="w-full" />
          </div>
        </div>
      </section>

      <section className="bg-sand py-16 md:py-24" aria-labelledby="promise-title">
        <div className="container-x">
          <h2 id="promise-title" className="mb-10 text-4xl md:text-5xl">
            Our promise
          </h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {promise.map((p) => (
              <li key={p.title} className="border-t-4 border-red pt-5">
                <h3 className="text-[1.75rem]">{p.title}</h3>
                <p className="mt-2 text-[#2b3a4a]">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="area-title">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <h2 id="area-title" className="text-4xl md:text-5xl">
              Where we work
            </h2>
            <p className="mt-4 text-lg text-slate">
              {site.areas.join(", ")}. Up to 25 miles per trip, and longer runs by quote.
            </p>
            <p className="mt-6">
              <Link href="/services" className="font-semibold text-red underline underline-offset-4">
                See services and prices
              </Link>
            </p>
          </div>
          <CheckList items={["Rush delivery in 60 to 90 minutes", "Same Day when you order by 2 PM", "After-hours, weekend and emergency runs"]} />
        </div>
      </section>

      <CtaBand title="Ready when you are" text="Get your price in a few taps and book online." />
    </>
  );
}
