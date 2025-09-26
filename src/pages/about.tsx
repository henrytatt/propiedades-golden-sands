import Image from "next/image";
import Link from "next/link";

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center p-4 rounded-xl border bg-white">
      <div className="text-3xl font-extrabold text-[#d4af37]">{value}</div>
      <div className="text-xs text-gray-600 mt-1">{label}</div>
    </div>
  );
}

export default function About() {
  const img = (p: string) => encodeURI(p);

  return (
    <section className="space-y-12">
      {/* HERO */}
      <div className="relative rounded-2xl overflow-hidden border">
        <Image
          src={img("/Flamingo3.jpg")}
          alt="Golden Sands - Costa Dorada"
          width={1920}
          height={900}
          priority
          className="w-full h-[38vh] sm:h-[48vh] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex items-end sm:items-center">
          <div className="container pb-6 sm:pb-0">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#d4af37] drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
              Nosotros
            </h1>
            <p className="max-w-2xl text-white/90 mt-2">
              Nuestra visión es ser el sitio más seguro y transparente para comprar y vender
              propiedades en la costa de Costa Rica.
            </p>
          </div>
        </div>
      </div>

      {/* MISIÓN / PROPÓSITO */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border bg-white">
          <h2 className="text-2xl font-semibold">Misión</h2>
          <p className="text-gray-700 mt-2">
            Conectar a compradores y vendedores de manera justa, rápida y segura, respaldados por
            procesos legales claros y un estándar alto de verificación de propiedades.
          </p>
        </div>
        <div className="p-6 rounded-2xl border bg-white">
          <h2 className="text-2xl font-semibold">Propósito</h2>
          <p className="text-gray-700 mt-2">
            Elevar la confianza en el mercado inmobiliario con información verificada, acompañamiento
            profesional y tecnología simple que reduce riesgos para todas las partes.
          </p>
        </div>
      </div>

      {/* POR QUÉ CONFIAR */}
      <div className="p-6 rounded-2xl border bg-white">
        <h2 className="text-2xl font-semibold">¿Por qué confiar en Golden Sands?</h2>
        <ul className="mt-3 grid md:grid-cols-2 gap-3 text-gray-700">
          <li className="flex gap-2"><span>✅</span> Due diligence legal previo y seguimiento hasta la inscripción en Registro Nacional.</li>
          <li className="flex gap-2"><span>✅</span> Notarios, abogados y contadores aliados en Guanacaste.</li>
          <li className="flex gap-2"><span>✅</span> Verificación documental y fotos originales de cada propiedad.</li>
          <li className="flex gap-2"><span>✅</span> Contratos claros, cronograma de pagos y resguardo de depósitos.</li>
        </ul>
      </div>

      {/* CIFRAS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Operaciones con 0 disputas legales" value="100%" />
        <Stat label="Tiempo promedio de cierre" value="30–45d" />
        <Stat label="Profesionales aliados" value="+12" />
        <Stat label="Satisfacción de clientes" value="4.9★" />
      </div>

      {/* VALORES */}
      <div className="p-6 rounded-2xl border bg-white">
        <h2 className="text-2xl font-semibold">Nuestros valores</h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Transparencia</h3>
            <p className="text-sm text-gray-700 mt-1">
              Información completa, comisiones claras y documentos accesibles.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Seguridad</h3>
            <p className="text-sm text-gray-700 mt-1">
              Validación legal y técnica de títulos, linderos y gravámenes.
            </p>
          </div>
          <div className="rounded-xl border p-4">
            <h3 className="font-semibold">Servicio humano</h3>
            <p className="text-sm text-gray-700 mt-1">
              Acompañamiento cercano, en español e inglés, durante todo el proceso.
            </p>
          </div>
        </div>
      </div>

      {/* EQUIPO */}
      <div className="p-6 rounded-2xl border bg-white">
        <h2 className="text-2xl font-semibold">Equipo</h2>
        <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border overflow-hidden bg-white">
            <div className="h-44 w-full overflow-hidden">
              <Image src="/henry1.jpg" alt="Henry - Founder" width={800} height={600} className="w-full h-44 object-cover" />
            </div>
            <div className="p-4">
              <div className="font-semibold">Henry A.</div>
              <div className="text-xs text-gray-600">Fundador · Operaciones</div>
              <p className="text-sm text-gray-700 mt-2">
                Apasionado por el servicio y los procesos claros. Conecta clientes con los mejores
                profesionales para cerrar con seguridad y confianza.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden bg-white">
            <div className="h-44 w-full overflow-hidden">
              <Image src={img("/casaplaya1.jpg")} alt="Costa Rica" width={800} height={600} className="w-full h-44 object-cover" />
            </div>
            <div className="p-4">
              <div className="font-semibold">Equipo Legal</div>
              <div className="text-xs text-gray-600">Abogados & Notarios aliados</div>
              <p className="text-sm text-gray-700 mt-2">
                Red de notarios y abogados con experiencia en bienes raíces, sociedades y zona
                marítimo-terrestre.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border overflow-hidden bg-white">
            <div className="h-44 w-full overflow-hidden">
              <Image src={img("/Flamingo4.jpg")} alt="Guanacaste" width={800} height={600} className="w-full h-44 object-cover" />
            </div>
            <div className="p-4">
              <div className="font-semibold">Asesoría Fiscal</div>
              <div className="text-xs text-gray-600">Contadores & Compliance</div>
              <p className="text-sm text-gray-700 mt-2">
                Acompañamiento tributario, NITE y estructura societaria cuando se requiere.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-2xl border p-6 bg-gradient-to-r from-white to-[#fff7df]">
        <h2 className="text-2xl font-semibold">Listo para avanzar con seguridad</h2>
        <p className="text-gray-700 mt-1">
          Te guiamos paso a paso: verificación legal, contrato y firma con notario.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/properties" className="btn btn-gold">Ver propiedades</Link>
          <Link href="/contact" className="btn btn-outline">Hablar con un asesor</Link>
        </div>
      </div>
    </section>
  );
}

