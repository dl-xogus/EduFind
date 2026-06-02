import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Cert from '@/app/models/Cert'

export async function GET(req: NextRequest) {
  await connectDB()
  const id = req.nextUrl.searchParams.get('id')

  if (id) {
    const cert = await Cert.findOne({ id: Number(id) }).lean()
    if (!cert) return NextResponse.json({ error: '자격증을 찾을 수 없습니다' }, { status: 404 })
    return NextResponse.json({ cert })
  }

  const certs = await Cert.find().lean()
  return NextResponse.json({ certs })
}
