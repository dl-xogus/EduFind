'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DropdownKey } from '@/app/types/Search'

import AcaData from '@/app/data/academies.json'
import CertData from '@/app/data/certs.json'
import styles from './Search.module.scss'

const REGIONS = ['서울', '경기', '부산', '대구', '인천'];
const CATEGORIES = ['IT', '어학', '금융', '기술', '디자인', '공무원'];
const FEES = ['무료', '20만원 이하', '20 ~ 40만원', '40만원 이상'];

export default function Search() {
  // 현재 열려있는 드롭다운 key ('region' | 'category' | 'fee' | null)
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);

  // 각 드롭다운에서 선택된 값 (선택 안 했으면 null)
  const [selected, setSelected] = useState<Record<DropdownKey, string | null>>({
    region: null,
    category: null,
    fee: null,
  });

  // 탭 클릭 시 해당 드롭다운 열기/닫기 (이미 열려있으면 닫힘)
  const toggleDropdown = (key: DropdownKey) => {
    setOpenDropdown(prev => prev === key ? null : key);
  };

  // 옵션 클릭 시 선택값 저장, 이미 선택된 항목이면 null로 초기화
  const selectOption = (key: DropdownKey, value: string) => {
    setSelected(prev => ({ ...prev, [key]: prev[key] === value ? null : value }));
    setOpenDropdown(null); // 선택 후 드롭다운 닫기
  };

  // 해당 드롭다운이 열려있는지 여부
  const isOpen = (key: DropdownKey) => openDropdown === key;

  // 선택된 값이 있으면 선택값, 없으면 기본 라벨(ex. '지역') 표시
  const tabLabel = (key: DropdownKey, defaultLabel: string) =>
    selected[key] ?? defaultLabel;

  const searchParams = useSearchParams();
  const value: string | null = searchParams.get('value');

  const filteredAcaList = AcaData.filter(a =>
    a.name.includes(value ?? '') ||
    a.subjects.some(s => s.includes(value ?? ''))
  );


  return (
    <div className={styles.search}>
      <p className={styles.find}><span>"{value}"</span> 검색결과</p>
      <div className={styles.acaOrCert}>
        <p className={styles.active}>학원({filteredAcaList.length})</p>
        <p>자격증(0)</p>
      </div>

      <div className={styles.filters}>
        {/* 지역 드롭다운 */}
        <div className={styles.dropdown}>
          {/* 열려있거나 선택된 값이 있으면 active 클래스로 파란 테두리 스타일 적용 */}
          <div
            className={`${styles.tab} ${isOpen('region') || selected.region ? styles.active : ''}`}
            onClick={() => toggleDropdown('region')}
          >
            <p>{tabLabel('region', '지역')}</p>
            {/* 열려있으면 화살표 회전 (active) + 파란 아이콘 */}
            <p className={`${styles.imgWrap} ${isOpen('region') ? styles.active : ''}`}>
              <img src={isOpen('region') || selected.region ? '/icons/ic-down(blue).svg' : '/icons/ic-down(black).svg'} alt="down아이콘" />
            </p>
          </div>
          {/* 열려있으면 'open', 닫혀있으면 'closed' (css에서 closed는 display:none) */}
          <div className={isOpen('region') ? styles.open : styles.closed}>
            <div>
              {REGIONS.map(r => (
                <p
                  key={r}
                  className={selected.region === r ? styles.selected : ''} // 선택된 항목 파란 글씨
                  onClick={() => selectOption('region', r)}
                >{r}</p>
              ))}
            </div>
          </div>
        </div>

        {/* 카테고리 드롭다운 */}
        <div className={styles.dropdown}>
          <div
            className={`${styles.tab} ${isOpen('category') || selected.category ? styles.active : ''}`}
            onClick={() => toggleDropdown('category')}
          >
            <p>{tabLabel('category', '카테고리')}</p>
            <p className={`${styles.imgWrap} ${isOpen('category') ? styles.active : ''}`}>
              <img src={isOpen('category') || selected.category ? '/icons/ic-down(blue).svg' : '/icons/ic-down(black).svg'} alt="down아이콘" />
            </p>
          </div>
          <div className={isOpen('category') ? styles.open : styles.closed}>
            <div>
              {CATEGORIES.map(c => (
                <p
                  key={c}
                  className={selected.category === c ? styles.selected : ''}
                  onClick={() => selectOption('category', c)}
                >{c}</p>
              ))}
            </div>
          </div>
        </div>

        {/* 수강료 드롭다운 */}
        <div className={styles.dropdown}>
          <div
            className={`${styles.tab} ${isOpen('fee') || selected.fee ? styles.active : ''}`}
            onClick={() => toggleDropdown('fee')}
          >
            <p>{tabLabel('fee', '수강료')}</p>
            <p className={`${styles.imgWrap} ${isOpen('fee') ? styles.active : ''}`}>
              <img src={isOpen('fee') || selected.fee ? '/icons/ic-down(blue).svg' : '/icons/ic-down(black).svg'} alt="down아이콘" />
            </p>
          </div>
          <div className={isOpen('fee') ? styles.open : styles.closed}>
            <div>
              {FEES.map(f => (
                <p
                  key={f}
                  className={selected.fee === f ? styles.selected : ''}
                  onClick={() => selectOption('fee', f)}
                >{f}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className={styles.title}>학원 <b>{filteredAcaList.length}</b>개</h2>

        <div className={styles.objs}>
          {filteredAcaList.map(obj => (
            <div className={styles.acaObj} key={obj.id}>
              <p className={styles.imgWrap}><img src={obj.image} alt="학원이미지" /></p>
              <div className={styles.detail}>
                <div className={styles.nameHeart}>
                  <p className={styles.name}>{obj.name}</p>
                  <div className={styles.heart}>
                    <p className={styles.imgWrap}><img src='/icons/ic-heart-1.svg' alt="하트아이콘" /></p>
                    <p>279</p>
                  </div>
                </div>

                <div className={styles.tag}>
                  <p className={styles.category}>{obj.category}</p>
                  {obj.subjects.map((s, i) => (
                    <p className={styles.subjects} key={i}>{s}</p>
                  ))}
                </div>

                <div className={styles.mapFee}>
                  <div className={styles.map}>
                    <p><img src='/icons/ic-map.svg' alt="맵아이콘" /></p>
                    <p className={styles.address}>{obj.address}</p>
                  </div>
                  <p className={styles.fee}>{obj.fee === 0 ? '무료' : `${Number(obj.fee).toLocaleString()}원`}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
