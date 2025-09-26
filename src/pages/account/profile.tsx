import type { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getUserFromRequest } from "@/lib/session";
import { prisma } from "@/lib/prisma";

type UiUser = {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  whatsapp: string | null;
  location: string | null;
  address: string | null;
  age: number | null;
  bio: string | null;
  profileImageUrl: string | null;
};

type Props = { user: UiUser };

export default function ProfilePage({ user }: Props) {
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // State controlado de inputs
  const [name, setName] = useState(user.name || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [whatsapp, setWhatsapp] = useState(user.whatsapp || "");
  const [location, setLocation] = useState(user.location || "");
  const [address, setAddress] = useState(user.address || "");
  const [age, setAge] = useState(user.age ?? ("" as any));
  const [bio, setBio] = useState(user.bio || "");
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || "/henry1.jpg");

  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function onUploadFile(file: File) {
    setErr(null);
    if (!file) return;
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "No se pudo subir");
      if (data?.url) setProfileImageUrl(data.url);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message || "Error subiendo archivo");
    } finally {
      setUploading(false);
    }
  }

  async function onSave(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      setSaving(true);
      const body = {
        name,
        phone,
        whatsapp,
        location,
        address,
        age: age === "" ? null : Number(age),
        bio,
        profileImageUrl,
      };
      const res = await fetch("/api/account/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "SERVER");
    } catch (e: any) {
      setErr(`No se pudo guardar (${e?.message || "SERVER"})`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-dvh bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Editar perfil</h1>
          <Link href="/account" className="border rounded-lg px-4 py-2 hover:bg-gray-50">Volver</Link>
        </div>
        <p className="text-sm text-gray-600">{user.email}</p>

        <form onSubmit={onSave} className="mt-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Foto y uploader */}
            <div className="space-y-4">
              <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100">
                <Image src={profileImageUrl || "/henry1.jpg"} alt="Foto de perfil" width={200} height={200} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-2">
                <button
                  type="button"
                  className="border rounded-lg px-4 py-2 hover:bg-gray-50"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Subiendo..." : "Subir foto"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadFile(f);
                  }}
                />
                <input
                  className="w-full border rounded px-3 py-2 text-sm"
                  placeholder="/uploads/archivo.jpg o URL"
                  value={profileImageUrl}
                  onChange={(e) => setProfileImageUrl(e.target.value)}
                />
                <p className="text-xs text-gray-500">Las imágenes se guardan en <code>/public/uploads</code>.</p>
              </div>
            </div>

            {/* Columna 1 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Nombre *</label>
                <input className="w-full border rounded px-3 py-2" value={name} onChange={(e)=>setName(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm text-gray-600">Teléfono</label>
                <input className="w-full border rounded px-3 py-2" value={phone} onChange={(e)=>setPhone(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">WhatsApp</label>
                <input className="w-full border rounded px-3 py-2" value={whatsapp} onChange={(e)=>setWhatsapp(e.target.value)} placeholder="+506 8888 8888" />
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-600">Ubicación</label>
                <input className="w-full border rounded px-3 py-2" value={location} onChange={(e)=>setLocation(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Dirección</label>
                <input className="w-full border rounded px-3 py-2" value={address} onChange={(e)=>setAddress(e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Edad</label>
                <input className="w-full border rounded px-3 py-2" value={age as any} onChange={(e)=>setAge(e.target.value)} inputMode="numeric" />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600">Bio</label>
            <textarea className="w-full border rounded px-3 py-2 h-28" value={bio} onChange={(e)=>setBio(e.target.value)} />
          </div>

          <div className="flex items-center gap-3">
            <button className="rounded-lg bg-[#d4af37] text-white px-5 py-2 hover:opacity-90" disabled={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
            <Link href="/account" className="border rounded-lg px-4 py-2 hover:bg-gray-50">Cancelar</Link>
            {err && <span className="text-sm text-red-600 ml-2">{err}</span>}
          </div>
        </form>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const me = await getUserFromRequest(req as any);
  if (!me) return { redirect: { destination: "/login", permanent: false } } as any;

  const u = await prisma.user.findUnique({
    where: { id: me.id },
    select: {
      id: true, name: true, email: true, phone: true, whatsapp: true,
      location: true, address: true, age: true, bio: true, profileImageUrl: true,
    },
  });
  if (!u) return { redirect: { destination: "/login", permanent: false } } as any;

  return { props: { user: u as UiUser } };
};
