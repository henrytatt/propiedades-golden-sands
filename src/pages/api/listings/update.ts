import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ error: "No autorizado" });

  const { id, title, location, priceUsd, image, description } = req.body || {};
  if (!id || !title) return res.status(400).json({ error: "Faltan campos requeridos (id, title)" });

  // Asegurar que el usuario sea dueño
  const current = await prisma.listing.findUnique({ where: { id } });
  if (!current || (current.ownerId && current.ownerId !== me.id)) {
    return res.status(403).json({ error: "No autorizado para editar esta publicación" });
  }

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: String(title),
      location: location ? String(location) : null,
      priceUsd: priceUsd == null || priceUsd === "" ? null : Number(priceUsd),
      image: image ? String(image) : null,
      description: description ? String(description) : null
    },
    select: { id: true }
  });

  return res.status(200).json({ ok: true, id: updated.id });
}
