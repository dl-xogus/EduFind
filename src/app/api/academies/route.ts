import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Academy from '@/models/Academy'

export async function GET(req: NextRequest) {
  await connectDB()
  const id = req.nextUrl.searchParams.get('id')

  if (id) {
    const academy = await Academy.findOne({ id: Number(id) }).lean()
    if (!academy) return NextResponse.json({ error: '학원을 찾을 수 없습니다' }, { status: 404 })
    return NextResponse.json({ academy })
  }

  const academies = await Academy.find().lean()
  return NextResponse.json({ academies })
}
