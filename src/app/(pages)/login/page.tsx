'use client'

import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.scss'
import { useAuthStore } from '@/stores/authStore'

export default function Login() {
  const router = useRouter()
  const { user, login } = useAuthStore()

  useEffect(() => {
    if (user) router.replace('/')
  }, [user])

  const handleLogin = async (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    setServerError('');
    
    const result = await login(email, password);
    if (result.success) {
      router.push('/');
    } else {
      setServerError(result.message ?? '오류가 발생했어요');
    }
  };

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('')

  return (
    <div className={styles.login}>
      <div className={styles.top}>
        <p className={styles.logo}>EduFind</p>
        <p className={styles.title}>로그인</p>
        <p className={styles.text}>찜 목록 이용을 위해 로그인하세요</p>
      </div>

      <form onSubmit={(e) => handleLogin(e, email, password)}>
        <div className={styles.inputs}>
          <div className={styles.inp}>
            <p>이메일</p>
            <input
              type="text"
              placeholder='이메일을 입력하세요'
              onChange={(e) => setEmail((e.target.value).trim())}
            />
          </div>

          <div className={styles.inp}>
            <p>비밀번호</p>
            <div className={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder='비밀번호를 입력하세요'
                onChange={(e) => setPassword((e.target.value).trim())}
              />
              <p className={styles.eyeBtn} onClick={() => setShowPassword(v => !v)}>
                <img src={showPassword ? '/icons/ic-hide.svg' : '/icons/ic-show.svg'} alt="비밀번호 숨김/보기" />
              </p>
            </div>
          </div>
        </div>

        <div>
          {serverError && <p className={styles.error}>{serverError}</p>}
          <button className={styles.btnLogin}>로그인</button>
        </div>
      </form>

      <div className={styles.msg}>계정이 없으신가요?<Link className={styles.botBtn} href="/signup">회원가입</Link></div>
    </div>
  )
}
