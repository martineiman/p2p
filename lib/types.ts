export type User = {
  id: string
  name: string
  email: string
  area: string
  team: string
  birthday?: string
  avatar?: string
  // agrega otros campos si tu tabla de supabase tiene más
}

export type Value = {
  //...
}

export type Medal = {
  id: string
  giver: User
  recipient: User
  value: string
  message: string
  timestamp: string
  isPublic: boolean
  likes: number
  comments: any[]
}