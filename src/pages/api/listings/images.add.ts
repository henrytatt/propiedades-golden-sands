import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  try {
    const me = await getUserFromRequest(req);
    if (!me) return res.status(401).json({ error: "No autorizado" });

    const { listingId, url } = req.body || {};
    if (!listingId || !url) return res.status(400).json({ error: "Faltan campos" });

    const ownerOk = await prisma.listing.findFirst({ where: { id: String(listingId), ownerId: me.id }, select: { id: true }});
    if (!ownerOk) return res.status(404).json({ error: "No encontrada o no es tuya" });

    const count = await prisma.listingImage.count({ where: { listingId: String(listingId) }});
    if (count >= 10) return res.status(400).json({ error: "Máximo 10 imágenes" });

    const created = await prisma.listingImage.create({
      data: { listingId: String(listingId), url: String(url), order: count }
    });

    return res.status(200).json({ ok:true, item: created });
  } catch (e) {
    console.error("listings/images/add", e);
    return res.status(500).json({ error: "SERVER" });
  }
}
