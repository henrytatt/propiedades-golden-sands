import { FormEvent, useState } from "react";
export default function Login(){ const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [msg,setMsg]=useState<string|null>(null);
  async function onSubmit(e:FormEvent){ e.preventDefault(); setMsg(null);
    const res = await fetch("/api/login",{ method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ email, password }) });
    const data = await res.json(); if(res.ok){ setMsg("Login ok, redirigiendo a /account..."); location.href="/account"; } else { setMsg(data.error || "Error"); } }
  return (<div className="max-w-sm mx-auto"><h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
    <form onSubmit={onSubmit} className="space-y-3">
      <input className="border rounded px-3 py-2 w-full" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="border rounded px-3 py-2 w-full" type="password" placeholder="Contraseña" value={password} onChange={e=>setPassword(e.target.value)} />
      <button className="bg-black text-white rounded px-4 py-2 w-full">Entrar</button>
    </form>{msg && <p className="mt-3 text-sm text-gray-600">{msg}</p>}</div>);
}

