import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import { User } from "@/lib/types"
import { databaseService } from "@/lib/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const areas = ["IT", "Marketing", "RRHH", "Ventas"]
const equipos = [
  "UX/UI",
  "Arquitectura",
  "QA",
  "Implementación",
  "Tabla y Parámetros",
  "Corporativo",
  "Contenido",
  "Reclutamiento",
]

interface ManageUsersSectionProps {
  users: User[]
  onUserAdded?: (user: User) => void
  onUserEdited?: (user: User) => void
}

export function ManageUsersSection({ users, onUserAdded, onUserEdited }: ManageUsersSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Nuevo usuario
  const handleAddUser = async () => {
    setError(null)
    if (formData.name && formData.email && formData.birthday) {
      setIsLoading(true)
      try {
        // Aquí podrías generar un UUID o dejar que Supabase lo genere (idealmente, integrarlo con auth)
        // Por simplicidad, lo dejamos en blanco y Supabase espera que el usuario ya exista en auth.users
        const userToSave = {
          ...formData,
          is_admin: false,
        } as User
        const user = await databaseService.createUser(userToSave)
        if (onUserAdded) onUserAdded(user)
        setShowAddForm(false)
        setFormData({})
      } catch (e: any) {
        setError(e.message || "Error al agregar usuario")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Editar usuario
  const handleEditUser = (user: User) => {
    setEditingUser(user.id)
    setFormData({
      ...user,
      birthday: user.birthday ? user.birthday.slice(0, 10) : "",
    })
  }

  const handleSaveEdit = async () => {
    setError(null)
    if (editingUser && formData.name && formData.email && formData.birthday) {
      setIsLoading(true)
      try {
        // Actualizar usuario en Supabase (puedes agregar un método updateUser en databaseService)
        // Por ahora, solo muestra el flujo
        if (onUserEdited) onUserEdited(formData as User)
        setEditingUser(null)
        setFormData({})
      } catch (e: any) {
        setError(e.message || "Error al editar usuario")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({})
    setError(null)
  }

  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <Button onClick={() => setShowAddForm(true)}>Agregar usuario</Button>
      {showAddForm && (
        <Card className="p-4">
          <Input
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nombre"
          />
          <Input
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Email"
          />
          <Select value={formData.area || ""} onValueChange={(value) => handleInputChange("area", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formData.team || ""} onValueChange={(value) => handleInputChange("team", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Equipo" />
            </SelectTrigger>
            <SelectContent>
              {equipos.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={formData.birthday || ""}
            onChange={(e) => handleInputChange("birthday", e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleAddUser} disabled={!formData.name || !formData.email || !formData.birthday || isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Lista de usuarios */}
      <div className="mt-6">
        {users.map((user) => (
          <Card key={user.id} className="p-4 flex items-center gap-4 mb-2">
            <div>{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => handleEditUser(user)}>
                Editar
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Formulario de edición */}
      {editingUser && (
        <Card className="p-4 mt-4">
          <Input
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Nombre"
          />
          <Input
            value={formData.email || ""}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="Email"
          />
          <Select value={formData.area || ""} onValueChange={(value) => handleInputChange("area", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Área" />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area} value={area}>
                  {area}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={formData.team || ""} onValueChange={(value) => handleInputChange("team", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Equipo" />
            </SelectTrigger>
            <SelectContent>
              {equipos.map((team) => (
                <SelectItem key={team} value={team}>
                  {team}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={formData.birthday || ""}
            onChange={(e) => handleInputChange("birthday", e.target.value)}
          />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSaveEdit} disabled={!formData.name || !formData.email || !formData.birthday || isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
            <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
              Cancelar
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}