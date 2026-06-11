import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { connectDB } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // 기본 입력값 체크
  if (!email || !password) {
    return NextResponse.json(
      { message: '이메일과 비밀번호를 입력해주세요' },
      { status: 400 }
    )
  }

  // MongoDB 연결
  await connectDB()

  // 이메일로 유저 조회
  const user = await User.findOne({ email })

  // 이메일이 없거나 비밀번호가 틀린 경우 → 같은 메시지로 응답
  // "이메일이 없습니다" / "비밀번호가 틀렸습니다"를 따로 알려주면
  // 어떤 이메일이 가입됐는지 노출되므로 보안상 같은 메시지 사용
  if (!user) {
    return NextResponse.json(
      { message: '이메일 또는 비밀번호가 틀렸어요' },
      { status: 401 } // Unauthorized
    )
  }

  // bcrypt.compare: 입력한 평문 비밀번호 vs DB의 해싱된 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    return NextResponse.json(
      { message: '이메일 또는 비밀번호가 틀렸어요' },
      { status: 401 }
    )
  }

  // 로그인 성공 → HTTP-only 쿠키 발급 후 유저 정보 반환
  const cookieStore = await cookies()
  cookieStore.set('user_email', user.email, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
  })

  return NextResponse.json({
    user: { name: user.name, email: user.email }
  })
}