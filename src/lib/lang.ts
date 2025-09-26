export type Lang = "es" | "en";
const es = { home_title:"Golden Sands Properties", menu_home:"Inicio", menu_search:"Buscar", menu_properties:"Propiedades", menu_legal:"Legal", menu_about:"Nosotros", menu_contact:"Contacto", menu_account:"Cuenta", menu_login:"Iniciar sesión", hero_sub:"Propiedades en la costa de Costa Rica" };
const en = { home_title:"Golden Sands Properties", menu_home:"Home", menu_search:"Search", menu_properties:"Properties", menu_legal:"Legal", menu_about:"About", menu_contact:"Contact", menu_account:"Account", menu_login:"Sign in", hero_sub:"Properties on Costa Rica's coast" };
export function useLang(){ const lang:Lang="es"; const dict = lang==="en"?en:es; const t=(k:keyof typeof dict, fb?:string)=>(dict as any)[k] ?? fb ?? String(k); return { lang, t }; }
