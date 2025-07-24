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
    
    const { message } = await request.json()
    
    const comment = await databaseService.addComment(params.id, user.id, message)
    
    return NextResponse.json(comment)
  } catch (error) {
    return NextResponse.json({ error: 'Error al agregar comentario' }, { status: 500 })
  }
}