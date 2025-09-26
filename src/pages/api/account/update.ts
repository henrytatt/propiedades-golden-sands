import type { NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ error: "No autorizado" });

  try {
    const { name, phone, whatsapp, location, address, age, bio, profileImageUrl } = req.body || {};
    if (!name || String(name).trim().length < 2) return res.status(400).json({ error: "Nombre inválido" });

    const data: any = { name: String(name).trim() };

    if (phone !== undefined)        data.phone = phone ? String(phone) : null;
    if (whatsapp !== undefined)     data.whatsapp = whatsapp ? String(whatsapp) : null;
    if (location !== undefined)     data.location = location ? String(location) : null;
    if (address !== undefined)      data.address = address ? String(address) : null;
    if (bio !== undefined)          data.bio = bio ? String(bio) : null;
    if (profileImageUrl !== undefined) data.profileImageUrl = profileImageUrl ? String(profileImageUrl) : null;

    if (age !== undefined) {
      const ageNum = (age === "" || age === null) ? null : Number(age);
      if (ageNum !== null && (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120)) {
        return res.status(400).json({ error: "Edad inválida" });
      }
      data.age = ageNum;
    }

    const u = await prisma.user.update({
      where: { id: me.id },
      data,
      select: {
        id: true, name: true, email: true, phone: true, whatsapp: true,
        location: true, address: true, age: true, bio: true, profileImageUrl: true
      },
    });

    return res.status(200).json({ ok: true, user: u });
  } catch (e: any) {
    console.error("[/api/account/update] error:", e?.message || e);
    return res.status(500).json({ error: e?.message || String(e) });
  }
}

