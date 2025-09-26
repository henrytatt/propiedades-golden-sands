import type { NextApiRequest, NextApiResponse } from "next";
import { getPrisma } from "@/lib/prisma";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = getPrisma();
    if (!db) return res.status(500).json({ ok: false, error: "Prisma no inicializado" });
    const version = await db.$queryRawUnsafe<any[]>("select sqlite_version() as v");
    const cols = await db.$queryRawUnsafe<any[]>("PRAGMA table_info(\"User\")");
    return res.status(200).json({ ok: true, sqlite: version?.[0]?.v, userColumns: cols });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}

