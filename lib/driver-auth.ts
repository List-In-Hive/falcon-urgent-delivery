import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const DRIVER_COOKIE = "fud_driver";
const TTL_SECONDS = 12 * 60 * 60;

function secret() {
  const s = process.env.DRIVER_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("DRIVER_SESSION_SECRET must be set (16+ characters).");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export function pinMatches(pin: string) {
  const expected = process.env.DRIVER_PIN;
  if (!expected) return false;
  return safeEqual(pin, expected);
}

export function driverConfigured() {
  return Boolean(process.env.DRIVER_PIN && process.env.DRIVER_SESSION_SECRET && process.env.DRIVER_SESSION_SECRET.length >= 16);
}

export function newSessionValue() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL_SECONDS);
  return { value: `${exp}.${sign(exp)}`, maxAge: TTL_SECONDS };
}

export async function isDriver(): Promise<boolean> {
  if (!driverConfigured()) return false;
  const raw = (await cookies()).get(DRIVER_COOKIE)?.value;
  if (!raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}
