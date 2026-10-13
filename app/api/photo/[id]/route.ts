import { getPhoto } from "@/lib/store";

export const runtime = "nodejs";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

/** Delivery photo by its random ID (linked from the proof-of-delivery email). */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) return new Response("Not found", { status: 404 });
  const photo = await getPhoto(id);
  if (!photo) return new Response("Not found", { status: 404 });
  return new Response(photo.bytes, {
    headers: {
      "Content-Type": photo.contentType,
      "Cache-Control": "private, max-age=86400",
      "X-Robots-Tag": "noindex",
    },
  });
}
