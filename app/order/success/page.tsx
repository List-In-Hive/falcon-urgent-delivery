import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck } from "lucide-react";
import { LastOrderSummary, NextStepLine } from "@/components/OrderSuccess";
import { site } from "@/lib/site";

// Stripe payment links send customers here after a successful payment.
export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  return (
    <section className="container-x max-w-3xl py-16 md:py-24">
      <CircleCheck aria-hidden size={48} className="text-green" />
      <h1 className="mt-4 text-5xl md:text-6xl">Thank you, payment received</h1>
      <LastOrderSummary />
      <div className="mt-10 rounded-xl bg-sand p-6 md:p-8">
        <h2 className="text-3xl">What happens next</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-lg">
          <li>
            <NextStepLine />
          </li>
          <li>Your item goes straight to the recipient at the drop-off address.</li>
        </ol>
        <p className="mt-4 text-slate">
          Stripe has emailed your receipt. Need to change something? Email{" "}
          <a href={`mailto:${site.email}`} className="text-red underline">
            {site.email}
          </a>{" "}
          with your Order ID.
        </p>
      </div>
      <Link href="/" className="btn btn-ghost-dark mt-8">
        Back to the home page
      </Link>
    </section>
  );
}
