"use client"

import type { Medal, User } from "@/lib/types"
import { getMonthlyHighlights } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import Image from "next/image"

interface DestacadosSectionProps {
  medals: Medal[]
  users: User[]
  onViewAchievements: (user: User) => void
}

export function DestacadosSection({ medals, users, onViewAchievements }: DestacadosSectionProps) {
  const highlights = getMonthlyHighlights(medals, users)
  const top3 = highlights.slice(0, 3)
  const rest = highlights.slice(3)

  const getPodiumPosition = (index: number) => {
    const positions = ["1º", "2º", "3º"]
    return positions[index]
  }

  const getPodiumHeight = (index: number) => {
    const heights = ["h-32", "h-24", "h-20"]
    return heights[index]
  }

  const getPodiumColor = (index: number) => {
    const colors = [
      "from-amber-400 to-amber-300 text-amber-900",
      "from-gray-300 to-gray-200 text-gray-700",
      "from-amber-700 to-amber-600 text-white",
    ]
    return colors[index]
  }

  return (
    <div>
      {top3.length > 0 && (
        <div className="flex justify-center items-end gap-4 mb-6 p-6">
          {top3.map((highlight, index) => (
            <div
              key={highlight.user.id}
              className={`flex flex-col items-center text-center cursor-pointer transition-all hover:scale-105 ${
                index === 0 ? "order-2" : index === 1 ? "order-1" : "order-3"
              }`}
              onClick={() => onViewAchievements(highlight.user)}
            >
              <Image
                src={highlight.user.avatar || "/placeholder.svg?height=60&width=60"}
                alt={highlight.user.name}
                width={index === 0 ? 80 : 60}
                height={index === 0 ? 80 : 60}
                className="rounded-full object-cover mb-2 border-3 hover:shadow-lg transition-shadow"
                style={{
                  borderColor: index === 0 ? "#ffd700" : index === 1 ? "#c0c0c0" : "#cd7f32",
                  borderWidth: "3px",
                }}
              />
              <div className="text-xs font-semibold text-gray-900 mt-1">{highlight.user.name}</div>
              <div className="text-xs text-gray-500 mb-2">({highlight.user.area})</div>
              <div
                className={`w-20 ${getPodiumHeight(index)} bg-gradient-to-br ${getPodiumColor(index)} rounded-t-lg flex flex-col items-center justify-center p-3`}
              >
                <div className="text-2xl font-extrabold mb-1">{getPodiumPosition(index)}</div>
                <div className="text-xs font-semibold">Reconocimientos: {highlight.count}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {rest.length > 0 && (
        <div>
          <h3 className="mb-4 text-gray-700">Resto del ranking</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rest.map((highlight, index) => (
              <Card
                key={highlight.user.id}
                className="p-4 animate-slideUp cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => onViewAchievements(highlight.user)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-bold">
                    {index + 4}
                  </div>
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <Image
                      src={highlight.user.avatar || "/placeholder.svg?height=24&width=24"}
                      alt={highlight.user.name}
                      width={24}
                      height={24}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-900">{highlight.user.name}</div>
                    <div className="text-xs text-gray-500">({highlight.user.area})</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{highlight.count}</div>
                    <div className="text-xs text-gray-500">reconocimientos</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {highlights.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4 grayscale-[30%]">🏆</div>
          <div className="text-xl font-semibold text-gray-700 mb-2">No hay destacados este mes</div>
          <div className="text-gray-500 max-w-md mx-auto">Aún no se han otorgado reconocimientos este mes.</div>
        </div>
      )}
    </div>
  )
}
