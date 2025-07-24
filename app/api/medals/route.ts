import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-sqlite'
import { authService } from '@/lib/auth-sqlite'

export async function GET() {
  try {
    const medals = await databaseService.getMedals()
    return NextResponse.json(medals)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener reconocimientos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('session')?.value
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const user = await authService.getUserBySession(sessionId)
    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }
    
    const { recipient_id, value_name, message, is_public } = await request.json()
    
    const medal = await databaseService.createMedal({
      giver_id: user.id,
      recipient_id,
      value_name,
      message,
      is_public
    })
    
    return NextResponse.json(medal)
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear reconocimiento' }, { status: 500 })
  }
}