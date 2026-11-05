"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Route } from "lucide-react";
import { submitNetlifyForm } from "@/lib/netlify-forms";
import { site } from "@/lib/site";
import { EMAIL_RE } from "@/lib/validate";

type Status = "idle" | "sending" | "sent" | "error";

const QUOTE = "Request a quote";
const OUT_OF_STATE = "Out-of-state delivery (California or Arizona)";
const TOPICS = ["General question", QUOTE, OUT_OF_STATE, "Recurring deliveries", "Large or long-distance delivery", "Other"];
// ?topic=… values that preselect a topic, e.g. /contact?topic=out-of-state
const TOPIC_PARAMS: Record<string, string> = { quote: QUOTE, "out-of-state": OUT_OF_STATE };

export default function ContactForm() {
  const params = useSearchParams();
  const details = (params.get("details") || "").slice(0, 300);
  const topicParam = params.get("topic") || "";
  const [topic, setTopic] = useState(TOPIC_PARAMS[topicParam] ?? TOPICS[0]);
  // A quote link clicked while already on /contact changes only the URL: follow it without clearing what was typed.
  const [appliedParam, setAppliedParam] = useState(topicParam);
  if (topicParam !== appliedParam) {
    setAppliedParam(topicParam);
    setTopic(TOPIC_PARAMS[topicParam] ?? TOPICS[0]);
  }
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentTo, setSentTo] = useState("");
  const [sentKind, setSentKind] = useState<"message" | "quote" | "outOfState">("message");
  const isOutOfState = topic === OUT_OF_STATE;
  const isQuote = topic === QUOTE || isOutOfState;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) || "").trim();
    const next: Record<string, string> = {};
    if (!v("name")) next.name = "Enter your name.";
    if (!EMAIL_RE.test(v("email"))) next.email = "Enter a valid email address.";
    if (!v("message"))
      next.message = isOutOfState
        ? "Tell us the pickup and drop-off cities and what we're carrying."
        : isQuote
          ? "Tell us about the delivery so we can price it."
          : "Write a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    // Subject line of the Netlify email notification
    const from = v("company") || v("name");
    data.set(
      "subject",
      isOutOfState ? `New out-of-state quote request (CA/AZ) from ${from}` : isQuote ? `New quote request from ${from}` : "New contact message",
    );
    setStatus("sending");
    try {
      await submitNetlifyForm(data);
      setSentTo(v("email"));
      setSentKind(isOutOfState ? "outOfState" : isQuote ? "quote" : "message");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border-l-4 border-green bg-sand p-8">
        <h2 className="text-3xl">
          {sentKind === "outOfState" ? "Out-of-state quote requested" : sentKind === "quote" ? "Quote requested" : "Message sent"}
        </h2>
        <p className="mt-2 text-lg">
          {sentKind === "message"
            ? `Thanks, we'll reply to ${sentTo} shortly.`
            : `Thanks, we'll email your quote to ${sentTo}, with a secure link to pay and confirm the delivery.`}
        </p>
        <p className="mt-2 text-[#2b3a4a]">
          In a hurry? Call{" "}
          <a href={site.phoneHref} className="font-semibold text-red underline underline-offset-4">
            {site.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const field = (name: string, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, optional = false) => (
    <div>
      <label htmlFor={`c-${name}`} className="field-label">
        {label} {optional && <span className="font-normal text-slate">(optional)</span>}
      </label>
      <input
        id={`c-${name}`}
        name={name}
        className="field"
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `c-${name}-err` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`c-${name}-err`} className="field-error">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <form name="contact" method="POST" data-netlify="true" netlify-honeypot="bot-field" onSubmit={onSubmit} noValidate className="space-y-5">
      <input type="hidden" name="form-name" value="contact" />
      <input type="hidden" name="subject" value="New contact message" />
      <p className="hidden">
        <label>
          Leave this empty: <input name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      {isOutOfState && (
        <div className="flex items-start gap-4 rounded-xl border-l-4 border-red bg-sand p-5 md:p-6">
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-white">
            <Route aria-hidden size={22} />
          </span>
          <div>
            <p className="font-display text-2xl font-bold leading-tight">Out-of-state delivery quote</p>
            <p className="mt-1 text-[#2b3a4a]">
              Special deliveries from Las Vegas to California and Arizona. Tell us the route below and we&apos;ll email you a price and a
              secure payment link. In a hurry? Call{" "}
              <a href={site.phoneHref} className="font-semibold text-red underline underline-offset-4">
                {site.phone}
              </a>
              .
            </p>
          </div>
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Your name", { autoComplete: "name" })}
        {field("company", "Company", { autoComplete: "organization" }, true)}
        {field("email", "Email", { type: "email", autoComplete: "email" })}
        {field("phone", "Phone", { type: "tel", autoComplete: "tel" }, !isQuote)}
      </div>
      <div>
        <label htmlFor="c-topic" className="field-label">
          Topic
        </label>
        <select id="c-topic" name="topic" className="field" value={topic} onChange={(e) => setTopic(e.target.value)}>
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">
          {isQuote ? "About the delivery" : "Message"}
        </label>
        {isQuote && (
          <p id="c-message-hint" className="mb-2 text-sm text-slate">
            {isOutOfState
              ? "Include the pickup address or city, the drop-off city and state, what we're carrying with its size and weight, and when it needs to arrive."
              : "Include pickup and drop-off (address or area), what we're carrying with its size and weight, and when you need it."}
          </p>
        )}
        <textarea
          id="c-message"
          name="message"
          rows={6}
          className="field"
          defaultValue={details ? `Quote for: ${details}\n\nPickup: \nDrop-off: \nWhen: ` : ""}
          placeholder={
            isOutOfState ? "Example: Pickup in Las Vegas, NV 89119. Drop-off in Phoenix, AZ 85004. Two boxes, about 40 lb in total. Needed by Friday noon." : undefined
          }
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={[isQuote ? "c-message-hint" : "", errors.message ? "c-message-err" : ""].filter(Boolean).join(" ") || undefined}
        />
        {errors.message && (
          <p id="c-message-err" className="field-error">
            {errors.message}
          </p>
        )}
      </div>
      {status === "error" && (
        <p role="alert" className="rounded-md bg-red/10 p-4 text-red-dark">
          Your message didn&apos;t send. Check your connection and try again, or call us at {site.phone}.
        </p>
      )}
      <button type="submit" className="btn btn-red" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : isOutOfState ? "Request Out-of-State Quote" : isQuote ? "Request a Quote" : "Send message"}
      </button>
    </form>
  );
}
