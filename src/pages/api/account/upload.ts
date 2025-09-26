import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import path from "path";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    multiples: false,
    filename: (_name: string, _ext: string, part: File): string => {
      const ext = path.extname(part.originalFilename || "").toLowerCase() || ".jpg";
      const base = `avatar_${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
      return base + ext;
    },
  });

  try {
    const [fields, files] = await form.parse(req);
    const f = files.file as File | File[] | undefined;
    const file = Array.isArray(f) ? f[0] : f;
    if (!file?.newFilename) return res.status(400).json({ error: "Archivo inválido" });

    // Ruta pública para usar en <Image src="...">
    const publicPath = "/uploads/" + file.newFilename;
    return res.status(200).json({ ok: true, path: publicPath });
  } catch (e) {
    return res.status(500).json({ error: "No se pudo subir el archivo" });
  }
}


