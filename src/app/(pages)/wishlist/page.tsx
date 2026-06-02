'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/stores/authStore';
import { useWishlistStore } from '@/app/stores/wishlistStore';
import { useAcademyStore } from '@/app/stores/academyStore';
import { useCertStore } from '@/app/stores/certStore';
import WishButton from '@/app/components/WishButton';
import styles from './wishlist.module.scss'

export default function Wishlist() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, fetchWishlist } = useWishlistStore();
  const allAcademies = useAcademyStore(s => s.academies);
  const allCerts = useCertStore(s => s.certs);
  const [activeTab, setActiveTab] = useState<'all' | 'aca' | 'cert'>('all');

  useEffect(() => {
    if (!user) { router.replace('/login'); return; }
    fetchWishlist(user.email);
  }, [user]);

  const wishedAcademies = allAcademies.filter(a => items.some(i => i.itemType === 'academy' && i.itemId === a.id));
  const wishedCerts = allCerts.filter(c => items.some(i => i.itemType === 'cert' && i.itemId === c.id));

  const showAca = activeTab === 'all' || activeTab === 'aca';
  const showCert = activeTab === 'all' || activeTab === 'cert';

  const levelFunc = (level: string) => {
    switch (level) {
      case '초급': return styles.low;
      case '중급': return styles.mid;
      case '고급': return styles.high;
    }
  };
  
  return (
    <div className={styles.wishlist}>
      <h2>내 찜 목록</h2>
      <div className={styles.tab}>
        <p
          className={activeTab === 'all' ? styles.active : ''}
          onClick={() => setActiveTab('all')}
        >
          전체({items.length})
        </p>
        <p
          className={activeTab === 'aca' ? styles.active : ''}
          onClick={() => setActiveTab('aca')}
        >
          학원({wishedAcademies.length})
        </p>
        <p
          className={activeTab === 'cert' ? styles.active : ''}
          onClick={() => setActiveTab('cert')}
        >
          자격증({wishedCerts.length})
        </p>
      </div>

      {showAca && wishedAcademies.length > 0 && (
        <div className={styles.section}>
          {activeTab === 'all' && <h3 className={styles.sectionTitle}>학원</h3>}
          <div className={styles.items}>
            {wishedAcademies.map(a => (
              <div key={a.id} className={styles.item} onClick={() => router.push(`/academies?id=${a.id}`)}>
                <p className={styles.thumb}><img src={a.image} alt={a.name} /></p>
                <div className={styles.info}>
                  <p className={styles.category}>{a.category}</p>
                  <p className={styles.name}>{a.name}</p>
                  <p className={styles.sub}>{a.region} · {a.fee === 0 ? '무료' : `${Number(a.fee).toLocaleString()}원`}</p>
                </div>
                <WishButton itemId={a.id} itemType="academy" className={styles.heartBtn} />
              </div>
            ))}
          </div>
        </div>
      )}

      {showCert && wishedCerts.length > 0 && (
        <div className={styles.section}>
          {activeTab === 'all' && <h3 className={styles.sectionTitle}>자격증</h3>}
          <div className={styles.items}>
            {wishedCerts.map(c => (
              <div key={c.id} className={styles.item} onClick={() => router.push(`/certs?id=${c.id}`)}>
                <p className={styles.certThumb}><img src="/icons/ic-certificate(small).svg" alt={c.name} /></p>
                <div className={styles.info}>
                  <p className={styles.category}>{c.category} · {c.subcategory}</p>
                  <p className={styles.name}>{c.name}</p>
                  <p className={styles.sub}><span className={levelFunc(c.level)}>{c.level}</span> · 합격률 {c.passRate}% · 다음 시험 {(c.nextExam).replaceAll('-', '.')}</p>
                </div>
                <WishButton itemId={c.id} itemType="cert" className={styles.heartBtn} />
              </div>
            ))}
          </div>
        </div>
      )}

      {items.length === 0 && (
        <p className={styles.empty}>찜한 항목이 없습니다.</p>
      )}
    </div>
  )
}
