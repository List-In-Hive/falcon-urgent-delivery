"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { submitNetlifyForm } from "@/lib/netlify-forms";
import { EMAIL_RE } from "@/lib/validate";

type Status = "idle" | "sending" | "sent" | "error";

const QUOTE = "Request a quote";
const TOPICS = ["General question", QUOTE, "Recurring deliveries", "Large or long-distance delivery", "Other"];

export default function ContactForm() {
  const params = useSearchParams();
  const details = (params.get("details") || "").slice(0, 300);
  const [topic, setTopic] = useState(params.get("topic") === "quote" ? QUOTE : TOPICS[0]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sentTo, setSentTo] = useState("");
  const [sentQuote, setSentQuote] = useState(false);
  const isQuote = topic === QUOTE;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) || "").trim();
    const next: Record<string, string> = {};
    if (!v("name")) next.name = "Enter your name.";
    if (!EMAIL_RE.test(v("email"))) next.email = "Enter a valid email address.";
    if (!v("message")) next.message = isQuote ? "Tell us about the delivery so we can price it." : "Write a short message.";
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>(`[name="${Object.keys(next)[0]}"]`)?.focus();
      return;
    }
    // Subject line of the Netlify email notification
    data.set("subject", isQuote ? `New quote request from ${v("company") || v("name")}` : "New contact message");
    setStatus("sending");
    try {
      await submitNetlifyForm(data);
      setSentTo(v("email"));
      setSentQuote(isQuote);
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-xl border-l-4 border-green bg-sand p-8">
        <h2 className="text-3xl">{sentQuote ? "Quote requested" : "Message sent"}</h2>
        <p className="mt-2 text-lg">
          {sentQuote
            ? `Thanks, we'll email your quote to ${sentTo}, with a secure link to pay and confirm the delivery.`
            : `Thanks, we'll reply to ${sentTo} shortly.`}
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
            Include pickup and drop-off (address or area), what we&apos;re carrying with its size and weight, and when you need it.
          </p>
        )}
        <textarea
          id="c-message"
          name="message"
          rows={6}
          className="field"
          defaultValue={details ? `Quote for: ${details}\n\nPickup: \nDrop-off: \nWhen: ` : ""}
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
          Your message didn&apos;t send. Check your connection and try again, or email us directly.
        </p>
      )}
      <button type="submit" className="btn btn-red" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : isQuote ? "Request a Quote" : "Send message"}
      </button>
    </form>
  );
}
