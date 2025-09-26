import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: { bodyParser: false }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({ multiples: false, uploadDir, keepExtensions: true });
  form.parse(req, async (err: unknown, fields: any, files: any) => {
    if (err) return res.status(400).json({ error: "Parse error" });
    const anyFile = (files.file as any) || (files.image as any);
    if (!anyFile) return res.status(400).json({ error: "Archivo no recibido" });

    const f = Array.isArray(anyFile) ? anyFile[0] : anyFile;
    const base = path.basename(f.newFilename || f.originalFilename || "file");
    const publicPath = "/uploads/" + base;
    return res.status(200).json({ ok: true, path: publicPath });
  });
}


