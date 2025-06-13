"use client"

import type React from "react"
import { useState } from "react"
import type { User, Value } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { HelpCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface GiveRecognitionSectionProps {
  users: User[]
  values: Value[]
  currentUser: User
  onAddMedal: (medal: {
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }) => Promise<void>
  onShowValues: () => void
}

export function GiveRecognitionSection({
  users,
  values,
  currentUser,
  onAddMedal,
  onShowValues,
}: GiveRecognitionSectionProps) {
  const [selectedUser, setSelectedUser] = useState("")
  const [selectedValue, setSelectedValue] = useState("")
  const [message, setMessage] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const availableUsers = users.filter((user) => user.id !== currentUser.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser || !selectedValue || !message.trim()) return

    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      await onAddMedal({
        recipient_id: selectedUser,
        value_name: selectedValue,
        message: message.trim(),
        is_public: isPublic,
      })

      // Limpiar formulario
      setSelectedUser("")
      setSelectedValue("")
      setMessage("")
      setSuccess(true)

      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError("Error al enviar el reconocimiento. Inténtalo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">¡Reconocimiento enviado exitosamente! 🎉</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="user-select">Persona a reconocer</Label>
          <Select value={selectedUser} onValueChange={setSelectedUser} required>
            <SelectTrigger id="user-select">
              <SelectValue placeholder="Selecciona una persona..." />
            </SelectTrigger>
            <SelectContent>
              {availableUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name} - {user.area} ({user.team})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value-select" className="flex items-center gap-2">
            Valor a reconocer
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="p-0 h-5 w-5 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
              onClick={onShowValues}
              title="Ver información de valores"
            >
              <HelpCircle className="h-3 w-3" />
            </Button>
          </Label>
          <Select value={selectedValue} onValueChange={setSelectedValue} required>
            <SelectTrigger id="value-select">
              <SelectValue placeholder="Selecciona un valor..." />
            </SelectTrigger>
            <SelectContent>
              {values.map((value) => (
                <SelectItem key={value.name} value={value.name}>
                  {value.icon} {value.name} - {value.description}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Mensaje de reconocimiento</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe por qué merece este reconocimiento..."
            rows={4}
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="public" checked={isPublic} onCheckedChange={(checked) => setIsPublic(checked as boolean)} />
          <Label htmlFor="public" className="text-sm">
            Hacer público este reconocimiento
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
          disabled={isSubmitting || !selectedUser || !selectedValue || !message.trim()}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            "Enviar Reconocimiento"
          )}
        </Button>
      </form>
    </div>
  )
}
