import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authService } from './lib/auth-sqlite'

export async function middleware(request: NextRequest) {
  // Rutas que requieren autenticación
  const protectedPaths = ['/']
  const authPaths = ['/auth']
  
  const { pathname } = request.nextUrl
  
  // Obtener sesión de las cookies
  const sessionId = request.cookies.get('session')?.value
  
  // Verificar si el usuario está autenticado
  let user = null
  if (sessionId) {
    user = await authService.getUserBySession(sessionId)
  }
  
  // Si está en una ruta protegida y no está autenticado
  if (protectedPaths.some(path => pathname.startsWith(path)) && !user) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }
  
  // Si está autenticado y trata de acceder a auth, redirigir al dashboard
  if (authPaths.some(path => pathname.startsWith(path)) && user) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|placeholder.svg).*)']
}