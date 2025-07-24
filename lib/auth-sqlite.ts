import db from './sqlite'
import { randomBytes } from 'crypto'
import bcrypt from 'bcryptjs'

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

export interface AuthSession {
  id: string
  user_id: string
  expires_at: string
}

class AuthService {
  // Generar ID único
  private generateId(): string {
    return randomBytes(16).toString('hex')
  }

  // Hash de contraseña
  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
  }

  // Verificar contraseña
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }

  // Crear sesión
  private createSession(userId: string): string {
    const sessionId = this.generateId()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
    
    const stmt = db.prepare(`
      INSERT INTO auth_sessions (id, user_id, expires_at)
      VALUES (?, ?, ?)
    `)
    
    stmt.run(sessionId, userId, expiresAt.toISOString())
    return sessionId
  }

  // Obtener usuario por sesión
  async getUserBySession(sessionId: string): Promise<AuthUser | null> {
    if (!sessionId) return null

    const stmt = db.prepare(`
      SELECT u.*, s.expires_at
      FROM users u
      JOIN auth_sessions s ON u.id = s.user_id
      WHERE s.id = ? AND s.expires_at > datetime('now')
    `)

    const result = stmt.get(sessionId) as any
    if (!result) return null

    return {
      id: result.id,
      email: result.email,
      name: result.name,
      department: result.department,
      team: result.team,
      area: result.area,
      avatar: result.avatar,
      birthday: result.birthday,
      is_admin: Boolean(result.is_admin)
    }
  }

  // Iniciar sesión
  async signIn(email: string, password: string): Promise<{ user: AuthUser; sessionId: string } | { error: string }> {
    try {
      const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
      const user = stmt.get(email) as any

      if (!user) {
        return { error: 'Usuario no encontrado' }
      }

      // Por simplicidad, en este ejemplo no verificamos contraseña hasheada
      // En producción deberías almacenar contraseñas hasheadas
      const sessionId = this.createSession(user.id)

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          department: user.department,
          team: user.team,
          area: user.area,
          avatar: user.avatar,
          birthday: user.birthday,
          is_admin: Boolean(user.is_admin)
        },
        sessionId
      }
    } catch (error) {
      return { error: 'Error al iniciar sesión' }
    }
  }

  // Registrarse
  async signUp(email: string, password: string, name: string): Promise<{ user: AuthUser; sessionId: string } | { error: string }> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
      if (existingUser) {
        return { error: 'El usuario ya existe' }
      }

      const userId = this.generateId()
      const hashedPassword = await this.hashPassword(password)

      const stmt = db.prepare(`
        INSERT INTO users (id, email, name, department, team, area, avatar, birthday, is_admin)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)

      stmt.run(
        userId,
        email,
        name,
        '',
        '',
        '',
        '/placeholder.svg?height=40&width=40',
        '',
        0
      )

      const sessionId = this.createSession(userId)

      return {
        user: {
          id: userId,
          email,
          name,
          department: '',
          team: '',
          area: '',
          avatar: '/placeholder.svg?height=40&width=40',
          birthday: '',
          is_admin: false
        },
        sessionId
      }
    } catch (error) {
      return { error: 'Error al crear la cuenta' }
    }
  }

  // Cerrar sesión
  async signOut(sessionId: string): Promise<void> {
    const stmt = db.prepare('DELETE FROM auth_sessions WHERE id = ?')
    stmt.run(sessionId)
  }

  // Actualizar perfil
  async updateProfile(userId: string, updates: Partial<AuthUser>): Promise<AuthUser | null> {
    try {
      const allowedFields = ['name', 'department', 'team', 'area', 'avatar', 'birthday']
      const updateFields: string[] = []
      const values: any[] = []

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          updateFields.push(`${key} = ?`)
          values.push(value)
        }
      }

      if (updateFields.length === 0) return null

      values.push(userId)
      const stmt = db.prepare(`
        UPDATE users 
        SET ${updateFields.join(', ')}, updated_at = datetime('now')
        WHERE id = ?
      `)

      stmt.run(...values)

      // Obtener usuario actualizado
      const userStmt = db.prepare('SELECT * FROM users WHERE id = ?')
      const user = userStmt.get(userId) as any

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        department: user.department,
        team: user.team,
        area: user.area,
        avatar: user.avatar,
        birthday: user.birthday,
        is_admin: Boolean(user.is_admin)
      }
    } catch (error) {
      return null
    }
  }

  // Limpiar sesiones expiradas
  cleanExpiredSessions(): void {
    const stmt = db.prepare("DELETE FROM auth_sessions WHERE expires_at <= datetime('now')")
    stmt.run()
  }
}

export const authService = new AuthService()