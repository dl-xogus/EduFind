'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from '@/app/(pages)/login/login.module.scss'
import { useAuthStore } from '@/app/stores/authStore'
import { RegisterForm, FormErrors } from '@/app/types/auth'
import { validateRegisterForm } from '@/app/utils/validate'

export default function Signup() {
  const router = useRouter()
  const { user, register, isLoading } = useAuthStore()

  useEffect(() => {
    if (user) router.replace('/')
  }, [user])

  const [form, setForm] = useState<RegisterForm>({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError('')

    const validationErrors = validateRegisterForm(form)
    if (Object.values(validationErrors).some(Boolean)) {
      setErrors(validationErrors)
      return
    }

    const result = await register(form)
    if (result.success) {
      router.push('/')
    } else {
      setServerError(result.message ?? '오류가 발생했어요')
    }
  }

  return (
    <div className={styles.login}>
      <div className={styles.top}>
        <p className={styles.logo}>EduFind</p>
        <p className={styles.title}>회원가입</p>
        <p className={styles.text}>무료로 시작하세요</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.inputs}>
          <div className={styles.inp}>
            <p>이름</p>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder='이름을 입력하세요'
            />
            {errors.name && <p className={styles.error}>{errors.name}</p>}
          </div>

          <div className={styles.inp}>
            <p>이메일</p>
            <input
              type="text"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder='이메일을 입력하세요'
            />
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.inp}>
            <p>비밀번호</p>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder='영문 대문자, 숫자 포함 8자 이상'
            />
            {errors.password && <p className={styles.error}>{errors.password}</p>}
          </div>

          <div className={styles.inp}>
            <p>비밀번호 확인</p>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              placeholder='비밀번호를 다시 입력하세요'
            />
            {errors.passwordConfirm && <p className={styles.error}>{errors.passwordConfirm}</p>}
          </div>
        </div>

        {serverError && <p className={styles.error}>{serverError}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중...' : '회원가입'}
        </button>
      </form>

      <div className={styles.msg}>이미 계정이 있으신가요?<Link className={styles.botBtn} href="/login">로그인</Link></div>
    </div>
  )
}
