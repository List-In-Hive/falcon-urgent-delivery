import type { Address } from "./order-types";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function clean(v: unknown, max = 500): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export function validPhone(v: string) {
  return v.replace(/\D/g, "").length >= 10;
}

export function validZip(v: string) {
  return /^\d{5}(-\d{4})?$/.test(v);
}

type Errors = Record<string, string>;

export function readAddress(src: Record<string, unknown>, prefix: "pickup" | "dropoff"): Address {
  return {
    business: clean(src[`${prefix}_business`], 120),
    contact: clean(src[`${prefix}_contact`], 120),
    phone: clean(src[`${prefix}_phone`], 40),
    address: clean(src[`${prefix}_address`], 200),
    suite: clean(src[`${prefix}_suite`], 60),
    city: clean(src[`${prefix}_city`], 80),
    zip: clean(src[`${prefix}_zip`], 10),
    notes: clean(src[`${prefix}_notes`], 500),
  };
}

export function checkAddress(a: Address, prefix: string, errors: Errors) {
  if (!a.business) errors[`${prefix}_business`] = "Enter the business name.";
  if (!a.contact) errors[`${prefix}_contact`] = "Enter a contact name.";
  if (!validPhone(a.phone)) errors[`${prefix}_phone`] = "Enter a 10-digit phone number.";
  if (!a.address) errors[`${prefix}_address`] = "Enter the street address.";
  if (!a.city) errors[`${prefix}_city`] = "Enter the city.";
  if (!validZip(a.zip)) errors[`${prefix}_zip`] = "Enter a 5-digit ZIP code.";
}
