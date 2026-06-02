import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/app/lib/mongodb'
import Wishlist from '@/app/models/Wishlist'

// GET /api/wishlist?email=...
export async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email')
  if (!email) return NextResponse.json({ error: '이메일이 필요합니다' }, { status: 400 })

  await connectDB()
  const items = await Wishlist.find({ userEmail: email }).lean()
  return NextResponse.json({ items })
}

// POST /api/wishlist  { email, itemId, itemType }
// 이미 찜한 항목이면 삭제(토글), 없으면 추가
export async function POST(req: NextRequest) {
  const { email, itemId, itemType } = await req.json()
  if (!email || !itemId || !itemType) {
    return NextResponse.json({ error: '필수 값이 누락되었습니다' }, { status: 400 })
  }

  await connectDB()
  const existing = await Wishlist.findOne({ userEmail: email, itemId, itemType })

  if (existing) {
    await Wishlist.deleteOne({ _id: existing._id })
    return NextResponse.json({ wished: false })
  } else {
    await Wishlist.create({ userEmail: email, itemId, itemType })
    return NextResponse.json({ wished: true })
  }
}
