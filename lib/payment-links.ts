import { PRICES } from "./pricing";

// Stripe Payment Links from Falcon's Stripe account, one per price.
// Checked on Oct 27, 2026: each link opens "Courier Delivery" at the price below.
export const PAYMENT_LINKS: Readonly<Record<number, string>> = {
  39: "https://buy.stripe.com/dRm00l83BaqEd8SdEqcV200",
  49: "https://buy.stripe.com/6oUaEZfw30Q41qa1VIcV202",
  59: "https://buy.stripe.com/dRmbJ35Vt9mA3yidEqcV201",
  69: "https://buy.stripe.com/28E8wRgA77es2ue1VIcV203",
  79: "https://buy.stripe.com/dRm5kFerZdCQfh0gQCcV204",
  89: "https://buy.stripe.com/cNiaEZfw356k4CmasecV205",
};

/**
 * The payment link for a price, with the Order ID attached (client_reference_id, so it is saved on the Stripe
 * payment) and the customer's email filled in. Null when there is no link for that price.
 */
export function paymentLinkFor(price: number, orderId: string, email: string): string | null {
  const base = PAYMENT_LINKS[price];
  if (!base) return null;
  const url = new URL(base);
  url.searchParams.set("client_reference_id", orderId);
  if (email) url.searchParams.set("prefilled_email", email);
  return url.toString();
}

// Every standard price must have a link. This runs when the build loads the checkout route, so a missing link fails the build.
const missing = [...new Set(Object.values(PRICES).flatMap((bySpeed) => Object.values(bySpeed).flat()))].filter((p) => !PAYMENT_LINKS[p]);
if (missing.length) throw new Error(`[payment-links] No Stripe payment link for: ${missing.map((p) => `$${p}`).join(", ")}`);
