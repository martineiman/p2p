"use client"

import type { Medal, User, Value } from "@/lib/types"
import { getMonthlyHighlights, getUpcomingBirthdays } from "@/lib/utils"
import { Activity, Award, Cake, Crown, Dna, MedalIcon, Search, Star } from "lucide-react"

interface SectionsGridProps {
  openSection: (section: string) => void
  medals: Medal[]
  users: User[]
  currentUser: User
  values: Value[]
}

export function SectionsGrid({ openSection, medals, users, currentUser, values }: SectionsGridProps) {
  const upcomingBirthdays = getUpcomingBirthdays(users)
  const nextBirthday = upcomingBirthdays[0]
  const highlights = getMonthlyHighlights(medals, users)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Cumpleaños */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("birthdays")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-orange-500"></div>
        <div className="text-2xl mb-2">
          <Cake className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Cumpleaños</h3>
          {nextBirthday && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full overflow-hidden">
                  <img
                    src={nextBirthday.avatar || "/placeholder.svg?height=24&width=24"}
                    alt={nextBirthday.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-xs font-semibold text-gray-900">{nextBirthday.name}</div>
                  <div className="text-[10px] text-gray-600">
                    {new Date(nextBirthday.birthday).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
                  </div>
                </div>
              </div>
              <div className="text-xs font-bold text-center text-pink-600">
                {nextBirthday.daysUntil === 0
                  ? "¡Hoy!"
                  : `En ${nextBirthday.daysUntil} día${nextBirthday.daysUntil !== 1 ? "s" : ""}`}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Destacados */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("destacados")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-600"></div>
        <div className="text-2xl mb-2">
          <Crown className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Destacados</h3>
          <div className="flex flex-col gap-1">
            {highlights.slice(0, 3).map((highlight, index) => (
              <div key={highlight.user.id} className="flex items-center gap-2 text-[10px]">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px]">
                  {index + 1}
                </div>
                <div className="w-5 h-5 rounded-full overflow-hidden">
                  <img
                    src={highlight.user.avatar || "/placeholder.svg?height=20&width=20"}
                    alt={highlight.user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="flex-1 font-medium text-gray-700 text-[10px]">
                  {highlight.user.name.split(" ")[0]}
                </span>
                <span className="font-bold text-gray-900 text-[10px]">{highlight.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métricas */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("metrics")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700"></div>
        <div className="text-2xl mb-2">
          <Activity className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Métricas</h3>
          <div className="grid grid-cols-3 gap-1">
            <div className="text-center">
              <div className="text-base font-extrabold text-orange-600 mb-1">85%</div>
              <div className="text-[8px] text-gray-600 uppercase tracking-wider">Participación</div>
            </div>
            <div className="text-center">
              <div className="text-base font-extrabold text-orange-600 mb-1">+23%</div>
              <div className="text-[8px] text-gray-600 uppercase tracking-wider">vs Mes Anterior</div>
            </div>
            <div className="text-center">
              <div className="text-base font-extrabold text-orange-600 mb-1">{medals.length}</div>
              <div className="text-[8px] text-gray-600 uppercase tracking-wider">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("values")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-purple-700"></div>
        <div className="text-2xl mb-2">
          <Award className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Valores</h3>
          <div className="grid grid-cols-2 gap-1">
            {values.slice(0, 4).map((value) => (
              <div key={value.name} className="flex items-center gap-1 text-xs font-medium text-gray-700">
                <span>{value.icon}</span>
                <span>{value.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ADN */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("adn")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-700"></div>
        <div className="text-2xl mb-2">
          <Dna className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">ADN</h3>
          <div className="text-xs text-gray-600">Tu perfil de valores y el de tu equipo</div>
        </div>
      </div>

      {/* Logros */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("achievements")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-amber-700"></div>
        <div className="text-2xl mb-2">
          <MedalIcon className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Logros</h3>
          <div className="text-xs text-gray-600">
            {medals.filter((m) => m.recipient.id === currentUser.id).length} reconocimientos recibidos
          </div>
        </div>
      </div>

      {/* Búsqueda */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("search")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-cyan-700"></div>
        <div className="text-2xl mb-2">
          <Search className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Buscar</h3>
          <div className="text-xs text-gray-600">Explora perfiles y logros</div>
        </div>
      </div>

      {/* Reconocimiento */}
      <div
        className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:translate-y-[-4px] cursor-pointer relative overflow-hidden"
        onClick={() => openSection("recognition")}
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 to-red-700"></div>
        <div className="text-2xl mb-2">
          <Star className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-2">Reconocer</h3>
          <div className="text-xs text-gray-600">Envía un reconocimiento</div>
        </div>
      </div>
    </div>
  )
}
