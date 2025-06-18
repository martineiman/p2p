import { supabase, isSupabaseConfigured } from "./supabase"
import type { User, Value, Medal } from "./types"
import { appData, updateUser as updateUserLocal, addComment as addCommentLocal } from "./data"

// IMPORTANTE: Cambia aquí los nombres de TU tabla y columnas en Supabase.
// Tu tabla es "usuarios", y las columnas principales son:
// - identificación (UUID)
// - nombre (texto)
// - correo electrónico (texto)
// - departamento (texto)
// - equipo (texto)
// - area (texto)
// - avatar (texto)
// - cumpleaños (texto o fecha)
// - es_admin (booleano)

export const databaseService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    if (!isSupabaseConfigured()) {
      return appData.users
    }
    const { data, error } = await supabase!.from("usuarios").select("*").order("nombre")
    if (error) throw error
    return data.map((user: any) => ({
      id: user["identificación"],
      name: user["nombre"],
      email: user["correo electrónico"],
      department: user["departamento"] || "",
      team: user["equipo"] || "",
      area: user["area"] || "",
      avatar: user["avatar"] || "/placeholder.svg?height=40&width=40",
      birthday: user["cumpleaños"] || "",
      is_admin: user["es_admin"] ?? false,
    }))
  },

  // Obtener un usuario por ID
  async getUserById(id: string): Promise<User | null> {
    if (!isSupabaseConfigured()) {
      return appData.users.find((user) => user.id === id) || null
    }
    const { data, error } = await supabase!.from("usuarios").select("*").eq("identificación", id).single()
    if (error) return null
    return {
      id: data["identificación"],
      name: data["nombre"],
      email: data["correo electrónico"],
      department: data["departamento"] || "",
      team: data["equipo"] || "",
      area: data["area"] || "",
      avatar: data["avatar"] || "/placeholder.svg?height=40&width=40",
      birthday: data["cumpleaños"] || "",
      is_admin: data["es_admin"] ?? false,
    }
  },

  // Editar usuario
  // Solo permite editar los campos custom (NO el id ni el email)
  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (!isSupabaseConfigured()) {
      return updateUserLocal(id, updates)
    }
    // Adaptar nombres de campos a los de la base de datos
    const allowedFields: any = {}
    if ("name" in updates) allowedFields["nombre"] = updates.name
    if ("department" in updates) allowedFields["departamento"] = updates.department
    if ("team" in updates) allowedFields["equipo"] = updates.team
    if ("area" in updates) allowedFields["area"] = updates.area
    if ("avatar" in updates) allowedFields["avatar"] = updates.avatar
    if ("birthday" in updates) allowedFields["cumpleaños"] = updates.birthday
    if ("is_admin" in updates) allowedFields["es_admin"] = updates.is_admin

    const { data, error } = await supabase!
      .from("usuarios")
      .update(allowedFields)
      .eq("identificación", id)
      .select("*")
      .single()
    if (error) throw error
    return {
      id: data["identificación"],
      name: data["nombre"],
      email: data["correo electrónico"],
      department: data["departamento"] || "",
      team: data["equipo"] || "",
      area: data["area"] || "",
      avatar: data["avatar"] || "/placeholder.svg?height=40&width=40",
      birthday: data["cumpleaños"] || "",
      is_admin: data["es_admin"] ?? false,
    }
  },

  // Obtener valores corporativos
  async getValues(): Promise<Value[]> {
    if (!isSupabaseConfigured()) {
      return appData.values
    }
    const { data, error } = await supabase!.from("valores").select("*").order("nombre")
    if (error) throw error
    return data
  },

  // Obtener reconocimientos (medallas)
  async getMedals(): Promise<Medal[]> {
    if (!isSupabaseConfigured()) {
      return appData.medals
    }
    const { data, error } = await supabase!
      .from("medallas")
      .select(`
        *,
        otorgante:otorgante_id(identificación, nombre, correo\ electrónico, avatar),
        destinatario:destinatario_id(identificación, nombre, correo\ electrónico, avatar),
        comentarios_de_medallas(
          id,
          mensaje,
          creado_en,
          usuario:usuario_id(identificación, nombre)
        ),
        me_gusta_de_medads(
          id,
          usuario_id,
          creado_en
        )
      `)
      .order("creado_en", { ascending: false })
    if (error) throw error
    return data.map((medal: any) => ({
      id: medal.id,
      giver: {
        id: medal.otorgante?.identificación,
        name: medal.otorgante?.nombre,
        email: medal.otorgante?.["correo electrónico"],
        avatar: medal.otorgante?.avatar || "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: medal.destinatario?.identificación,
        name: medal.destinatario?.nombre,
        email: medal.destinatario?.["correo electrónico"],
        avatar: medal.destinatario?.avatar || "/placeholder.svg?height=40&width=40",
      },
      value: medal.nombre_valor,
      message: medal.mensaje,
      timestamp: medal.creado_en,
      isPublic: medal.es_publico,
      likes: medal.me_gusta_de_medads?.length || 0,
      comments:
        medal.comentarios_de_medallas?.map((comment: any) => ({
          id: comment.id,
          user: comment.usuario.nombre,
          message: comment.mensaje,
          timestamp: comment.creado_en,
        })) || [],
    }))
  },

  // Crear reconocimiento (medalla) -- AJUSTAR nombres de columnas según tu base
  async createMedal(medal: {
    destinatario_id: string
    nombre_valor: string
    mensaje: string
    es_publico: boolean
  }): Promise<Medal> {
    if (!isSupabaseConfigured()) {
      throw new Error("Solo disponible con Supabase configurado")
    }

    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data, error } = await supabase!
      .from("medallas")
      .insert({
        otorgante_id: user.id,
        ...medal,
      })
      .select(`
        *,
        otorgante:otorgante_id(identificación, nombre, correo\ electrónico, avatar),
        destinatario:destinatario_id(identificación, nombre, correo\ electrónico, avatar)
      `)
      .single()
    if (error) throw error

    return {
      id: data.id,
      giver: {
        id: data.otorgante.identificación,
        name: data.otorgante.nombre,
        email: data.otorgante["correo electrónico"],
        avatar: data.otorgante.avatar || "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: data.destinatario.identificación,
        name: data.destinatario.nombre,
        email: data.destinatario["correo electrónico"],
        avatar: data.destinatario.avatar || "/placeholder.svg?height=40&width=40",
      },
      value: data.nombre_valor,
      message: data.mensaje,
      timestamp: data.creado_en,
      isPublic: data.es_publico,
      likes: 0,
      comments: [],
    }
  },

  // Agregar comentario a un reconocimiento
  async addComment(medallaId: string, mensaje: string): Promise<{
    id: string
    user: string
    message: string
    timestamp: string
  }> {
    if (!isSupabaseConfigured()) {
      return addCommentLocal(medallaId, { user: "Usuario Demo", message: mensaje })
    }
    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data, error } = await supabase!
      .from("comentarios_de_medallas")
      .insert({
        medalla_id: medallaId,
        usuario_id: user.id,
        mensaje,
      })
      .select("id, mensaje, creado_en, usuario:usuario_id(nombre)")
      .single()
    if (error) throw error

    return {
      id: data.id,
      user: data.usuario.nombre,
      message: data.mensaje,
      timestamp: data.creado_en,
    }
  },

  // Like/Unlike en reconocimientos
  async toggleLike(medallaId: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      return true
    }
    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data: existingLike } = await supabase!
      .from("me_gusta_de_medads")
      .select("id")
      .eq("medalla_id", medallaId)
      .eq("usuario_id", user.id)
      .single()
    if (existingLike) {
      const { error } = await supabase!.from("me_gusta_de_medads").delete().eq("id", existingLike.id)
      if (error) throw error
      return false
    } else {
      const { error } = await supabase!.from("me_gusta_de_medads").insert({
        medalla_id: medallaId,
        usuario_id: user.id,
      })
      if (error) throw error
      return true
    }
  },
}