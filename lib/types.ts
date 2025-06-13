export interface User {
  id: string
  name: string
  email: string
  department: string
  team: string
  area: string
  avatar: string
  birthday: string
  isAdmin: boolean
  daysUntil?: number
}

export interface Value {
  name: string
  color: string
  icon: string
  description: string
  example: string
}

export interface Medal {
  id: string
  giver: User
  recipient: User
  value: string
  message: string
  timestamp: string
  isPublic: boolean
  likes: number
  comments: Comment[]
}

export interface Comment {
  id: string
  user: string
  message: string
  timestamp: string
}
