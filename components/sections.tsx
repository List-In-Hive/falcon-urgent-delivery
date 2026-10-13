import Link from "next/link";
import {
  Check,
  FileText,
  FlaskConical,
  Pill,
  Scale,
  Smile,
  Stethoscope,
  Wrench,
} from "lucide-react";
import { industries, publishedTestimonials } from "@/lib/content";
import { DISTANCE_LABELS, ITEM_LABELS, PRICES } from "@/lib/pricing";
import { prohibitedItems } from "@/lib/site";

export function PageHero({ title, intro, children }: { title: string; intro?: string; children?: React.ReactNode }) {
  return (
    <section className="edge-angle bg-navy pb-20 pt-12 text-white md:pb-28 md:pt-16">
      <div className="container-x">
        <h1 className="max-w-4xl text-[2.75rem] sm:text-6xl md:text-7xl">{title}</h1>
        {intro && <p className="mt-5 max-w-2xl text-lg text-white/80 md:text-xl">{intro}</p>}
        {children}
      </div>
    </section>
  );
}

export function SectionHeading({ title, intro, id }: { title: string; intro?: string; id?: string }) {
  return (
    <div className="mb-10 max-w-3xl">
      <h2 id={id} className="text-4xl md:text-5xl">
        {title}
      </h2>
      {intro && <p className="mt-4 text-lg text-slate">{intro}</p>}
    </div>
  );
}

const services = [
  {
    time: "60–90 min",
    name: "Rush / Urgent",
    price: "from $49",
    text: "We come now. Picked up and delivered within 60 to 90 minutes, anywhere in our area.",
  },
  {
    time: "Same day",
    name: "Same Day",
    price: "from $39",
    text: "Order by 2 PM and it's delivered by the end of the business day. The lower price for anything that can wait a few hours.",
  },
  {
    time: "Any hour",
    name: "After-Hours & Weekend",
    price: "by quote",
    text: "Night, weekend, holiday and emergency runs. Tell us what you need and we'll confirm the price.",
  },
  {
    time: "Your route",
    name: "Custom Courier",
    price: "by quote",
    text: "Recurring runs, several stops and round trips, set up around how your business works.",
  },
];

export function ServicesList() {
  return (
    <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
      {services.map((s) => (
        <li key={s.name} className="flex gap-5 bg-white p-6 md:p-8">
          <div className="w-28 shrink-0 border-r-2 border-red pr-4 font-display text-[1.75rem] font-extrabold leading-none text-navy sm:w-32 sm:text-[2rem]">
            {s.time}
          </div>
          <div>
            <h3 className="text-2xl">
              {s.name} <span className="ml-1 font-sans text-base font-semibold text-red">{s.price}</span>
            </h3>
            <p className="mt-2 text-[#2b3a4a]">{s.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

const industryIcons: Record<string, typeof Stethoscope> = {
  stethoscope: Stethoscope,
  flask: FlaskConical,
  scale: Scale,
  wrench: Wrench,
  smile: Smile,
  pill: Pill,
  file: FileText,
};

export function Industries({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className={`grid gap-x-8 gap-y-6 ${detailed ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"}`}>
      {industries.map((i) => {
        const Icon = industryIcons[i.icon] ?? FileText;
        return (
          <li key={i.name} className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-sand text-navy">
              <Icon aria-hidden size={22} strokeWidth={1.75} />
            </span>
            <span>
              <span className="block font-semibold leading-snug">{i.name}</span>
              {detailed && <span className="mt-1 block text-[0.9375rem] text-slate">{i.line}</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const steps = [
  { title: "Get your price and book", text: "Pick the item, speed and distance. See the price and pay online, or request a quote." },
  { title: "We pick up", text: "Rush orders are picked up and delivered within 60 to 90 minutes. Same Day by end of day." },
  { title: "Delivered, with proof", text: "You get an email with a photo, the time and the name of the person who received it." },
];

export function HowItWorks() {
  return (
    <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
      <span aria-hidden className="absolute left-[1.375rem] top-12 bottom-12 border-l-2 border-dashed border-red/50 md:hidden" />
      <span aria-hidden className="absolute left-12 right-12 top-[1.375rem] hidden border-t-2 border-dashed border-red/50 md:block" />
      {steps.map((s, i) => (
        <li key={s.title} className="relative flex gap-5 md:block">
          <span className="relative z-10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red font-display text-2xl font-extrabold text-white ring-8 ring-sand">
            {i + 1}
          </span>
          <div className="md:mt-5">
            <h3 className="text-[1.75rem]">{s.title}</h3>
            <p className="mt-2 max-w-sm text-[#2b3a4a]">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export const reasons = [
  "On time, every time",
  "10 years of experience",
  "Air-conditioned van, so items stay cool in the Las Vegas heat",
  "Photo proof of every delivery",
  "Licensed & insured",
  "No waiting-time fees",
  "After-hours and weekend service",
];

export function CheckList({ items, dark = false }: { items: string[]; dark?: boolean }) {
  return (
    <ul className="space-y-3.5">
      {items.map((r) => (
        <li key={r} className="flex items-start gap-3">
          <span className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red text-white">
            <Check aria-hidden size={16} strokeWidth={3} />
          </span>
          <span className={`text-lg ${dark ? "text-white" : ""}`}>{r}</span>
        </li>
      ))}
    </ul>
  );
}

export function TestimonialsGrid() {
  if (!publishedTestimonials.length) {
    return (
      <div className="rounded-xl border-2 border-dashed border-line p-8 text-center">
        <p className="font-display text-2xl font-bold">Reviews from our first customers are on the way.</p>
        <p className="mx-auto mt-2 max-w-xl text-slate">
          We just opened for business. Book a delivery and see the service for yourself.
        </p>
      </div>
    );
  }
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {publishedTestimonials.map((t) => (
        <li key={t.name}>
          <figure className="flex h-full flex-col rounded-xl bg-white p-7 ring-1 ring-line">
            <p className="border-l-4 border-red pl-3 font-display text-xl font-bold leading-tight text-navy">{t.service}</p>
            <span aria-hidden className="mt-5 font-display text-6xl leading-none text-red">
              “
            </span>
            <blockquote className="-mt-4 flex-1 text-[1.0625rem] leading-relaxed text-[#2b3a4a]">{t.quote}</blockquote>
            <figcaption className="mt-6 border-t border-line pt-4 text-lg font-semibold">
              {t.name}
              {t.company && <span className="block text-base font-normal text-slate">{t.company}</span>}
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title = "Need it there in the next 90 minutes?", text }: { title?: string; text?: string }) {
  return (
    <section className="bg-red text-white">
      <div className="container-x flex flex-col items-start justify-between gap-6 py-14 md:flex-row md:items-center">
        <div>
          <h2 className="text-4xl md:text-5xl">{title}</h2>
          {text && <p className="mt-3 max-w-xl text-white/90">{text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/order" className="btn bg-navy text-white hover:bg-navy-2">
            Get a Price &amp; Book
          </Link>
          <Link href="/contact?topic=quote" className="btn btn-ghost-light">
            Request a Quote
          </Link>
        </div>
      </div>
    </section>
  );
}

export function PriceTable() {
  const rows: { item: keyof typeof PRICES }[] = [{ item: "envelope" }, { item: "medium" }, { item: "big" }];
  const bands = ["d1", "d2", "d3"] as const;
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-line">
      <table className="w-full min-w-[36rem] border-collapse text-left">
        <caption className="sr-only">Flat prices in US dollars by item, speed and driving distance</caption>
        <thead>
          <tr className="bg-navy text-white">
            <th scope="col" className="px-4 py-3 font-display text-lg font-bold">Item</th>
            <th scope="col" className="px-4 py-3 font-display text-lg font-bold">Speed</th>
            {bands.map((b) => (
              <th key={b} scope="col" className="px-4 py-3 text-right font-display text-lg font-bold">
                {DISTANCE_LABELS[b]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.flatMap(({ item }, ri) =>
            (["rush", "sameDay"] as const).map((speed, si) => (
              <tr key={`${item}-${speed}`} className={ri % 2 ? "bg-sand/60" : "bg-white"}>
                {si === 0 && (
                  <th scope="rowgroup" rowSpan={2} className="border-b border-line px-4 py-3 align-top font-semibold">
                    {ITEM_LABELS[item]}
                  </th>
                )}
                <td className={`px-4 py-3 ${si === 1 ? "border-b border-line" : ""}`}>{speed === "rush" ? "Rush / Urgent" : "Same Day"}</td>
                {PRICES[item][speed].map((p, i) => (
                  <td
                    key={i}
                    className={`px-4 py-3 text-right font-display text-2xl font-bold tabular-nums ${si === 1 ? "border-b border-line" : ""} ${
                      speed === "rush" ? "text-red" : "text-navy"
                    }`}
                  >
                    ${p}
                  </td>
                ))}
              </tr>
            )),
          )}
        </tbody>
      </table>
    </div>
  );
}

export function ProhibitedList() {
  return (
    <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {prohibitedItems.map((p) => (
        <li key={p} className="flex items-center gap-3">
          <span aria-hidden className="h-[3px] w-4 shrink-0 bg-red" />
          {p}
        </li>
      ))}
    </ul>
  );
}
