import { supabase, isSupabaseConfigured } from "./supabase"
import type { User, Value, Medal } from "./types"
import { appData, updateUser as updateUserLocal, addComment as addCommentLocal } from "./data"

// Tablas y campos en inglés:
// users, medals, medal_comments, medal_likes
// Asumo campos: id, name, email, department, team, area, avatar, birthday, is_admin

export const databaseService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    if (!isSupabaseConfigured()) {
      return appData.users
    }
    const { data, error } = await supabase!.from("users").select("*").order("name")
    if (error) throw error
    return data.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || "",
      team: user.team || "",
      area: user.area || "",
      avatar: user.avatar || "/placeholder.svg?height=40&width=40",
      birthday: user.birthday || "",
      is_admin: user.is_admin ?? false,
    }))
  },

  // Obtener un usuario por ID
  async getUserById(id: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return appData.users.find((user) => user.id === id) || null
    }
    const { data, error } = await supabase!.from("users").select("*").eq("id", id).single()
    if (error) return null
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      department: data.department || "",
      team: data.team || "",
      area: data.area || "",
      avatar: data.avatar || "/placeholder.svg?height=40&width=40",
      birthday: data.birthday || "",
      is_admin: data.is_admin ?? false,
    }
  },

  // Editar usuario (solo campos custom)
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!isSupabaseConfigured()) {
      return updateUserLocal(id, updates)
    }
    const allowedFields: any = {}
    if ("name" in updates) allowedFields["name"] = updates.name
    if ("department" in updates) allowedFields["department"] = updates.department
    if ("team" in updates) allowedFields["team"] = updates.team
    if ("area" in updates) allowedFields["area"] = updates.area
    if ("avatar" in updates) allowedFields["avatar"] = updates.avatar
    if ("birthday" in updates) allowedFields["birthday"] = updates.birthday
    if ("is_admin" in updates) allowedFields["is_admin"] = updates.is_admin

    const { data, error } = await supabase!
      .from("users")
      .update(allowedFields)
      .eq("id", id)
      .select("*")
      .single()
    if (error) throw error
    return {
      id: data.id,
      name: data.name,
      email: data.email,
      department: data.department || "",
      team: data.team || "",
      area: data.area || "",
      avatar: data.avatar || "/placeholder.svg?height=40&width=40",
      birthday: data.birthday || "",
      is_admin: data.is_admin ?? false,
    }
  },

  // Obtener valores corporativos (si tienes la tabla, ajusta el nombre)
  async getValues(): Promise<Value[]> {
    if (!isSupabaseConfigured()) {
      return appData.values
    }
    // Ajusta el nombre si tu tabla no es 'values'
    const { data, error } = await supabase!.from("values").select("*").order("name")
    if (error) throw error
    return data
  },

  // Obtener reconocimientos (medallas)
  async getMedals(): Promise<Medal[]> {
    if (!isSupabaseConfigured()) {
      return appData.medals
    }
    const { data, error } = await supabase!
      .from("medals")
      .select(`
        *,
        giver: giver_id (id, name, email, avatar),
        recipient: recipient_id (id, name, email, avatar),
        medal_comments (
          id,
          message,
          created_at,
          user: user_id (id, name)
        ),
        medal_likes (
          id,
          user_id,
          created_at
        )
      `)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data.map((medal: any) => ({
      id: medal.id,
      giver: {
        id: medal.giver?.id,
        name: medal.giver?.name,
        email: medal.giver?.email,
        avatar: medal.giver?.avatar || "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: medal.recipient?.id,
        name: medal.recipient?.name,
        email: medal.recipient?.email,
        avatar: medal.recipient?.avatar || "/placeholder.svg?height=40&width=40",
      },
      value: medal.value_name,
      message: medal.message,
      timestamp: medal.created_at,
      isPublic: medal.is_public,
      likes: medal.medal_likes?.length || 0,
      comments:
        medal.medal_comments?.map((comment: any) => ({
          id: comment.id,
          user: comment.user.name,
          message: comment.message,
          timestamp: comment.created_at,
        })) || [],
    }))
  },

  // Crear reconocimiento (medalla)
  async createMedal(medal: {
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }): Promise<Medal> {
    if (!isSupabaseConfigured()) {
      throw new Error("Solo disponible con Supabase configurado")
    }

    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data, error } = await supabase!
      .from("medals")
      .insert({
        giver_id: user.id,
        ...medal,
      })
      .select(`
        *,
        giver: giver_id (id, name, email, avatar),
        recipient: recipient_id (id, name, email, avatar)
      `)
      .single()
    if (error) throw error

    return {
      id: data.id,
      giver: {
        id: data.giver.id,
        name: data.giver.name,
        email: data.giver.email,
        avatar: data.giver.avatar || "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: data.recipient.id,
        name: data.recipient.name,
        email: data.recipient.email,
        avatar: data.recipient.avatar || "/placeholder.svg?height=40&width=40",
      },
      value: data.value_name,
      message: data.message,
      timestamp: data.created_at,
      isPublic: data.is_public,
      likes: 0,
      comments: [],
    }
  },

  // Agregar comentario a una medalla
  async addComment(medalId: string, message: string): Promise<{
    id: string
    user: string
    message: string
    timestamp: string
  }> {
    if (!isSupabaseConfigured()) {
      return addCommentLocal(medalId, { user: "Demo User", message })
    }
    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data, error } = await supabase!
      .from("medal_comments")
      .insert({
        medal_id: medalId,
        user_id: user.id,
        message,
      })
      .select("id, message, created_at, user: user_id (name)")
      .single()
    if (error) throw error

    return {
      id: data.id,
      user: data.user.name,
      message: data.message,
      timestamp: data.created_at,
    }
  },

  // Like/Unlike en reconocimientos
  async toggleLike(medalId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return true
    }
    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data: existingLike } = await supabase!
      .from("medal_likes")
      .select("id")
      .eq("medal_id", medalId)
      .eq("user_id", user.id)
      .single()
    if (existingLike) {
      const { error } = await supabase!.from("medal_likes").delete().eq("id", existingLike.id)
      if (error) throw error
      return false
    } else {
      const { error } = await supabase!.from("medal_likes").insert({
        medal_id: medalId,
        user_id: user.id,
      })
      if (error) throw error
      return true
    }
  },
}