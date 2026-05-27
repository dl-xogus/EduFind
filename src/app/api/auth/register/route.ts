// =============================================
// app/api/auth/register/route.ts
// 회원가입 API Route
// POST /api/auth/register
// =============================================

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/app/lib/mongodb'
import User from '@/app/models/User'
import { validateRegisterForm, isFormValid } from '@/app/utils/validate'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // 1단계: 서버에서도 유효성 검사
  // 클라이언트 검사를 우회하고 직접 API를 호출하는 경우를 막기 위함
  const errors = validateRegisterForm(body)
  if (!isFormValid(errors)) {
    return NextResponse.json(
      { message: Object.values(errors).find(Boolean) },
      { status: 400 } // Bad Request
    )
  }

  // 2단계: MongoDB 연결
  await connectDB()

  // 3단계: 이메일 중복 체크
  // DB 레벨에서도 unique 설정이 있지만, 친절한 에러 메시지를 위해 먼저 확인
  const existing = await User.findOne({ email: body.email })
  if (existing) {
    return NextResponse.json(
      { message: '이미 사용 중인 이메일이에요' },
      { status: 409 } // Conflict
    )
  }

  // 4단계: 비밀번호 해싱
  // 평문 비밀번호를 절대 DB에 저장하면 안 됨
  // bcrypt saltRounds=10: 해싱 강도 (높을수록 안전하지만 느림, 10이 일반적)
  const hashed = await bcrypt.hash(body.password, 10)

  // 5단계: DB에 유저 저장
  const user = await User.create({
    name: body.name,
    email: body.email,
    password: hashed, // 해싱된 비밀번호만 저장
  })

  // 6단계: 응답 시 비밀번호 제외하고 반환
  return NextResponse.json(
    { user: { name: user.name, email: user.email } },
    { status: 201 } // Created
  )
}