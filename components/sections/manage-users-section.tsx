"use client"

import { useState } from "react"
import type { User } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUser, updateUser } from "@/lib/data"
import { Plus, Edit, Save, X } from "lucide-react"
import Image from "next/image"

interface ManageUsersSectionProps {
  users: User[]
  onRefreshData: () => Promise<void>
}

const departments = [
  "Desarrollo",
  "Marketing",
  "Recursos Humanos",
  "Ventas",
  "Diseño",
  "Operaciones",
  "QA",
  "Implementación",
  "Tabla y Parámetros",
]

const teams = [
  "Satélites",
  "Digital",
  "Gestión",
  "Comercial",
  "UX/UI",
  "Arquitectura",
  "QA",
  "Implementación",
  "Tabla y Parámetros",
  "Corporativo",
  "Contenido",
  "Reclutamiento",
]

const areas = ["IT", "Marketing", "RRHH", "Ventas"]

export function ManageUsersSection({ users, onRefreshData }: ManageUsersSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    team: "",
    area: "",
    birthday: "",
    isAdmin: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddUser = () => {
    if (!formData.name || !formData.email) return

    addUser({
      name: formData.name,
      email: formData.email,
      department: formData.department,
      team: formData.team,
      area: formData.area,
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: formData.birthday,
      isAdmin: formData.isAdmin,
    })

    setFormData({
      name: "",
      email: "",
      department: "",
      team: "",
      area: "",
      birthday: "",
      isAdmin: false,
    })
    setShowAddForm(false)
    onRefreshData()
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user.id)
    setFormData({
      name: user.name,
      email: user.email,
      department: user.department,
      team: user.team,
      area: user.area,
      birthday: user.birthday,
      isAdmin: user.isAdmin,
    })
  }

  const handleSaveEdit = () => {
    if (!editingUser) return

    updateUser(editingUser, {
      name: formData.name,
      email: formData.email,
      department: formData.department,
      team: formData.team,
      area: formData.area,
      birthday: formData.birthday,
      isAdmin: formData.isAdmin,
    })

    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      department: "",
      team: "",
      area: "",
      birthday: "",
      isAdmin: false,
    })
    onRefreshData()
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({
      name: "",
      email: "",
      department: "",
      team: "",
      area: "",
      birthday: "",
      isAdmin: false,
    })
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Gestión de Empleados</h3>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Empleado
        </Button>
      </div>

      {/* Formulario para agregar usuario */}
      {showAddForm && (
        <Card className="p-6 mb-6">
          <h4 className="text-md font-semibold mb-4">Agregar Nuevo Empleado</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nombre completo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="email@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Equipo</Label>
              <Select value={formData.team} onValueChange={(value) => handleInputChange("team", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área</Label>
              <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar área" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthday">Fecha de nacimiento</Label>
              <Input
                id="birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) => handleInputChange("birthday", e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleAddUser} disabled={!formData.name || !formData.email}>
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button variant="outline" onClick={() => setShowAddForm(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Lista de usuarios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            {editingUser === user.id ? (
              // Modo edición
              <div className="space-y-3">
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Nombre"
                />
                <Input
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email"
                />
                <Select value={formData.area} onValueChange={(value) => handleInputChange("area", value)}>
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
                <Input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange("birthday", e.target.value)}
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveEdit}>
                    <Save className="w-3 h-3 mr-1" />
                    Guardar
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                    <X className="w-3 h-3 mr-1" />
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              // Modo vista
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar || "/placeholder.svg?height=40&width=40"}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">{user.name}</h4>
                    <p className="text-xs text-gray-600">
                      {user.area} - {user.team}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-3">
                  <div>Email: {user.email}</div>
                  <div>
                    Cumpleaños:{" "}
                    {user.birthday ? new Date(user.birthday).toLocaleDateString("es-ES") : "No especificado"}
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleEditUser(user)} className="w-full">
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
