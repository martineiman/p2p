"use client"

import { isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

export function DevBanner() {
  if (isSupabaseConfigured()) {
    return null
  }

  return (
    <Alert className="mb-4 border-amber-200 bg-amber-50">
      <Info className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        <strong>Modo de desarrollo:</strong> Supabase no está configurado. Usando datos estáticos de demostración. Para
        usar la base de datos real, configura las variables de entorno en <code>.env.local</code>.
      </AlertDescription>
    </Alert>
  )
}
