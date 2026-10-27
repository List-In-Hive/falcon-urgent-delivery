// The last order placed in this browser, saved just before the customer goes to Stripe,
// so the thank-you page can show the Order ID when Stripe sends them back.
export const LAST_ORDER_KEY = "falcon-last-order";

export interface LastOrder {
  id: string;
  price: number;
  line: string;
  speed: "rush" | "sameDay";
}

export function parseLastOrder(raw: string | null): LastOrder | null {
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as Partial<LastOrder>;
    if (typeof o.id !== "string" || !/^FUD-\d{6}-[A-Z0-9]{4}$/.test(o.id)) return null;
    return {
      id: o.id,
      price: typeof o.price === "number" ? o.price : 0,
      line: typeof o.line === "string" ? o.line : "",
      speed: o.speed === "sameDay" ? "sameDay" : "rush",
    };
  } catch {
    return null;
  }
}
