import { NextRequest, NextResponse } from 'next/server'
import { databaseService } from '@/lib/database-sqlite'

export async function GET() {
  try {
    const values = await databaseService.getValues()
    return NextResponse.json(values)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener valores' }, { status: 500 })
  }
}