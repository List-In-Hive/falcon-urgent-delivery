"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CircleCheck, LogOut, Package, Phone, Plus, Search, TriangleAlert } from "lucide-react";
import type { Order } from "@/lib/order-types";
import { STATUS_LABELS } from "@/lib/order-types";
import { lineItemName } from "@/lib/pricing";

type Session = { configured: boolean; authenticated: boolean } | null;

const time = (iso?: string) =>
  iso
    ? new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }).format(new Date(iso))
    : "";

/** Shrinks a phone photo to max 1600 px JPEG so uploads stay fast on mobile data. */
async function compress(file: File): Promise<Blob> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    return blob ?? file;
  } catch {
    return file;
  }
}

function Login({ onDone, configured }: { onDone: () => void; configured: boolean }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/driver/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok) onDone();
    else setError(json.error || "Sign-in failed. Try again.");
  }
  return (
    <form onSubmit={submit} className="rounded-xl bg-white p-6 ring-1 ring-line md:p-8">
      <h1 className="text-4xl">Driver sign-in</h1>
      {!configured && (
        <p className="mt-3 rounded-md bg-red/10 p-3 text-red-dark">
          The driver page isn&apos;t set up yet. Add DRIVER_PIN and DRIVER_SESSION_SECRET in Netlify.
        </p>
      )}
      <label htmlFor="pin" className="field-label mt-6">
        PIN
      </label>
      <input
        id="pin"
        className="field text-2xl tracking-[0.3em]"
        type="password"
        inputMode="numeric"
        autoComplete="current-password"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        aria-invalid={error ? true : undefined}
      />
      {error && <p className="field-error">{error}</p>}
      <button className="btn btn-red mt-5 w-full" disabled={busy || !pin}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}

function Stop({ label, a }: { label: string; a: Order["pickup"] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate">{label}</p>
      <p className="font-semibold">{a.business}</p>
      <p>{[a.address, a.suite, [a.city, a.zip].filter(Boolean).join(" ")].filter(Boolean).join(", ")}</p>
      {(a.contact || a.phone) && (
        <p className="mt-1 flex flex-wrap items-center gap-2">
          {a.contact}
          {a.phone && (
            <a href={`tel:${a.phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1 font-semibold text-red underline">
              <Phone aria-hidden size={16} /> {a.phone}
            </a>
          )}
        </p>
      )}
      {a.notes && <p className="mt-1 text-sm text-slate">{a.notes}</p>}
    </div>
  );
}

function OrderCard({ order, onChange }: { order: Order; onChange: (o: Order, warning?: string | null) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [recipient, setRecipient] = useState("");
  const [note, setNote] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

  async function send(action: "picked_up" | "delivered") {
    setError("");
    if (action === "delivered") {
      if (!photo) return setError("Take a photo of the delivered item.");
      if (!recipient.trim()) return setError("Enter the name of the person who received it.");
    }
    setBusy(true);
    const fd = new FormData();
    fd.set("orderId", order.id);
    fd.set("action", action);
    if (action === "delivered" && photo) {
      fd.set("recipientName", recipient.trim());
      fd.set("note", note.trim());
      fd.set("photo", await compress(photo), "delivery.jpg");
    }
    const res = await fetch("/api/driver/update", { method: "POST", body: fd });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error || "That didn't save. Try again.");
    onChange(json.order as Order, json.emailWarning);
  }

  const badge =
    order.status === "delivered" ? "bg-green text-white" : order.status === "awaiting_payment" ? "bg-red text-white" : "bg-navy text-white";

  return (
    <div className="rounded-xl bg-white ring-1 ring-line">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-5">
        <p className="font-display text-3xl font-extrabold">{order.id}</p>
        <span className={`rounded-full px-3 py-1 text-sm font-semibold ${badge}`}>{STATUS_LABELS[order.status]}</span>
      </div>
      <div className="space-y-5 p-5">
        {order.status === "awaiting_payment" && (
          <p className="flex gap-2 rounded-md bg-red/10 p-3 text-red-dark">
            <TriangleAlert aria-hidden className="shrink-0" size={20} />
            Payment isn&apos;t confirmed. Check Stripe for this Order ID before you pick up.
          </p>
        )}
        <div>
          <p className="text-sm font-semibold text-slate">Delivery</p>
          <p className="font-semibold">
            {order.item && order.speed && order.distance ? lineItemName(order.item, order.speed, order.distance) : "Quoted delivery"}
            {order.price != null && `, $${order.price}`}
          </p>
          <p>{order.itemDescription}</p>
          {order.pickupReady && <p className="text-sm text-slate">Ready at {order.pickupReady.replace("T", " ")}</p>}
        </div>
        <Stop label="Pick up from" a={order.pickup} />
        <Stop label="Deliver to" a={order.dropoff} />
        <div>
          <p className="text-sm font-semibold text-slate">Customer</p>
          <p>
            {order.customer.name}
            {order.customer.company && `, ${order.customer.company}`}
          </p>
          <p className="text-sm text-slate">{order.customer.email}</p>
        </div>
        {order.pickedUpAt && <p className="text-sm text-slate">Picked up {time(order.pickedUpAt)}</p>}
      </div>

      <div className="border-t border-line p-5">
        {(order.status === "paid" || order.status === "awaiting_payment") && (
          <button type="button" className="btn btn-red w-full" disabled={busy} onClick={() => send("picked_up")}>
            <Package aria-hidden size={20} /> {busy ? "Saving…" : "Mark picked up"}
          </button>
        )}

        {order.status === "picked_up" && (
          <div className="space-y-4">
            <h2 className="text-2xl">Complete delivery</h2>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              id="photo"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setPhoto(f);
                setPreview(f ? URL.createObjectURL(f) : null);
              }}
            />
            {preview ? (
              <div>
                { }
                <img src={preview} alt="Delivery photo preview" className="max-h-72 w-full rounded-md object-cover" />
                <button type="button" className="mt-2 text-sm font-semibold text-red underline" onClick={() => fileRef.current?.click()}>
                  Retake photo
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-ghost-dark w-full" onClick={() => fileRef.current?.click()}>
                <Camera aria-hidden size={20} /> Take delivery photo
              </button>
            )}
            <div>
              <label htmlFor="recipient" className="field-label">
                Received by
              </label>
              <input id="recipient" className="field" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
            </div>
            <div>
              <label htmlFor="note" className="field-label">
                Note for the customer <span className="font-normal text-slate">(optional)</span>
              </label>
              <input id="note" className="field" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Left with front desk" />
            </div>
            <button type="button" className="btn btn-red w-full" disabled={busy} onClick={() => send("delivered")}>
              <CircleCheck aria-hidden size={20} /> {busy ? "Uploading…" : "Mark delivered and email proof"}
            </button>
          </div>
        )}

        {order.status === "delivered" && (
          <div className="space-y-2">
            <p className="flex items-center gap-2 font-semibold text-green">
              <CircleCheck aria-hidden size={20} /> Delivered {time(order.deliveredAt)} to {order.recipientName}
            </p>
            {order.photoId && (
               
              <img src={`/api/photo/${order.photoId}`} alt="Proof of delivery" className="max-h-72 w-full rounded-md object-cover" />
            )}
          </div>
        )}
        {error && (
          <p role="alert" className="field-error mt-3">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

function ManualOrder({ onCreated, onCancel }: { onCreated: (o: Order) => void; onCancel: () => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const body = Object.fromEntries(new FormData(e.currentTarget).entries());
    const res = await fetch("/api/driver/manual-order", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setErrors(json.fields || { form: json.error || "That didn't save." });
    onCreated(json.order);
  }
  const f = (name: string, label: string, type = "text", optional = false) => (
    <div>
      <label htmlFor={`m-${name}`} className="field-label">
        {label} {optional && <span className="font-normal text-slate">(optional)</span>}
      </label>
      <input id={`m-${name}`} name={name} type={type} className="field" aria-invalid={errors[name] ? true : undefined} />
      {errors[name] && <p className="field-error">{errors[name]}</p>}
    </div>
  );
  return (
    <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 ring-1 ring-line md:p-6">
      <h2 className="text-3xl">New manual order</h2>
      <p className="text-slate">For quotes paid by payment link. It creates an Order ID so the customer gets photo proof.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {f("customerName", "Customer name")}
        {f("customerCompany", "Company", "text", true)}
        {f("customerEmail", "Customer email", "email")}
        {f("customerPhone", "Customer phone", "tel", true)}
        {f("pickupBusiness", "Pickup business", "text", true)}
        {f("pickupAddress", "Pickup address")}
        {f("pickupCity", "Pickup city", "text", true)}
        {f("dropoffBusiness", "Drop-off business", "text", true)}
        {f("dropoffAddress", "Drop-off address")}
        {f("dropoffCity", "Drop-off city", "text", true)}
        {f("itemDescription", "Item")}
        {f("price", "Price paid, USD", "number", true)}
      </div>
      {errors.form && <p className="field-error">{errors.form}</p>}
      <div className="flex flex-wrap gap-3">
        <button className="btn btn-red" disabled={busy}>
          {busy ? "Creating…" : "Create order"}
        </button>
        <button type="button" className="btn btn-ghost-dark" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function DriverApp() {
  const [session, setSession] = useState<Session>(null);
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [manual, setManual] = useState(false);
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const res = await fetch("/api/driver/session", { cache: "no-store" });
    setSession(await res.json());
  }
  useEffect(() => {
    let alive = true;
    fetch("/api/driver/session", { cache: "no-store" })
      .then((res) => res.json())
      .then((s: Session) => {
        if (alive) setSession(s);
      });
    return () => {
      alive = false;
    };
  }, []);

  async function find(e?: React.FormEvent) {
    e?.preventDefault();
    const id = query.trim().toUpperCase();
    if (!id) return;
    setBusy(true);
    setError("");
    setNotice("");
    const res = await fetch(`/api/driver/order/${encodeURIComponent(id)}`, { cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.status === 401) return refresh();
    if (!res.ok) {
      setOrder(null);
      return setError(json.error || "Couldn't load that order.");
    }
    setOrder(json.order);
  }

  async function logout() {
    await fetch("/api/driver/logout", { method: "POST" });
    setOrder(null);
    refresh();
  }

  if (!session) return <p className="text-slate">Loading…</p>;
  if (!session.authenticated) return <Login onDone={refresh} configured={session.configured} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl">Deliveries</h1>
        <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate hover:text-navy">
          <LogOut aria-hidden size={16} /> Sign out
        </button>
      </div>

      <form onSubmit={find} className="flex gap-2">
        <label htmlFor="order-id" className="sr-only">
          Order ID
        </label>
        <input
          id="order-id"
          className="field flex-1 font-display text-xl uppercase tracking-wide"
          placeholder="FUD-261013-AB12"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoCapitalize="characters"
          autoComplete="off"
        />
        <button className="btn btn-red" disabled={busy}>
          <Search aria-hidden size={20} />
          <span className="sr-only sm:not-sr-only">Find</span>
        </button>
      </form>
      {error && <p className="field-error -mt-3">{error}</p>}
      {notice && <p className="-mt-3 rounded-md bg-white p-3 text-sm ring-1 ring-line">{notice}</p>}

      {manual ? (
        <ManualOrder
          onCreated={(o) => {
            setManual(false);
            setOrder(o);
            setQuery(o.id);
          }}
          onCancel={() => setManual(false)}
        />
      ) : (
        <button type="button" onClick={() => setManual(true)} className="inline-flex items-center gap-1.5 font-semibold text-red underline underline-offset-4">
          <Plus aria-hidden size={18} /> New manual order
        </button>
      )}

      {order && (
        <OrderCard
          order={order}
          onChange={(o, warning) => {
            setOrder(o);
            setNotice(warning || (o.status === "delivered" ? "Delivered. Proof sent to the customer." : "Picked up. The customer was emailed."));
          }}
        />
      )}
    </div>
  );
}
