import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Verificar que las variables de entorno estén configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase no está configurado. Usando modo de desarrollo con datos estáticos.")
}

// Solo crear cliente si las variables están configuradas
export const supabase = supabaseUrl && supabaseAnonKey ? createClient<Database>(supabaseUrl, supabaseAnonKey) : null

// Cliente para el servidor (opcional)
export const createServerClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// Función para verificar si Supabase está disponible
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey && supabase)
}