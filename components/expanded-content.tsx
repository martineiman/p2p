import type React from "react"
import type { Medal, User, Value } from "@/lib/types"
import { BirthdaysSection } from "@/components/sections/birthdays-section"
import { DestacadosSection } from "@/components/sections/destacados-section"
import { MetricsSection } from "@/components/sections/metrics-section"
import { ValuesSection } from "@/components/sections/values-section"
import { ADNSection } from "@/components/sections/adn-section"
import { AchievementsSection } from "@/components/sections/achievements-section"
import { PeopleSearchSection } from "@/components/sections/people-search-section"
import { GiveRecognitionSection } from "@/components/sections/give-recognition-section"
import ManageUsersSection from "@/components/sections/manage-users-section"

interface ExpandedContentProps {
  activeSection: string
  medals: Medal[]
  users: User[]
  currentUser: User
  values: Value[]
  onAddMedal: (medal: {
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }) => Promise<void>
  setActiveSection: (section: string | null) => void
  onRefreshData: () => Promise<void>
  onViewAchievements: (user: User) => void
}

export function ExpandedContent({
  activeSection,
  medals,
  users,
  currentUser,
  values,
  onAddMedal,
  setActiveSection,
  onRefreshData,
  onViewAchievements,
}: ExpandedContentProps) {
  const sectionConfig: Record<string, { title: string; subtitle: string; component: React.ReactNode }> = {
    birthdays: {
      title: "🎂 Cumpleaños del Equipo",
      subtitle: "Próximos cumpleaños y felicitaciones",
      component: <BirthdaysSection users={users} />,
    },
    destacados: {
      title: "🏅 Destacados del Mes",
      subtitle: "Los empleados más reconocidos este mes",
      component: <DestacadosSection medals={medals} users={users} onViewAchievements={onViewAchievements} />,
    },
    metrics: {
      title: "📊 Métricas del Sistema",
      subtitle: "Análisis de interacciones y reconocimientos",
      component: <MetricsSection medals={medals} users={users} currentUser={currentUser} />,
    },
    values: {
      title: "💎 Nuestros Valores Corporativos",
      subtitle: "Conoce nuestros valores y cómo aplicarlos",
      component: <ValuesSection values={values} />,
    },
    adn: {
      title: "🧬 ADN de Reconocimientos",
      subtitle: "Tu perfil de valores y el de tu equipo",
      component: <ADNSection medals={medals} currentUser={currentUser} values={values} users={users} />,
    },
    achievements: {
      title: "🏆 Vitrina de Logros",
      subtitle: "Tus reconocimientos recibidos",
      component: (
        <AchievementsSection
          medals={medals}
          currentUser={currentUser}
          users={users}
          values={values}
          onRefreshData={onRefreshData}
        />
      ),
    },
    search: {
      title: "🔍 Buscar Personas",
      subtitle: "Explora perfiles y logros de tus compañeros",
      component: (
        <PeopleSearchSection
          users={users}
          medals={medals}
          values={values}
          currentUser={currentUser}
          onViewAchievements={onViewAchievements}
        />
      ),
    },
    recognition: {
      title: "⭐ Enviar Reconocimiento",
      subtitle: "Reconoce el gran trabajo de tus compañeros",
      component: (
        <GiveRecognitionSection
          users={users}
          values={values}
          currentUser={currentUser}
          onAddMedal={onAddMedal}
          onShowValues={() => setActiveSection("values")}
        />
      ),
    },
    manage: {
      title: "👥 Gestión de Empleados",
      subtitle: "Agregar y editar información de empleados",
      component: <ManageUsersSection users={users} onRefreshData={onRefreshData} />,
    },
  }

  const config = sectionConfig[activeSection]
  if (!config) return null

  return (
    <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden animate-slideDown">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-orange-50 to-white">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{config.title}</h2>
        <p className="text-gray-600 text-sm">{config.subtitle}</p>
      </div>
      <div className="p-6">{config.component}</div>
    </div>
  )
}
