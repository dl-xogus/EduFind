'use client'

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?value=${encodeURIComponent(query.trim())}`);
  };

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
        <Link className='loginBtn' href='/login'>로그인</Link>
      </div>
    </header>
  )
}
