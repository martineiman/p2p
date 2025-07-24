export type User = {
  id: string
  email: string
  name: string
  department: string
  team: string
  area: string
  avatar: string
  birthday: string
  isAdmin: boolean
}

export type Value = {
  id: string
  name: string
  color: string
  icon: string
  description: string
  example: string
}

export type Medal = {
  id: string
  giver: {
    id: string
    name: string
    email: string
    avatar: string
  }
  recipient: {
    id: string
    name: string
    email: string
    avatar: string
  }
  value: string
  message: string
  timestamp: string
  isPublic: boolean
  likes: number
  comments: {
    id: string
    user: string
    message: string
    timestamp: string
  }[]
}