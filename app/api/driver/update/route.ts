import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isDriver } from "@/lib/driver-auth";
import { getOrder, savePhoto, updateOrder } from "@/lib/store";
import { isOrderId } from "@/lib/order-id";
import { deliveredEmail, pickedUpEmail, sendEmail } from "@/lib/email";
import { clean } from "@/lib/validate";

export const runtime = "nodejs";

const MAX_PHOTO_BYTES = 4 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isDriver())) return NextResponse.json({ error: "Sign in again." }, { status: 401 });

  const form = await req.formData();
  const orderId = clean(form.get("orderId"), 20).toUpperCase();
  const action = form.get("action");
  if (!isOrderId(orderId)) return NextResponse.json({ error: "Missing order ID." }, { status: 400 });
  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: `No order found with ID ${orderId}.` }, { status: 404 });

  const copyTo = process.env.EMAIL_COPY_TO || undefined;
  let emailWarning: string | null = null;

  if (action === "picked_up") {
    if (order.status === "delivered") return NextResponse.json({ error: "This order is already delivered." }, { status: 409 });
    const updated = await updateOrder(orderId, { status: "picked_up", pickedUpAt: new Date().toISOString() });
    try {
      const mail = pickedUpEmail(updated!);
      await sendEmail({ to: updated!.customer.email, bcc: copyTo, ...mail });
    } catch (err) {
      console.error(err);
      emailWarning = "Saved, but the customer email didn't send.";
    }
    return NextResponse.json({ order: updated, emailWarning });
  }

  if (action === "delivered") {
    const recipientName = clean(form.get("recipientName"), 120);
    const note = clean(form.get("note"), 500);
    const photo = form.get("photo");
    if (!recipientName) return NextResponse.json({ error: "Enter the name of the person who received it." }, { status: 400 });
    if (!(photo instanceof File) || photo.size === 0) return NextResponse.json({ error: "Take a photo of the delivered item." }, { status: 400 });
    if (photo.size > MAX_PHOTO_BYTES) return NextResponse.json({ error: "The photo is too large. Try again." }, { status: 413 });
    if (!photo.type.startsWith("image/")) return NextResponse.json({ error: "The photo must be an image." }, { status: 400 });

    const photoId = randomUUID();
    await savePhoto(photoId, await photo.arrayBuffer(), photo.type);
    const updated = await updateOrder(orderId, {
      status: "delivered",
      deliveredAt: new Date().toISOString(),
      recipientName,
      deliveryNote: note || undefined,
      photoId,
      pickedUpAt: order.pickedUpAt ?? new Date().toISOString(),
    });
    try {
      const mail = deliveredEmail(updated!);
      await sendEmail({ to: updated!.customer.email, bcc: copyTo, ...mail });
    } catch (err) {
      console.error(err);
      emailWarning = "Saved, but the customer email didn't send.";
    }
    return NextResponse.json({ order: updated, emailWarning });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
