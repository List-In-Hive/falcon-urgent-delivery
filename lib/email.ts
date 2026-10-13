import { Resend } from "resend";
import type { Order } from "./order-types";
import { site } from "./site";
import { DISTANCE_LABELS, ITEM_LABELS, SPEED_LABELS } from "./pricing";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

const lasVegasTime = (iso: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));

/** Sends one email through Resend. Without RESEND_API_KEY it logs and skips (local dev). */
export async function sendEmail(opts: { to: string; subject: string; html: string; bcc?: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn(`[email skipped: RESEND_API_KEY not set] to=${opts.to} subject="${opts.subject}"`);
    return { skipped: true as const };
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || `Falcon Urgent Delivery <deliveries@falconurgentdelivery.com>`,
    to: opts.to,
    bcc: opts.bcc,
    replyTo: site.email,
    subject: opts.subject,
    html: opts.html,
  });
  if (error) throw new Error(`Email failed: ${error.message}`);
  return { skipped: false as const };
}

function frame(title: string, body: string) {
  return `<!doctype html><html><body style="margin:0;background:#F4EFE6;font-family:Arial,Helvetica,sans-serif;color:#0D1B2A">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:10px;overflow:hidden">
    <tr><td style="background:#0D1B2A;padding:20px 24px"><img src="${site.url}/brand/falcon-logo-reversed.png" alt="Falcon Urgent Delivery" width="180" style="display:block;border:0"></td></tr>
    <tr><td style="padding:28px 24px">
      <h1 style="margin:0 0 12px;font-size:22px;line-height:1.3">${title}</h1>
      ${body}
      <p style="margin:24px 0 0;font-size:14px;color:#5B6B7C">Questions? Reply to this email or write to <a href="mailto:${site.email}" style="color:#D22B24">${site.email}</a>.</p>
    </td></tr>
  </table></td></tr></table></body></html>`;
}

function summary(order: Order) {
  const what =
    order.item && order.speed && order.distance
      ? `${SPEED_LABELS[order.speed]}, ${ITEM_LABELS[order.item]}, ${DISTANCE_LABELS[order.distance]}`
      : esc(order.itemDescription);
  const row = (k: string, v: string) =>
    `<tr><td style="padding:6px 12px 6px 0;color:#5B6B7C;font-size:14px;vertical-align:top">${k}</td><td style="padding:6px 0;font-size:14px">${v}</td></tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0">
    ${row("Order", `<strong>${order.id}</strong>`)}
    ${row("Delivery", what)}
    ${row("From", esc(`${order.pickup.business}, ${order.pickup.address}, ${order.pickup.city}`))}
    ${row("To", esc(`${order.dropoff.business}, ${order.dropoff.address}, ${order.dropoff.city}`))}
  </table>`;
}

export function pickedUpEmail(order: Order) {
  return {
    subject: `Your item is on the way (order ${order.id})`,
    html: frame(
      "Your item is on the way",
      `<p style="margin:0;font-size:15px;line-height:1.5">We picked up your item${
        order.pickedUpAt ? ` at ${lasVegasTime(order.pickedUpAt)}` : ""
      } and it's heading to ${esc(order.dropoff.business || order.dropoff.contact)}.</p>${summary(order)}
      <p style="margin:0;font-size:15px;line-height:1.5">You'll get another email with a photo as soon as it's delivered.</p>`,
    ),
  };
}

export function deliveredEmail(order: Order) {
  const photo = order.photoId ? `${site.url}/api/photo/${order.photoId}` : null;
  return {
    subject: `Delivered: order ${order.id}`,
    html: frame(
      "Your delivery is complete",
      `<p style="margin:0;font-size:15px;line-height:1.5">Delivered${
        order.deliveredAt ? ` at <strong>${lasVegasTime(order.deliveredAt)}</strong>` : ""
      }${order.recipientName ? `, received by <strong>${esc(order.recipientName)}</strong>` : ""}.</p>
      ${summary(order)}
      ${order.deliveryNote ? `<p style="margin:0 0 16px;font-size:15px;line-height:1.5">Driver's note: ${esc(order.deliveryNote)}</p>` : ""}
      ${
        photo
          ? `<p style="margin:0 0 8px;font-size:15px">Proof of delivery:</p>
             <a href="${photo}"><img src="${photo}" alt="Photo of the delivered item" width="512" style="display:block;width:100%;max-width:512px;border-radius:8px;border:0"></a>`
          : ""
      }`,
    ),
  };
}
