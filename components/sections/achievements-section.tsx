"use client"

import { useState } from "react"
import type { Medal, User, Value } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Send } from "lucide-react"
import { addComment } from "@/lib/data"

interface AchievementsSectionProps {
  medals: Medal[]
  currentUser: User
  users: User[]
  values: Value[]
  onRefreshData: () => Promise<void>
}

export function AchievementsSection({ medals, currentUser, users, values, onRefreshData }: AchievementsSectionProps) {
  const userMedals = medals.filter((m) => m.recipient.id === currentUser.id)
  const recentMedals = userMedals.slice(0, 6)
  const [likedMedals, setLikedMedals] = useState(new Set<string>())
  const [showComments, setShowComments] = useState(new Set<string>())
  const [newComments, setNewComments] = useState<Record<string, string>>({})

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getValueData = (valueName: string) => {
    return values.find((v) => v.name === valueName) || { color: "#gray", icon: "🏆" }
  }

  const handleLike = async (medalId: string) => {
    const newLiked = new Set(likedMedals)
    if (newLiked.has(medalId)) {
      newLiked.delete(medalId)
    } else {
      newLiked.add(medalId)
    }
    setLikedMedals(newLiked)

    // Simular actualización de likes
    const medal = medals.find((m) => m.id === medalId)
    if (medal) {
      medal.likes += newLiked.has(medalId) ? 1 : -1
    }
  }

  const toggleComments = (medalId: string) => {
    const newShow = new Set(showComments)
    if (newShow.has(medalId)) {
      newShow.delete(medalId)
    } else {
      newShow.add(medalId)
    }
    setShowComments(newShow)
  }

  const handleAddComment = (medalId: string) => {
    const commentText = newComments[medalId]?.trim()
    if (!commentText) return

    const newComment = addComment(medalId, {
      user: currentUser.name,
      message: commentText,
    })

    if (newComment) {
      // Limpiar el campo de comentario
      setNewComments((prev) => ({ ...prev, [medalId]: "" }))
      // Refrescar datos si es necesario
      onRefreshData()
    }
  }

  const updateComment = (medalId: string, value: string) => {
    setNewComments((prev) => ({ ...prev, [medalId]: value }))
  }

  return (
    <div>
      {recentMedals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4 grayscale-[30%]">🏆</div>
          <div className="text-xl font-semibold text-gray-700 mb-2">No tienes reconocimientos aún</div>
          <div className="text-gray-500 max-w-md mx-auto">
            ¡Sigue trabajando duro y pronto aparecerán aquí! Los reconocimientos son una forma de celebrar tus logros y
            contribuciones al equipo.
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentMedals.map((medal, index) => {
            const valueData = getValueData(medal.value)
            const isLiked = likedMedals.has(medal.id)
            const showMedalComments = showComments.has(medal.id)

            return (
              <Card key={medal.id} className="p-6 animate-slideUp" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="mb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-gray-500">
                      Enviado por: <strong>{medal.giver.name}</strong>
                    </span>
                    <div
                      className="inline-flex items-center px-2 py-1 rounded-sm text-xs font-semibold border"
                      style={{
                        backgroundColor: valueData.color + "20",
                        color: valueData.color,
                        borderColor: valueData.color + "30",
                      }}
                    >
                      {valueData.icon} {medal.value}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{formatDate(medal.timestamp)}</div>
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">Motivo:</div>
                  <p className="text-sm text-gray-600 leading-relaxed">"{medal.message}"</p>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center gap-2 ${isLiked ? "text-red-500 bg-red-50" : "text-gray-600"}`}
                    onClick={() => handleLike(medal.id)}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                    <span>{medal.likes}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-gray-600"
                    onClick={() => toggleComments(medal.id)}
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>{medal.comments?.length || 0}</span>
                  </Button>
                </div>

                {showMedalComments && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-semibold mb-3">Comentarios:</h4>

                    {/* Comentarios existentes */}
                    {medal.comments && medal.comments.length > 0 && (
                      <div className="space-y-2 mb-3">
                        {medal.comments.map((comment) => (
                          <div key={comment.id} className="text-xs bg-white p-2 rounded border">
                            <div className="font-semibold text-gray-700">{comment.user}</div>
                            <div className="text-gray-600">{comment.message}</div>
                            <div className="text-gray-400 text-xs mt-1">
                              {new Date(comment.timestamp).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Agregar nuevo comentario */}
                    <div className="space-y-2">
                      <Textarea
                        placeholder="Escribe un comentario..."
                        value={newComments[medal.id] || ""}
                        onChange={(e) => updateComment(medal.id, e.target.value)}
                        rows={2}
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleAddComment(medal.id)}
                        disabled={!newComments[medal.id]?.trim()}
                        className="w-full"
                      >
                        <Send className="w-3 h-3 mr-1" />
                        Comentar
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
