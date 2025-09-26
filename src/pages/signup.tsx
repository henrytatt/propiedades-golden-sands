import { useState } from "react";

export default function Signup(){
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null);
    if (!name || !email || !password) { setErr("Completa nombre, email y contraseña."); return; }
    setLoading(true);
    try{
      const res = await fetch("/api/signup", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if(res.ok){ setMsg("Cuenta creada. Redirigiendo..."); location.href="/account"; }
      else setErr(data?.error || "No se pudo crear la cuenta");
    }catch{ setErr("Error de red"); } finally { setLoading(false); }
  }

  return (
    <div className="max-w-md mx-auto card p-6 space-y-4">
      <h1 className="text-3xl font-bold">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="field">
          <label className="label">Nombre completo</label>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tucorreo@ejemplo.com" />
        </div>
        <div className="field">
          <label className="label">Contraseña</label>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
        </div>
        <button className="btn btn-gold w-full" disabled={loading}>{loading ? "Creando..." : "Crear cuenta"}</button>
      </form>
      {msg && <p className="text-green-700 text-sm">{msg}</p>}
      {err && <p className="text-red-600 text-sm">{err}</p>}
      <p className="text-xs text-gray-500">Al crear una cuenta aceptas nuestras condiciones legales.</p>
    </div>
  );
}

