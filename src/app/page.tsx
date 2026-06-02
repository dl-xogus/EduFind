'use client'

import { useState } from 'react'

import WishButton from '@/components/WishButton'
import { useAcademyStore } from '@/stores/academyStore'
import { useCertStore } from '@/stores/certStore'

import styles from "./page.module.scss";
import { useRouter } from 'next/navigation'

const TABS = [
  { label: '전체', ic_black: '/icons/ic-all.svg', ic_white: '/icons/ic-all(white).svg' },
  { label: 'IT', ic_black: '/icons/ic-pc.svg', ic_white: '/icons/ic-pc(white).svg' },
  { label: '어학', ic_black: '/icons/ic-language.svg', ic_white: '/icons/ic-language(white).svg' },
  { label: '금융', ic_black: '/icons/ic-coin.svg', ic_white: '/icons/ic-coin(white).svg' },
  { label: '기술', ic_black: '/icons/ic-tools.svg', ic_white: '/icons/ic-tools(white).svg' },
  { label: '디자인', ic_black: '/icons/ic-palette.svg', ic_white: '/icons/ic-palette(white).svg' },
  { label: '공무원', ic_black: '/icons/ic-building.svg', ic_white: '/icons/ic-building(white).svg' },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const academies = useAcademyStore(s => s.academies);
  const certs = useCertStore(s => s.certs);

  const academyList = academies
    .filter(a => selectedCategory === '전체' || a.category === selectedCategory)
    .slice(0, 6);

  const certList = certs
    .filter(c => selectedCategory === '전체' || c.category === selectedCategory)
    .slice(0, 6);

  const levelFunc = (level: string) => {
    switch (level) {
      case '초급': return 'low';
      case '중급': return 'mid';
      case '고급': return 'high';
    }
  };

  const router = useRouter();

  const handleAcaClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!id) return;
    router.push(`/academies?id=${encodeURIComponent(id)}`);
  };

  const handleCertClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!id) return;
    router.push(`/certs?id=${encodeURIComponent(id)}`);
  };

  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.top}>
          <p className={styles.imgWrap}><img src='/icons/ic-3star.svg' alt="별3개 아이콘" /></p>
          <p className={styles.text}>학원 자격증 통합 검색</p>
        </div>

        <div className={styles.middle}>
          <h1>배우고 싶을 때,</h1>
          <h1>여기 하나면 끝</h1>
        </div>

        <p className={styles.bottom}>전국 학원과 자격증 정보를 한 번에 찾아보세요</p>
      </section>

      <section className={styles.tabs}>
        {TABS.map(tab => (
          <div
            key={tab.label}
            className={`${styles.tabBtn} ${selectedCategory === tab.label ? styles.active : ''}`}
            onClick={() => setSelectedCategory(tab.label)}      // 클릭 시 해당 카테고리로 변경
          >
            <p className={styles.imgWrap}>
              <img src={selectedCategory == tab.label ? tab.ic_white : tab.ic_black} alt={tab.label} />
            </p>
            <p>{tab.label}</p>
          </div>
        ))}
      </section>

      {
        academyList.length ?
          <section className={styles.objSection}>
            <div className={styles.title}>
              <h2>학원</h2>
              <div>
                <p>전체보기</p>
                <p className={styles.imgWrap}><img src='/icons/ic-right(blue).svg' alt="right" /></p>
              </div>
            </div>

            <article>
              {academyList.map(obj => (
                <div className={styles.acaObj} key={obj.id}>
                  <p
                    className={styles.imgWrap}
                    onClick={e => handleAcaClick(e, obj.id)}
                  >
                    <img src={obj.image} alt={obj.name} />
                  </p>
                  <div className={styles.detail}>
                    <p className={styles.category}>{obj.category}</p>
                    <p
                      className={styles.name}
                      onClick={e => handleAcaClick(e, obj.id)}
                    >
                      {obj.name}
                    </p>
                    <div className={styles.address}>
                      <p><img src='/icons/ic-map.svg' alt="맵아이콘" /></p>
                      <p>{obj.address ? obj.address : '정보 없음'}</p>
                    </div>
                    <div className={styles.priceHeart}>
                      <p className={styles.price}>{obj.fee === 0 ? '무료' : `${Number(obj.fee).toLocaleString()}원`}</p>
                      <div className={styles.heart}>
                        <WishButton itemId={obj.id} itemType="academy" className={styles.imgWrap} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </article>
          </section>
          : ''
      }

      {
        certList.length ?
          <section className={styles.objSection} style={{ paddingTop: '40px' }}>
            <div className={styles.title}>
              <h2>자격증</h2>
              <div>
                <p>전체보기</p>
                <p className={styles.imgWrap}><img src='/icons/ic-right(blue).svg' alt="right" /></p>
              </div>
            </div>

            <article>
              {certList.map(obj => (
                <div className={styles.certObj} key={obj.id}>
                  <div className={styles.top}>
                    <p
                      className={styles.imgWrap}
                      onClick={e => handleCertClick(e, obj.id)}
                    >
                      <img src='/icons/ic-certificate(small).svg' alt="자격증아이콘" />
                    </p>
                    <div>
                      <WishButton itemId={obj.id} itemType="cert" className={styles.imgWrap} />
                    </div>
                  </div>
                  <p
                    className={styles.name}
                    onClick={e => handleCertClick(e, obj.id)}
                  >
                    {obj.name}
                  </p>
                  <div className={styles.text}>
                    <p className={styles.t}>난이도</p>
                    <p className={levelFunc(obj.level)}>{obj.level ? obj.level : ''}</p>
                  </div>
                  <div className={styles.text}>
                    <p className={styles.t}>합격률</p>
                    <p>{obj.passRate ? `${obj.passRate}%` : '정보 없음'}</p>
                  </div>
                  <div className={styles.text}>
                    <p className={styles.t}>다음 시험</p>
                    <p>{obj.nextExam ? obj.nextExam : '정보 없음'}</p>
                  </div>
                </div>
              ))}
            </article>
          </section>
          : ''
      }
    </div>
  )
}
