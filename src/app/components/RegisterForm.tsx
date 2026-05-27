// components/RegisterForm.tsx
'use client'
import { useState } from 'react'
import { useAuthStore } from '@/app/stores/authStore'
import { validateRegisterForm } from '@/app/utils/validate'
import { RegisterForm, FormErrors } from '@/app/types/auth'

export default function RegisterForm() {
  const register = useAuthStore((s) => s.register)
  const [form, setForm] = useState<RegisterForm>({
    name: '', email: '', password: '', passwordConfirm: ''
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updated = { ...form, [name]: value }
    setForm(updated)

    // 타이핑할 때마다 해당 필드만 실시간 검사
    const newErrors = validateRegisterForm(updated)
    setErrors((prev) => ({ ...prev, [name]: newErrors[name as keyof FormErrors] }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const allErrors = validateRegisterForm(form)
    setErrors(allErrors)
    if (Object.values(allErrors).some(Boolean)) return

    const result = await register(form)
    if (!result.success) setServerError(result.message ?? '')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} placeholder="이름" />
      {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

      <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" />
      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

      <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="비밀번호" />
      {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

      <input name="passwordConfirm" type="password" value={form.passwordConfirm} onChange={handleChange} placeholder="비밀번호 확인" />
      {errors.passwordConfirm && <p className="text-red-500 text-sm">{errors.passwordConfirm}</p>}

      {serverError && <p className="text-red-500">{serverError}</p>}
      <button type="submit">회원가입</button>
    </form>
  )
}