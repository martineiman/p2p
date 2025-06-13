"use client"

import { useState } from "react"
import type { Medal, User, Value } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface PeopleSearchSectionProps {
  users: User[]
  medals: Medal[]
  values: Value[]
  currentUser: User
  onViewAchievements: (user: User) => void
}

export function PeopleSearchSection({
  users,
  medals,
  values,
  currentUser,
  onViewAchievements,
}: PeopleSearchSectionProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.id !== currentUser.id &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.area.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getUserStats = (userId: string) => {
    const userMedals = medals.filter((m) => m.recipient.id === userId)
    const valueCounts: Record<string, number> = {}

    userMedals.forEach((medal) => {
      valueCounts[medal.value] = (valueCounts[medal.value] || 0) + 1
    })

    return {
      total: userMedals.length,
      values: Object.entries(valueCounts)
        .map(([value, count]) => ({
          value,
          count,
          color: values.find((v) => v.name === value)?.color || "#gray",
          icon: values.find((v) => v.name === value)?.icon || "🏆",
        }))
        .sort((a, b) => b.count - a.count),
    }
  }

  return (
    <div>
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Buscar por nombre, departamento, equipo o área..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user, index) => {
          const stats = getUserStats(user.id)
          return (
            <Card
              key={user.id}
              className="p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105 animate-slideUp"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => onViewAchievements(user)}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <Image
                    src={user.avatar || "/placeholder.svg?height=48&width=48"}
                    alt={user.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">
                    {user.area} - {user.team}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {stats.total} reconocimiento{stats.total !== 1 ? "s" : ""}
                </span>
                <div className="flex gap-1">
                  {stats.values.slice(0, 3).map((value, index) => (
                    <span key={index} className="text-xs" title={`${value.value}: ${value.count}`}>
                      {value.icon}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <Button variant="outline" size="sm" className="w-full">
                  Ver vitrina de logros
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredUsers.length === 0 && searchTerm && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4 grayscale-[30%]">🔍</div>
          <div className="text-xl font-semibold text-gray-700 mb-2">No se encontraron resultados</div>
          <div className="text-gray-500 max-w-md mx-auto">
            Intenta con otros términos de búsqueda. Puedes buscar por nombre, departamento, equipo o área.
          </div>
        </div>
      )}
    </div>
  )
}
