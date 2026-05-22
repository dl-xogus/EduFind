'use client'

import Link from "next/link"


export default function Footer() {
  return (
    <footer>
        <Link className='logo' href="/">EduFind</Link>
        <div>
          <p>2026 EduFind. 교육 통합 검색 플랫폼</p>
          <p>본 서비스에 표시되는 데이터는 실제 정보가 아닌 Mock 데이터입니다.</p>
        </div>
    </footer>
  )
}
