import * as React from "react";
import Image from "next/image";

const MAX_LISTING_IMAGES = 10;
const UPLOAD_URL = "/api/upload";

async function uploadFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("image", file);
  const r = await fetch(UPLOAD_URL, { method: "POST", body: fd });
  if (!r.ok) throw new Error(await r.text());
  const d = await r.json();
  return d.path || d.url;
}

export default function MyGalleryEditor(
  { listingId, initialImages }: { listingId: string; initialImages: string[] }
) {
  const [gallery, setGallery] = React.useState<string[]>(initialImages || []);
  const [msg, setMsg] = React.useState<string>("");
  const [busy, setBusy] = React.useState<boolean>(false);

  const canAdd = gallery.length < MAX_LISTING_IMAGES;

  async function onPickGallery(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    try {
      setBusy(true);
      const left = MAX_LISTING_IMAGES - gallery.length;
      const take = files.slice(0, left);
      const uploads = await Promise.all(take.map(uploadFile));

      const res = await fetch("/api/listings/add-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, urls: uploads })
      });
      if (!res.ok) {
        try {
          const j = await res.json();
          throw new Error(j?.error || "server");
        } catch {
          throw new Error(await res.text());
        }
      }

      setGallery(g => [...g, ...uploads]);
      setMsg(" Imagen(es) agregada(s)");
    } catch (e: any) {
      console.error(e);
      setMsg(` ${e?.message || "Error al agregar imágenes"}`);
    } finally {
      setBusy(false);
    }
  }

  async function addGalleryUrl(url: string) {
    if (!url.trim()) return;
    if (!canAdd) {
      setMsg(" Límite (10)");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch("/api/listings/add-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, urls: [url] })
      });
      if (!res.ok) {
        try {
          const j = await res.json();
          throw new Error(j?.error || "server");
        } catch {
          throw new Error(await res.text());
        }
      }
      setGallery(g => [...g, url]);
      setMsg("✅ Imagen agregada");
    } catch (e: any) {
      setMsg(`❌ ${e?.message || "Error al agregar URL"}`);
    } finally {
      setBusy(false);
    }
  }

  async function removeImage(url: string) {
    try {
      setBusy(true);
      const res = await fetch("/api/listings/remove-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, url })
      });
      if (!res.ok) {
        try {
          const j = await res.json();
          throw new Error(j?.error || "server");
        } catch {
          throw new Error(await res.text());
        }
      }
      setGallery(g => g.filter(u => u !== url));
      setMsg(" Imagen eliminada");
    } catch (e: any) {
      setMsg(` ${e?.message || "Error al eliminar"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-6">
      <label className="block text-sm mb-1">
        Galería (hasta {MAX_LISTING_IMAGES} fotos)
      </label>

      <div className="flex items-center gap-3">
        <input type="file" accept="image/*" multiple onChange={onPickGallery} disabled={busy || !canAdd} />
        <input
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Pega URL y Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const v = (e.target as HTMLInputElement).value.trim();
              if (v) addGalleryUrl(v);
              (e.target as HTMLInputElement).value = "";
            }
          }}
          disabled={busy || !canAdd}
        />
        <span className="text-xs text-gray-500">
          {gallery.length} / {MAX_LISTING_IMAGES}
        </span>
      </div>

      {!!gallery.length && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
          {gallery.map((u, i) => (
            <div key={u + i} className="relative group">
              <Image src={u} alt={"img" + i} width={300} height={200} className="w-full h-24 object-cover rounded" />
              <button
                type="button"
                onClick={() => removeImage(u)}
                className="absolute top-1 right-1 text-xs px-2 py-1 rounded bg-black/60 text-white opacity-0 group-hover:opacity-100"
              >
                Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      {msg && <p className="text-sm mt-2">{msg}</p>}
    </section>
  );
}
