import { supabase, isSupabaseConfigured } from "./supabase"

export interface AuthUser {
  id: string
  email: string
  name: string
  department?: string
  team?: string
  area?: string
  avatar?: string
  birthday?: string
  is_admin: boolean
}

// Usuario de desarrollo por defecto
const DEV_USER: AuthUser = {
  id: "dev-user-1",
  email: "demo@empresa.com",
  name: "Usuario Demo",
  department: "Desarrollo",
  team: "Satélites",
  area: "IT",
  avatar: "/placeholder.svg?height=40&width=40",
  birthday: "1990-03-15",
  is_admin: false,
}

export const authService = {
  // Obtener usuario actual
  async getCurrentUser(): Promise<AuthUser | null> {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - devolver usuario demo
      return DEV_USER
    }

    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase!.from("users").select("*").eq("id", user.id).single()

    if (!profile) return null

    return {
      id: profile.id,
      email: profile.email,
      name: profile.name,
      department: profile.department || undefined,
      team: profile.team || undefined,
      area: profile.area || undefined,
      avatar: profile.avatar || undefined,
      birthday: profile.birthday || undefined,
      is_admin: profile.is_admin,
    }
  },

  // Iniciar sesión
  async signIn(email: string, password: string) {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - simular login exitoso
      return { data: { user: DEV_USER }, error: null }
    }

    const { data, error } = await supabase!.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  },

  // Registrarse
  async signUp(email: string, password: string, name: string) {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - simular registro exitoso
      return { data: { user: { ...DEV_USER, email, name } }, error: null }
    }

    const { data, error } = await supabase!.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    })
    return { data, error }
  },

  // Cerrar sesión
  async signOut() {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - simular logout
      return { error: null }
    }

    const { error } = await supabase!.auth.signOut()
    return { error }
  },

  // Actualizar perfil
  async updateProfile(updates: Partial<AuthUser>) {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - simular actualización
      return { data: { ...DEV_USER, ...updates }, error: null }
    }

    const {
      data: { user },
    } = await supabase!.auth.getUser()
    if (!user) throw new Error("No hay usuario autenticado")

    const { data, error } = await supabase!.from("users").update(updates).eq("id", user.id).select().single()

    return { data, error }
  },

  // Escuchar cambios de autenticación
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    if (!isSupabaseConfigured()) {
      // Modo desarrollo - simular estado de autenticación
      setTimeout(() => callback(DEV_USER), 100)
      return {
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }
    }

    return supabase!.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  },
}
