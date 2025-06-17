import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User, Medal } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para calcular días hasta cumpleaños (usando zona horaria local del usuario)
export const getDaysUntilBirthday = (birthday: string) => {
  if (!birthday) return null;

  // Parse cumpleaños en formato "YYYY-MM-DD"
  const [birthYear, birthMonth, birthDay] = birthday.split("-").map(Number);

  const today = new Date();
  // Fecha de hoy (solo año, mes y día, en zona local)
  const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  // Cumpleaños de este año (zona local)
  const birthdayThisYearLocal = new Date(todayLocal.getFullYear(), birthMonth - 1, birthDay);

  let diffDays;
  if (birthdayThisYearLocal.getTime() === todayLocal.getTime()) {
    diffDays = 0;
  } else if (birthdayThisYearLocal < todayLocal) {
    // Si ya pasó, calcula para el próximo año
    const birthdayNextYearLocal = new Date(todayLocal.getFullYear() + 1, birthMonth - 1, birthDay);
    diffDays = Math.round((birthdayNextYearLocal.getTime() - todayLocal.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    diffDays = Math.round((birthdayThisYearLocal.getTime() - todayLocal.getTime()) / (1000 * 60 * 60 * 24));
  }

  // LOG para debug
  console.log(
    '[Cumpleaños][DEBUG]',
    {
      birthday,
      today: todayLocal.toLocaleDateString(),
      birthdayThisYearLocal: birthdayThisYearLocal.toLocaleDateString(),
      diffDays
    }
  );
  return diffDays;
};

// Función para obtener próximos cumpleaños
export const getUpcomingBirthdays = (users: User[]) => {
  return users
    .map((user) => ({
      ...user,
      daysUntil: getDaysUntilBirthday(user.birthday),
    }))
    .filter((user) => user.daysUntil !== null)
    .sort((a, b) => a.daysUntil - b.daysUntil);
};

// Función para obtener destacados del mes
export const getMonthlyHighlights = (medals: Medal[], users: User[]) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyMedals = medals.filter((medal) => {
    const medalDate = new Date(medal.timestamp);
    return medalDate.getMonth() === currentMonth && medalDate.getFullYear() === currentYear;
  });

  const userCounts: Record<string, { user: User; count: number; firstRecognition: Date }> = {};
  monthlyMedals.forEach((medal) => {
    if (!userCounts[medal.recipient.id]) {
      userCounts[medal.recipient.id] = {
        user: users.find((u) => u.id === medal.recipient.id)!,
        count: 0,
        firstRecognition: new Date(medal.timestamp),
      };
    }
    userCounts[medal.recipient.id].count++;

    const medalDate = new Date(medal.timestamp);
    if (medalDate < userCounts[medal.recipient.id].firstRecognition) {
      userCounts[medal.recipient.id].firstRecognition = medalDate;
    }
  });

  return Object.values(userCounts).sort((a, b) => {
    if (a.count === b.count) {
      return a.firstRecognition.getTime() - b.firstRecognition.getTime();
    }
    return b.count - a.count;
  });
};