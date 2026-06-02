// =============================================
// types/auth.ts
// 회원가입/로그인에 사용되는 TypeScript 타입 정의
// =============================================

// 회원가입 폼에 입력하는 데이터 구조
export interface RegisterForm {
  email: string
  password: string
  passwordConfirm: string // 비밀번호 확인용 (DB에는 저장 안 함)
  name: string
}

// 각 필드의 에러 메시지 구조 (없으면 undefined)
export interface FormErrors {
  email?: string
  password?: string
  passwordConfirm?: string
  name?: string
}

// Zustand store와 컴포넌트에서 사용하는 유저 정보
// 비밀번호는 절대 포함하지 않음
export interface User {
  name: string
  email: string
}