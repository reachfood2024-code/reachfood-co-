import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation, Link } from 'react-router-dom'
import { Check, X, Sparkles } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL || 'https://shop.reachfood.co/api/v1'
const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL

const subscriptionPlans = [
  {
    id: 'oneMeal',
    mealsPerDay: 1,
    totalMeals: 26,
    priceUSD: 175,
    priceSAR: 656,
    pricePerMealUSD: 6.73,
    pricePerMealSAR: 25.23,
    popular: false,
    badge: null,
  },
  {
    id: 'twoMeals',
    mealsPerDay: 2,
    totalMeals: 52,
    priceUSD: 330,
    priceSAR: 1238,
    pricePerMealUSD: 6.35,
    pricePerMealSAR: 23.81,
    popular: false,
    badge: null,
  },
  {
    id: 'threeMeals',
    mealsPerDay: 3,
    totalMeals: 78,
    priceUSD: 480,
    priceSAR: 1800,
    pricePerMealUSD: 6.15,
    pricePerMealSAR: 23.08,
    popular: true,
    badge: null,
  },
  {
    id: 'twoMealsSalad',
    mealsPerDay: 2,
    totalMeals: 52,
    includesSalad: true,
    priceUSD: 390,
    priceSAR: 1463,
    pricePerMealUSD: 7.50,
    pricePerMealSAR: 28.13,
    popular: false,
    badge: 'bundleValue',
  },
  {
    id: 'twoMealsSaladPudding',
    mealsPerDay: 2,
    totalMeals: 52,
    includesSalad: true,
    includesPudding: true,
    priceUSD: 430,
    priceSAR: 1613,
    popular: false,
    badge: 'premium',
  },
]

const SUBSCRIPTION_DAYS = 26

// Translations
const t = (key: string, isArabic: boolean): string => {
  const translations: Record<string, { en: string; ar: string }> = {
    // Hero
    tagline: { en: 'Special Offers', ar: 'عروض خاصة' },
    title: { en: 'Meal Subscription', ar: 'خطط الاشتراك' },
    titleHighlight: { en: 'Plans', ar: 'في الوجبات' },
    description: {
      en: 'Get fresh, healthy, self-heating meals delivered daily to your door. Choose from our flexible 26-day subscription plans.',
      ar: 'احصل على وجبات صحية طازجة ذاتية التسخين تُوصل يومياً إلى بابك. اختر من خططنا المرنة لمدة 26 يوماً.',
    },
    viewPlans: { en: 'View Plans', ar: 'عرض الخطط' },
    browseMenu: { en: 'Browse Menu', ar: 'تصفح القائمة' },
    daysSubscription: { en: 'Days Subscription', ar: 'يوم اشتراك' },
    limitedOffer: { en: 'Limited Launch Offer', ar: 'عرض إطلاق محدود' },
    withFreeDelivery: { en: 'with Free Delivery', ar: 'مع توصيل مجاني' },

    // Benefits
    whySubscribe: { en: 'Why Subscribe?', ar: 'لماذا تشترك؟' },
    whySubscribeDesc: {
      en: 'Join thousands of happy customers who enjoy convenient, healthy meals every day.',
      ar: 'انضم إلى آلاف العملاء السعداء الذين يستمتعون بوجبات صحية ومريحة كل يوم.',
    },
    benefit1Title: { en: 'Save Money', ar: 'وفر المال' },
    benefit1Desc: {
      en: 'Subscribe and save compared to individual purchases. The longer you subscribe, the more you save.',
      ar: 'اشترك ووفر مقارنة بالشراء الفردي. كلما طالت مدة اشتراكك، وفرت أكثر.',
    },
    benefit2Title: { en: 'Flexible Delivery', ar: 'توصيل يومي' },
    benefit2Desc: {
      en: 'Daily delivery of fresh meals. Skip, pause, or cancel anytime with no commitment.',
      ar: 'توصيل يومي للوجبات الطازجة. تخطَّ أو أوقف أو ألغِ في أي وقت بدون التزام.',
    },
    benefit3Title: { en: 'Premium Quality', ar: 'جودة ممتازة' },
    benefit3Desc: {
      en: 'Every meal is prepared with fresh ingredients and our innovative self-heating technology.',
      ar: 'كل وجبة محضرة بمكونات طازجة وتقنية التسخين الذاتي المبتكرة.',
    },

    // Plans
    choosePlan: { en: 'Choose Your Plan', ar: 'اختر خطتك' },
    choosePlanDesc: {
      en: 'Select the subscription that fits your lifestyle. All plans are for 26 days with free delivery.',
      ar: 'اختر الاشتراك الذي يناسب أسلوب حياتك. جميع الخطط لمدة 26 يوماً مع توصيل مجاني.',
    },
    mostPopular: { en: 'Most Popular', ar: 'الأكثر شيوعاً' },
    oneMealPlan: { en: '1 Meal', ar: 'وجبة واحدة' },
    twoMealsPlan: { en: '2 Meals', ar: 'وجبتان' },
    threeMealsPlan: { en: '3 Meals', ar: '3 وجبات' },
    twoMealsSaladPlan: { en: '2 Meals + Salad', ar: 'وجبتان + سلطة' },
    twoMealsSaladPuddingPlan: { en: 'Full Package', ar: 'الباقة الكاملة' },
    mealsPerDayLabel: { en: 'Meals / Day', ar: 'وجبات / يوم' },
    totalMealsLabel: { en: 'Total Meals', ar: 'إجمالي الوجبات' },
    meal: { en: 'meal', ar: 'وجبة' },
    bundleValue: { en: 'bundle value', ar: 'قيمة الباقة' },
    premium: { en: 'Premium', ar: 'مميز' },
    selectPlan: { en: 'Select Plan', ar: 'اختر الخطة' },

    // How it works
    howItWorks: { en: 'How It Works', ar: 'كيف يعمل' },
    howItWorksDesc: {
      en: 'Getting started with your meal subscription is easy.',
      ar: 'البدء مع اشتراك الوجبات سهل.',
    },
    step1Title: { en: 'Choose Your Plan', ar: 'اختر خطتك' },
    step1Desc: {
      en: 'Select the subscription plan that best fits your daily meal needs.',
      ar: 'اختر خطة الاشتراك التي تناسب احتياجاتك اليومية.',
    },
    step2Title: { en: 'Set Your Schedule', ar: 'حدد جدولك' },
    step2Desc: {
      en: 'Choose your preferred delivery time and start date.',
      ar: 'اختر وقت التوصيل المفضل وتاريخ البدء.',
    },
    step3Title: { en: 'Daily Delivery', ar: 'توصيل يومي' },
    step3Desc: {
      en: 'Fresh meals delivered to your door every day for 26 days.',
      ar: 'وجبات طازجة تُوصل إلى بابك يومياً لمدة 26 يوماً.',
    },
    step4Title: { en: 'Heat & Enjoy', ar: 'سخن واستمتع' },
    step4Desc: {
      en: 'Self-heating meals ready in just 3-5 minutes.',
      ar: 'وجبات ذاتية التسخين جاهزة في 3-5 دقائق فقط.',
    },

    // CTA
    ctaTitle: { en: 'Ready to Start Your Plan?', ar: 'مستعد لبدء خطتك؟' },
    ctaDesc: {
      en: 'Join our 26-day subscription plan today and enjoy healthy, delicious meals delivered daily.',
      ar: 'انضم إلى خطة الاشتراك لمدة 26 يوماً اليوم واستمتع بوجبات صحية ولذيذة تُوصل يومياً.',
    },
    getStarted: { en: 'Get Started', ar: 'ابدأ الآن' },
    contactUs: { en: 'Contact Us', ar: 'تواصل معنا' },

    // Modal
    subscriptionForm: { en: 'Complete Your Subscription', ar: 'أكمل اشتراكك' },
    formName: { en: 'Full Name', ar: 'الاسم الكامل' },
    formNamePlaceholder: { en: 'Enter your full name', ar: 'أدخل اسمك الكامل' },
    formPhone: { en: 'Phone Number', ar: 'رقم الهاتف' },
    formPhonePlaceholder: { en: '+966 5XX XXX XXXX', ar: '+966 5XX XXX XXXX' },
    formEmail: { en: 'Email Address', ar: 'البريد الإلكتروني' },
    formEmailPlaceholder: { en: 'your.email@example.com', ar: 'your.email@example.com' },
    submitSubscription: { en: 'Submit Subscription', ar: 'إرسال الاشتراك' },
    submitting: { en: 'Submitting...', ar: 'جاري الإرسال...' },
    successTitle: { en: 'Thank You!', ar: 'شكراً لك!' },
    successMessage: {
      en: "Thanks for your subscription! We're going to contact you soon.",
      ar: 'شكراً على اشتراكك! سنتواصل معك قريباً.',
    },
    closeModal: { en: 'Close', ar: 'إغلاق' },
    requiredField: { en: 'This field is required', ar: 'هذا الحقل مطلوب' },
    invalidEmail: { en: 'Please enter a valid email address', ar: 'يرجى إدخال بريد إلكتروني صالح' },
    selectedPlanLabel: { en: 'Selected Plan', ar: 'الخطة المختارة' },
  }

  return translations[key]?.[isArabic ? 'ar' : 'en'] || key
}

const getPlanName = (planId: string, isArabic: boolean): string => {
  const names: Record<string, { en: string; ar: string }> = {
    oneMeal: { en: '1 Meal', ar: 'وجبة واحدة' },
    twoMeals: { en: '2 Meals', ar: 'وجبتان' },
    threeMeals: { en: '3 Meals', ar: '3 وجبات' },
    twoMealsSalad: { en: '2 Meals + Salad', ar: 'وجبتان + سلطة' },
    twoMealsSaladPudding: { en: 'Full Package', ar: 'الباقة الكاملة' },
  }
  return names[planId]?.[isArabic ? 'ar' : 'en'] || planId
}

const Offers = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')
  const [currency, setCurrency] = useState<'USD' | 'SAR'>('USD')
  const [selectedPlan, setSelectedPlan] = useState('threeMeals')
  const [activeSlide, setActiveSlide] = useState(2)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const scrollToSlide = (index: number) => {
    setActiveSlide(index)
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth * 0.85
      carouselRef.current.scrollTo({ left: index * slideWidth, behavior: 'smooth' })
    }
  }

  const handleScroll = () => {
    if (carouselRef.current) {
      const slideWidth = carouselRef.current.offsetWidth * 0.85
      const newIndex = Math.round(carouselRef.current.scrollLeft / slideWidth)
      if (newIndex !== activeSlide && newIndex >= 0 && newIndex < subscriptionPlans.length) {
        setActiveSlide(newIndex)
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (carouselRef.current && window.innerWidth < 768) {
        const popularIndex = subscriptionPlans.findIndex((p) => p.popular)
        if (popularIndex !== -1) {
          const slideWidth = carouselRef.current.offsetWidth * 0.85
          carouselRef.current.scrollTo({ left: popularIndex * slideWidth, behavior: 'smooth' })
        }
      }
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const formatPrice = (plan: (typeof subscriptionPlans)[0]) => {
    if (currency === 'SAR') {
      return `${plan.priceSAR.toLocaleString()} SAR`
    }
    return `$${plan.priceUSD}`
  }

  const getPricePerMeal = (plan: (typeof subscriptionPlans)[0]) => {
    if (plan.badge === 'bundleValue') {
      return currency === 'SAR'
        ? `${(plan.pricePerMealSAR ?? 0).toFixed(2)} SAR ${t('bundleValue', isArabic)}`
        : `$${(plan.pricePerMealUSD ?? 0).toFixed(2)} ${t('bundleValue', isArabic)}`
    }
    if (plan.badge === 'premium') {
      return t('premium', isArabic)
    }
    if (currency === 'SAR') {
      return `${(plan.pricePerMealSAR ?? 0).toFixed(2)} SAR / ${t('meal', isArabic)}`
    }
    return `$${(plan.pricePerMealUSD ?? 0).toFixed(2)} / ${t('meal', isArabic)}`
  }

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    setIsModalOpen(true)
    setShowSuccess(false)
    setErrors({})
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      newErrors.name = t('requiredField', isArabic)
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t('requiredField', isArabic)
    }
    if (!formData.email.trim()) {
      newErrors.email = t('requiredField', isArabic)
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('invalidEmail', isArabic)
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    const plan = subscriptionPlans.find((p) => p.id === selectedPlan)

    try {
      const response = await fetch(`${API_URL}/subscriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          planId: selectedPlan,
          planName: getPlanName(selectedPlan, isArabic),
          mealsPerDay: plan?.mealsPerDay,
          totalMeals: plan?.totalMeals,
          priceUSD: plan?.priceUSD,
          priceSAR: plan?.priceSAR,
          currency: currency,
          subscriptionDays: SUBSCRIPTION_DAYS,
        }),
      })

      if (!response.ok) throw new Error('API submission failed')

      // Backup to Google Apps Script
      if (GOOGLE_SCRIPT_URL) {
        fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'subscription',
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            planId: selectedPlan,
            planName: getPlanName(selectedPlan, isArabic),
            mealsPerDay: plan?.mealsPerDay,
            totalMeals: plan?.totalMeals,
            priceUSD: plan?.priceUSD,
            priceSAR: plan?.priceSAR,
            currency: currency,
            subscriptionDays: SUBSCRIPTION_DAYS,
            source: 'reachfood.co',
            timestamp: new Date().toISOString(),
          }),
        }).catch(() => {})
      }

      setShowSuccess(true)
      setFormData({ name: '', phone: '', email: '' })
    } catch (error) {
      console.error('Subscription form submission error:', error)
      if (GOOGLE_SCRIPT_URL) {
        try {
          await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'subscription',
              name: formData.name,
              phone: formData.phone,
              email: formData.email,
              planId: selectedPlan,
              planName: getPlanName(selectedPlan, isArabic),
              mealsPerDay: plan?.mealsPerDay,
              totalMeals: plan?.totalMeals,
              priceUSD: plan?.priceUSD,
              priceSAR: plan?.priceSAR,
              currency: currency,
              subscriptionDays: SUBSCRIPTION_DAYS,
              source: 'reachfood.co',
              timestamp: new Date().toISOString(),
            }),
          })
        } catch {}
      }
      setShowSuccess(true)
      setFormData({ name: '', phone: '', email: '' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setShowSuccess(false)
    setFormData({ name: '', phone: '', email: '' })
    setErrors({})
  }

  const benefits = [
    {
      title: t('benefit1Title', isArabic),
      desc: t('benefit1Desc', isArabic),
      symbol: '$',
    },
    {
      title: t('benefit2Title', isArabic),
      desc: t('benefit2Desc', isArabic),
      symbol: '~',
    },
    {
      title: t('benefit3Title', isArabic),
      desc: t('benefit3Desc', isArabic),
      symbol: '*',
    },
  ]

  const steps = [
    { title: t('step1Title', isArabic), desc: t('step1Desc', isArabic) },
    { title: t('step2Title', isArabic), desc: t('step2Desc', isArabic) },
    { title: t('step3Title', isArabic), desc: t('step3Desc', isArabic) },
    { title: t('step4Title', isArabic), desc: t('step4Desc', isArabic) },
  ]

  return (
    <div className={`pt-16 ${isArabic ? 'direction-rtl' : ''}`}>
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isArabic ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`space-y-6 ${isArabic ? 'lg:order-2 text-right' : ''}`}
            >
              <div className="inline-flex items-center px-4 py-2 bg-teal-500/20 rounded-full">
                <Sparkles className="w-4 h-4 text-teal-400 mr-2" />
                <span className="text-teal-400 font-medium text-sm">{t('tagline', isArabic)}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight">
                {t('title', isArabic)}
                <span className="block text-teal-400 mt-2">{t('titleHighlight', isArabic)}</span>
              </h1>

              <p className="text-lg text-teal-100 max-w-xl">{t('description', isArabic)}</p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="#plans"
                  className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {t('viewPlans', isArabic)}
                </motion.a>
                <Link
                  to="https://shop.reachfood.co/shop"
                  className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all"
                >
                  {t('browseMenu', isArabic)}
                </Link>
              </div>

              {/* Currency Toggle */}
              <div className="flex items-center gap-4 pt-4">
                <span className="text-teal-100 text-sm">Currency:</span>
                <div className="flex bg-slate-800/50 rounded-full p-1">
                  <button
                    onClick={() => setCurrency('USD')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      currency === 'USD'
                        ? 'bg-teal-500 text-white'
                        : 'text-teal-100 hover:text-white'
                    }`}
                  >
                    USD
                  </button>
                  <button
                    onClick={() => setCurrency('SAR')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      currency === 'SAR'
                        ? 'bg-teal-500 text-white'
                        : 'text-teal-100 hover:text-white'
                    }`}
                  >
                    SAR
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: isArabic ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className={`relative ${isArabic ? 'lg:order-1' : ''}`}
            >
              <div className="relative">
                <img
                  src="https://shop.reachfood.co/offers-pack.jpg"
                  alt="ReachFood Meal Pack"
                  className="w-full rounded-3xl shadow-2xl"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -bottom-6 -right-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-4 shadow-xl border border-teal-500/30"
                >
                  <div className="text-center">
                    <span className="text-3xl font-bold text-teal-400">{SUBSCRIPTION_DAYS}</span>
                    <p className="text-sm text-teal-100">{t('daysSubscription', isArabic)}</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {t('whySubscribe', isArabic)}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('whySubscribeDesc', isArabic)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-8 text-center hover:shadow-lg transition-all"
                whileHover={{ y: -5 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-teal-600">{benefit.symbol}</span>
                </div>
                <h3 className="font-semibold text-xl text-slate-900 mb-3">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscription Plans */}
      <section
        id="plans"
        className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Promotional Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center py-3 px-4 rounded-full mb-8 max-w-2xl mx-auto"
          >
            <span className="font-medium">
              {t('limitedOffer', isArabic)} - {SUBSCRIPTION_DAYS} {t('daysSubscription', isArabic)}{' '}
              {t('withFreeDelivery', isArabic)}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('choosePlan', isArabic)}
            </h2>
            <p className="text-xl text-teal-100 max-w-2xl mx-auto">
              {t('choosePlanDesc', isArabic)}
            </p>
          </motion.div>

          {/* Mobile Carousel */}
          <div className="md:hidden">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-4 pt-8 pb-4 -mx-4 px-4"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {subscriptionPlans.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex-shrink-0 w-[85%] snap-center ${plan.popular ? 'pt-0' : 'pt-4'}`}
                >
                  {plan.popular && (
                    <div className="text-center mb-2">
                      <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md inline-block">
                        {t('mostPopular', isArabic)}
                      </span>
                    </div>
                  )}
                  <div
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`bg-slate-800/50 backdrop-blur-sm border rounded-3xl p-6 cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'ring-2 ring-teal-400 shadow-xl border-teal-500/50'
                        : 'border-teal-700/30 shadow-lg'
                    }`}
                  >
                    <div className="text-center">
                      <h3 className="font-semibold text-xl text-white mb-3">
                        {getPlanName(plan.id, isArabic)}
                      </h3>
                      <div className="mb-3">
                        <span className="text-teal-100 text-sm">
                          {t('mealsPerDayLabel', isArabic)}
                        </span>
                        <div className="text-2xl font-bold text-white">{plan.mealsPerDay}</div>
                      </div>
                      <div className="mb-4">
                        <span className="text-teal-100 text-sm">
                          {t('totalMealsLabel', isArabic)}
                        </span>
                        <div className="text-lg font-semibold text-white">{plan.totalMeals}</div>
                      </div>
                      <div className="mb-2">
                        <div className="text-3xl font-bold text-teal-400">{formatPrice(plan)}</div>
                      </div>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                          plan.badge === 'premium'
                            ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300'
                            : 'bg-teal-500/20 text-teal-300'
                        }`}
                      >
                        {getPricePerMeal(plan)}
                      </div>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectPlan(plan.id)
                        }}
                        className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                          selectedPlan === plan.id
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                            : 'bg-slate-700 text-white hover:bg-teal-500'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {t('selectPlan', isArabic)}
                      </motion.button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {subscriptionPlans.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    activeSlide === index ? 'bg-teal-400 w-8' : 'bg-slate-600 w-2.5 hover:bg-slate-500'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 pt-4">
            {subscriptionPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedPlan(plan.id)}
                className={`relative bg-slate-800/50 backdrop-blur-sm border rounded-3xl p-6 cursor-pointer transition-all duration-300 ${
                  selectedPlan === plan.id
                    ? 'ring-2 ring-teal-400 shadow-xl scale-105 border-teal-500/50'
                    : 'border-teal-700/30 hover:shadow-lg'
                } ${plan.popular ? 'md:mt-2' : ''}`}
                whileHover={{ y: -5 }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shadow-md">
                      {t('mostPopular', isArabic)}
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <h3 className="font-semibold text-xl text-white mb-3">
                    {getPlanName(plan.id, isArabic)}
                  </h3>
                  <div className="mb-3">
                    <span className="text-teal-100 text-sm">{t('mealsPerDayLabel', isArabic)}</span>
                    <div className="text-2xl font-bold text-white">{plan.mealsPerDay}</div>
                  </div>
                  <div className="mb-4">
                    <span className="text-teal-100 text-sm">{t('totalMealsLabel', isArabic)}</span>
                    <div className="text-lg font-semibold text-white">{plan.totalMeals}</div>
                  </div>
                  <div className="mb-2">
                    <div className="text-3xl font-bold text-teal-400">{formatPrice(plan)}</div>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${
                      plan.badge === 'premium'
                        ? 'bg-gradient-to-r from-amber-400/20 to-amber-500/20 text-amber-300'
                        : 'bg-teal-500/20 text-teal-300'
                    }`}
                  >
                    {getPricePerMeal(plan)}
                  </div>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSelectPlan(plan.id)
                    }}
                    className={`w-full py-3 rounded-full font-semibold transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                        : 'bg-slate-700 text-white hover:bg-teal-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('selectPlan', isArabic)}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {t('howItWorks', isArabic)}
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              {t('howItWorksDesc', isArabic)}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-lg text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {t('ctaTitle', isArabic)}
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">{t('ctaDesc', isArabic)}</p>
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href="#plans"
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-semibold hover:bg-teal-50 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('getStarted', isArabic)}
              </motion.a>
              <motion.a
                href={isArabic ? '/ar/contact' : '/contact'}
                className="px-8 py-4 border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-slate-900 transition-all"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {t('contactUs', isArabic)}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Subscription Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative bg-gradient-to-br from-slate-800 to-slate-900 border border-teal-700/30 rounded-3xl shadow-2xl w-full max-w-md p-8 ${isArabic ? 'text-right' : ''}`}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-teal-100 hover:text-white hover:bg-slate-700 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {showSuccess ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Check className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">
                    {t('successTitle', isArabic)}
                  </h3>
                  <p className="text-teal-100 mb-6">{t('successMessage', isArabic)}</p>
                  <motion.button
                    onClick={closeModal}
                    className="px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-full font-semibold hover:from-teal-600 hover:to-teal-700 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('closeModal', isArabic)}
                  </motion.button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-serif font-bold text-white mb-2">
                    {t('subscriptionForm', isArabic)}
                  </h3>

                  {/* Selected Plan Info */}
                  <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-teal-100 mb-1">{t('selectedPlanLabel', isArabic)}</p>
                    <p className="font-semibold text-white">
                      {getPlanName(selectedPlan, isArabic)} -{' '}
                      {formatPrice(subscriptionPlans.find((p) => p.id === selectedPlan)!)}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-teal-100 font-medium mb-2">
                        {t('formName', isArabic)}
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder={t('formNamePlaceholder', isArabic)}
                        className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${
                          errors.name ? 'border-red-400' : 'border-transparent'
                        } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors`}
                      />
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label className="block text-teal-100 font-medium mb-2">
                        {t('formPhone', isArabic)}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder={t('formPhonePlaceholder', isArabic)}
                        className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${
                          errors.phone ? 'border-red-400' : 'border-transparent'
                        } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors`}
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-teal-100 font-medium mb-2">
                        {t('formEmail', isArabic)}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={t('formEmailPlaceholder', isArabic)}
                        className={`w-full px-5 py-3 bg-slate-700/50 border-2 ${
                          errors.email ? 'border-red-400' : 'border-transparent'
                        } rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-teal-400 transition-colors`}
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold text-lg rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                      whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                      whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    >
                      {isSubmitting ? t('submitting', isArabic) : t('submitSubscription', isArabic)}
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Offers
