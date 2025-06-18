import { supabase, isSupabaseConfigured } from "./supabase"
import type { User, Value, Medal } from "./types"
import { appData, addUser } from "./data"

export const databaseService = {
  // Usuarios
  async getUsers(): Promise<User[]> {
    if (!isSupabaseConfigured()) {
      return appData.users
    }
    const { data, error } = await supabase!.from("users").select("*").order("name")
    if (error) throw error
    return data.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || "",
      team: user.team || "",
      area: user.area || "",
      avatar: user.avatar || "/placeholder.svg?height=40&width=40",
      birthday: user.birthday || "",
      isAdmin: user.is_admin,
    }))
  },

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
      isAdmin: data.is_admin,
    }
  },

  async createUser(user: {
    id: string,
    name: string,
    email: string,
    department?: string,
    team?: string,
    area?: string,
    avatar?: string,
    birthday?: string,
    is_admin?: boolean
  }): Promise<User> {
    if (!isSupabaseConfigured()) {
      return addUser(user)
    }
    const { data, error } = await supabase!
      .from("users")
      .insert([user])
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
      isAdmin: data.is_admin,
    }
  },

  // Valores corporativos
  async getValues(): Promise<Value[]> {
    if (!isSupabaseConfigured()) {
      return appData.values
    }
    const { data, error } = await supabase!.from("values").select("*").order("name")
    if (error) throw error
    return data
  },

  // Reconocimientos
  async getMedals(): Promise<Medal[]> {
    if (!isSupabaseConfigured()) {
      return appData.medals
    }
    const { data, error } = await supabase!
      .from("medals")
      .select(`
        *,
        giver:giver_id(id, name, email, avatar),
        recipient:recipient_id(id, name, email, avatar),
        medal_comments(
          id,
          message,
          created_at,
          user:user_id(id, name)
        ),
        medal_likes(
          id,
          user_id,
          created_at
        )
      `)
      .order("created_at", { ascending: false })
    if (error) throw error
    return data.map((medal) => ({
      id: medal.id,
      giver: {
        id: medal.giver.id,
        name: medal.giver.name,
        email: medal.giver.email,
        avatar: medal.giver.avatar || "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: medal.recipient.id,
        name: medal.recipient.name,
        email: medal.recipient.email,
        avatar: medal.recipient.avatar || "/placeholder.svg?height=40&width=40",
      },
      value: medal.value_name,
      message: medal.message,
      timestamp: medal.created_at,
      isPublic: medal.is_public,
      likes: medal.medal_likes?.length || 0,
      comments:
        medal.medal_comments?.map((comment) => ({
          id: comment.id,
          user: comment.user.name,
          message: comment.message,
          timestamp: comment.created_at,
        })) || [],
    }))
  },

  async createMedal(medal: {
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }): Promise<Medal> {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo
      const newMedal: Medal = {
        id: `medal-${Date.now()}`,
        giver: {
          id: "dev-user-1",
          name: "Usuario Demo",
          email: "demo@empresa.com",
          avatar: "/placeholder.svg?height=40&width=40",
        },
        recipient: appData.users.find((u) => u.id === medal.recipient_id) || appData.users[0],
        value: medal.value_name,
        message: medal.message,
        timestamp: new Date().toISOString(),
        isPublic: medal.is_public,
        likes: 0,
        comments: [],
      }
      appData.medals.unshift(newMedal)
      return newMedal
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
        giver:giver_id(id, name, email, avatar),
        recipient:recipient_id(id, name, email, avatar)
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

  // Comentarios / felicitaciones en reconocimientos
  async addComment(medalId: string, message: string): Promise<{
    id: string
    user: string
    message: string
    timestamp: string
  }> {
    if (!isSupabaseConfigured()) {
      // modo local
      return appData.addComment(medalId, { user: "Usuario Demo", message })
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
      .select("id, message, created_at, user:user_id(name)")
      .single()
    if (error) throw error

    return {
      id: data.id,
      user: data.user.name,
      message: data.message,
      timestamp: data.created_at,
    }
  },

  // Likes en reconocimientos
  async toggleLike(medalId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      console.log("Like toggled for medal:", medalId)
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
      // Quitar like
      const { error } = await supabase!.from("medal_likes").delete().eq("id", existingLike.id)
      if (error) throw error
      return false
    } else {
      // Agregar like
      const { error } = await supabase!.from("medal_likes").insert({
        medal_id: medalId,
        user_id: user.id,
      })
      if (error) throw error
      return true
    }
  },
}