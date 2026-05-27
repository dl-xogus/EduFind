// =============================================
// types/global.d.ts
// Node.js global 객체에 mongoose 타입 추가
// =============================================

import mongoose from 'mongoose'

declare global {
  // Next.js 개발 모드에서 핫리로딩 시 mongoose 연결을 재사용하기 위해
  // global 객체에 캐싱함. TypeScript가 이 타입을 인식하도록 선언.
  var mongoose: {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
  }
}