"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import {
  DISTANCE_LABELS,
  INCLUDED_VALUE,
  ITEM_LABELS,
  SPEED_HINTS,
  SPEED_LABELS,
  isDistance,
  isItemType,
  isSpeed,
  lineItemName,
  priceFor,
  quoteReasons,
  type Distance,
  type ItemCount,
  type ItemType,
  type Speed,
} from "@/lib/pricing";
import { EMAIL_RE, validPhone, validZip } from "@/lib/validate";
import { submitNetlifyForm } from "@/lib/netlify-forms";
import { LAST_ORDER_KEY } from "@/lib/last-order";

type Errors = Record<string, string>;
type Phase = "editing" | "paying";

function Radio<T extends string>({
  name,
  value,
  current,
  onChange,
  label,
  hint,
}: {
  name: string;
  value: T;
  current: T;
  onChange: (v: T) => void;
  label: string;
  hint?: string;
}) {
  const checked = value === current;
  return (
    <label
      className={`flex min-h-[3.5rem] cursor-pointer items-start gap-3 rounded-md border-[1.5px] px-4 py-3 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
        checked ? "border-navy bg-navy/[0.04]" : "border-line hover:border-navy/40"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="mt-1 h-4 w-4 accent-[#D22B24]"
      />
      <span>
        <span className="block font-semibold leading-snug">{label}</span>
        {hint && <span className="block text-sm text-slate">{hint}</span>}
      </span>
    </label>
  );
}

function Field({
  name,
  label,
  errors,
  optional,
  className = "",
  children,
}: {
  name: string;
  label: string;
  errors: Errors;
  optional?: boolean;
  className?: string;
  children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}) {
  return (
    <div className={className}>
      <label htmlFor={`o-${name}`} className="field-label">
        {label} {optional && <span className="font-normal text-slate">(optional)</span>}
      </label>
      {children}
      {errors[name] && (
        <p id={`o-${name}-err`} className="field-error">
          {errors[name]}
        </p>
      )}
    </div>
  );
}

function input(name: string, errors: Errors, props: React.InputHTMLAttributes<HTMLInputElement> = {}) {
  return (
    <input
      id={`o-${name}`}
      name={name}
      className="field"
      aria-invalid={errors[name] ? true : undefined}
      aria-describedby={errors[name] ? `o-${name}-err` : undefined}
      {...props}
    />
  );
}

function AddressFields({ prefix, errors, title }: { prefix: "pickup" | "dropoff"; errors: Errors; title: string }) {
  const who = prefix === "pickup" ? "Pickup" : "Recipient";
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Field name={`${prefix}_business`} label={prefix === "pickup" ? "Business name" : "Recipient business"} errors={errors}>
        {input(`${prefix}_business`, errors, { autoComplete: "organization" })}
      </Field>
      <Field name={`${prefix}_contact`} label={`${who} contact name`} errors={errors}>
        {input(`${prefix}_contact`, errors, { autoComplete: "off" })}
      </Field>
      <Field name={`${prefix}_phone`} label={`${who} phone`} errors={errors}>
        {input(`${prefix}_phone`, errors, { type: "tel", inputMode: "tel", autoComplete: "off" })}
      </Field>
      <Field name={`${prefix}_address`} label="Street address" errors={errors}>
        {input(`${prefix}_address`, errors, { autoComplete: "off" })}
      </Field>
      <Field name={`${prefix}_suite`} label="Suite or unit" errors={errors} optional>
        {input(`${prefix}_suite`, errors)}
      </Field>
      <div className="grid grid-cols-[1.4fr_1fr] gap-4">
        <Field name={`${prefix}_city`} label="City" errors={errors}>
          {input(`${prefix}_city`, errors, { defaultValue: "Las Vegas" })}
        </Field>
        <Field name={`${prefix}_zip`} label="ZIP" errors={errors}>
          {input(`${prefix}_zip`, errors, { inputMode: "numeric", maxLength: 10 })}
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor={`o-${prefix}_notes`} className="field-label">
          {title} instructions <span className="font-normal text-slate">(optional)</span>
        </label>
        <textarea id={`o-${prefix}_notes`} name={`${prefix}_notes`} rows={2} className="field" placeholder="Gate code, suite entrance, who to ask for" />
      </div>
    </div>
  );
}

const REQUIRED_TEXT: [string, string][] = [
  ["pickup_business", "Enter the pickup business name."],
  ["pickup_contact", "Enter a pickup contact name."],
  ["pickup_address", "Enter the pickup street address."],
  ["pickup_city", "Enter the pickup city."],
  ["dropoff_business", "Enter the recipient business."],
  ["dropoff_contact", "Enter the recipient's name."],
  ["dropoff_address", "Enter the drop-off street address."],
  ["dropoff_city", "Enter the drop-off city."],
  ["item_description", "Describe the item, e.g. \"sealed envelope\"."],
  ["customer_name", "Enter your name."],
];

export default function OrderForm() {
  const params = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const p = (k: string) => params.get(k);
  const [item, setItem] = useState<ItemType>(isItemType(p("item")) ? (p("item") as ItemType) : "envelope");
  const [speed, setSpeed] = useState<Speed>(isSpeed(p("speed")) ? (p("speed") as Speed) : "rush");
  const [distance, setDistance] = useState<Distance>(isDistance(p("distance")) ? (p("distance") as Distance) : "d1");
  const [itemCount, setItemCount] = useState<ItemCount>("one");
  const [afterHours, setAfterHours] = useState(false);
  const [declared, setDeclared] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [phase, setPhase] = useState<Phase>("editing");
  const [problem, setProblem] = useState("");

  const declaredValue = declared.trim() === "" ? null : Number(declared);
  const priceInput = { item, speed, distance, itemCount, afterHours, declaredValue: Number.isFinite(declaredValue) ? declaredValue : null };
  const reasons = useMemo(() => quoteReasons(priceInput), [item, speed, distance, itemCount, afterHours, declared]); // eslint-disable-line react-hooks/exhaustive-deps
  const price = priceFor(priceInput);

  function validate(form: HTMLFormElement): Errors {
    const d = new FormData(form);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    const e: Errors = {};
    for (const [k, msg] of REQUIRED_TEXT) if (!v(k)) e[k] = msg;
    for (const k of ["pickup_phone", "dropoff_phone", "customer_phone"]) if (!validPhone(v(k))) e[k] = "Enter a 10-digit phone number.";
    for (const k of ["pickup_zip", "dropoff_zip"]) if (!validZip(v(k))) e[k] = "Enter a 5-digit ZIP code.";
    if (!EMAIL_RE.test(v("customer_email"))) e.customer_email = "Enter a valid email address. Your receipt goes here.";
    if (speed === "sameDay" && !v("pickup_ready")) e.pickup_ready = "Choose when the item is ready for pickup.";
    if (declared.trim() !== "" && (!Number.isFinite(declaredValue) || (declaredValue as number) < 0)) e.declared_value = "Enter a dollar amount, or leave it empty.";
    if (!d.get("no_prohibited_items")) e.no_prohibited_items = "Confirm the item isn't on the prohibited list.";
    if (!d.get("agree_terms")) e.agree_terms = "Agree to the Terms of Use and Privacy Policy to continue.";
    return e;
  }

  function netlifyData(form: HTMLFormElement, extra: Record<string, string>) {
    const d = new FormData(form);
    d.set("form-name", "order");
    // A field named "email" makes Reply in the Netlify notification go to the customer.
    d.set("email", String(d.get("customer_email") ?? ""));
    d.set("item_type", ITEM_LABELS[item]);
    d.set("speed", SPEED_LABELS[speed]);
    d.set("distance_band", DISTANCE_LABELS[distance]);
    d.set("item_count", itemCount === "one" ? "One" : "More than one");
    d.set("after_hours", afterHours ? "Yes" : "No");
    d.set("quote_reasons", reasons.join(" "));
    for (const [k, val] of Object.entries(extra)) d.set(k, val);
    return d;
  }

  function checkForm(): HTMLFormElement | null {
    const form = formRef.current;
    if (!form) return null;
    const e = validate(form);
    setErrors(e);
    setProblem("");
    const first = Object.keys(e)[0];
    if (first) {
      setProblem(`Check ${Object.keys(e).length === 1 ? "1 field" : `${Object.keys(e).length} fields`} marked in red.`);
      form.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return null;
    }
    return form;
  }

  async function pay() {
    const form = checkForm();
    if (!form || price == null) return;
    setPhase("paying");
    try {
      const body = Object.fromEntries(new FormData(form).entries());
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, item_type: item, speed, distance_band: distance, item_count: itemCount, after_hours: afterHours }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; orderId?: string; price?: number; error?: string; fields?: Errors };
      if (!res.ok || !json.url || !json.orderId) {
        if (json.fields) setErrors(json.fields);
        throw new Error(json.error || "Payment couldn't start. Try again in a moment.");
      }
      // Notify Falcon through Netlify Forms; don't block payment if it fails.
      await submitNetlifyForm(
        netlifyData(form, {
          subject: `New order ${json.orderId}: $${json.price}, awaiting payment`,
          order_id: json.orderId,
          price: `$${json.price}`,
          request_type: "Pay now",
          payment_status: "Awaiting payment: dispatch only after Stripe's payment email",
        }),
      ).catch(() => undefined);
      // The thank-you page shows the Order ID after Stripe sends the customer back.
      try {
        sessionStorage.setItem(
          LAST_ORDER_KEY,
          JSON.stringify({ id: json.orderId, price: json.price, line: lineItemName(item, speed, distance), speed }),
        );
      } catch {
        // Private mode or storage blocked: the page still works, just without the Order ID.
      }
      window.location.assign(json.url);
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "Payment couldn't start. Try again in a moment.");
      setPhase("editing");
    }
  }

  const busy = phase === "paying";
  const payable = price != null;
  const quoteHref = `/contact?topic=quote&details=${encodeURIComponent(
    `${ITEM_LABELS[item]}, ${SPEED_LABELS[speed]}, ${DISTANCE_LABELS[distance]}${itemCount === "multiple" ? ", more than one item" : ""}${
      afterHours ? ", after hours / weekend / holiday" : ""
    }${declaredValue && declaredValue > INCLUDED_VALUE ? `, declared value $${declaredValue}` : ""}`,
  )}`;

  const summary = (
    <div className="rounded-xl bg-navy p-6 text-white">
      <h2 className="text-2xl">Your delivery</h2>
      <p className="mt-1 text-white/70">{lineItemName(item, speed, distance)}</p>
      {payable ? (
        <>
          <p key={price} className="price-tick mt-4 font-display text-7xl font-extrabold leading-none text-white">
            ${price}
          </p>
          <p className="mt-2 text-sm text-white/70">{SPEED_HINTS[speed]}. Covered up to ${INCLUDED_VALUE}.</p>
        </>
      ) : (
        <div className="mt-4">
          <p className="font-display text-3xl font-bold text-white">This delivery needs a custom quote</p>
          <ul className="mt-3 space-y-1 text-sm text-white/75">
            {reasons.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="mt-6 flex flex-col gap-3">
        {payable ? (
          <>
            <button type="button" onClick={pay} disabled={busy} className="btn btn-red w-full">
              {busy ? "Opening secure payment…" : `Pay $${price} Now`}
            </button>
            <p className="text-center text-xs text-white/60">Secure card payment by Stripe.</p>
          </>
        ) : (
          <>
            <Link href={quoteHref} className="btn btn-red w-full">
              Request a Quote
            </Link>
            <p className="text-center text-xs text-white/60">A short form. We email you the price and a payment link.</p>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
      <form
        ref={formRef}
        name="order"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (payable) pay();
        }}
        className="space-y-12"
      >
        <input type="hidden" name="form-name" value="order" />
        <p className="hidden">
          <label>
            Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        <fieldset className="space-y-6">
          <legend className="mb-6 flex items-center gap-3 text-3xl font-display font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-xl text-white">1</span> Delivery
          </legend>
          <div>
            <p className="field-label">What are we carrying?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["envelope", "medium", "big", "oversize"] as ItemType[]).map((v) => (
                <Radio key={v} name="item_type" value={v} current={item} onChange={setItem} label={ITEM_LABELS[v]} hint={v === "oversize" ? "Quote only" : undefined} />
              ))}
            </div>
          </div>
          <div>
            <p className="field-label">How fast?</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {(["rush", "sameDay"] as Speed[]).map((v) => (
                <Radio key={v} name="speed" value={v} current={speed} onChange={setSpeed} label={SPEED_LABELS[v]} hint={SPEED_HINTS[v]} />
              ))}
            </div>
          </div>
          <div>
            <p className="field-label">Driving distance, pickup to drop-off</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["d1", "d2", "d3", "over25"] as Distance[]).map((v) => (
                <Radio key={v} name="distance_band" value={v} current={distance} onChange={setDistance} label={DISTANCE_LABELS[v]} hint={v === "over25" ? "Quote only" : undefined} />
              ))}
            </div>
            <p className="mt-2 text-sm text-slate">Not sure? Check the driving distance in your maps app. If it falls in a higher band, we&apos;ll contact you before pickup.</p>
          </div>
          <div>
            <p className="field-label">Number of items</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <Radio name="item_count" value="one" current={itemCount} onChange={setItemCount} label="One item" />
              <Radio name="item_count" value="multiple" current={itemCount} onChange={setItemCount} label="More than one" hint="Quote only" />
            </div>
          </div>
          <label className="flex cursor-pointer items-start gap-3">
            <input type="checkbox" name="after_hours" value="Yes" checked={afterHours} onChange={(e) => setAfterHours(e.target.checked)} className="mt-1 h-5 w-5 accent-[#D22B24]" />
            <span>
              <span className="font-semibold">Needed after hours, on a weekend or holiday</span>
              <span className="block text-sm text-slate">Quote only</span>
            </span>
          </label>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="mb-6 flex items-center gap-3 text-3xl font-display font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-xl text-white">2</span> Pickup
          </legend>
          <AddressFields prefix="pickup" errors={errors} title="Pickup" />
          {speed === "sameDay" && (
            <Field name="pickup_ready" label="Ready for pickup at" errors={errors} className="max-w-sm">
              {input("pickup_ready", errors, { type: "datetime-local" })}
            </Field>
          )}
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="mb-6 flex items-center gap-3 text-3xl font-display font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-xl text-white">3</span> Drop-off
          </legend>
          <AddressFields prefix="dropoff" errors={errors} title="Delivery" />
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="mb-6 flex items-center gap-3 text-3xl font-display font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-xl text-white">4</span> Item
          </legend>
          <div className="grid gap-5 sm:grid-cols-[2fr_1fr]">
            <Field name="item_description" label="What is it?" errors={errors}>
              {input("item_description", errors, { placeholder: "e.g. sealed lab envelope, brake rotors" })}
            </Field>
            <Field name="declared_value" label="Declared value, USD" errors={errors} optional>
              {input("declared_value", errors, {
                type: "number",
                inputMode: "decimal",
                min: 0,
                value: declared,
                onChange: (e) => setDeclared(e.target.value),
              })}
            </Field>
          </div>
          <p className="text-sm text-slate">Every delivery is covered up to ${INCLUDED_VALUE}. Higher values are arranged by quote.</p>
        </fieldset>

        <fieldset className="space-y-6">
          <legend className="mb-6 flex items-center gap-3 text-3xl font-display font-bold">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red text-xl text-white">5</span> Your details
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="customer_name" label="Your name" errors={errors}>
              {input("customer_name", errors, { autoComplete: "name" })}
            </Field>
            <Field name="customer_company" label="Company" errors={errors} optional>
              {input("customer_company", errors, { autoComplete: "organization" })}
            </Field>
            <Field name="customer_email" label="Email" errors={errors}>
              {input("customer_email", errors, { type: "email", autoComplete: "email" })}
            </Field>
            <Field name="customer_phone" label="Phone" errors={errors}>
              {input("customer_phone", errors, { type: "tel", inputMode: "tel", autoComplete: "tel" })}
            </Field>
          </div>
          <div className="space-y-4">
            {[
              {
                name: "no_prohibited_items",
                text: (
                  <>
                    The item isn&apos;t on the{" "}
                    <Link href="/services#prohibited-title" className="text-red underline" target="_blank">
                      prohibited items list
                    </Link>
                    .
                  </>
                ),
              },
              {
                name: "agree_terms",
                text: (
                  <>
                    I agree to the{" "}
                    <Link href="/terms" className="text-red underline" target="_blank">
                      Terms of Use
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-red underline" target="_blank">
                      Privacy Policy
                    </Link>
                    .
                  </>
                ),
              },
            ].map((c) => (
              <div key={c.name}>
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name={c.name}
                    value="Yes"
                    aria-invalid={errors[c.name] ? true : undefined}
                    aria-describedby={errors[c.name] ? `o-${c.name}-err` : undefined}
                    className="mt-1 h-5 w-5 accent-[#D22B24]"
                  />
                  <span>{c.text}</span>
                </label>
                {errors[c.name] && (
                  <p id={`o-${c.name}-err`} className="field-error ml-8">
                    {errors[c.name]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </fieldset>

        {problem && (
          <p role="alert" className="rounded-md bg-red/10 p-4 font-semibold text-red-dark">
            {problem}
          </p>
        )}

        {/* Mobile: the summary sits at the end of the form */}
        <div className="lg:hidden">{summary}</div>
      </form>

      <aside className="hidden lg:sticky lg:top-24 lg:block">{summary}</aside>

      {/* Mobile sticky price bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-white/10 bg-navy px-4 py-3 text-white lg:hidden">
        <div>
          <p className="text-xs text-white/70">{payable ? "Your price" : "Custom quote"}</p>
          <p className="font-display text-3xl font-extrabold leading-none">{payable ? `$${price}` : "By quote"}</p>
        </div>
        {payable ? (
          <button type="button" onClick={pay} disabled={busy} className="btn btn-red">
            {busy ? "Working…" : `Pay $${price}`}
          </button>
        ) : (
          <Link href={quoteHref} className="btn btn-red">
            Request a Quote
          </Link>
        )}
      </div>
    </div>
  );
}
