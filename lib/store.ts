// Order and photo storage. On Netlify this uses Netlify Blobs; anywhere else (local dev) it
// falls back to files in ./.data so the whole flow can be tested without Netlify.
import { getStore } from "@netlify/blobs";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { Order } from "./order-types";

type Kind = "orders" | "photos";

function blobStore(kind: Kind) {
  try {
    return getStore({ name: kind, consistency: "strong" });
  } catch {
    return null; // No Netlify Blobs context (local dev)
  }
}

const DATA_DIR = path.join(process.cwd(), ".data");
const fileFor = (kind: Kind, key: string) => path.join(DATA_DIR, kind, key.replace(/[^A-Za-z0-9_-]/g, "_"));

export async function saveOrder(order: Order): Promise<void> {
  const store = blobStore("orders");
  if (store) {
    await store.setJSON(order.id, order);
    return;
  }
  await fs.mkdir(path.join(DATA_DIR, "orders"), { recursive: true });
  await fs.writeFile(fileFor("orders", order.id) + ".json", JSON.stringify(order, null, 2));
}

export async function getOrder(id: string): Promise<Order | null> {
  const store = blobStore("orders");
  if (store) return ((await store.get(id, { type: "json" })) as Order | null) ?? null;
  try {
    return JSON.parse(await fs.readFile(fileFor("orders", id) + ".json", "utf8")) as Order;
  } catch {
    return null;
  }
}

export async function updateOrder(id: string, patch: Partial<Order>): Promise<Order | null> {
  const current = await getOrder(id);
  if (!current) return null;
  const next = { ...current, ...patch, id: current.id };
  await saveOrder(next);
  return next;
}

export async function savePhoto(id: string, bytes: ArrayBuffer, contentType: string): Promise<void> {
  const store = blobStore("photos");
  if (store) {
    await store.set(id, bytes, { metadata: { contentType } });
    return;
  }
  await fs.mkdir(path.join(DATA_DIR, "photos"), { recursive: true });
  await fs.writeFile(fileFor("photos", id), Buffer.from(bytes));
  await fs.writeFile(fileFor("photos", id) + ".type", contentType);
}

export async function getPhoto(id: string): Promise<{ bytes: ArrayBuffer; contentType: string } | null> {
  const store = blobStore("photos");
  if (store) {
    const res = await store.getWithMetadata(id, { type: "arrayBuffer" });
    if (!res) return null;
    return { bytes: res.data, contentType: String(res.metadata?.contentType || "image/jpeg") };
  }
  try {
    const buf = await fs.readFile(fileFor("photos", id));
    const contentType = await fs.readFile(fileFor("photos", id) + ".type", "utf8").catch(() => "image/jpeg");
    return { bytes: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer, contentType };
  } catch {
    return null;
  }
}
