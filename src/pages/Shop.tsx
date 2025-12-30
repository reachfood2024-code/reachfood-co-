import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const Shop = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')

  useEffect(() => {
    // Redirect to shop subdomain
    window.location.href = isArabic
      ? 'https://shop.reachfood.co/ar'
      : 'https://shop.reachfood.co'
  }, [isArabic])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-white text-xl">
        {isArabic ? 'جاري التحويل إلى المتجر...' : 'Redirecting to shop...'}
      </p>
    </div>
  )
}

export default Shop
