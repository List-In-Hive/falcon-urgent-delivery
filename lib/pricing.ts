// One price table for the browser and the server. The server always recalculates; the browser only displays.

export type ItemType = "envelope" | "medium" | "big" | "oversize";
export type Speed = "rush" | "sameDay";
export type Distance = "d1" | "d2" | "d3" | "over25";
export type ItemCount = "one" | "multiple";

// Index 0 = 0–7.5 mi, 1 = 7.5–15 mi, 2 = 15–25 mi (USD)
export const PRICES = {
  envelope: { rush: [49, 59, 69], sameDay: [39, 49, 59] },
  medium: { rush: [59, 69, 79], sameDay: [49, 59, 69] },
  big: { rush: [69, 79, 89], sameDay: [59, 69, 79] },
} as const;

export const ITEM_LABELS: Record<ItemType, string> = {
  envelope: "Envelope (any size)",
  medium: "Medium box (up to 25 lb)",
  big: "Big box (25–50 lb)",
  oversize: "Over 50 lb or oversized",
};

export const ITEM_SHORT: Record<ItemType, string> = {
  envelope: "Envelope",
  medium: "Medium box",
  big: "Big box",
  oversize: "Oversized",
};

export const SPEED_LABELS: Record<Speed, string> = {
  rush: "Rush / Urgent",
  sameDay: "Same Day",
};

export const SPEED_HINTS: Record<Speed, string> = {
  rush: "Picked up and delivered in 60–90 minutes",
  sameDay: "Order by 2 PM, delivered by end of business day",
};

export const DISTANCE_LABELS: Record<Distance, string> = {
  d1: "0–7.5 mi",
  d2: "7.5–15 mi",
  d3: "15–25 mi",
  over25: "Over 25 mi",
};

export const INCLUDED_VALUE = 100;

export interface PriceInput {
  item: ItemType;
  speed: Speed;
  distance: Distance;
  itemCount?: ItemCount;
  afterHours?: boolean;
  declaredValue?: number | null;
}

const DIST_INDEX: Record<Exclude<Distance, "over25">, 0 | 1 | 2> = { d1: 0, d2: 1, d3: 2 };

/** Reasons this delivery can't be paid online and needs a quote. Empty array = payable now. */
export function quoteReasons(input: PriceInput): string[] {
  const reasons: string[] = [];
  if (input.item === "oversize") reasons.push("Over 50 lb or oversized items are priced by quote.");
  if (input.distance === "over25") reasons.push("Trips over 25 miles are priced by quote.");
  if (input.itemCount === "multiple") reasons.push("Orders with more than one item are priced by quote.");
  if (input.afterHours) reasons.push("After-hours, weekend and holiday deliveries are priced by quote.");
  if (input.declaredValue != null && input.declaredValue > INCLUDED_VALUE)
    reasons.push(`Declared values above $${INCLUDED_VALUE} are arranged by quote.`);
  return reasons;
}

/** Table price in whole dollars, or null when the delivery needs a quote. */
export function priceFor(input: PriceInput): number | null {
  if (quoteReasons(input).length) return null;
  if (input.item === "oversize" || input.distance === "over25") return null;
  return PRICES[input.item][input.speed][DIST_INDEX[input.distance]];
}

export function isItemType(v: unknown): v is ItemType {
  return v === "envelope" || v === "medium" || v === "big" || v === "oversize";
}
export function isSpeed(v: unknown): v is Speed {
  return v === "rush" || v === "sameDay";
}
export function isDistance(v: unknown): v is Distance {
  return v === "d1" || v === "d2" || v === "d3" || v === "over25";
}

export function lineItemName(item: ItemType, speed: Speed, distance: Distance) {
  return `${SPEED_LABELS[speed]}, ${ITEM_SHORT[item]}, ${DISTANCE_LABELS[distance]}`;
}
