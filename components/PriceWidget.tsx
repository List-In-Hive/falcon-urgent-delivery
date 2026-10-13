"use client";

import Link from "next/link";
import { useId, useState } from "react";
import {
  DISTANCE_LABELS,
  ITEM_SHORT,
  SPEED_LABELS,
  priceFor,
  type Distance,
  type ItemType,
  type Speed,
} from "@/lib/pricing";

type Option<T extends string> = { value: T; label: string; hint?: string };

function Segmented<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
}: {
  legend: string;
  name: string;
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-[0.9375rem] font-semibold text-navy">{legend}</legend>
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((o) => {
          const checked = o.value === value;
          return (
            <label
              key={o.value}
              className={`relative flex min-h-[3.25rem] cursor-pointer flex-col items-center justify-center rounded-md border-[1.5px] px-1.5 py-1.5 text-center leading-tight transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-red ${
                checked ? "border-navy bg-navy text-white" : "border-line bg-white text-navy hover:border-navy/50"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span className="font-display text-[1.0625rem] font-bold">{o.label}</span>
              {o.hint && <span className={`text-xs ${checked ? "text-white/75" : "text-slate"}`}>{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function PriceWidget() {
  const uid = useId();
  const [item, setItem] = useState<Exclude<ItemType, "oversize">>("envelope");
  const [speed, setSpeed] = useState<Speed>("rush");
  const [distance, setDistance] = useState<Exclude<Distance, "over25">>("d1");
  const price = priceFor({ item, speed, distance }) as number;
  const href = `/order?item=${item}&speed=${speed}&distance=${distance}`;

  return (
    <section
      aria-labelledby={`${uid}-title`}
      className="relative rounded-xl bg-white text-navy shadow-[0_30px_60px_-20px_rgba(0,0,0,0.55)]"
    >
      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
          <h2 id={`${uid}-title`} className="text-[1.75rem]">
            Price your delivery
          </h2>
          <span className="text-sm text-slate">Flat price, no waiting fees</span>
        </div>
        <Segmented
          legend="What are we carrying?"
          name={`${uid}-item`}
          value={item}
          onChange={setItem}
          options={[
            { value: "envelope", label: "Envelope", hint: "any size" },
            { value: "medium", label: "Medium box", hint: "up to 25 lb" },
            { value: "big", label: "Big box", hint: "25–50 lb" },
          ]}
        />
        <Segmented
          legend="How fast?"
          name={`${uid}-speed`}
          value={speed}
          onChange={setSpeed}
          options={[
            { value: "rush", label: "Rush", hint: "60–90 min" },
            { value: "sameDay", label: "Same Day", hint: "order by 2 PM" },
          ]}
        />
        <Segmented
          legend="Driving distance, pickup to drop-off"
          name={`${uid}-distance`}
          value={distance}
          onChange={setDistance}
          options={[
            { value: "d1", label: "0–7.5 mi" },
            { value: "d2", label: "7.5–15 mi" },
            { value: "d3", label: "15–25 mi" },
          ]}
        />
      </div>

      {/* Tear-off line: the ticket stub */}
      <div className="relative h-0 border-t-2 border-dashed border-line" aria-hidden>
        <span className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-navy" />
        <span className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-navy" />
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 p-5 sm:p-6">
        <div aria-live="polite">
          <p className="text-sm text-slate">
            {SPEED_LABELS[speed]}, {ITEM_SHORT[item]}, {DISTANCE_LABELS[distance]}
          </p>
          <p key={price} className="price-tick font-display text-[4.25rem] font-extrabold leading-none text-red">
            ${price}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:items-end">
          <Link href={href} className="btn btn-red w-full sm:w-auto">
            Book this delivery
          </Link>
          <Link href="/contact?topic=quote" className="text-center text-sm text-slate underline underline-offset-4 hover:text-navy">
            Heavier, farther or after hours? Request a quote
          </Link>
        </div>
      </div>
    </section>
  );
}
