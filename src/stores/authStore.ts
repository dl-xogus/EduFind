// =============================================
// stores/authStore.ts
// 로그인 상태를 전역으로 관리하는 Zustand 스토어
// persist 미들웨어로 localStorage에 세션 유지
// =============================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import { validateRegisterForm, isFormValid } from '@/utils/validate'
import { RegisterForm, User } from '@/types/auth'

interface AuthStore {
  user: User | null        // 로그인한 유저 정보 (null이면 비로그인)
  isLoading: boolean       // API 요청 중 여부 (버튼 비활성화 등에 사용)
  register: (form: RegisterForm) => Promise<{ success: boolean; message?: string }>
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  // persist: 지정한 상태를 localStorage에 자동 저장/복원
  // → 새로고침해도 로그인 상태 유지됨
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      // ── 회원가입 ──────────────────────────────
      register: async (form) => {
        // 1단계: 클라이언트 유효성 검사 (API 요청 전에 먼저 막음)
        const errors = validateRegisterForm(form)
        if (!isFormValid(errors)) {
          return { success: false, message: Object.values(errors).find(Boolean) }
        }

        set({ isLoading: true })
        try {
          // 2단계: API Route로 전송 → 서버에서 DB 저장
          const { data } = await axios.post('/api/auth/register', form)

          // 회원가입 성공 시 바로 로그인 상태로 전환
          set({ user: data.user })
          return { success: true }
        } catch (error: any) {
          // axios 에러: error.response.data.message에 서버 에러 메시지가 담김
          return {
            success: false,
            message: error.response?.data?.message ?? '오류가 발생했어요'
          }
        } finally {
          // 성공/실패 상관없이 로딩 종료
          set({ isLoading: false })
        }
      },

      // ── 로그인 ──────────────────────────────
      login: async (email, password) => {
        set({ isLoading: true })
        try {
          // API Route로 이메일/비밀번호 전송 → 서버에서 DB 조회 + bcrypt 비교
          const { data } = await axios.post('/api/auth/login', { email, password })

          // 로그인 성공 시 유저 정보 저장 (비밀번호는 응답에 포함 안 됨)
          set({ user: data.user })
          return { success: true }
        } catch (error: any) {
          return {
            success: false,
            message: error.response?.data?.message ?? '이메일 또는 비밀번호가 틀렸어요'
          }
        } finally {
          set({ isLoading: false })
        }
      },

      // ── 로그아웃 ──────────────────────────────
      // user를 null로 바꾸면 persist가 localStorage도 자동 업데이트
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth', // localStorage에 저장될 키 이름: "auth"

      // isLoading은 UI 상태라 저장할 필요 없음 → user만 골라서 저장
      partialize: (state) => ({ user: state.user }),
    }
  )
)