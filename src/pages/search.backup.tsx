import * as React from "react";
import type { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Card = {
  id: string;
  title: string;
  image: string | null;
  location: string | null;
  priceUsd: number | null;
};

type SearchProps = {
  listings: Card[];
  query: Record<string, string>;
};

const Money = ({ v }:{ v:number|null }) => (
  <span>{v==null ? "-" : new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format(v)}</span>
);

export default function SearchPage({ listings, query }: SearchProps) {
  return (
    <main className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Buscar</h1>

      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-8">
        {/* Filtros */}
        <aside className="bg-white rounded-2xl border shadow-sm p-5 h-fit">
          <form method="GET" className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Palabra clave</label>
              <input
                type="text"
                name="q"
                defaultValue={query.q ?? ""}
                placeholder="Ej: vista al mar, Flamingo"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">Ubicación</label>
              <select
                name="location"
                defaultValue={query.location ?? ""}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Todas</option>
                <option>Flamingo</option>
                <option>Tamarindo</option>
                <option>Guanacaste</option>
                <option>Santa Cruz</option>
                <option>Nosara</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm mb-1">Precio mín. (USD)</label>
                <input
                  type="number"
                  name="min"
                  inputMode="numeric"
                  defaultValue={query.min ?? ""}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Precio máx. (USD)</label>
                <input
                  type="number"
                  name="max"
                  inputMode="numeric"
                  defaultValue={query.max ?? ""}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button className="rounded-lg px-4 py-2 text-white" style={{background:"#d4af37"}}>
                Buscar
              </button>
              <Link
                className="rounded-lg px-4 py-2 border"
                href="/search"
              >
                Limpiar
              </Link>
            </div>
          </form>
        </aside>

        {/* Resultados */}
        <section>
          <div className="text-sm text-gray-500 mb-3">{listings.length} resultado{listings.length!==1 && "s"}</div>
          {listings.length === 0 ? (
            <p className="text-gray-600">No se encontraron propiedades con esos filtros.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((l) => (
                <article key={l.id} className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                  <div className="relative">
                    <Image
                      src={l.image || "/portada1.jpg"}
                      alt={l.title}
                      width={900}
                      height={600}
                      className="w-full h-56 object-cover"
                    />
                    {l.location && (
                      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs rounded px-2 py-1">
                        {l.location}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-medium line-clamp-1">{l.title}</h3>
                    <div className="text-gray-700"><Money v={l.priceUsd} /></div>
                    <div className="pt-1">
                      <Link
                        href={`/properties/${l.id}`}
                        className="text-sm px-3 py-1 rounded-lg text-white inline-block"
                        style={{background:"#d4af37"}}
                      >
                        Ver detalles
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<SearchProps> = async (ctx) => {
  const q = (ctx.query.q ?? "").toString().trim();
  const location = (ctx.query.location ?? "").toString().trim();
  const min = Number(ctx.query.min ?? "");
  const max = Number(ctx.query.max ?? "");

  const where: any = {};

  // Texto libre en title/location/description (si existe)
  if (q) {
    where.OR = [
      { title:     { contains: q, mode: "insensitive" } },
      { location:  { contains: q, mode: "insensitive" } },
    ];
    // Solo intenta description si la columna existe en tu DB.
    try {
      where.OR.push({ description: { contains: q, mode: "insensitive" } });
    } catch {}
  }

  if (location) where.location = { equals: location };

  if (!Number.isNaN(min) || !Number.isNaN(max)) {
    where.priceUsd = {};
    if (!Number.isNaN(min)) where.priceUsd.gte = min;
    if (!Number.isNaN(max)) where.priceUsd.lte = max;
  }

  const listings = await prisma.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    select: { id:true, title:true, image:true, location:true, priceUsd:true },
    take: 48,
  });

  return {
    props: {
      listings,
      query: {
        q,
        location,
        min: Number.isNaN(min) ? "" : String(min),
        max: Number.isNaN(max) ? "" : String(max),
      },
    },
  };
};
