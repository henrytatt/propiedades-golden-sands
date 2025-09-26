import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

/**
 * Crea un Listing y luego inserta la galería con ListingImage.createMany.
 * Evita nested-write (images: {...}) para no depender de versiones del Client.
 *
 * Body esperado:
 * {
 *   title: string,
 *   location?: string,
 *   priceUsd?: number|string,
 *   image?: string,           // portada (URL /uploads/... o http...)
 *   description?: string|null,
 *   images?: (string | {url:string, order?:number})[]
 * }
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "METHOD" });

  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ ok: false, error: "AUTH" });

  try {
    const { title, location, priceUsd, image, description, images } = (req.body || {}) as {
      title?: string;
      location?: string;
      priceUsd?: number | string;
      image?: string | null;
      description?: string | null;
      images?: Array<string | { url: string; order?: number }>;
    };

    if (!title || !String(title).trim()) {
      return res.status(400).json({ ok: false, error: "TITLE" });
    }

    // Normalizar precio
    const price = priceUsd == null ? null : Number(priceUsd);
    const priceOk = Number.isFinite(price) ? Number(price) : null;

    // 1) Crear listing (sin nested images)
    const created = await prisma.listing.create({
      data: {
        title: String(title),
        location: location ? String(location) : null,
        priceUsd: priceOk,
        image: image ? String(image) : null,
        description: (description ?? null) ? String(description) : null,
        owner: { connect: { id: me.id } },
      },
      select: { id: true },
    });

    // 2) Insertar galería (si llega)
    const gallery: Array<{ url: string; order: number }> = Array.isArray(images)
      ? images
          .filter(Boolean)
          .map((g: any, i: number) => ({
            url: typeof g === "string" ? g : String(g?.url ?? ""),
            order: Number.isFinite(g?.order) ? Number(g.order) : i,
          }))
          .filter((it) => !!it.url)
      : [];

    if (gallery.length) {
      await prisma.listingImage.createMany({
        data: gallery.map((g) => ({
          url: g.url,
          order: Number.isFinite(g.order) ? Number(g.order) : 0,
          listingId: created.id,
        })),
      });
    }

    return res.status(200).json({ ok: true, id: created.id });
  } catch (err: any) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "SERVER", detail: String(err?.message || err) });
  }
}
