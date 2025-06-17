import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { User, Medal } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Función para calcular días hasta cumpleaños (corrige zona horaria y facilita debug)
export const getDaysUntilBirthday = (birthday: string) => {
  if (!birthday) return null;

  // Parseo seguro "YYYY-MM-DD"
  const [year, month, day] = birthday.split("-").map(Number);

  const today = new Date();
  const todayUTC = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
  const birthdayThisYearUTC = new Date(Date.UTC(todayUTC.getFullYear(), month - 1, day));

  let diffDays;
  if (birthdayThisYearUTC.getTime() === todayUTC.getTime()) {
    diffDays = 0;
  } else if (birthdayThisYearUTC < todayUTC) {
    const birthdayNextYearUTC = new Date(Date.UTC(todayUTC.getFullYear() + 1, month - 1, day));
    diffDays = Math.round((birthdayNextYearUTC.getTime() - todayUTC.getTime()) / (1000 * 60 * 60 * 24));
  } else {
    diffDays = Math.round((birthdayThisYearUTC.getTime() - todayUTC.getTime()) / (1000 * 60 * 60 * 24));
  }
  // LOG de debug
  console.log(
    '[Cumpleaños][DEBUG]',
    { birthday, today: todayUTC.toISOString(), birthdayThisYearUTC: birthdayThisYearUTC.toISOString(), diffDays }
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