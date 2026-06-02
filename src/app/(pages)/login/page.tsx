'use client'

import { ReactElement, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.scss'
import { useAuthStore } from '@/app/stores/authStore'

export default function Login() {
  const router = useRouter()
  const { user, login } = useAuthStore()

  useEffect(() => {
    if (user) router.replace('/')
  }, [user])

  const handleLogin = (e: React.FormEvent, email: string, password: string) => {
    e.preventDefault();
    console.log(`이메일: ${email}`, `비밀번호: ${password}`);
    
    login(email, password);
    router.push('/');
  };

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

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

        <button>로그인</button>
      </form>

      <div className={styles.msg}>계정이 없으신가요?<Link className={styles.botBtn} href="/signup">회원가입</Link></div>
    </div>
  )
}
