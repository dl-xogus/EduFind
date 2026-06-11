import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import Wishlist from '@/models/Wishlist'

const UNAUTHORIZED = NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })

async function getEmailFromCookie(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('user_email')?.value ?? null
}

// GET /api/wishlist
export async function GET() {
  const email = await getEmailFromCookie()
  if (!email) return UNAUTHORIZED

  await connectDB()
  const items = await Wishlist.find({ userEmail: email }).lean()
  return NextResponse.json({ items })
}

// POST /api/wishlist  { itemId, itemType }
export async function POST(req: NextRequest) {
  const email = await getEmailFromCookie()
  if (!email) return UNAUTHORIZED

  const { itemId, itemType } = await req.json()
  if (!itemId || !itemType) {
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
