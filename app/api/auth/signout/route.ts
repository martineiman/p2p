import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-sqlite'

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (sessionId) {
      await authService.signOut(sessionId)
    }
    
    const response = NextResponse.json({ success: true })
    
    // Eliminar cookie de sesión
    response.cookies.delete('session')
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}