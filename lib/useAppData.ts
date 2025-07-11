"use client"
import { useState, useEffect } from "react"
import { supabase } from "./supabase"
import type { User, Medal } from "@/lib/types"

export function useAppData() {
  const [users, setUsers] = useState<User[]>([])
  const [medals, setMedals] = useState<Medal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData } = await supabase.from("users").select("*")
      setUsers(usersData || [])
      const { data: medalsData } = await supabase.from("medals").select("*")
      setMedals(medalsData || [])
      setLoading(false)
    }
    fetchData()
  }, [])

  return { users, medals, loading }
}