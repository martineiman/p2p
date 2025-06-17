import React, { useState } from "react";
import { Card, Button, Input, Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui";
import Image from "next/image";
import { Save, X, Edit } from "lucide-react";
import type { User } from "@/lib/types";

// Supón que tus áreas y equipos están definidos así o similar
const areas = ["RRHH", "IT", "Ventas", "Marketing", "Operaciones"];
const equipos = ["Equipo 1", "Equipo 2", "Equipo 3", "Equipo 4"];

interface ManageUsersSectionProps {
  users: User[];
  onAddUser: (user: User) => void;
  onEditUser: (user: User) => void;
}

export function ManageUsersSection({ users, onAddUser, onEditUser }: ManageUsersSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [editingUser, setEditingUser] = useState<string | null>(null);

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddUser = () => {
    if (formData.name && formData.email && formData.birthday) {
      // Guardar cumpleaños como string "YYYY-MM-DD"
      const userToSave = {
        ...formData,
        birthday: formData.birthday, // NO convertir a Date
      } as User;
      console.log("[DEBUG][ADD USER]", userToSave);
      onAddUser(userToSave);
      setShowAddForm(false);
      setFormData({});
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user.id);
    setFormData({
      ...user,
      // Elimina la hora si existe
      birthday: user.birthday ? user.birthday.slice(0, 10) : "",
    });
  };

  const handleSaveEdit = () => {
    if (editingUser && formData.name && formData.email && formData.birthday) {
      const userToSave = {
        ...formData,
        birthday: formData.birthday, // NO convertir a Date
      } as User;
      console.log("[DEBUG][EDIT USER]", userToSave);
      onEditUser(userToSave);
      setEditingUser(null);
      setFormData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setFormData({});
  };

  return (
    <div>
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
            <Button onClick={handleAddUser} disabled={!formData.name || !formData.email || !formData.birthday}>
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
  );
}