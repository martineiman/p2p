"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { getUpcomingBirthdays } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"

interface BirthdaysSectionProps {
  users: User[]
}

export function BirthdaysSection({ users }: BirthdaysSectionProps) {
  const upcomingBirthdays = getUpcomingBirthdays(users)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [congratsMessage, setCongratsMessage] = useState("")

  const formatBirthday = (birthday: string) => {
    return new Date(birthday).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
    })
  }

  const handleSendCongrats = (user: User) => {
    if (congratsMessage.trim()) {
      alert(`¡Felicitaciones enviadas a ${user.name}! 🎉`)
      setSelectedUser(null)
      setCongratsMessage("")
    }
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingBirthdays.map((user, index) => (
          <Card key={user.id} className="p-6 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
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

            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-700">{formatBirthday(user.birthday)}</span>
              <span className={`text-sm font-semibold ${user.daysUntil === 0 ? "text-pink-600" : "text-gray-600"}`}>
                {user.daysUntil === 0 ? "¡Hoy!" : `En ${user.daysUntil} día${user.daysUntil !== 1 ? "s" : ""}`}
              </span>
            </div>

            {user.daysUntil === 0 && (
              <Button
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
                onClick={() => setSelectedUser(user)}
              >
                🎉 Felicitar
              </Button>
            )}
          </Card>
        ))}
      </div>

      {selectedUser && (
        <div className="mt-6 p-6 bg-gray-50 rounded-xl">
          <h3 className="mb-4 text-lg font-medium">Felicitar a {selectedUser.name}</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="congrats-message">Mensaje de felicitación</Label>
              <Textarea
                id="congrats-message"
                value={congratsMessage}
                onChange={(e) => setCongratsMessage(e.target.value)}
                placeholder="Escribe tu mensaje de felicitación..."
                rows={4}
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => handleSendCongrats(selectedUser)}
                disabled={!congratsMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                Enviar Felicitación 🎉
              </Button>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
