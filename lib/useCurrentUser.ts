"use client"
import { useEffect, useState } from "react"
import { supabase } from "./supabase"
import type { User as DBUser } from "@/lib/types"

export function useCurrentUser() {
  const [user, setUser] = useState<DBUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }
      // Busca el perfil en la tabla users usando el email
      const { data, error } = await supabase.from("users").select("*").eq("email", authUser.email).single()
      if (error || !data) {
        setUser(null)
      } else {
        setUser(data)
      }
      setLoading(false)
    }
    getUser()
  }, [])

  return { user, loading }
}