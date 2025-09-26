export type Lang = "es" | "en";

const es = {
  home_title: "Golden Sands Properties",
  // TODO: agrega aquí los demás textos en español
};

const en = {
  home_title: "Golden Sands Properties",
  // TODO: agrega aquí los demás textos en inglés
};

export function useLang() {
  // Usa variable pública si existe, de lo contrario "es"
  const lang: Lang = (process.env.NEXT_PUBLIC_LANG === "en" ? "en" : "es");
  return lang === "es" ? es : en;
}
