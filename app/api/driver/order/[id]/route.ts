import { NextResponse } from "next/server";
import { isDriver } from "@/lib/driver-auth";
import { getOrder } from "@/lib/store";
import { isOrderId } from "@/lib/order-id";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isDriver())) return NextResponse.json({ error: "Sign in again." }, { status: 401 });
  const { id } = await params;
  const orderId = decodeURIComponent(id).trim().toUpperCase();
  if (!isOrderId(orderId)) return NextResponse.json({ error: "Order IDs look like FUD-261013-AB12." }, { status: 400 });
  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: `No order found with ID ${orderId}.` }, { status: 404 });
  return NextResponse.json({ order });
}
