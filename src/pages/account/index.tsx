import MyListingsSection from "@/components/MyListingsSection";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import Image from "next/image";
import { getUserFromRequest } from "@/lib/session";

type Props = {
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    whatsapp?: string | null;
    location?: string | null;
    address?: string | null;
    age?: number | null;
    bio?: string | null;
    profileImageUrl?: string | null;
  };
};
import * as React from "react";

export default function Account({ user }: Props) {
  const initials =
    (user?.name || "U")
      .split(/\s+/)
      .map(p => p[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  return (
    <main className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mi cuenta</h1>
        <div className="flex gap-2">
          <Link href="/account/publish" className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: "#d4af37" }}>
            ➕ Publicar propiedad
          </Link>
          <Link href="/account/profile" className="rounded-lg px-3 py-2 border">
            Editar perfil
          </Link>
        </div>
      </div>

      <section className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center text-lg font-bold">
            {user?.profileImageUrl ? (
              <Image src={user.profileImageUrl} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div>
            <div className="font-semibold">{user?.name}</div>
            <div className="text-sm text-gray-600">{user?.email}</div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm">
          <div><div className="text-gray-500">WhatsApp</div><div className="font-medium">{user?.whatsapp || "—"}</div></div>
          <div><div className="text-gray-500">Teléfono</div><div className="font-medium">{user?.phone || "—"}</div></div>
          <div><div className="text-gray-500">Ubicación</div><div className="font-medium">{user?.location || "—"}</div></div>
          <div><div className="text-gray-500">Dirección</div><div className="font-medium">{user?.address || "—"}</div></div>
          <div><div className="text-gray-500">Edad</div><div className="font-medium">{user?.age ?? "—"}</div></div>
          <div className="sm:col-span-2 lg:col-span-3">
            <div className="text-gray-500">Bio</div>
            <div className="font-medium whitespace-pre-wrap">{user?.bio || "—"}</div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-2">
          <Link href="/account/publish" className="rounded-lg px-3 py-2 text-white" style={{ backgroundColor: "#d4af37" }}>
            ➕ Nueva publicación
          </Link>
          <Link href="/properties" className="rounded-lg px-3 py-2 border">
            Ver propiedades
          </Link>
        </div>
      </section>
    <section className="space-y-4 mt-8">
  <div className="flex items-center justify-between">
    <h2 className="text-2xl font-semibold">Mis publicaciones</h2>
    <Link href="/account/publish" className="text-white rounded-lg px-3 py-2" style={{background:"#d4af37"}}>➕ Publicar</Link>
  </div>
  <MyListingsSection/>
</section>
</main>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const u = await getUserFromRequest(req);
  if (!u) {
    return { redirect: { destination: "/login", permanent: false } } as any;
  }
  return {
    props: {
      user: {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: (u as any).phone ?? null,
        whatsapp: (u as any).whatsapp ?? null,
        location: (u as any).location ?? null,
        address: (u as any).address ?? null,
        age: (u as any).age ?? null,
        bio: (u as any).bio ?? null,
        profileImageUrl: (u as any).profileImageUrl ?? null,
      },
    },
  };
};


