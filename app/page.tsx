"use client"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { appData } from "@/lib/data"
import { GiveRecognitionSection } from "@/components/GiveRecognitionSection"
import { StatsGrid } from "@/components/stats-grid"
import { SectionsGrid } from "@/components/sections-grid"
import { ExpandedContent } from "@/components/expanded-content"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { User, Value, Medal } from "@/lib/types"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [viewingUserAchievements, setViewingUserAchievements] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [values, setValues] = useState<Value[]>(appData.values)
  const [medals, setMedals] = useState<Medal[]>(appData.medals)
  const [loading, setLoading] = useState(true)
  const [showRecognition, setShowRecognition] = useState(false)
  const currentUser = appData.currentUser

  // Cargar usuarios desde Supabase
  const loadUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("users").select("*")
    if (error) {
      setUsers([])
    } else {
      setUsers(data as User[])
    }
    setLoading(false)
  }

  // Refrescar datos
  const loadData = async () => {
    await loadUsers()
    setValues([...appData.values])
    setMedals([...appData.medals])
  }

  useEffect(() => {
    loadData()
  }, [])

  // Funciones de navegación, logros, etc. Puedes ajustar según tu lógica real:
  const handleAddMedal = async () => {
    // Puedes implementar lógica si quieres refrescar tras agregar desde otra sección
    await loadData()
  }
  const handleViewAchievements = (user: User) => {
    setViewingUserAchievements(user)
  }

  // Loader mientras carga
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
        <p className="text-gray-600">Cargando datos...</p>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <header>
        {/* Aquí pon tu header, navegación, etc */}
      </header>
      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {/* Botón para abrir el modal de reconocimiento */}
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setShowRecognition(true)}>
            Enviar reconocimiento
          </Button>
        </div>

        {/* Dashboard original */}
        {viewingUserAchievements ? (
          <AchievementsSection
            medals={medals}
            currentUser={currentUser}
            users={users}
            values={values}
            onRefreshData={loadData}
          />
        ) : (
          <>
            <StatsGrid medals={medals} currentUser={currentUser} users={users} />
            <SectionsGrid
              openSection={setActiveSection}
              medals={medals}
              users={users}
              currentUser={currentUser}
              values={values}
            />
            {activeSection && (
              <ExpandedContent
                activeSection={activeSection}
                medals={medals}
                users={users}
                currentUser={currentUser}
                values={values}
                onAddMedal={handleAddMedal}
                setActiveSection={setActiveSection}
                onRefreshData={loadData}
                onViewAchievements={handleViewAchievements}
              />
            )}
          </>
        )}

        {/* MODAL de envío de reconocimiento */}
        {showRecognition && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg relative">
              <GiveRecognitionSection
                users={users}
                values={values}
                currentUser={currentUser}
                onRecognitionSent={async () => {
                  await loadData()
                  setShowRecognition(false)
                }}
                onShowValues={() => {
                  // Lógica para mostrar valores si lo deseas
                }}
              />
              <Button
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={() => setShowRecognition(false)}
              >
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}