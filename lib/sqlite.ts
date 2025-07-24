import Database from 'better-sqlite3'
import path from 'path'
import fs from 'fs'

// Crear directorio de base de datos si no existe
const dbDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const dbPath = path.join(dbDir, 'sistema-p2p.db')
const db = new Database(dbPath)

// Habilitar foreign keys
db.pragma('foreign_keys = ON')

// Función para inicializar la base de datos
export function initializeDatabase() {
  // Crear tablas
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      department TEXT,
      team TEXT,
      area TEXT,
      avatar TEXT,
      birthday TEXT,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS values (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      color TEXT NOT NULL,
      icon TEXT NOT NULL,
      description TEXT NOT NULL,
      example TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS medals (
      id TEXT PRIMARY KEY,
      giver_id TEXT NOT NULL,
      recipient_id TEXT NOT NULL,
      value_name TEXT NOT NULL,
      message TEXT NOT NULL,
      is_public INTEGER DEFAULT 1,
      likes INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (giver_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medal_comments (
      id TEXT PRIMARY KEY,
      medal_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (medal_id) REFERENCES medals(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS medal_likes (
      id TEXT PRIMARY KEY,
      medal_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (medal_id) REFERENCES medals(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(medal_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS auth_sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Índices
    CREATE INDEX IF NOT EXISTS idx_medals_giver_id ON medals(giver_id);
    CREATE INDEX IF NOT EXISTS idx_medals_recipient_id ON medals(recipient_id);
    CREATE INDEX IF NOT EXISTS idx_medals_value_name ON medals(value_name);
    CREATE INDEX IF NOT EXISTS idx_medal_comments_medal_id ON medal_comments(medal_id);
    CREATE INDEX IF NOT EXISTS idx_medal_likes_medal_id ON medal_likes(medal_id);
    CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
  `)

  // Insertar datos iniciales si no existen
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number }
  
  if (userCount.count === 0) {
    insertInitialData()
  }
}

function insertInitialData() {
  // Insertar valores corporativos
  const insertValue = db.prepare(`
    INSERT INTO values (id, name, color, icon, description, example)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  const values = [
    {
      id: 'colaboracion',
      name: 'Colaboración',
      color: '#3b82f6',
      icon: '🤝',
      description: 'Trabajar en equipo para lograr objetivos comunes',
      example: 'Ayudar a un compañero con un proyecto complejo, compartir conocimientos o facilitar la comunicación entre equipos.'
    },
    {
      id: 'innovacion',
      name: 'Innovación',
      color: '#ef4444',
      icon: '💡',
      description: 'Buscar nuevas formas de hacer las cosas',
      example: 'Proponer una solución creativa a un problema, implementar una nueva tecnología o mejorar un proceso existente.'
    },
    {
      id: 'excelencia',
      name: 'Excelencia',
      color: '#f59e0b',
      icon: '🌟',
      description: 'Buscar la calidad en todo lo que hacemos',
      example: 'Entregar trabajo de alta calidad, superar expectativas o mantener estándares elevados consistentemente.'
    },
    {
      id: 'integridad',
      name: 'Integridad',
      color: '#10b981',
      icon: '🛡️',
      description: 'Actuar con honestidad y transparencia',
      example: 'Ser honesto sobre errores, cumplir compromisos o actuar éticamente en situaciones difíciles.'
    },
    {
      id: 'liderazgo',
      name: 'Liderazgo',
      color: '#8b5cf6',
      icon: '👑',
      description: 'Inspirar y guiar a otros hacia el éxito',
      example: 'Motivar al equipo durante un proyecto desafiante, tomar iniciativa o mentorear a compañeros junior.'
    },
    {
      id: 'adaptabilidad',
      name: 'Adaptabilidad',
      color: '#06b6d4',
      icon: '🔄',
      description: 'Flexibilidad ante los cambios',
      example: 'Adaptarse rápidamente a nuevos requerimientos, aprender nuevas tecnologías o manejar cambios de prioridades.'
    }
  ]

  for (const value of values) {
    insertValue.run(value.id, value.name, value.color, value.icon, value.description, value.example)
  }

  // Insertar usuarios de ejemplo
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, name, department, team, area, avatar, birthday, is_admin)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const users = [
    {
      id: '1',
      email: 'maria.garcia@empresa.com',
      name: 'María García',
      department: 'Desarrollo',
      team: 'Satélites',
      area: 'IT',
      avatar: '/placeholder.svg?height=40&width=40',
      birthday: '1990-03-15',
      is_admin: 0
    },
    {
      id: '2',
      email: 'carlos.lopez@empresa.com',
      name: 'Carlos López',
      department: 'Marketing',
      team: 'Digital',
      area: 'Marketing',
      avatar: '/placeholder.svg?height=40&width=40',
      birthday: '1988-01-15',
      is_admin: 1
    },
    {
      id: '3',
      email: 'ana.martinez@empresa.com',
      name: 'Ana Martínez',
      department: 'Recursos Humanos',
      team: 'Gestión',
      area: 'RRHH',
      avatar: '/placeholder.svg?height=40&width=40',
      birthday: new Date().toISOString().split('T')[0], // Hoy para probar felicitaciones
      is_admin: 0
    },
    {
      id: '4',
      email: 'luis.rodriguez@empresa.com',
      name: 'Luis Rodríguez',
      department: 'Ventas',
      team: 'Comercial',
      area: 'Ventas',
      avatar: '/placeholder.svg?height=40&width=40',
      birthday: '1985-02-10',
      is_admin: 0
    },
    {
      id: '5',
      email: 'elena.fernandez@empresa.com',
      name: 'Elena Fernández',
      department: 'Diseño',
      team: 'UX/UI',
      area: 'IT',
      avatar: '/placeholder.svg?height=40&width=40',
      birthday: '1991-12-05',
      is_admin: 0
    }
  ]

  for (const user of users) {
    insertUser.run(
      user.id,
      user.email,
      user.name,
      user.department,
      user.team,
      user.area,
      user.avatar,
      user.birthday,
      user.is_admin
    )
  }

  // Insertar algunas medallas de ejemplo
  const insertMedal = db.prepare(`
    INSERT INTO medals (id, giver_id, recipient_id, value_name, message, is_public, likes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  const medals = [
    {
      id: '1',
      giver_id: '2',
      recipient_id: '1',
      value_name: 'Colaboración',
      message: 'Excelente trabajo en el proyecto de la nueva plataforma. Tu colaboración fue clave para el éxito.',
      is_public: 1,
      likes: 5
    },
    {
      id: '2',
      giver_id: '3',
      recipient_id: '1',
      value_name: 'Innovación',
      message: 'Tu propuesta de automatización ahorró muchas horas de trabajo manual.',
      is_public: 1,
      likes: 8
    },
    {
      id: '3',
      giver_id: '1',
      recipient_id: '3',
      value_name: 'Liderazgo',
      message: 'Excelente liderazgo en el proyecto de recursos humanos.',
      is_public: 1,
      likes: 3
    }
  ]

  for (const medal of medals) {
    insertMedal.run(
      medal.id,
      medal.giver_id,
      medal.recipient_id,
      medal.value_name,
      medal.message,
      medal.is_public,
      medal.likes
    )
  }
}

export default db