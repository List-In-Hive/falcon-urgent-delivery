import { NextResponse } from "next/server";
import { DRIVER_COOKIE, driverConfigured, newSessionValue, pinMatches } from "@/lib/driver-auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!driverConfigured()) {
    return NextResponse.json(
      { error: "The driver page isn't set up yet. Add DRIVER_PIN and DRIVER_SESSION_SECRET in Netlify." },
      { status: 503 },
    );
  }
  const { pin } = (await req.json().catch(() => ({}))) as { pin?: unknown };
  if (typeof pin !== "string" || !pinMatches(pin.trim())) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return NextResponse.json({ error: "That PIN didn't match. Try again." }, { status: 401 });
  }
  const { value, maxAge } = newSessionValue();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DRIVER_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge,
  });
  return res;
}
