import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Payment not completed",
  robots: { index: false, follow: false },
};

export default function CancelledPage() {
  return (
    <section className="container-x max-w-3xl py-16 md:py-24">
      <h1 className="text-5xl md:text-6xl">Payment not completed</h1>
      <p className="mt-4 text-lg text-[#2b3a4a]">Your delivery is not booked and your card was not charged.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/order" className="btn btn-red">
          Try again
        </Link>
        <Link href="/contact?topic=quote" className="btn btn-ghost-dark">
          Request a Quote
        </Link>
      </div>
      <p className="mt-8 text-slate">
        Having trouble paying? Email{" "}
        <a href={`mailto:${site.email}`} className="text-red underline">
          {site.email}
        </a>
        .
      </p>
    </section>
  );
}
