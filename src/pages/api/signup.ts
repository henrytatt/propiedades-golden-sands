import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import { signupSchema } from "@/lib/valid";
import { createSessionCookie } from "@/lib/session";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const parse = signupSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.issues[0]?.message || "Datos inválidos" });
  const { name, email, password } = parse.data;

  const prisma = getPrisma();
  const exists = await prisma.user.findUnique({ where: { email }});
  if (exists) return res.status(409).json({ error: "Ese email ya está registrado" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, plan: "FREE" }
  });

  res.setHeader("Set-Cookie", createSessionCookie(user.id));
  return res.status(200).json({ ok: true, user: { id: user.id, name: user.name, email: user.email } });
}

