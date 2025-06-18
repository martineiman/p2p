import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function DBUsersDebug() {
  const [rawData, setRawData] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    supabase.from("users").select("*").then(({ data, error }) => {
      setRawData(data)
      setError(error)
    })
  }, [])

  return (
    <div>
      <h2>Debug usuarios Supabase</h2>
      <h3>Respuesta cruda:</h3>
      <pre>{JSON.stringify(rawData, null, 2)}</pre>
      {error && <pre style={{ color: "red" }}>{JSON.stringify(error, null, 2)}</pre>}
    </div>
  )
}