'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/app/stores/authStore'
import { useWishlistStore } from '@/app/stores/wishlistStore'

interface Props {
  itemId: number
  itemType: 'academy' | 'cert'
  className?: string
}

export default function WishButton({ itemId, itemType, className }: Props) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { fetchWishlist, toggle, isWished, items } = useWishlistStore()

  useEffect(() => {
    if (user) fetchWishlist(user.email)
  }, [user])

  const wished = isWished(itemId, itemType)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!user) return router.push('/login')
    toggle(user.email, itemId, itemType)
  }

  return (
    <p className={className} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <img
        src={wished ? '/icons/ic-heart.svg' : '/icons/ic-heart-1.svg'}
        alt="하트아이콘"
      />
    </p>
  )
}
