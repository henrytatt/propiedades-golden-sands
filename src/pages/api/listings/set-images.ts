import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";
import { MAX_LISTING_IMAGES } from "@/lib/constants";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ error: "No autorizado" });

  const { listingId, images }:{ listingId?: string; images?: string[] } = req.body || {};
  if (!listingId || !Array.isArray(images)) {
    return res.status(400).json({ error: "listingId y images:string[] son requeridos" });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: String(listingId) }, select: { ownerId: true }
  });
  if (!listing) return res.status(404).json({ error: "Publicación no existe" });
  if (listing.ownerId !== me.id) return res.status(403).json({ error: "No eres el dueño" });

  const urls = images.map(String).filter(Boolean).slice(0, MAX_LISTING_IMAGES);

  const result = await prisma.$transaction(async (tx) => {
    await tx.listingImage.deleteMany({ where: { listingId: String(listingId) }});
    if (urls.length) {
      await tx.listingImage.createMany({
        data: urls.map((u, i) => ({ listingId: String(listingId), url: u, order: i })),
      });
    }
    return tx.listingImage.findMany({
      where: { listingId: String(listingId) },
      orderBy: { order: "asc" },
    });
  });

  return res.status(200).json({ ok: true, images: result, max: MAX_LISTING_IMAGES });
}
