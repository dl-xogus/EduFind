// =============================================
// utils/validate.ts
// 유효성 검사 로직을 한 곳에 모아둔 파일
// 프론트(컴포넌트, Zustand)와 백엔드(API Route) 양쪽에서 재사용
// =============================================

import { RegisterForm, FormErrors } from '@/types/auth'

/**
 * 회원가입 폼 전체 유효성 검사
 * @returns 에러가 없는 필드는 undefined, 에러 있으면 메시지 문자열
 */
export function validateRegisterForm(form: RegisterForm): FormErrors {
  const errors: FormErrors = {}

  // 이름: 공백만 입력하는 경우도 막기 위해 trim() 사용
  if (!form.name.trim()) {
    errors.name = '이름을 입력해주세요'
  }

  // 이메일: 정규식으로 형식 검사 (예: test@example.com)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = '이메일을 입력해주세요'
  } else if (!emailRegex.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아니에요'
  }

  // 비밀번호: 8자 이상, 영문 대문자 + 숫자 포함 필수
  if (!form.password) {
    errors.password = '비밀번호를 입력해주세요'
  } else if (form.password.length < 8) {
    errors.password = '비밀번호는 8자 이상이어야 해요'
  } else if (!/[A-Z]/.test(form.password) || !/[0-9]/.test(form.password)) {
    errors.password = '영문 대문자와 숫자를 포함해야 해요'
  }

  // 비밀번호 확인: 위에서 비밀번호 에러 없을 때만 비교
  if (!errors.password && form.password !== form.passwordConfirm) {
    errors.passwordConfirm = '비밀번호가 일치하지 않아요'
  }

  return errors
}

/**
 * 에러 객체에 에러가 하나도 없으면 true
 * 폼 제출 가능 여부 판단에 사용
 */
export const isFormValid = (errors: FormErrors): boolean =>
  Object.values(errors).every((v) => !v)