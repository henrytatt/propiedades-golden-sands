import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { getUserFromRequest } from "@/lib/session";
import { passwordSchema } from "@/lib/valid";
import { getPrisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const me = await getUserFromRequest(req);
  if (!me) return res.status(401).json({ error: "No autorizado" });

  const parse = passwordSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues[0]?.message || "Datos inválidos" });

  const { current, next } = parse.data;
  const prisma = getPrisma();

  const user = await prisma.user.findUnique({ where: { id: me.id }});
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  const ok = await bcrypt.compare(current, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Contraseña actual incorrecta" });

  const passwordHash = await bcrypt.hash(next, 10);
  await prisma.user.update({ where: { id: me.id }, data: { passwordHash }});

  return res.status(200).json({ ok: true });
}

