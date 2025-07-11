"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function AuthPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else router.push("/")
    setLoading(false)
  }

  // REGISTRO
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    // 1. Registrar en Auth
    const { data, error: authError } = await supabase.auth.signUp({ email, password })
    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }
    // 2. Registrar en tabla users
    const { error: userError } = await supabase.from("users").insert([{
      email,
      name,
      area: "",
      team: "",
      birthday: "",
      isAdmin: false,
    }])
    if (userError) setError(userError.message)
    else setError("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.")
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-xs bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4 text-center">Ingresar / Registrarse</h2>
        <form className="space-y-3" onSubmit={handleLogin}>
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-blue-600 text-white py-2 rounded"
            disabled={loading}
            type="submit"
          >
            Ingresar
          </button>
        </form>
        <form className="space-y-3 mt-4" onSubmit={handleRegister}>
          <input
            className="w-full border rounded px-3 py-2"
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border rounded px-3 py-2"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            className="w-full bg-gray-600 text-white py-2 rounded"
            disabled={loading}
            type="submit"
          >
            Registrarse
          </button>
        </form>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </div>
    </div>
  )
}