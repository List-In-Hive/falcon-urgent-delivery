import { NextResponse } from "next/server";
import { paymentLinkFor } from "@/lib/payment-links";
import { newOrderId } from "@/lib/order-id";
import {
  isDistance,
  isItemType,
  isSpeed,
  priceFor,
  quoteReasons,
  type ItemCount,
} from "@/lib/pricing";
import { EMAIL_RE, checkAddress, clean, readAddress, validPhone } from "@/lib/validate";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields.
  if (clean(body["bot-field"])) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  const item = body.item_type;
  const speed = body.speed;
  const distance = body.distance_band;
  const itemCount: ItemCount = body.item_count === "multiple" ? "multiple" : "one";
  const afterHours = body.after_hours === true || body.after_hours === "Yes";
  const declaredRaw = clean(body.declared_value, 20);
  const declaredValue = declaredRaw === "" ? null : Number(declaredRaw);

  if (!isItemType(item) || !isSpeed(speed) || !isDistance(distance)) {
    return NextResponse.json({ error: "Choose the item, speed and distance." }, { status: 400 });
  }

  const input = { item, speed, distance, itemCount, afterHours, declaredValue: Number.isFinite(declaredValue) ? declaredValue : null };
  const reasons = quoteReasons(input);
  const price = priceFor(input); // the server's price is the only one that counts
  if (reasons.length || price == null) {
    return NextResponse.json({ error: `This delivery needs a quote. ${reasons.join(" ")}` }, { status: 400 });
  }

  const pickup = readAddress(body, "pickup");
  const dropoff = readAddress(body, "dropoff");
  const customer = {
    name: clean(body.customer_name, 120),
    company: clean(body.customer_company, 120),
    email: clean(body.customer_email, 200),
    phone: clean(body.customer_phone, 40),
  };
  const fields: Record<string, string> = {};
  checkAddress(pickup, "pickup", fields);
  checkAddress(dropoff, "dropoff", fields);
  if (!customer.name) fields.customer_name = "Enter your name.";
  if (!EMAIL_RE.test(customer.email)) fields.customer_email = "Enter a valid email address.";
  if (!validPhone(customer.phone)) fields.customer_phone = "Enter a 10-digit phone number.";
  const itemDescription = clean(body.item_description, 300);
  if (!itemDescription) fields.item_description = "Describe the item.";
  const pickupReady = clean(body.pickup_ready, 40);
  if (speed === "sameDay" && !pickupReady) fields.pickup_ready = "Choose when the item is ready for pickup.";
  if (!body.no_prohibited_items) fields.no_prohibited_items = "Confirm the item isn't on the prohibited list.";
  if (!body.agree_terms) fields.agree_terms = "Agree to the Terms of Use and Privacy Policy.";
  if (Object.keys(fields).length) {
    return NextResponse.json({ error: "Check the fields marked in red.", fields }, { status: 400 });
  }

  const orderId = newOrderId();
  const url = paymentLinkFor(price, orderId, customer.email);
  if (!url) {
    return NextResponse.json(
      { error: "Online payment isn't available for this price yet. Request a quote instead and we'll email you a payment link." },
      { status: 503 },
    );
  }
  return NextResponse.json({ orderId, url, price });
}
