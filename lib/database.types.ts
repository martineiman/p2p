export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          department: string | null
          team: string | null
          area: string | null
          avatar: string | null
          birthday: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          department?: string | null
          team?: string | null
          area?: string | null
          avatar?: string | null
          birthday?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          department?: string | null
          team?: string | null
          area?: string | null
          avatar?: string | null
          birthday?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      values: {
        Row: {
          id: string
          name: string
          color: string
          icon: string
          description: string
          example: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          icon: string
          description: string
          example: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          icon?: string
          description?: string
          example?: string
          created_at?: string
          updated_at?: string
        }
      }
      medals: {
        Row: {
          id: string
          giver_id: string
          recipient_id: string
          value_name: string
          message: string
          is_public: boolean
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          giver_id: string
          recipient_id: string
          value_name: string
          message: string
          is_public?: boolean
          likes?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          giver_id?: string
          recipient_id?: string
          value_name?: string
          message?: string
          is_public?: boolean
          likes?: number
          created_at?: string
          updated_at?: string
        }
      }
      medal_comments: {
        Row: {
          id: string
          medal_id: string
          user_id: string
          message: string
          created_at: string
        }
        Insert: {
          id?: string
          medal_id: string
          user_id: string
          message: string
          created_at?: string
        }
        Update: {
          id?: string
          medal_id?: string
          user_id?: string
          message?: string
          created_at?: string
        }
      }
      medal_likes: {
        Row: {
          id: string
          medal_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          medal_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          medal_id?: string
          user_id?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
