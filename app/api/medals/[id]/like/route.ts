import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-sqlite'
import { authService } from '@/lib/auth-sqlite'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const user = await authService.getUserBySession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const liked = await databaseService.toggleLike(params.id, user.id)
    
    return NextResponse.json({ liked })
  } catch (error) {
    return NextResponse.json({ error: 'Error al procesar like' }, { status: 500 })
  }
}