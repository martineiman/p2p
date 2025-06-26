"use client"

import { useState, useEffect } from "react"
import { StatsGrid } from "@/components/stats-grid"
import { SectionsGrid } from "@/components/sections-grid"
import { ExpandedContent } from "@/components/expanded-content"
import { appData } from "@/lib/data"
import type { User, Value, Medal } from "@/lib/types"
import { Loader2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [viewingUserAchievements, setViewingUserAchievements] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [values, setValues] = useState<Value[]>(appData.values)
  const [medals, setMedals] = useState<Medal[]>(appData.medals)
  const [loading, setLoading] = useState(true)

  const currentUser = appData.currentUser

  // Cargar usuarios desde Supabase
  const loadUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase.from("users").select("*")
    if (error) {
      // Si hay error, dejamos usuarios vacío o podrías mostrar una alerta
      setUsers([])
    } else {
      setUsers(data as User[])
    }
    setLoading(false)
  }

  // Lógica para refrescar todos los datos si lo deseas
  const loadData = async () => {
    await loadUsers()
    setValues([...appData.values])
    setMedals([...appData.medals])
  }

  useEffect(() => {
    loadUsers()
    // Si también deseas cargar valores/medallas de Supabase, ponlo aquí
  }, [])

  const handleAddMedal = async (newMedal: {
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }) => {
    const medal: Medal = {
      id: `medal-${Date.now()}`,
      giver: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        avatar: currentUser.avatar,
      },
      recipient: users.find((u) => u.id === newMedal.recipient_id) || users[0],
      value: newMedal.value_name,
      message: newMedal.message,
      timestamp: new Date().toISOString(),
      isPublic: newMedal.is_public,
      likes: 0,
      comments: [],
    }

    setMedals([medal, ...medals])
  }

  const openSection = (sectionType: string) => {
    setActiveSection(activeSection === sectionType ? null : sectionType)
    setViewingUserAchievements(null)
  }

  const handleViewAchievements = (user: User) => {
    setViewingUserAchievements(user)
    setActiveSection(null)
  }

  const handleBackToMain = () => {
    setViewingUserAchievements(null)
    setActiveSection(null)
  }

  if (loading) {
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
      {/* Header */}
      <header className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 py-4 mb-8 shadow-sm backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              P2P
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Sistema P2P</h1>
              <p className="text-sm text-gray-600">Plataforma de Reconocimientos</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900 text-sm">{currentUser.name}</span>
            <span className="text-gray-500 text-xs">
              {currentUser.area} - {currentUser.team}
            </span>
            <Button variant="outline" size="sm" onClick={() => openSection("manage")} className="ml-4">
              👥 Gestionar Empleados
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 md:px-6">
        {viewingUserAchievements ? (
          // Vista de logros de usuario específico
          <div>
            <div className="mb-6 flex items-center gap-4">
              <Button variant="outline" onClick={handleBackToMain} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Vitrina de Logros - {viewingUserAchievements.name}</h2>
                <p className="text-gray-600">
                  {viewingUserAchievements.area} - {viewingUserAchievements.team}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <AchievementsSection
                medals={medals.filter((m) => m.recipient.id === viewingUserAchievements.id)}
                currentUser={viewingUserAchievements}
                users={users}
                values={values}
                onRefreshData={loadData}
              />
            </div>
          </div>
        ) : (
          // Vista principal del dashboard
          <>
            <StatsGrid medals={medals} currentUser={currentUser} users={users} />

            <SectionsGrid
              openSection={openSection}
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
      </div>
    </main>
  )
}