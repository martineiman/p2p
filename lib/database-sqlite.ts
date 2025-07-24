import db from './sqlite'
import type { User, Value, Medal } from './types'
import { randomBytes } from 'crypto'

function generateId(): string {
  return randomBytes(16).toString('hex')
}

export const databaseService = {
  // Obtener todos los usuarios
  async getUsers(): Promise<User[]> {
    const stmt = db.prepare('SELECT * FROM users ORDER BY name')
    const users = stmt.all() as any[]
    
    return users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || '',
      team: user.team || '',
      area: user.area || '',
      avatar: user.avatar || '/placeholder.svg?height=40&width=40',
      birthday: user.birthday || '',
      isAdmin: Boolean(user.is_admin)
    }))
  },

  // Obtener un usuario por ID
  async getUserById(id: string): Promise<User | null> {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    const user = stmt.get(id) as any
    
    if (!user) return null
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      department: user.department || '',
      team: user.team || '',
      area: user.area || '',
      avatar: user.avatar || '/placeholder.svg?height=40&width=40',
      birthday: user.birthday || '',
      isAdmin: Boolean(user.is_admin)
    }
  },

  // Actualizar usuario
  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    try {
      const allowedFields = ['name', 'department', 'team', 'area', 'avatar', 'birthday', 'isAdmin']
      const updateFields: string[] = []
      const values: any[] = []

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key) && value !== undefined) {
          const dbField = key === 'isAdmin' ? 'is_admin' : key
          updateFields.push(`${dbField} = ?`)
          values.push(key === 'isAdmin' ? (value ? 1 : 0) : value)
        }
      }

      if (updateFields.length === 0) return null

      values.push(id)
      const stmt = db.prepare(`
        UPDATE users 
        SET ${updateFields.join(', ')}, updated_at = datetime('now')
        WHERE id = ?
      `)

      stmt.run(...values)
      return this.getUserById(id)
    } catch (error) {
      throw new Error('Error al actualizar usuario')
    }
  },

  // Obtener valores corporativos
  async getValues(): Promise<Value[]> {
    const stmt = db.prepare('SELECT * FROM values ORDER BY name')
    return stmt.all() as Value[]
  },

  // Obtener reconocimientos con información completa
  async getMedals(): Promise<Medal[]> {
    const stmt = db.prepare(`
      SELECT 
        m.*,
        g.name as giver_name,
        g.email as giver_email,
        g.avatar as giver_avatar,
        r.name as recipient_name,
        r.email as recipient_email,
        r.avatar as recipient_avatar
      FROM medals m
      JOIN users g ON m.giver_id = g.id
      JOIN users r ON m.recipient_id = r.id
      ORDER BY m.created_at DESC
    `)
    
    const medals = stmt.all() as any[]
    
    // Obtener comentarios para cada medalla
    const commentsStmt = db.prepare(`
      SELECT 
        mc.*,
        u.name as user_name
      FROM medal_comments mc
      JOIN users u ON mc.user_id = u.id
      WHERE mc.medal_id = ?
      ORDER BY mc.created_at ASC
    `)

    return medals.map(medal => ({
      id: medal.id,
      giver: {
        id: medal.giver_id,
        name: medal.giver_name,
        email: medal.giver_email,
        avatar: medal.giver_avatar || '/placeholder.svg?height=40&width=40'
      },
      recipient: {
        id: medal.recipient_id,
        name: medal.recipient_name,
        email: medal.recipient_email,
        avatar: medal.recipient_avatar || '/placeholder.svg?height=40&width=40'
      },
      value: medal.value_name,
      message: medal.message,
      timestamp: medal.created_at,
      isPublic: Boolean(medal.is_public),
      likes: medal.likes || 0,
      comments: commentsStmt.all(medal.id).map((comment: any) => ({
        id: comment.id,
        user: comment.user_name,
        message: comment.message,
        timestamp: comment.created_at
      }))
    }))
  },

  // Crear reconocimiento
  async createMedal(medal: {
    giver_id: string
    recipient_id: string
    value_name: string
    message: string
    is_public: boolean
  }): Promise<Medal> {
    const medalId = generateId()
    
    const stmt = db.prepare(`
      INSERT INTO medals (id, giver_id, recipient_id, value_name, message, is_public)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      medalId,
      medal.giver_id,
      medal.recipient_id,
      medal.value_name,
      medal.message,
      medal.is_public ? 1 : 0
    )

    // Obtener la medalla creada con información completa
    const createdMedal = db.prepare(`
      SELECT 
        m.*,
        g.name as giver_name,
        g.email as giver_email,
        g.avatar as giver_avatar,
        r.name as recipient_name,
        r.email as recipient_email,
        r.avatar as recipient_avatar
      FROM medals m
      JOIN users g ON m.giver_id = g.id
      JOIN users r ON m.recipient_id = r.id
      WHERE m.id = ?
    `).get(medalId) as any

    return {
      id: createdMedal.id,
      giver: {
        id: createdMedal.giver_id,
        name: createdMedal.giver_name,
        email: createdMedal.giver_email,
        avatar: createdMedal.giver_avatar || '/placeholder.svg?height=40&width=40'
      },
      recipient: {
        id: createdMedal.recipient_id,
        name: createdMedal.recipient_name,
        email: createdMedal.recipient_email,
        avatar: createdMedal.recipient_avatar || '/placeholder.svg?height=40&width=40'
      },
      value: createdMedal.value_name,
      message: createdMedal.message,
      timestamp: createdMedal.created_at,
      isPublic: Boolean(createdMedal.is_public),
      likes: 0,
      comments: []
    }
  },

  // Agregar comentario
  async addComment(medalId: string, userId: string, message: string): Promise<{
    id: string
    user: string
    message: string
    timestamp: string
  }> {
    const commentId = generateId()
    
    const stmt = db.prepare(`
      INSERT INTO medal_comments (id, medal_id, user_id, message)
      VALUES (?, ?, ?, ?)
    `)
    
    stmt.run(commentId, medalId, userId, message)

    // Obtener el comentario con información del usuario
    const comment = db.prepare(`
      SELECT 
        mc.*,
        u.name as user_name
      FROM medal_comments mc
      JOIN users u ON mc.user_id = u.id
      WHERE mc.id = ?
    `).get(commentId) as any

    return {
      id: comment.id,
      user: comment.user_name,
      message: comment.message,
      timestamp: comment.created_at
    }
  },

  // Toggle like
  async toggleLike(medalId: string, userId: string): Promise<boolean> {
    // Verificar si ya existe el like
    const existingLike = db.prepare(`
      SELECT id FROM medal_likes 
      WHERE medal_id = ? AND user_id = ?
    `).get(medalId, userId)

    if (existingLike) {
      // Quitar like
      db.prepare('DELETE FROM medal_likes WHERE id = ?').run((existingLike as any).id)
      
      // Decrementar contador
      db.prepare(`
        UPDATE medals 
        SET likes = likes - 1 
        WHERE id = ?
      `).run(medalId)
      
      return false
    } else {
      // Agregar like
      const likeId = generateId()
      db.prepare(`
        INSERT INTO medal_likes (id, medal_id, user_id)
        VALUES (?, ?, ?)
      `).run(likeId, medalId, userId)
      
      // Incrementar contador
      db.prepare(`
        UPDATE medals 
        SET likes = likes + 1 
        WHERE id = ?
      `).run(medalId)
      
      return true
    }
  }
}