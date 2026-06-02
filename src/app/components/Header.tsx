'use client'

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';

export default function Header() {
  const [query, setQuery] = useState('');
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    setActiveMenu(false);
    router.push('/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?value=${encodeURIComponent(query.trim())}`);
  };

  console.log(user);

  const [activeMenu, setActiveMenu] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
  }, [activeMenu]);

  return (
    <header>
      <div className='inner'>
        <Link className='logo' href="/">EduFind</Link>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder='검색어를 입력해주세요'
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button className='searchBtn'><img src='/icons/ic-search.svg' alt="검색아이콘" /></button>
        </form>
        {user ?
          <div className='loginDiv' ref={menuRef}>
            <p className='user' onClick={() => setActiveMenu(!activeMenu)}>
              <span className='userName'>{user.name}</span> 님
            </p>
            <div className={`userMenu ${activeMenu ? 'active' : ''}`}>
              <Link className='list' href='/wishlist' onClick={() => setActiveMenu(false)}>찜 목록</Link>
              <p className='list' onClick={handleLogout}>로그아웃</p>
            </div>
          </div>
          : <Link className='loginBtn' href='/login'>로그인</Link>
        }
      </div>
    </header>
  )
}
