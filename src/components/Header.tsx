import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white/70 backdrop-blur">
      <nav className="container h-14 flex items-center gap-6">
        <Link href="/" className="font-extrabold text-xl tracking-tight text-[#d4af37]">
          Golden Sands
        </Link>
        <div className="hidden md:flex gap-5 text-sm text-gray-700">
          <Link href="/search">Buscar</Link>
          <Link href="/properties">Propiedades</Link>
          <Link href="/legal">Legal</Link>
          <Link href="/about">Nosotros</Link>
          <Link href="/contact">Contacto</Link>
          <Link href="/account">Cuenta</Link>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/login" className="px-3 py-1.5 rounded-lg border hover:bg-gray-50">Iniciar sesión</Link>
          <Link href="/signup" className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-white hover:brightness-95">
            Crear cuenta
          </Link>
        </div>
      </nav>
    </header>
  );
}
