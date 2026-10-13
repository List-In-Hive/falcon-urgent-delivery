import type { Distance, ItemType, Speed } from "./pricing";

export interface Address {
  business: string;
  contact: string;
  phone: string;
  address: string;
  suite: string;
  city: string;
  zip: string;
  notes: string;
}

export type OrderStatus = "awaiting_payment" | "paid" | "picked_up" | "delivered";

export interface Order {
  id: string;
  createdAt: string;
  source: "online" | "manual";
  status: OrderStatus;
  paid: boolean;
  item: ItemType | null;
  speed: Speed | null;
  distance: Distance | null;
  price: number | null;
  pickupReady: string;
  pickup: Address;
  dropoff: Address;
  itemDescription: string;
  declaredValue: number | null;
  customer: { name: string; company: string; email: string; phone: string };
  stripeSessionId?: string;
  paidAt?: string;
  pickedUpAt?: string;
  deliveredAt?: string;
  recipientName?: string;
  deliveryNote?: string;
  photoId?: string;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  awaiting_payment: "Awaiting payment",
  paid: "Paid, ready for pickup",
  picked_up: "Picked up",
  delivered: "Delivered",
};
