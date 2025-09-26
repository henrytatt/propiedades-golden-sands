export default function Legal() {
  return (
    <section className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-[#d4af37]">Aspectos Legales</h1>
        <p className="mt-2 text-gray-700">
          Comprar una propiedad en Costa Rica es un proceso accesible y seguro,
          siempre que se realice de la mano de profesionales legales certificados.
          Aquí encontrarás información clave para residentes y extranjeros.
        </p>
      </div>

      {/* Requisitos generales */}
      <div className="card p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Requisitos Generales</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Contar con un abogado y notario público colegiado.</li>
          <li>Revisión de la propiedad en el Registro Nacional (due diligence).</li>
          <li>Redacción de la escritura pública de compraventa.</li>
          <li>Pago de impuestos de transferencia (1.5% del valor).</li>
          <li>Inscripción de la propiedad a nombre del comprador.</li>
        </ul>
      </div>

      {/* Extranjeros */}
      <div className="card p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Extranjeros Comprando en Costa Rica</h2>
        <p className="text-gray-700">
          Los extranjeros tienen los mismos derechos que los costarricenses para adquirir
          propiedades en Costa Rica, salvo en la zona marítimo-terrestre (primeros 200m de playa).
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Pasaporte vigente y copia de todas las páginas.</li>
          <li>Número de Identificación Tributaria (NITE) emitido por Hacienda.</li>
          <li>Cuenta bancaria local para transferencias.</li>
          <li>Representación legal en caso de no residir en el país.</li>
        </ul>
      </div>

      {/* Proceso legal */}
      <div className="card p-6 space-y-3">
        <h2 className="text-2xl font-semibold">Pasos del Proceso Legal</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Firma de la opción de compra-venta entre las partes.</li>
          <li>Due diligence realizado por el abogado.</li>
          <li>Firma de la escritura pública en presencia de notario.</li>
          <li>Inscripción en el Registro Nacional.</li>
          <li>Entrega final de la propiedad al comprador.</li>
        </ol>
      </div>

      {/* Profesionales recomendados */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Profesionales Recomendados en Guanacaste</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-4">
            <h3 className="font-bold">Lic. Juan Pérez</h3>
            <p className="text-sm text-gray-600">Abogado & Notario</p>
            <p className="mt-1 text-sm">Especialista en bienes raíces y derecho corporativo.</p>
            <p className="mt-2 text-xs text-gray-500">Tel: +506 8888-1111</p>
          </div>
          <div className="card p-4">
            <h3 className="font-bold">Licda. María Rodríguez</h3>
            <p className="text-sm text-gray-600">Notaria Pública</p>
            <p className="mt-1 text-sm">Más de 15 años de experiencia en transacciones inmobiliarias.</p>
            <p className="mt-2 text-xs text-gray-500">Tel: +506 8888-2222</p>
          </div>
          <div className="card p-4">
            <h3 className="font-bold">Carlos Sánchez</h3>
            <p className="text-sm text-gray-600">Contador Público</p>
            <p className="mt-1 text-sm">Asesoría fiscal y apertura de sociedades.</p>
            <p className="mt-2 text-xs text-gray-500">Tel: +506 8888-3333</p>
          </div>
        </div>
      </div>
    </section>
  );
}

