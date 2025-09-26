import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const me = await getUserFromRequest(req);
    if (!me) return res.status(401).json({ error: "No autorizado" });

    const id = String(req.query.id || "");
    if (!id) return res.status(400).json({ error: "Falta id" });

    const ownerOk = await prisma.listing.findFirst({ where: { id, ownerId: me.id }, select: { id: true }});
    if (!ownerOk) return res.status(404).json({ error: "No encontrada o no es tuya" });

    const images = await prisma.listingImage.findMany({
      where: { listingId: id },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id:true, url:true, order:true }
    });
    return res.status(200).json({ ok:true, items: images });
  } catch (e) {
    console.error("listings/images GET", e);
    return res.status(500).json({ error: "SERVER" });
  }
}
