import { NextResponse } from "next/server";
import { driverConfigured, isDriver } from "@/lib/driver-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ configured: driverConfigured(), authenticated: await isDriver() });
}
