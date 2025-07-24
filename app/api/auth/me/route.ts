import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/auth-sqlite'

export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (!sessionId) {
      return NextResponse.json({ user: null })
    }
    
    const user = await authService.getUserBySession(sessionId)
    
    return NextResponse.json({ user })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}