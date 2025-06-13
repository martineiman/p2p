"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { LogOut, Settings, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export function Header() {
  const { user, signOut } = useAuth()

  if (!user) return null

  return (
    <header className="bg-gradient-to-br from-white to-gray-50 border-b border-gray-200 py-4 mb-8 shadow-sm backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
            P2P
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sistema P2P</h1>
            <p className="text-sm text-gray-600">Plataforma de Reconocimientos</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100">
              <div className="h-10 w-10 rounded-full bg-orange-200 border-2 border-orange-200 overflow-hidden">
                <Image
                  src={user.avatar || "/placeholder.svg?height=40&width=40"}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="text-left">
                <span className="font-semibold text-gray-900 text-sm block">{user.name}</span>
                <span className="text-gray-500 text-xs">
                  {user.area} - {user.team}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
