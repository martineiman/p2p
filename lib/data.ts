import type { User, Value, Medal } from "./types"

export const appData = {
  currentUser: {
    id: "1",
    name: "María García",
    email: "maria.garcia@empresa.com",
    department: "Desarrollo",
    team: "Satélites",
    area: "IT",
    avatar: "/placeholder.svg?height=40&width=40",
    birthday: "1990-03-15",
    isAdmin: false,
  } as User,

  users: [
    {
      id: "1",
      name: "María García",
      email: "maria.garcia@empresa.com",
      department: "Desarrollo",
      team: "Satélites",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1990-03-15",
      isAdmin: false,
    },
    {
      id: "2",
      name: "Carlos López",
      email: "carlos.lopez@empresa.com",
      department: "Marketing",
      team: "Digital",
      area: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1988-01-15",
      isAdmin: true,
    },
    {
      id: "3",
      name: "Ana Martínez",
      email: "ana.martinez@empresa.com",
      department: "Recursos Humanos",
      team: "Gestión",
      area: "RRHH",
      avatar: "/placeholder.svg?height=40&width=40",
      // Fecha de hoy para probar felicitaciones
      birthday: new Date().toISOString().split("T")[0],
      isAdmin: false,
    },
    {
      id: "4",
      name: "Luis Rodríguez",
      email: "luis.rodriguez@empresa.com",
      department: "Ventas",
      team: "Comercial",
      area: "Ventas",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1985-02-10",
      isAdmin: false,
    },
    {
      id: "5",
      name: "Elena Fernández",
      email: "elena.fernandez@empresa.com",
      department: "Diseño",
      team: "UX/UI",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1991-12-05",
      isAdmin: false,
    },
    {
      id: "6",
      name: "Roberto Silva",
      email: "roberto.silva@empresa.com",
      department: "Operaciones",
      team: "Arquitectura",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1987-06-20",
      isAdmin: false,
    },
    {
      id: "7",
      name: "Patricia Morales",
      email: "patricia.morales@empresa.com",
      department: "QA",
      team: "QA",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1989-04-12",
      isAdmin: false,
    },
    {
      id: "8",
      name: "Diego Herrera",
      email: "diego.herrera@empresa.com",
      department: "Implementación",
      team: "Implementación",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1993-08-30",
      isAdmin: false,
    },
    {
      id: "9",
      name: "Carmen Vega",
      email: "carmen.vega@empresa.com",
      department: "Tabla y Parámetros",
      team: "Tabla y Parámetros",
      area: "IT",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1986-11-18",
      isAdmin: false,
    },
    {
      id: "10",
      name: "Fernando Castro",
      email: "fernando.castro@empresa.com",
      department: "Ventas",
      team: "Corporativo",
      area: "Ventas",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1984-07-25",
      isAdmin: false,
    },
    {
      id: "11",
      name: "Sofía Ramírez",
      email: "sofia.ramirez@empresa.com",
      department: "Marketing",
      team: "Contenido",
      area: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1991-09-14",
      isAdmin: false,
    },
    {
      id: "12",
      name: "Andrés Jiménez",
      email: "andres.jimenez@empresa.com",
      department: "RRHH",
      team: "Reclutamiento",
      area: "RRHH",
      avatar: "/placeholder.svg?height=40&width=40",
      birthday: "1987-05-03",
      isAdmin: false,
    },
  ] as User[],

  values: [
    {
      name: "Colaboración",
      color: "#3b82f6",
      icon: "🤝",
      description: "Trabajar en equipo para lograr objetivos comunes",
      example:
        "Ayudar a un compañero con un proyecto complejo, compartir conocimientos o facilitar la comunicación entre equipos.",
    },
    {
      name: "Innovación",
      color: "#ef4444",
      icon: "💡",
      description: "Buscar nuevas formas de hacer las cosas",
      example:
        "Proponer una solución creativa a un problema, implementar una nueva tecnología o mejorar un proceso existente.",
    },
    {
      name: "Excelencia",
      color: "#f59e0b",
      icon: "🌟",
      description: "Buscar la calidad en todo lo que hacemos",
      example:
        "Entregar trabajo de alta calidad, superar expectativas o mantener estándares elevados consistentemente.",
    },
    {
      name: "Integridad",
      color: "#10b981",
      icon: "🛡️",
      description: "Actuar con honestidad y transparencia",
      example: "Ser honesto sobre errores, cumplir compromisos o actuar éticamente en situaciones difíciles.",
    },
    {
      name: "Liderazgo",
      color: "#8b5cf6",
      icon: "👑",
      description: "Inspirar y guiar a otros hacia el éxito",
      example: "Motivar al equipo durante un proyecto desafiante, tomar iniciativa o mentorear a compañeros junior.",
    },
    {
      name: "Adaptabilidad",
      color: "#06b6d4",
      icon: "🔄",
      description: "Flexibilidad ante los cambios",
      example:
        "Adaptarse rápidamente a nuevos requerimientos, aprender nuevas tecnologías o manejar cambios de prioridades.",
    },
  ] as Value[],

  medals: [
    // Reconocimientos para María García (usuario actual) - RECIBIDOS
    {
      id: "1",
      giver: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "1",
        name: "María García",
        email: "maria.garcia@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Excelente trabajo en el proyecto de la nueva plataforma. Tu colaboración fue clave para el éxito.",
      timestamp: "2024-12-15T10:30:00Z",
      isPublic: true,
      likes: 5,
      comments: [
        {
          id: "1",
          user: "Ana Martínez",
          message: "¡Totalmente de acuerdo! María siempre está dispuesta a ayudar.",
          timestamp: "2024-12-15T11:00:00Z",
        },
      ],
    },
    {
      id: "2",
      giver: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "1",
        name: "María García",
        email: "maria.garcia@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Innovación",
      message: "Tu propuesta de automatización ahorró muchas horas de trabajo manual.",
      timestamp: "2024-12-20T14:15:00Z",
      isPublic: true,
      likes: 8,
      comments: [],
    },
    {
      id: "3",
      giver: {
        id: "4",
        name: "Luis Rodríguez",
        email: "luis.rodriguez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "1",
        name: "María García",
        email: "maria.garcia@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Siempre dispuesta a ayudar al equipo cuando más lo necesitamos.",
      timestamp: "2024-12-10T09:45:00Z",
      isPublic: true,
      likes: 3,
      comments: [],
    },

    // Reconocimientos ENVIADOS por María García
    {
      id: "4",
      giver: {
        id: "1",
        name: "María García",
        email: "maria.garcia@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Liderazgo",
      message: "Excelente liderazgo en el proyecto de recursos humanos.",
      timestamp: "2024-12-10T10:00:00Z",
      isPublic: true,
      likes: 3,
      comments: [],
    },
    {
      id: "5",
      giver: {
        id: "1",
        name: "María García",
        email: "maria.garcia@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "7",
        name: "Patricia Morales",
        email: "patricia.morales@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Excelencia",
      message: "Testing exhaustivo que evitó errores críticos en producción.",
      timestamp: "2024-12-09T13:20:00Z",
      isPublic: true,
      likes: 5,
      comments: [],
    },

    // Más reconocimientos para Ana Martínez (para que aparezca en destacados)
    {
      id: "6",
      giver: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Siempre disponible para apoyar a todo el equipo.",
      timestamp: "2024-12-05T14:30:00Z",
      isPublic: true,
      likes: 4,
      comments: [],
    },
    {
      id: "7",
      giver: {
        id: "4",
        name: "Luis Rodríguez",
        email: "luis.rodriguez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Integridad",
      message: "Manejo ético y transparente de situaciones complejas.",
      timestamp: "2024-12-08T16:20:00Z",
      isPublic: true,
      likes: 6,
      comments: [],
    },
    {
      id: "8",
      giver: {
        id: "5",
        name: "Elena Fernández",
        email: "elena.fernandez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Excelencia",
      message: "Procesos de RRHH impecables y bien estructurados.",
      timestamp: "2024-12-12T11:30:00Z",
      isPublic: true,
      likes: 4,
      comments: [],
    },
    {
      id: "9",
      giver: {
        id: "6",
        name: "Roberto Silva",
        email: "roberto.silva@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Adaptabilidad",
      message: "Excelente adaptación a los nuevos procesos de la empresa.",
      timestamp: "2024-12-18T13:45:00Z",
      isPublic: true,
      likes: 7,
      comments: [],
    },
    {
      id: "10",
      giver: {
        id: "7",
        name: "Patricia Morales",
        email: "patricia.morales@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "3",
        name: "Ana Martínez",
        email: "ana.martinez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Facilitó la comunicación entre diferentes departamentos.",
      timestamp: "2024-12-22T08:15:00Z",
      isPublic: true,
      likes: 2,
      comments: [],
    },

    // Reconocimientos para Carlos López (para ranking)
    {
      id: "11",
      giver: {
        id: "11",
        name: "Sofía Ramírez",
        email: "sofia.ramirez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Innovación",
      message: "Estrategias de marketing innovadoras que generaron excelentes resultados.",
      timestamp: "2024-12-07T14:20:00Z",
      isPublic: true,
      likes: 6,
      comments: [],
    },
    {
      id: "12",
      giver: {
        id: "4",
        name: "Luis Rodríguez",
        email: "luis.rodriguez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Excelente coordinación entre marketing y ventas.",
      timestamp: "2024-12-11T16:45:00Z",
      isPublic: true,
      likes: 5,
      comments: [],
    },
    {
      id: "13",
      giver: {
        id: "10",
        name: "Fernando Castro",
        email: "fernando.castro@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Excelencia",
      message: "Campañas de marketing de alta calidad y muy efectivas.",
      timestamp: "2024-12-15T11:30:00Z",
      isPublic: true,
      likes: 4,
      comments: [],
    },

    // Reconocimientos entre diferentes áreas para métricas
    {
      id: "14",
      giver: {
        id: "2",
        name: "Carlos López",
        email: "carlos.lopez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "4",
        name: "Luis Rodríguez",
        email: "luis.rodriguez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Liderazgo",
      message: "Lideró el equipo de ventas con excelentes resultados.",
      timestamp: "2024-12-08T11:15:00Z",
      isPublic: true,
      likes: 4,
      comments: [],
    },
    {
      id: "15",
      giver: {
        id: "11",
        name: "Sofía Ramírez",
        email: "sofia.ramirez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "10",
        name: "Fernando Castro",
        email: "fernando.castro@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Colaboración",
      message: "Excelente coordinación entre ventas y marketing para las campañas corporativas.",
      timestamp: "2024-12-14T09:30:00Z",
      isPublic: true,
      likes: 5,
      comments: [],
    },
    {
      id: "16",
      giver: {
        id: "6",
        name: "Roberto Silva",
        email: "roberto.silva@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "8",
        name: "Diego Herrera",
        email: "diego.herrera@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Adaptabilidad",
      message: "Se adaptó rápidamente a los nuevos procesos de implementación.",
      timestamp: "2024-12-16T13:45:00Z",
      isPublic: true,
      likes: 3,
      comments: [],
    },
    {
      id: "17",
      giver: {
        id: "9",
        name: "Carmen Vega",
        email: "carmen.vega@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "8",
        name: "Diego Herrera",
        email: "diego.herrera@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Excelencia",
      message: "Implementaciones técnicas impecables y bien documentadas.",
      timestamp: "2024-12-19T15:20:00Z",
      isPublic: true,
      likes: 4,
      comments: [],
    },
    {
      id: "18",
      giver: {
        id: "12",
        name: "Andrés Jiménez",
        email: "andres.jimenez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      recipient: {
        id: "11",
        name: "Sofía Ramírez",
        email: "sofia.ramirez@empresa.com",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      value: "Innovación",
      message: "Contenido creativo que conectó perfectamente con nuestra audiencia.",
      timestamp: "2024-12-21T10:45:00Z",
      isPublic: true,
      likes: 6,
      comments: [],
    },
  ] as Medal[],
}

// Función para agregar un nuevo empleado
export const addUser = (user: Omit<User, "id">) => {
  const newUser = {
    ...user,
    id: `user-${Date.now()}`,
  }
  appData.users.push(newUser)
  return newUser
}

// Función para actualizar un empleado
export const updateUser = (id: string, updates: Partial<User>) => {
  const userIndex = appData.users.findIndex((u) => u.id === id)
  if (userIndex !== -1) {
    appData.users[userIndex] = { ...appData.users[userIndex], ...updates }
    return appData.users[userIndex]
  }
  return null
}

// Función para agregar comentario
export const addComment = (medalId: string, comment: { user: string; message: string }) => {
  const medal = appData.medals.find((m) => m.id === medalId)
  if (medal) {
    const newComment = {
      id: `comment-${Date.now()}`,
      user: comment.user,
      message: comment.message,
      timestamp: new Date().toISOString(),
    }
    medal.comments.push(newComment)
    return newComment
  }
  return null
}
