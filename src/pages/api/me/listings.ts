import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const me = await getUserFromRequest(req);
    if (!me) return res.status(401).json({ error: "No autorizado" });

    const list = await prisma.listing.findMany({
      where: { ownerId: me.id },
      orderBy: { createdAt: "desc" },
      select: { id:true, title:true, location:true, priceUsd:true, image:true, createdAt:true }
    });

    return res.status(200).json({ ok:true, items: list });
  } catch (e) {
    console.error("me/listings error:", e);
    return res.status(500).json({ error: "SERVER" });
  }
}
