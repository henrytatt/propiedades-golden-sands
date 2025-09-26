import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type PageProps = {
  listing: {
    id: string;
    title: string;
    image: string|null;
    location: string|null;
    priceUsd: number|null;
    description: string|null;
    images: { url:string }[];
    owner: {
      name: string | null;
      email: string;
      phone: string | null;
      whatsapp: string | null;
      location: string | null;
      profileImageUrl: string | null;
    } | null;
  } | null;
};

const Money = ({ v }:{ v:number|null }) =>
  <span>{v==null ? "-" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>;

export default function ListingDetail({ listing }: PageProps) {
  if (!listing) {
    return (
      <main className="container py-10">
        <p className="text-gray-600">Publicación no encontrada.</p>
        <Link href="/properties" className="text-[#d4af37] underline">Volver a propiedades</Link>
      </main>
    );
  }

  const gallery = (listing.images?.length ? listing.images.map(i=>i.url) : []).filter(Boolean);
  const hero = listing.image || gallery[0] || "/portada1.jpg";

  return (
    <main className="container py-8 space-y-8">
      <Link href="/properties" className="text-sm text-[#d4af37] underline">← Volver a propiedades</Link>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        {/* Media + info */}
        <article className="lg:col-span-2 bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="relative">
            <Image src={hero} alt={listing.title} width={1600} height={900} className="w-full h-80 object-cover" />
            <div className="absolute top-3 left-3 bg-black/60 text-white text-xs rounded px-2 py-1">
              {listing.location || "Costa Rica"}
            </div>
          </div>

          {gallery.length > 1 && (
            <div className="p-4 grid gap-3 grid-cols-2 sm:grid-cols-3">
              {gallery.slice(1).map((u,idx)=>(
                <Image key={idx} src={u} alt={"gal"+idx} width={900} height={600} className="w-full h-32 object-cover rounded"/>
              ))}
            </div>
          )}

          <div className="p-6 space-y-2">
            <h1 className="text-3xl font-bold">{listing.title}</h1>
            <div className="text-lg text-gray-700"><Money v={listing.priceUsd} /></div>
            {listing.description && (
              <p className="mt-4 whitespace-pre-wrap text-gray-800">{listing.description}</p>
            )}
          </div>
        </article>

        {/* Publicador */}
        <aside className="bg-white rounded-2xl border shadow-sm p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Publicado por</h2>
          {!listing.owner ? (
            <p className="text-gray-600">Usuario desconocido</p>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={listing.owner.profileImageUrl || "/henry1.jpg"}
                    alt="Owner" width={96} height={96} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="font-medium">{listing.owner.name || "Propietario"}</div>
                  <div className="text-xs text-gray-500">{listing.owner.location || "Costa Rica"}</div>
                </div>
              </div>

              <div className="text-sm">
                <div className="text-gray-500">Correo</div>
                <div className="font-medium break-all">{listing.owner.email}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">WhatsApp</div>
                <div className="font-medium">{listing.owner.whatsapp || "-"}</div>
              </div>
              <div className="text-sm">
                <div className="text-gray-500">Teléfono</div>
                <div className="font-medium">{listing.owner.phone || "-"}</div>
              </div>

              {listing.owner.whatsapp && (
                <a
                  href={`https://wa.me/${listing.owner.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  className="inline-flex items-center justify-center w-full mt-2 rounded-lg bg-[#25D366] text-white py-2"
                >
                  Chatear por WhatsApp
                </a>
              )}
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const id = String(ctx.params?.id || "");
  if (!id) return { props: { listing: null } };

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      images: { select: { url: true }, orderBy: { order: "asc" } },
      owner: { select: { name:true, email:true, phone:true, whatsapp:true, location:true, profileImageUrl:true } }
    }
  });

  if(!listing) return { props: { listing: null } };

  return { props: {
    listing: {
      id: listing.id,
      title: listing.title,
      image: listing.image,
      location: listing.location,
      priceUsd: listing.priceUsd,
      description: (listing as any).description ?? null,
      images: listing.images || [],
      owner: listing.owner as any
    }
  }};
};
