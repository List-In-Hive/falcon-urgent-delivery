import { NextResponse } from "next/server";
import { isDriver } from "@/lib/driver-auth";
import { newOrderId } from "@/lib/order-id";
import { saveOrder } from "@/lib/store";
import { EMAIL_RE, clean } from "@/lib/validate";
import type { Address, Order } from "@/lib/order-types";

export const runtime = "nodejs";

const addr = (business: string, address: string, city: string): Address => ({
  business,
  contact: "",
  phone: "",
  address,
  suite: "",
  city,
  zip: "",
  notes: "",
});

/** For quotes paid by payment link: gives the delivery an Order ID so it gets photo proof too. */
export async function POST(req: Request) {
  if (!(await isDriver())) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const b = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const customerEmail = clean(b.customerEmail, 200);
  const customerName = clean(b.customerName, 120);
  const fields: Record<string, string> = {};
  if (!customerName) fields.customerName = "Enter the customer's name.";
  if (!EMAIL_RE.test(customerEmail)) fields.customerEmail = "Enter the customer's email. Proof of delivery goes here.";
  if (!clean(b.pickupAddress)) fields.pickupAddress = "Enter the pickup address.";
  if (!clean(b.dropoffAddress)) fields.dropoffAddress = "Enter the drop-off address.";
  if (!clean(b.itemDescription)) fields.itemDescription = "Describe the item.";
  if (Object.keys(fields).length) return NextResponse.json({ error: "Check the highlighted fields.", fields }, { status: 400 });

  const priceRaw = Number(clean(b.price, 12));
  const order: Order = {
    id: newOrderId(),
    createdAt: new Date().toISOString(),
    source: "manual",
    status: "paid",
    paid: true,
    paidAt: new Date().toISOString(),
    item: null,
    speed: null,
    distance: null,
    price: Number.isFinite(priceRaw) && priceRaw > 0 ? priceRaw : null,
    pickupReady: "",
    pickup: addr(clean(b.pickupBusiness, 120), clean(b.pickupAddress, 200), clean(b.pickupCity, 80)),
    dropoff: addr(clean(b.dropoffBusiness, 120), clean(b.dropoffAddress, 200), clean(b.dropoffCity, 80)),
    itemDescription: clean(b.itemDescription, 300),
    declaredValue: null,
    customer: { name: customerName, company: clean(b.customerCompany, 120), email: customerEmail, phone: clean(b.customerPhone, 40) },
  };
  await saveOrder(order);
  return NextResponse.json({ order });
}
