import { randomInt } from "node:crypto";

// No 0/O or 1/I so IDs are easy to read over the phone or copy by hand.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** FUD-YYMMDD-XXXX, dated in Las Vegas time. */
export function newOrderId(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  let suffix = "";
  for (let i = 0; i < 4; i++) suffix += ALPHABET[randomInt(ALPHABET.length)];
  return `FUD-${get("year")}${get("month")}${get("day")}-${suffix}`;
}

export function isOrderId(v: unknown): v is string {
  return typeof v === "string" && /^FUD-\d{6}-[A-Z2-9]{4}$/.test(v);
}
