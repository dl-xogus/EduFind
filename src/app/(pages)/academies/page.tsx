'use client'

import { useRouter, useSearchParams } from 'next/navigation';
import AcaData from '@/app/data/academies.json'
import CertData from '@/app/data/certs.json'
import styles from './academies.module.scss'

export default function Academies() {
  const searchParams = useSearchParams();
  const id: string | null = searchParams.get('id');

  const acaDetail = AcaData.find(a => a.id === Number(id));
  const cert = CertData.filter(c => acaDetail?.certIds.includes(c.id));

  const levelFunc = (level: string) => {
    switch (level) {
      case '초급': return styles.low;
      case '중급': return styles.mid;
      case '고급': return styles.high;
    }
  };

  const router = useRouter();

  const handleCertClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    if (!id) return;
    router.push(`/certs?id=${encodeURIComponent(id)}`);
  };

  if (!acaDetail) return (
    <div className={styles.academies}>
      <p className={styles.undefined}>학원을 찾을 수 없습니다.</p>
    </div>
  )

  return (
    <div className={styles.academies}>
      <p className={styles.acaImg}><img src={acaDetail.image} alt="학원이미지" /></p>

      <div className={styles.title}>
        <p className={styles.category}>{acaDetail.category}</p>
        <div className={styles.bottom}>
          <div className={styles.nameAndHeart}>
            <h2 className={styles.name}>{acaDetail.name}</h2>
            <p className={styles.heart}><img src="/icons/ic-heart-1.svg" alt="하트아이콘" /></p>
          </div>

          <div className={styles.wishCount}>
            <p className={styles.heart}><img src="/icons/ic-heart-1.svg" alt="" /></p>
            <p className={styles.text}>{acaDetail.wishCount}명이 찜했어요</p>
          </div>
        </div>
      </div>

      <div className={styles.info}>
        <div className={styles.item}>
          <div className={styles.top}>
            <p className={styles.imgWrap}><img src="/icons/ic-map.svg" alt="맵아이콘" /></p>
            <p className={styles.text}>위치</p>
          </div>
          <p className={styles.detail}>{acaDetail.region}</p>
        </div>

        <div className={styles.item}>
          <div className={styles.top}>
            <p className={styles.imgWrap}><img src="/icons/ic-time.svg" alt="맵아이콘" /></p>
            <p className={styles.text}>운영시간</p>
          </div>
          <p className={styles.detail}>{acaDetail.openTime}</p>
        </div>

        <div className={styles.item}>
          <div className={styles.top}>
            <p className={styles.imgWrap}><img src="/icons/ic-phone.svg" alt="맵아이콘" /></p>
            <p className={styles.text}>전화번호</p>
          </div>
          <p className={styles.detail}>{acaDetail.phone}</p>
        </div>

        <div className={styles.item}>
          <div className={styles.top}>
            <p className={styles.imgWrap}><img src="/icons/ic-coin-1.svg" alt="맵아이콘" /></p>
            <p className={styles.text}>수강료</p>
          </div>
          <p className={styles.detail}>{acaDetail.fee == 0 ? '무료' : `${Number(acaDetail.fee).toLocaleString()}원`}</p>
        </div>
      </div>

      <div className={styles.intro}>
        <h3>학원 소개</h3>
        <p>{acaDetail.description}</p>
      </div>

      <div className={styles.intro}>
        <h3>개설 과목</h3>
        <div className={styles.subjects}>
          {acaDetail.subjects.map((aca, i) => (
            <p className={styles.sub} key={i}>{aca}</p>
          ))}
        </div>
      </div>

      <div className={`${styles.intro} ${styles.last}`}>
        <h3>연관 자격증</h3>
        <div className={styles.certs}>
          {cert.map(cer => (
            <div className={styles.cert} key={cer.id}>
              <p className={styles.imgWrap}><img src="/icons/ic-certificate(small).svg" alt="자격증아이콘" /></p>
              <div className={styles.inner}>
                <p
                  className={styles.name}
                  onClick={e => handleCertClick(e, cer.id)}
                >
                  {cer.name}
                </p>
                <div className={styles.text}>
                  <p className={levelFunc(cer.level)}>{cer.level}</p>
                  <p><img src="/icons/ic-dot.svg" alt="dot" /></p>
                  <p className={styles.detail}>합격률 {cer.passRate}%</p>
                  <p><img src="/icons/ic-dot.svg" alt="dot" /></p>
                  <p className={styles.detail}>다음 시험 {cer.nextExam.replaceAll('-', '.')}</p>
                </div>
              </div>
              <p className={styles.btn}><img src="/icons/ic-right.svg" alt="right" /></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
