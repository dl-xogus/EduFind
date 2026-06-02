'use client'

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAcademyStore } from '@/stores/academyStore';
import { useCertStore } from '@/stores/certStore';
import { Academy, Cert } from '@/types/Main';
import styles from './certs.module.scss'
import WishButton from '@/components/WishButton'

export default function Certs() {
  return <Suspense><CertsInner /></Suspense>
}

function CertsInner() {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get('id');

  const allCerts = useCertStore(s => s.certs);
  const allAcademies = useAcademyStore(s => s.academies);

  const cert = allCerts.find(c => c.id === Number(id)) ?? null;
  const aca = cert ? allAcademies.filter(a => cert.academyIds.includes(a.id)) : [];
  const loading = allCerts.length === 0;

  /* 난이도별 클래스 따로 지정 */
  const levelFunc = (level: string) => {
    switch (level) {
      case '초급': return styles.low;
      case '중급': return styles.mid;
      case '고급': return styles.high;
    }
  };

  /* 시험 일정 선택 active */
  const [activeTab, setActiveTab] = useState<number | null>(null);

  const handleActiveTab = (i: number) => {
    if (activeTab === i) return setActiveTab(null);
    else return setActiveTab(i);
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

  if (loading) return <div className={styles.certs}><p className={styles.undefined}>불러오는 중...</p></div>
  if (!cert) return <div className={styles.certs}><p className={styles.undefined}>자격증을 찾을 수 없습니다.</p></div>

  return (
    <div className={styles.certs}>
      {/* 타이틀 */}
      <div className={styles.certTitle}>
        <p className={styles.certImg}><img src="/icons/ic-certificate(big).svg" alt="자격증아이콘" /></p>

        <div className={styles.right}>
          <div className={styles.category}>
            <p>{cert.category}</p>
            <p><img src="/icons/ic-dot.svg" alt="dot" /></p>
            <p>{cert.subcategory}</p>
          </div>

          <div className={styles.title}>
            <p className={styles.name}>{cert.name}</p>
            <WishButton itemId={cert.id} itemType="cert" className={styles.imgWrap} />
          </div>

          <p className={styles.issuer}>주관 : {cert.issuer}</p>

          <div className={styles.tags}>
            {cert.tags.map((c, i) => (
              <p key={i}>{c}</p>
            ))}
            <p>{cert.examType}</p>
          </div>
        </div>
      </div>

      {/* 간단 정보 */}
      <div className={styles.info}>
        <div className={styles.item}>
          <p className={styles.text}>난이도</p>
          <p className={levelFunc(cert.level)}>{cert.level}</p>
        </div>

        <div className={styles.item}>
          <p className={styles.text}>합격률</p>
          <p className={styles.detail}>{cert.passRate}%</p>
        </div>

        <div className={styles.item}>
          <p className={styles.text}>응시료</p>
          <p className={styles.detail}>{Number(cert.examFee).toLocaleString()}원</p>
        </div>

        <div className={styles.item}>
          <p className={styles.text}>응시 자격</p>
          <p className={styles.detail}>{cert.requirements}</p>
        </div>
      </div>

      {/* 자격증 소개 */}
      <div className={styles.intro}>
        <h3>자격증 소개</h3>
        <p>{cert.description}</p>
      </div>

      {/* 시험 과목 */}
      <div className={styles.intro}>
        <h3>시험 과목</h3>
        <div className={styles.subjects}>
          {cert.subjects.map((c, i) => (
            <p className={styles.sub} key={i}>{c}</p>
          ))}
        </div>
      </div>

      {/* 시험 일정 */}
      <div className={styles.intro}>
        <h3>시험 일정</h3>
        <div className={styles.examSchedule}>
          {cert.examSchedule.map((c, i) => (
            <div
              key={i}
              className={`${styles.schedules} ${activeTab === i ? styles.active : ''}`}
              onClick={() => handleActiveTab(i)}
            >
              <div className={`${styles.round} ${activeTab === i ? styles.active : ''}`}>
                <p className={`${styles.roundText} ${activeTab === i ? styles.active : ''}`}>{c.round}</p>
                <p className={`${styles.star} ${activeTab === i ? styles.active : ''}`}><img src="/icons/ic-bluestar.svg" alt="별아이콘" /></p>
              </div>
              <div className={styles.sches}>
                <div className={styles.sche}>
                  <p className={styles.text}>접수</p>
                  <p className={`${styles.date} ${activeTab === i ? styles.active : ''}`}>{c.apply}</p>
                </div>
                <div className={styles.sche}>
                  <p className={styles.text}>시험</p>
                  <p className={`${styles.date} ${activeTab === i ? styles.active : ''}`}>{c.exam}</p>
                </div>
                <div className={styles.sche}>
                  <p className={styles.text}>발표</p>
                  <p className={`${styles.date} ${activeTab === i ? styles.active : ''}`}>{c.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 관련 학원 */}
      <div className={`${styles.intro} ${styles.last}`}>
        <h3>관련 학원</h3>
        {aca.map(a => (
          <div key={a.id} className={styles.aca} onClick={e => handleAcaClick(e, a.id)}>
            <p
              className={styles.acaImg}
              onClick={e => handleAcaClick(e, a.id)}
            >
              <img src={a.image} alt="학원이미지" />
            </p>
            <div className={styles.mid}>
              <p className={styles.name}>{a.name}</p>
              <div className={styles.tag}>
                <p>{a.region}</p>
                <p><img src="/icons/ic-dot.svg" alt="dot" /></p>
                <p>{a.fee == 0 ? '무료' : `${Number(a.fee).toLocaleString()}원`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
