export function hasId(x: any): x is { id: string | number; images?: { url: string }[] } {
  return !!x && (typeof x.id === "string" || typeof x.id === "number");
}
