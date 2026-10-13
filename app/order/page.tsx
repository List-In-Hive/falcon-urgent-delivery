import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import OrderForm from "@/components/OrderForm";

export const metadata: Metadata = {
  title: { absolute: "Get a Price & Book a Courier | Falcon Urgent Delivery" },
  description: "See your price instantly and pay online. Rush and same-day courier delivery across Las Vegas, Henderson and Summerlin.",
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  return (
    <>
      <section className="bg-navy pb-10 pt-10 text-white md:pt-14">
        <div className="container-x">
          <h1 className="text-5xl md:text-6xl">Get a price &amp; book</h1>
          <p className="mt-3 max-w-2xl text-lg text-white/80">
            Standard deliveries have a flat price you pay right now. Heavier, farther or after hours?{" "}
            <Link href="/contact?topic=quote" className="text-white underline underline-offset-4">
              Request a quote
            </Link>{" "}
            instead.
          </p>
        </div>
      </section>
      <section className="py-12 pb-32 md:py-16">
        <div className="container-x">
          <Suspense fallback={<p className="text-slate">Loading the order form…</p>}>
            <OrderForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
