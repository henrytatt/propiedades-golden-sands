import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "@/lib/session";
import { getPrisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ error: "No autorizado" });

  const prisma = getPrisma();
  const list = await prisma.listing.findMany({
    where: { ownerId: me.id },
    orderBy: { createdAt: "desc" }
  });

  return res.status(200).json({ ok: true, listings: list });
}

