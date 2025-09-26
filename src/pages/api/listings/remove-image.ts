import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { listingId, url }:{ listingId:string, url:string } = req.body || {};
    if (!listingId || !url) return res.status(400).json({ error: "params" });

    await prisma.listingImage.deleteMany({ where: { listingId, url } });

    const all = await prisma.listingImage.findMany({
      where: { listingId },
      orderBy: { order: "asc" }
    });
    await Promise.all(all.map((img, i) =>
      prisma.listingImage.update({ where: { id: img.id }, data: { order: i } })
    ));

    return res.json({ ok: true });
  } catch (e:any) {
    return res.status(500).json({ error: e?.message || "server" });
  }
}
