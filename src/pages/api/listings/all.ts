import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const list = await prisma.listing.findMany({
      orderBy: { createdAt: "desc" },
      include: { owner: { select: { name: true } } }
    });
    return res.status(200).json({ ok: true, listings: list });
  } catch (e:any) {
    console.error("listings/all error", e);
    return res.status(500).json({ ok: false, error: "SERVER" });
  }
}
