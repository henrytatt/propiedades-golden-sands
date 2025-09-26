import type { GetServerSideProps } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/session";

type Row = { id:string; title:string; createdAt:string; };

export default function MyListings({ items }: { items: Row[] }) {
  return (
    <main className="container py-8 space-y-6">
      <h1 className="text-3xl font-bold">Mis publicaciones</h1>
      {!items.length ? (
        <p className="text-gray-600">No tienes publicaciones aún. Crea una desde <Link href="/account/publish" className="text-[#d4af37] underline">Publicar</Link>.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-[640px] w-full border rounded-xl overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-3">Título</th>
                <th className="text-left p-3">Creada</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(x=>(
                <tr key={x.id} className="border-t">
                  <td className="p-3">{x.title}</td>
                  <td className="p-3 text-sm text-gray-500">{new Date(x.createdAt).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <Link href={`/account/edit/${x.id}`} className="text-white rounded-lg px-3 py-1" style={{background:"#d4af37"}}>Editar</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div><Link href="/account" className="text-[#d4af37] underline">Volver a mi cuenta</Link></div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const me = await getUserFromRequest(req);
  if (!me) return { redirect: { destination: "/login", permanent: false } } as any;

  const list = await prisma.listing.findMany({
    where: { ownerId: me.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, title: true, createdAt: true }
  });

  return { props: { items: list.map(l => ({...l, createdAt: l.createdAt.toISOString()})) } };
};
