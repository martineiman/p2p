import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-sqlite'

export async function GET() {
  try {
    const users = await databaseService.getUsers()
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}