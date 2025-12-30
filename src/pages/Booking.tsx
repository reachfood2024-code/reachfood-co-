import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Minus, Plus, Package, CreditCard, Sparkles, ShieldCheck } from 'lucide-react'

// Types (previously from api.ts)
interface Product {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  price: number;
  originalPrice?: number;
  category: string;
  badgeEn?: string;
  badgeAr?: string;
  imageUrl?: string;
  featuresEn: string[];
  featuresAr: string[];
  isFeatured: boolean;
  isActive: boolean;
}

interface OrderResult {
  orderNumber: string;
  total: number;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
}

// Generate unique session ID
const generateSessionId = () => {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${timestamp}-${random}`
}

// Mock Products Data
const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    nameEn: 'Collagen Boost Meal Kit',
    nameAr: 'وجبة معززة بالكولاجين',
    descriptionEn: 'Self-heating meal enriched with marine collagen peptides for skin health and joint support',
    descriptionAr: 'وجبة ذاتية التسخين غنية ببتيدات الكولاجين البحري لصحة البشرة ودعم المفاصل',
    price: 24.99,
    originalPrice: 29.99,
    category: 'wellness',
    badgeEn: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
    featuresEn: ['5000mg Marine Collagen', 'Self-heating in 5 min', 'Plantable packaging'],
    featuresAr: ['5000 ملغ كولاجين بحري', 'تسخين ذاتي في 5 دقائق', 'تغليف قابل للزراعة'],
    isFeatured: true,
    isActive: true
  },
  {
    id: '2',
    nameEn: 'High Protein Power Meal',
    nameAr: 'وجبة البروتين العالي',
    descriptionEn: 'Nutrient-dense meal with 35g of protein for active lifestyles and muscle recovery',
    descriptionAr: 'وجبة غنية بالمغذيات تحتوي على 35 جرام من البروتين لأسلوب حياة نشط واستعادة العضلات',
    price: 22.99,
    originalPrice: 27.99,
    category: 'fitness',
    badgeEn: 'High Protein',
    badgeAr: 'بروتين عالي',
    featuresEn: ['35g Protein', 'Low carb', 'Ready in 5 min'],
    featuresAr: ['35 جرام بروتين', 'منخفض الكربوهيدرات', 'جاهز في 5 دقائق'],
    isFeatured: true,
    isActive: true
  }
]

// Product image mapping
const getProductImage = (productName: string): string => {
  if (productName.toLowerCase().includes('collagen') || productName.includes('كولاجين')) {
    return '/images/prod7.jpg'
  }
  if (productName.toLowerCase().includes('protein') || productName.includes('بروتين')) {
    return '/images/icons/3dzz.jpg'
  }
  return '/images/prod7.jpg' // fallback
}

export default function Booking() {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')

  // State
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<Record<string, { product: Product; quantity: number }>>({})
  const [step, setStep] = useState(0)
  const [sessionId] = useState(() => generateSessionId())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null)

  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: ''
  })

  // Load products on mount (using mock data)
  useEffect(() => {
    // Simulate API loading delay
    setTimeout(() => {
      setProducts(MOCK_PRODUCTS)
      setIsLoading(false)
    }, 500)
  }, [])

  // Track abandonment (disabled for mock)
  useEffect(() => {
    // Mock: tracking disabled
  }, [sessionId, step])

  // Track cart changes (disabled for mock)
  useEffect(() => {
    // Mock: tracking disabled
  }, [cart, sessionId, step])

  // Calculate totals
  const cartItems = Object.values(cart)
  const subtotal = cartItems.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0)
  const total = subtotal

  // Update quantity
  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      const current = prev[productId]?.quantity || 0
      const newQuantity = Math.max(0, Math.min(10, current + delta))

      if (newQuantity === 0) {
        const { [productId]: _, ...rest } = prev
        return rest
      }

      const product = products.find(p => p.id === productId)
      if (!product) return prev

      return {
        ...prev,
        [productId]: { product, quantity: newQuantity }
      }
    })
  }

  // Handlers
  const handleContinueToPersonalInfo = async () => {
    if (Object.keys(cart).length === 0) {
      setError(isArabic ? 'يرجى اختيار منتج واحد على الأقل' : 'Please select at least one product')
      return
    }
    setError(null)
    setStep(1)
    // Mock: tracking disabled
  }

  const handleContinueToCheckout = async () => {
    if (!formData.fullName || !formData.email) {
      setError(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields')
      return
    }
    setError(null)
    setStep(2)
    // Mock: tracking disabled
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.country) {
      setError(isArabic ? 'يرجى إدخال البلد' : 'Please enter your country')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Generate order number
      const orderNumber = `RF${Date.now().toString().slice(-8)}`

      // Prepare booking data for Google Apps Script
      const bookingData = {
        type: 'booking',
        orderNumber,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country
        },
        items: Object.values(cart).map(item => ({
          id: item.product.id,
          name: isArabic ? item.product.nameAr : item.product.nameEn,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: Number(total.toFixed(2)),
        source: 'reachfood.co'
      }

      // Send to Google Apps Script
      const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL
      if (GOOGLE_SCRIPT_URL) {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData)
        })
      }

      // Create order result
      const result: OrderResult = {
        orderNumber,
        total: Number(total.toFixed(2)),
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending'
      }

      setOrderResult(result)
      setStep(3)
    } catch (err) {
      console.error('Order submission error:', err)
      // Still show success since no-cors doesn't return response
      const orderNumber = `RF${Date.now().toString().slice(-8)}`
      setOrderResult({
        orderNumber,
        total: Number(total.toFixed(2)),
        status: 'pending',
        paymentMethod: 'cod',
        paymentStatus: 'pending'
      })
      setStep(3)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-amber-50/30 to-teal-50">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');
        `}</style>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="w-20 h-20 border-4 border-teal-500/30 border-t-teal-600 rounded-full animate-spin mx-auto mb-6"></div>
            <Sparkles className="w-8 h-8 text-teal-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-stone-700 font-['Manrope'] font-medium text-lg">
            {isArabic ? 'جاري التحضير...' : 'Preparing your experience...'}
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden pt-20 md:pt-24 ${isArabic ? 'rtl' : 'ltr'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Custom Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Manrope:wght@400;500;600;700&display=swap');

        body {
          font-family: 'Manrope', sans-serif;
        }

        h1, h2, h3, h4, h5, h6 {
          font-family: 'Cormorant Garamond', serif;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-2deg);
          }
          50% {
            transform: translateY(-15px) rotate(0deg);
          }
          75% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
          background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          background-size: 1000px 100%;
        }
      `}</style>

      {/* Gradient Mesh Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-50 via-amber-50/30 to-teal-50"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-teal-400/10 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 md:py-8 lg:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12 lg:mb-16 mt-2 md:mt-4"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-4 py-2 md:px-6 md:py-2 rounded-full mb-4 md:mb-6 shadow-lg"
          >
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
            <span className="font-['Manrope'] font-semibold text-xs md:text-sm uppercase tracking-wider">
              {isArabic ? 'تجربة تسوق مميزة' : 'Premium Shopping Experience'}
            </span>
          </motion.div>

          <h1 className="font-['Cormorant_Garamond'] text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-stone-900 mb-3 md:mb-4 leading-tight px-2">
            {isArabic ? 'اختر صحتك' : 'Choose Your Wellness'}
          </h1>
          <p className="font-['Manrope'] text-sm sm:text-base md:text-lg lg:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed px-4">
            {isArabic
              ? 'وجبات ذاتية التسخين مدعمة بالمغذيات الحيوية لأسلوب حياة نشط'
              : 'Self-heating meals fortified with bio-nutrients for an active lifestyle'
            }
          </p>
        </motion.div>

        {/* Progress Steps */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-6 md:mb-8 lg:mb-12 px-2"
          >
            <div className="relative flex justify-between items-center">
              {/* Progress Bar Background */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-stone-200 -translate-y-1/2"></div>

              {/* Progress Bar Fill */}
              <motion.div
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-teal-500 to-emerald-500 -translate-y-1/2 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: step === 0 ? '0%' : step === 1 ? '50%' : '100%' }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              ></motion.div>

              {/* Steps */}
              {[
                { num: 0, label: isArabic ? 'المنتجات' : 'Products', icon: Package },
                { num: 1, label: isArabic ? 'المعلومات' : 'Details', icon: Check },
                { num: 2, label: isArabic ? 'الدفع' : 'Payment', icon: CreditCard }
              ].map((s, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10 flex flex-col items-center gap-1 md:gap-2"
                >
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center font-['Manrope'] font-bold text-sm md:text-lg transition-all duration-300 ${
                    step >= s.num
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg shadow-teal-500/50'
                      : 'bg-white border-2 border-stone-200 text-stone-400'
                  }`}>
                    {step > s.num ? <s.icon className="w-4 h-4 md:w-6 md:h-6" /> : s.num + 1}
                  </div>
                  <span className={`font-['Manrope'] text-xs md:text-sm font-medium ${
                    step >= s.num ? 'text-teal-600' : 'text-stone-400'
                  }`}>
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 font-['Manrope']"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 0: Product Selection */}
        {step === 0 && (
          <div className="grid lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {/* Products Grid */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {products.map((product, idx) => {
                const quantity = cart[product.id]?.quantity || 0
                const productImage = getProductImage(isArabic ? product.nameAr : product.nameEn)

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ${
                      quantity > 0 ? 'ring-2 ring-teal-500 ring-offset-4' : ''
                    }`}
                  >
                    {/* Shimmer effect on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute inset-0 animate-shimmer"></div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6 lg:p-8 relative z-10">
                      {/* Product Image */}
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        className="relative w-full md:w-48 h-40 md:h-48 flex-shrink-0 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-50 to-amber-50 shadow-inner"
                      >
                        <img
                          src={productImage}
                          alt={isArabic ? product.nameAr : product.nameEn}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%2314b8a6" width="200" height="200"/%3E%3Ctext fill="%23ffffff" font-family="Arial" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EProduct%3C/text%3E%3C/svg%3E'
                          }}
                        />

                        {/* Badge */}
                        {product.badgeEn && (
                          <div className="absolute top-3 right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-['Manrope'] font-semibold shadow-lg">
                            {isArabic ? product.badgeAr : product.badgeEn}
                          </div>
                        )}

                        {/* Quantity Badge */}
                        {quantity > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-3 left-3 bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-['Manrope'] font-bold shadow-lg"
                          >
                            {quantity}
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col">
                        <div className="flex-1">
                          <h3 className="font-['Cormorant_Garamond'] text-2xl md:text-3xl lg:text-4xl font-bold text-stone-900 mb-2">
                            {isArabic ? product.nameAr : product.nameEn}
                          </h3>

                          <div className="flex items-baseline gap-2 md:gap-3 mb-3 md:mb-4">
                            <span className="font-['Cormorant_Garamond'] text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                              ${Number(product.price).toFixed(2)}
                            </span>
                            {product.originalPrice && (
                              <span className="font-['Manrope'] text-lg text-stone-400 line-through">
                                ${Number(product.originalPrice).toFixed(2)}
                              </span>
                            )}
                          </div>

                          {product.descriptionEn && (
                            <p className="font-['Manrope'] text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
                              {isArabic ? product.descriptionAr : product.descriptionEn}
                            </p>
                          )}

                          {/* Features */}
                          {product.featuresEn && product.featuresEn.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                              {(isArabic ? product.featuresAr : product.featuresEn).slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center gap-1 text-xs font-['Manrope'] text-teal-700 bg-teal-50 px-3 py-1 rounded-full"
                                >
                                  <Check className="w-3 h-3" />
                                  {feature}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="flex items-center gap-1 md:gap-2 bg-stone-100 rounded-full p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(product.id, -1)}
                              disabled={quantity === 0}
                              className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-white hover:bg-teal-500 hover:text-white text-stone-700 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm touch-manipulation active:scale-90"
                            >
                              <Minus className="w-4 h-4" />
                            </motion.button>

                            <span className="font-['Manrope'] font-bold text-lg md:text-xl text-stone-900 w-10 md:w-12 text-center">
                              {quantity}
                            </span>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(product.id, 1)}
                              disabled={quantity >= 10}
                              className="w-11 h-11 md:w-10 md:h-10 rounded-full bg-white hover:bg-teal-500 hover:text-white text-stone-700 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm touch-manipulation active:scale-90"
                            >
                              <Plus className="w-4 h-4" />
                            </motion.button>
                          </div>

                          {quantity > 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex-1 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-full px-4 py-2"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-['Manrope'] text-sm text-stone-600">
                                  {isArabic ? 'المجموع' : 'Subtotal'}
                                </span>
                                <span className="font-['Cormorant_Garamond'] text-xl font-bold text-teal-600">
                                  ${(Number(product.price) * quantity).toFixed(2)}
                                </span>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Floating Cart Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:sticky lg:top-24"
              >
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-teal-100">
                  {/* Decorative gradient */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>

                  <div className="p-4 md:p-6">
                    <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center">
                        <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <h3 className="font-['Cormorant_Garamond'] text-xl md:text-2xl font-bold text-stone-900">
                        {isArabic ? 'سلة التسوق' : 'Your Cart'}
                      </h3>
                    </div>

                    {cartItems.length === 0 ? (
                      <div className="text-center py-8 md:py-12">
                        <Package className="w-12 h-12 md:w-16 md:h-16 text-stone-300 mx-auto mb-3 md:mb-4" />
                        <p className="font-['Manrope'] text-sm md:text-base text-stone-500">
                          {isArabic ? 'السلة فارغة' : 'Cart is empty'}
                        </p>
                        <p className="font-['Manrope'] text-xs md:text-sm text-stone-400 mt-2">
                          {isArabic ? 'أضف منتجات لبدء الطلب' : 'Add products to get started'}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                          {cartItems.map(({ product, quantity }) => (
                            <motion.div
                              key={product.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-stone-50 rounded-2xl"
                            >
                              <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-amber-50 flex-shrink-0">
                                <img
                                  src={getProductImage(isArabic ? product.nameAr : product.nameEn)}
                                  alt={isArabic ? product.nameAr : product.nameEn}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%2314b8a6" width="64" height="64"/%3E%3C/svg%3E'
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-['Manrope'] font-semibold text-stone-900 text-sm truncate">
                                  {isArabic ? product.nameAr : product.nameEn}
                                </p>
                                <p className="font-['Manrope'] text-xs text-stone-500">
                                  {quantity} × ${Number(product.price).toFixed(2)}
                                </p>
                              </div>
                              <div className="font-['Cormorant_Garamond'] text-lg font-bold text-teal-600">
                                ${(Number(product.price) * quantity).toFixed(2)}
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        <div className="space-y-3 mb-6 p-4 bg-gradient-to-br from-stone-50 to-teal-50/30 rounded-2xl">
                          <div className="flex justify-between font-['Manrope'] text-stone-600">
                            <span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                            <span className="font-semibold">${subtotal.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-['Manrope'] text-stone-600">
                            <span>{isArabic ? 'الشحن' : 'Shipping'}</span>
                            <span className="font-semibold text-emerald-600">{isArabic ? 'مجاني' : 'FREE'}</span>
                          </div>
                          <div className="pt-3 border-t border-stone-200 flex justify-between items-center">
                            <span className="font-['Cormorant_Garamond'] text-xl font-bold text-stone-900">
                              {isArabic ? 'الإجمالي' : 'Total'}
                            </span>
                            <span className="font-['Cormorant_Garamond'] text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleContinueToPersonalInfo}
                          className="w-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-['Manrope'] font-semibold py-3 md:py-4 text-sm md:text-base rounded-2xl shadow-lg shadow-teal-500/30 transition-all duration-300 active:scale-95 touch-manipulation"
                        >
                          {isArabic ? 'متابعة الطلب' : 'Continue to Checkout'}
                        </motion.button>

                        <div className="mt-3 md:mt-4 flex items-center justify-center gap-2 text-stone-500 text-xs font-['Manrope']">
                          <ShieldCheck className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{isArabic ? 'دفع آمن ومضمون' : 'Secure & Protected Payment'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Step 1: Personal Info */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-teal-100">
                <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold text-stone-900 mb-2">
                  {isArabic ? 'معلوماتك الشخصية' : 'Your Information'}
                </h2>
                <p className="font-['Manrope'] text-stone-600 mb-8">
                  {isArabic ? 'نحتاج بعض التفاصيل لإتمام طلبك' : 'We need a few details to complete your order'}
                </p>

                <form onSubmit={(e) => { e.preventDefault(); handleContinueToCheckout(); }} className="space-y-6">
                  <div>
                    <label className="block font-['Manrope'] font-semibold text-stone-700 mb-2">
                      {isArabic ? 'الاسم الكامل' : 'Full Name'} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all outline-none font-['Manrope'] text-stone-900"
                      placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-['Manrope'] font-semibold text-stone-700 mb-2">
                        {isArabic ? 'البريد الإلكتروني' : 'Email'} <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all outline-none font-['Manrope'] text-stone-900"
                        placeholder="you@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-['Manrope'] font-semibold text-stone-700 mb-2">
                        {isArabic ? 'رقم الهاتف' : 'Phone'} <span className="text-stone-400 text-sm">({isArabic ? 'اختياري' : 'optional'})</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all outline-none font-['Manrope'] text-stone-900"
                        placeholder="+962 XX XXX XXXX"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-['Manrope'] font-semibold py-4 rounded-2xl transition-all"
                    >
                      {isArabic ? 'رجوع' : 'Back'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-['Manrope'] font-semibold py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-all"
                    >
                      {isArabic ? 'متابعة' : 'Continue'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>

            {/* Mini Cart Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-teal-100">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-stone-900 mb-4">
                  {isArabic ? 'ملخص الطلب' : 'Order Summary'}
                </h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm font-['Manrope']">
                      <span className="text-stone-600">
                        {isArabic ? product.nameAr : product.nameEn} × {quantity}
                      </span>
                      <span className="font-semibold text-stone-900">
                        ${(Number(product.price) * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex justify-between items-center">
                    <span className="font-['Cormorant_Garamond'] text-xl font-bold text-stone-900">
                      {isArabic ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-teal-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Checkout */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8"
          >
            <div className="md:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-teal-100">
                <h2 className="font-['Cormorant_Garamond'] text-4xl font-bold text-stone-900 mb-2">
                  {isArabic ? 'إتمام الطلب' : 'Complete Your Order'}
                </h2>
                <p className="font-['Manrope'] text-stone-600 mb-8">
                  {isArabic ? 'خطوة أخيرة قبل استلام طلبك' : 'One final step before your order arrives'}
                </p>

                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <div>
                    <label className="block font-['Manrope'] font-semibold text-stone-700 mb-2">
                      {isArabic ? 'البلد' : 'Country'} <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-6 py-4 bg-stone-50 border-2 border-stone-200 rounded-2xl focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 transition-all outline-none font-['Manrope'] text-stone-900"
                      placeholder={isArabic ? 'أدخل اسم البلد' : 'Enter your country'}
                      required
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="relative bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 rounded-3xl p-6 overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative flex items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg animate-float">
                        <CreditCard className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-stone-900 mb-1">
                          {isArabic ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                        </h3>
                        <p className="font-['Manrope'] text-stone-600 text-sm">
                          {isArabic ? 'ادفع نقداً عند استلام طلبك بأمان' : 'Pay securely in cash when you receive your order'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary Box */}
                  <div className="bg-stone-50 rounded-3xl p-6 border border-stone-200">
                    <h4 className="font-['Cormorant_Garamond'] text-2xl font-bold text-stone-900 mb-4">
                      {isArabic ? 'تفاصيل الطلب' : 'Order Details'}
                    </h4>
                    <div className="space-y-3 mb-4">
                      {cartItems.map(({ product, quantity }) => (
                        <div key={product.id} className="flex justify-between font-['Manrope']">
                          <span className="text-stone-600">
                            {isArabic ? product.nameAr : product.nameEn} × {quantity}
                          </span>
                          <span className="font-semibold text-stone-900">
                            ${(Number(product.price) * quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t-2 border-stone-300 pt-4 space-y-2">
                      <div className="flex justify-between font-['Manrope'] text-stone-600">
                        <span>{isArabic ? 'المجموع الفرعي' : 'Subtotal'}</span>
                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-['Manrope'] text-stone-600">
                        <span>{isArabic ? 'الشحن' : 'Shipping'}</span>
                        <span className="font-semibold text-emerald-600">{isArabic ? 'مجاني' : 'FREE'}</span>
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-stone-300">
                        <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-stone-900">
                          {isArabic ? 'الإجمالي' : 'Total'}
                        </span>
                        <span className="font-['Cormorant_Garamond'] text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-['Manrope'] font-semibold py-4 rounded-2xl transition-all disabled:opacity-50"
                    >
                      {isArabic ? 'رجوع' : 'Back'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-['Manrope'] font-semibold py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? (isArabic ? 'جاري المعالجة...' : 'Processing...')
                        : (isArabic ? 'تأكيد الطلب' : 'Place Order')
                      }
                    </motion.button>
                  </div>
                </form>
              </div>
            </div>

            {/* Mini Cart Summary */}
            <div className="md:col-span-1">
              <div className="sticky top-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-6 border border-teal-100">
                <h3 className="font-['Cormorant_Garamond'] text-2xl font-bold text-stone-900 mb-4">
                  {isArabic ? 'ملخص الطلب' : 'Order Summary'}
                </h3>
                <div className="space-y-3 mb-4">
                  {cartItems.map(({ product, quantity }) => (
                    <div key={product.id} className="flex justify-between text-sm font-['Manrope']">
                      <span className="text-stone-600">
                        {isArabic ? product.nameAr : product.nameEn} × {quantity}
                      </span>
                      <span className="font-semibold text-stone-900">
                        ${(Number(product.price) * quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-stone-200">
                  <div className="flex justify-between items-center">
                    <span className="font-['Cormorant_Garamond'] text-xl font-bold text-stone-900">
                      {isArabic ? 'الإجمالي' : 'Total'}
                    </span>
                    <span className="font-['Cormorant_Garamond'] text-2xl font-bold text-teal-600">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && orderResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 text-center border border-teal-100 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-500"></div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="relative w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-teal-500/50 animate-float"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-['Cormorant_Garamond'] text-5xl font-bold text-stone-900 mb-4"
              >
                {isArabic ? 'تم تأكيد طلبك!' : 'Order Confirmed!'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="font-['Manrope'] text-lg text-stone-600 mb-8"
              >
                {isArabic
                  ? 'شكراً لثقتك! سنتواصل معك قريباً لتأكيد تفاصيل التوصيل'
                  : 'Thank you for your trust! We\'ll contact you soon to confirm delivery details'
                }
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="relative bg-gradient-to-br from-stone-50 to-teal-50/50 rounded-3xl p-8 mb-8"
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-stone-500" />
                  <p className="font-['Manrope'] text-sm text-stone-600">
                    {isArabic ? 'رقم الطلب' : 'Order Number'}
                  </p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm cursor-pointer group"
                  onClick={() => navigator.clipboard.writeText(orderResult.orderNumber)}
                >
                  <p className="font-['Cormorant_Garamond'] text-3xl font-bold text-teal-600">
                    {orderResult.orderNumber}
                  </p>
                  <Sparkles className="w-5 h-5 text-teal-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                <div className="mt-6 pt-6 border-t border-stone-200 space-y-3">
                  <div className="flex justify-between font-['Manrope']">
                    <span className="text-stone-600">{isArabic ? 'الإجمالي' : 'Total'}</span>
                    <span className="font-semibold text-stone-900">${orderResult.total}</span>
                  </div>
                  <div className="flex justify-between font-['Manrope']">
                    <span className="text-stone-600">{isArabic ? 'طريقة الدفع' : 'Payment'}</span>
                    <span className="font-semibold text-teal-600">
                      {isArabic ? 'الدفع عند الاستلام' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link
                  to={isArabic ? '/ar' : '/'}
                  className="inline-block bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-['Manrope'] font-semibold px-12 py-4 rounded-2xl shadow-lg shadow-teal-500/30 transition-all"
                >
                  {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
