import Image from "next/image";
import { useState } from "react";

type FormState = {
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  hp: string; // honeypot
};

export default function Contact() {
  const [state, setState] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    interest: "",
    message: "",
    hp: "",
  });
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | string>(null);
  const [err, setErr] = useState<null | string>(null);

  const img = (p: string) => encodeURI(p);

  function onChange<K extends keyof FormState>(k: K, v: FormState[K]) {
    setState((s) => ({ ...s, [k]: v }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setOk(null); setErr(null);

    // Validación mínima
    if (!state.name || !state.email || !state.message) {
      setErr("Por favor completa Nombre, Email y Mensaje.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(state.email)) {
      setErr("Ingresa un email válido.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      const data = await res.json();
      if (res.ok) {
        setOk("¡Gracias! Te contactaremos en breve.");
        setState({ name: "", email: "", phone: "", interest: "", message: "", hp: "" });
      } else {
        setErr(data?.error || "No se pudo enviar. Intenta de nuevo.");
      }
    } catch {
      setErr("Error de red. Verifica tu conexión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="space-y-10">
      {/* HERO */}
      <div className="relative rounded-2xl overflow-hidden border">
        <Image
          src={img("/Flamingo4.jpg")}
          alt="Contacto Golden Sands"
          width={1920}
          height={900}
          priority
          className="w-full h-[30vh] sm:h-[40vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="container pb-6">
            <h1 className="text-4xl font-extrabold text-[#d4af37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Contacto
            </h1>
            <p className="text-white/90 max-w-2xl">
              Hablemos sobre tu compra o venta con total seguridad y claridad.
            </p>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulario */}
        <form onSubmit={onSubmit} className="card p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="field">
              <label className="label">Nombre completo *</label>
              <input className="input" value={state.name} onChange={(e)=>onChange("name", e.target.value)} placeholder="Tu nombre" />
            </div>
            <div className="field">
              <label className="label">Email *</label>
              <input className="input" type="email" value={state.email} onChange={(e)=>onChange("email", e.target.value)} placeholder="tucorreo@ejemplo.com" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="field">
              <label className="label">Teléfono / WhatsApp</label>
              <input className="input" value={state.phone} onChange={(e)=>onChange("phone", e.target.value)} placeholder="+506 ..." />
            </div>
            <div className="field">
              <label className="label">Interés</label>
              <select className="select" value={state.interest} onChange={(e)=>onChange("interest", e.target.value)}>
                <option value="">Selecciona una opción</option>
                <option value="comprar">Comprar propiedad</option>
                <option value="vender">Vender propiedad</option>
                <option value="asesoria">Asesoría legal/fiscal</option>
                <option value="otra">Otra consulta</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label className="label">Mensaje *</label>
            <textarea className="input" rows={5} value={state.message} onChange={(e)=>onChange("message", e.target.value)} placeholder="Cuéntanos qué buscas o en qué te ayudamos..." />
          </div>

          {/* Honeypot invisible anti-spam */}
          <input
            type="text"
            value={state.hp}
            onChange={(e)=>onChange("hp", e.target.value)}
            className="hidden"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
          />

          <div className="flex items-center gap-3">
            <button className="btn btn-gold" disabled={loading}>
              {loading ? "Enviando..." : "Enviar mensaje"}
            </button>
            {ok && <span className="text-sm text-green-700">{ok}</span>}
            {err && <span className="text-sm text-red-600">{err}</span>}
          </div>
        </form>

        {/* Datos de contacto / Info */}
        <aside className="card p-6 space-y-4">
          <h2 className="text-2xl font-semibold">Datos de contacto</h2>
          <ul className="text-gray-700 space-y-2">
            <li><strong>WhatsApp:</strong> +506 8888-0000</li>
            <li><strong>Email:</strong> contacto@goldensands.cr</li>
            <li><strong>Horario:</strong> Lun–Vie 9:00–18:00 (GMT-6)</li>
            <li><strong>Oficina:</strong> Guanacaste, Costa Rica</li>
          </ul>

          <div className="rounded-xl overflow-hidden border">
            <Image
              src={img("/playa tamarindo.jpeg")}
              alt="Oficina Guanacaste"
              width={1200}
              height={800}
              className="w-full h-44 object-cover"
            />
          </div>

          <div className="text-sm text-gray-600">
            ¿Propiedad para vender? Envíanos ubicación, área, escritura y fotos.
            Te guiamos con el proceso legal y la publicación segura.
          </div>
        </aside>
      </div>
    </section>
  );
}

