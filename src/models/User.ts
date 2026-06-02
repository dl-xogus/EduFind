// =============================================
// models/User.ts
// MongoDB users 컬렉션의 데이터 구조(스키마) 정의
// =============================================

import mongoose, { Schema, Document } from 'mongoose'

// Document를 extends해서 MongoDB의 _id, save() 등 기본 메서드 타입도 포함
export interface IUser extends Document {
  name: string
  email: string
  password: string  // bcrypt로 해싱된 비밀번호 (평문 절대 저장 안 함)
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,   // 필수 필드
  },
  email: {
    type: String,
    required: true,
    unique: true,     // 이메일 중복 불가 (DB 레벨에서도 보장)
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 자동으로 현재 시간 저장
  },
})

// 핫리로딩 시 "Cannot overwrite model once compiled" 에러 방지
// 이미 등록된 모델이 있으면 재사용, 없으면 새로 생성
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema, 'users')

export default User

// 참고: MongoDB 컬렉션 이름은 모델명(User)을 소문자 복수형으로 자동 변환 → "users"