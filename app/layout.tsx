import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth/auth-provider"
import { initializeDatabase } from "@/lib/sqlite"

const inter = Inter({ subsets: ["latin"] })

// Inicializar la base de datos al cargar la aplicación
if (typeof window === 'undefined') {
  initializeDatabase()
}
export const metadata: Metadata = {
  title: "Sistema P2P - Plataforma de Reconocimientos",
  description: "Plataforma de reconocimientos entre empleados basada en valores corporativos",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
