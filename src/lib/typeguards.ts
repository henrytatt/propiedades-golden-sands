export type Image = { url: string };
export type Listing = { id: string | number; images?: Image[] };

/** Type guard para asegurar que listing tiene id en tiempo de ejecución */
export function hasId(x: any): x is Listing {
  return !!x && (typeof x.id === "string" || typeof x.id === "number");
}
