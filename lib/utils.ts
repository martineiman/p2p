import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { User, Medal } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para calcular días hasta cumpleaños
export const getDaysUntilBirthday = (birthday: string) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const birthdayThisYear = new Date(currentYear, new Date(birthday).getMonth(), new Date(birthday).getDate())

  if (birthdayThisYear < today) {
    birthdayThisYear.setFullYear(currentYear + 1)
  }

  const diffTime = birthdayThisYear.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

// Función para obtener próximos cumpleaños
export const getUpcomingBirthdays = (users: User[]) => {
  return users
    .map((user) => ({
      ...user,
      daysUntil: getDaysUntilBirthday(user.birthday),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
}

// Función para obtener destacados del mes
export const getMonthlyHighlights = (medals: Medal[], users: User[]) => {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()

  const monthlyMedals = medals.filter((medal) => {
    const medalDate = new Date(medal.timestamp)
    return medalDate.getMonth() === currentMonth && medalDate.getFullYear() === currentYear
  })

  const userCounts: Record<string, { user: User; count: number; firstRecognition: Date }> = {}
  monthlyMedals.forEach((medal) => {
    if (!userCounts[medal.recipient.id]) {
      userCounts[medal.recipient.id] = {
        user: users.find((u) => u.id === medal.recipient.id)!,
        count: 0,
        firstRecognition: new Date(medal.timestamp),
      }
    }
    userCounts[medal.recipient.id].count++

    const medalDate = new Date(medal.timestamp)
    if (medalDate < userCounts[medal.recipient.id].firstRecognition) {
      userCounts[medal.recipient.id].firstRecognition = medalDate
    }
  })

  return Object.values(userCounts).sort((a, b) => {
    if (a.count === b.count) {
      return a.firstRecognition.getTime() - b.firstRecognition.getTime()
    }
    return b.count - a.count
  })
}
