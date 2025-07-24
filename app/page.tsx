"use client"
import { useState, useEffect } from "react"
import { GiveRecognitionSection } from "@/components/GiveRecognitionSection"
import { StatsGrid } from "@/components/stats-grid"
import { SectionsGrid } from "@/components/sections-grid"
import { ExpandedContent } from "@/components/expanded-content"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import type { User, Value, Medal } from "@/lib/types"

export default function Home() {
  const { user: currentUser } = useAuth()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [viewingUserAchievements, setViewingUserAchievements] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [values, setValues] = useState<Value[]>([])
  const [medals, setMedals] = useState<Medal[]>([])
  const [loading, setLoading] = useState(true)
  const [showRecognition, setShowRecognition] = useState(false)

  // Cargar datos desde la API
  const loadData = async () => {
    setLoading(true)
    try {
      const [usersRes, valuesRes, medalsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/values'),
        fetch('/api/medals')
      ])
      
      const [usersData, valuesData, medalsData] = await Promise.all([
        usersRes.json(),
        valuesRes.json(),
        medalsRes.json()
      ])
      
      setUsers(usersData)
      setValues(valuesData)
      setMedals(medalsData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }


  useEffect(() => {
    if (currentUser) {
      loadData()
    }
  }, [currentUser])

  const handleAddMedal = async () => {
    await loadData()
  }
  
  const handleViewAchievements = (user: User) => {
    setViewingUserAchievements(user)
  }

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-orange-500" />
          <p className="text-gray-600">Cargando datos...</p>
        </div>
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