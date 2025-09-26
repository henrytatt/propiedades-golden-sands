import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "method" });
  try {
    const { listingId, urls } = (req.body || {}) as { listingId?: string; urls?: string[] };
    if (!listingId || !Array.isArray(urls) || urls.length === 0) {
      return res.status(400).json({ error: "listingId y urls requeridos" });
    }

    // Confirmar que el listing existe
    const listing = await prisma.listing.findUnique({ where: { id: listingId }, select: { id: true } });
    if (!listing) return res.status(404).json({ error: "listing no existe" });

    // Contar cuántas tiene
    const existing = await prisma.listingImage.count({ where: { listingId } });
    const left = 10 - existing;
    if (left <= 0) return res.status(400).json({ error: "Límite alcanzado (10)" });

    const toAdd = urls.filter(Boolean).slice(0, left);

    // Crear una a una en transacción para máxima compatibilidad
    await prisma.$transaction(
      toAdd.map((u, idx) =>
        prisma.listingImage.create({
          data: { url: u, order: existing + idx, listingId },
        })
      )
    );

    return res.json({ ok: true, added: toAdd.length });
  } catch (e: any) {
    console.error("add-image error:", e?.message, e?.stack);
    return res.status(500).json({ error: e?.message || "server" });
  }
}
