import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Save } from "lucide-react"
import { User } from "@/lib/types"
import { databaseService } from "@/lib/database"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const areas = ["IT", "Marketing", "HR", "Sales"]
const teams = [
  "UX/UI", "Architecture", "QA", "Implementation", "Tables & Params", "Corporate", "Content", "Recruiting"
]

function isUUID(id: string) {
  return /^[0-9a-fA-F-]{36}$/.test(id)
}

interface ManageUsersSectionProps {
  users: User[]
  onUserEdited?: (user: User) => void
}

export function ManageUsersSection({ users, onUserEdited }: ManageUsersSectionProps) {
  const [editingUser, setEditingUser] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (field: keyof User, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleEditUser = (user: User) => {
    setEditingUser(user.id)
    setFormData({
      ...user,
      birthday: user.birthday ? user.birthday.slice(0, 10) : "",
    })
  }

  const handleSaveEdit = async () => {
    setError(null)
    if (editingUser && formData.name && formData.birthday) {
      setIsLoading(true)
      try {
        const updatedUser = await databaseService.updateUser(editingUser, formData)
        if (onUserEdited) onUserEdited(updatedUser)
        setEditingUser(null)
        setFormData({})
      } catch (e: any) {
        setError(e.message || "Error editing user")
      } finally {
        setIsLoading(false)
      }
    } else {
      setError("Fill all required fields.")
    }
  }

  const handleCancelEdit = () => {
    setEditingUser(null)
    setFormData({})
    setError(null)
  }

  const validUsers = users.filter(user => isUUID(user.id))

  return (
    <div>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mt-6">
        {validUsers.map((user) => (
          <Card key={user.id} className="p-4 flex items-center gap-4 mb-2">
            <div>{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
            <div className="ml-auto">
              <Button variant="outline" onClick={() => handleEditUser(user)}>
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
      {editingUser && (
        <Card className="p-4 mt-4">
          <Input
            value={formData.name || ""}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Name"
          />
          <Select value={formData.area || ""} onValueChange={(value) => handleInputChange("area", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Area" />
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
              <SelectValue placeholder="Team" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
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
          <Input
            value={formData.department || ""}
            onChange={(e) => handleInputChange("department", e.target.value)}
            placeholder="Department"
          />
          <div className="flex gap-3 mt-4">
            <Button onClick={handleSaveEdit} disabled={!formData.name || !formData.birthday || isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Saving..." : "Save"}
            </Button>
            <Button variant="outline" onClick={handleCancelEdit} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
