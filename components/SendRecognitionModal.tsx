"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useCurrentUser } from "@/lib/useCurrentUser"
import type { User } from "@/lib/types"

type SendRecognitionModalProps = {
  users: User[]
  values: { name: string, emoji: string }[]
  onSent?: () => void
  onClose?: () => void
}

export function SendRecognitionModal({ users, values, onSent, onClose }: SendRecognitionModalProps) {
  const { user: currentUser, loading } = useCurrentUser()
  const [recipientId, setRecipientId] = useState("")
  const [valueName, setValueName] = useState("")
  const [message, setMessage] = useState("")
  const [isPublic, setIsPublic] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSend = async () => {
    setError(null)
    setSuccess(false)

    if (!currentUser?.id) {
      setError("No se encontró tu usuario. Inicia sesión nuevamente.")
      return
    }
    if (!recipientId || !valueName || !message) {
      setError("Completa todos los campos para enviar un reconocimiento.")
      return
    }
    if (recipientId === currentUser.id) {
      setError("No puedes enviarte un reconocimiento a ti mismo.")
      return
    }

    setSending(true)
    const { error } = await supabase.from("medals").insert({
      giver_id: currentUser.id,
      recipient_id: recipientId,
      value: valueName,
      message,
      is_public: isPublic
    })
    setSending(false)

    if (error) {
      setError("Error al enviar reconocimiento: " + error.message)
    } else {
      setSuccess(true)
      setRecipientId("")
      setValueName("")
      setMessage("")
      setIsPublic(true)
      if (onSent) onSent()
      if (onClose) setTimeout(onClose, 1200)
    }
  }

  return (
    <div className="p-6 bg-white shadow-xl rounded-xl max-w-md w-full">
      <h2 className="text-lg font-bold mb-4">Enviar un reconocimiento</h2>
      {error && <div className="mb-3 text-red-600">{error}</div>}
      {success && <div className="mb-3 text-green-600">¡Reconocimiento enviado!</div>}

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Para:</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={recipientId}
          onChange={e => setRecipientId(e.target.value)}
          disabled={sending}
        >
          <option value="">Selecciona un usuario</option>
          {users
            .filter(u => u.id !== currentUser?.id)
            .map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.area} - {u.team})</option>
            ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Valor:</label>
        <select
          className="w-full border rounded px-2 py-1"
          value={valueName}
          onChange={e => setValueName(e.target.value)}
          disabled={sending}
        >
          <option value="">Selecciona un valor</option>
          {values.map(v => (
            <option key={v.name} value={v.name}>
              {v.emoji} {v.name}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="block mb-1 font-semibold">Mensaje:</label>
        <textarea
          className="w-full border rounded px-2 py-1 resize-none"
          rows={3}
          value={message}
          onChange={e => setMessage(e.target.value)}
          disabled={sending}
        />
      </div>

      <div className="mb-3 flex items-center">
        <input
          type="checkbox"
          id="isPublic"
          checked={isPublic}
          onChange={e => setIsPublic(e.target.checked)}
          disabled={sending}
          className="mr-2"
        />
        <label htmlFor="isPublic">Público (el reconocimiento será visible para todos)</label>
      </div>

      <div className="flex gap-2">
        <button
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded disabled:opacity-60"
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? "Enviando..." : "Enviar"}
        </button>
        {onClose && (
          <button
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-4 py-2 rounded"
            onClick={onClose}
            disabled={sending}
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  )
}