import type { Metadata } from "next";
import Link from "next/link";
import { CircleCheck, Clock } from "lucide-react";
import { getStripe } from "@/lib/stripe";
import { getOrder, updateOrder } from "@/lib/store";
import { isOrderId } from "@/lib/order-id";
import { lineItemName } from "@/lib/pricing";
import type { Order } from "@/lib/order-types";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

async function confirm(sessionId: string): Promise<{ order: Order | null; paid: boolean; orderId: string | null }> {
  const stripe = getStripe();
  if (!stripe || !sessionId.startsWith("cs_")) return { order: null, paid: false, orderId: null };
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const orderId = session.metadata?.order_id ?? session.client_reference_id ?? null;
    const paid = session.payment_status === "paid";
    if (!orderId || !isOrderId(orderId)) return { order: null, paid, orderId: null };
    let order = await getOrder(orderId);
    if (order && paid && order.status === "awaiting_payment") {
      order = await updateOrder(orderId, { status: "paid", paid: true, paidAt: new Date().toISOString() });
    }
    return { order, paid, orderId };
  } catch (err) {
    console.error("Could not confirm Stripe session", err);
    return { order: null, paid: false, orderId: null };
  }
}

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams;
  const { order, paid, orderId } = session_id ? await confirm(session_id) : { order: null, paid: false, orderId: null };

  if (!paid) {
    return (
      <section className="container-x max-w-3xl py-16 md:py-24">
        <Clock aria-hidden size={44} className="text-red" />
        <h1 className="mt-4 text-5xl">We couldn&apos;t confirm the payment yet</h1>
        <p className="mt-4 text-lg text-[#2b3a4a]">
          If you completed checkout, Stripe will email your receipt and we&apos;ll be in touch shortly. If something went wrong, email{" "}
          <a href={`mailto:${site.email}`} className="text-red underline">
            {site.email}
          </a>{" "}
          {orderId ? `with order ${orderId}` : "and we'll sort it out"}.
        </p>
        <Link href="/order" className="btn btn-red mt-8">
          Back to the order form
        </Link>
      </section>
    );
  }

  const rush = order?.speed === "rush";
  return (
    <section className="container-x max-w-3xl py-16 md:py-24">
      <CircleCheck aria-hidden size={48} className="text-green" />
      <h1 className="mt-4 text-5xl md:text-6xl">Payment received</h1>
      <p className="mt-4 text-xl">
        Order <strong className="font-display text-2xl">{orderId}</strong> is booked.
      </p>
      {order?.item && order.speed && order.distance && (
        <p className="mt-2 text-slate">
          {lineItemName(order.item, order.speed, order.distance)}, ${order.price}
        </p>
      )}
      <div className="mt-10 rounded-xl bg-sand p-6 md:p-8">
        <h2 className="text-3xl">What happens next</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-lg">
          <li>{rush ? "We're on our way. Your item will be picked up and delivered within 60 to 90 minutes." : "We'll pick up when your item is ready and deliver it by the end of the business day."}</li>
          <li>You&apos;ll get an email when the item is picked up.</li>
          <li>When it&apos;s delivered, you&apos;ll get a photo, the time and the recipient&apos;s name.</li>
        </ol>
        <p className="mt-4 text-slate">Stripe has emailed your receipt. Need to change something? Email {site.email} with your Order ID.</p>
      </div>
    </section>
  );
}
