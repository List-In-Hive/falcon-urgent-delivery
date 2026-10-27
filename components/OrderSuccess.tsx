"use client";

import { useSyncExternalStore } from "react";
import { LAST_ORDER_KEY, parseLastOrder } from "@/lib/last-order";

function readStored(): string | null {
  try {
    return sessionStorage.getItem(LAST_ORDER_KEY);
  } catch {
    return null;
  }
}

const subscribe = () => () => {};

/** Order details saved in this browser just before payment. Shows nothing if they aren't there. */
export function LastOrderSummary() {
  const raw = useSyncExternalStore(subscribe, readStored, () => null);
  const order = parseLastOrder(raw);
  if (!order) return null;
  return (
    <>
      <p className="mt-4 text-xl">
        Order <strong className="font-display text-2xl">{order.id}</strong>
      </p>
      {order.line && (
        <p className="mt-1 text-slate">
          {order.line}
          {order.price ? `, $${order.price}` : ""}
        </p>
      )}
    </>
  );
}

export function NextStepLine() {
  const raw = useSyncExternalStore(subscribe, readStored, () => null);
  const order = parseLastOrder(raw);
  if (order?.speed === "sameDay") return <>We&apos;ll pick up when your item is ready and deliver it by the end of the business day.</>;
  return <>We&apos;re getting ready. Rush deliveries are picked up and delivered within 60 to 90 minutes.</>;
}
