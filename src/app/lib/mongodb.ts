// =============================================
// lib/mongodb.ts
// MongoDB 연결을 관리하는 파일
// =============================================

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI as string

if (!MONGODB_URI) {
  throw new Error('.env.local에 MONGODB_URI를 설정해주세요')
}

// Next.js 개발 모드에서는 파일 수정 시 핫리로딩이 발생함
// 핫리로딩마다 새 연결을 만들면 MongoDB 연결이 수백 개 쌓임
// → global 객체에 연결을 캐싱해서 이미 있으면 재사용
let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
  // 이미 연결된 게 있으면 그대로 반환 (재연결 안 함)
  if (cached.conn) return cached.conn

  // 연결 시도 중인 promise가 없으면 새로 생성
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI)
  }

  // promise가 완료될 때까지 기다린 후 캐싱
  cached.conn = await cached.promise
  return cached.conn
}