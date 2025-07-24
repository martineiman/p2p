import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-sqlite'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    const result = await authService.signIn(email, password)
    
    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }
    
    const response = NextResponse.json({ user: result.user })
    
    // Establecer cookie de sesión
    response.cookies.set('session', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 días
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}