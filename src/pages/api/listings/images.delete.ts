import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST" && req.method !== "DELETE") return res.status(405).json({ error: "Method not allowed" });
  try {
    const me = await getUserFromRequest(req);
    if (!me) return res.status(401).json({ error: "No autorizado" });

    const { id } = req.body || {};
    if (!id) return res.status(400).json({ error: "Falta id" });

    // Verificar que la imagen pertenezca a un listing del usuario
    const img = await prisma.listingImage.findUnique({ where: { id: String(id) }});
    if (!img) return res.status(404).json({ error: "No encontrada" });

    const ownerOk = await prisma.listing.findFirst({ where: { id: img.listingId, ownerId: me.id }, select: { id:true }});
    if (!ownerOk) return res.status(403).json({ error: "No autorizado" });

    await prisma.listingImage.delete({ where: { id: img.id }});
    return res.status(200).json({ ok:true });
  } catch (e) {
    console.error("listings/images/delete", e);
    return res.status(500).json({ error: "SERVER" });
  }
}
