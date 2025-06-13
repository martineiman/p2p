import type { Medal, User } from "@/lib/types"

interface StatsGridProps {
  medals: Medal[]
  currentUser: User
  users: User[]
}

export function StatsGrid({ medals, currentUser, users }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl text-center shadow-lg transition-all hover:translate-y-[-4px] hover:scale-[1.02]">
        <div className="text-4xl font-extrabold mb-2">
          {medals.filter((m) => m.recipient.id === currentUser.id).length}
        </div>
        <div className="text-sm opacity-95">Reconocimientos Recibidos</div>
      </div>

      <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl text-center shadow-lg transition-all hover:translate-y-[-4px] hover:scale-[1.02]">
        <div className="text-4xl font-extrabold mb-2">{medals.filter((m) => m.giver.id === currentUser.id).length}</div>
        <div className="text-sm opacity-95">Reconocimientos Dados</div>
      </div>

      <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-xl text-center shadow-lg transition-all hover:translate-y-[-4px] hover:scale-[1.02]">
        <div className="text-4xl font-extrabold mb-2">
          {new Set(medals.filter((m) => m.recipient.id === currentUser.id).map((m) => m.value)).size}
        </div>
        <div className="text-sm opacity-95">Valores Reconocidos</div>
      </div>

      <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-6 rounded-xl text-center shadow-lg transition-all hover:translate-y-[-4px] hover:scale-[1.02]">
        <div className="text-4xl font-extrabold mb-2">{users.length - 1}</div>
        <div className="text-sm opacity-95">Compañeros de Equipo</div>
      </div>
    </div>
  )
}
