import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  Shield, 
  Clock, 
  Star,
  Check,
  Zap,
  Leaf,
  Globe,
  Heart
} from 'lucide-react'

const Booking = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')
  const [selectedPlan, setSelectedPlan] = useState('')
  const [orderType, setOrderType] = useState<'one-time' | 'subscription'>('subscription')
  const [step, setStep] = useState(1)

  const subscriptionPlans = [
    {
      id: 'emergency-prep',
      name: isArabic ? 'الاستعداد للطوارئ' : 'Emergency Preparedness',
      price: '$89.99',
      period: 'monthly',
      meals: 8,
      description: isArabic ? 'تغذية طوارئ أساسية للعائلات والمؤسسات' : 'Essential emergency nutrition for families and organizations',
      features: isArabic ? ['وجبات طويلة الصلاحية', 'دعم الاستجابة للطوارئ', 'مناسبة للتخزين بالجملة', 'ملصقات متعددة اللغات'] : ['High shelf-life meals', 'Emergency response support', 'Bulk storage friendly', 'Multi-language labels'],
      icon: Shield,
      color: 'text-red-400',
      popular: false
    },
    {
      id: 'adventure-explorer',
      name: isArabic ? 'مستكشف المغامرة' : 'Adventure Explorer',
      price: '$49.99',
      period: 'monthly',
      meals: 4,
      description: isArabic ? 'مثالي للمغامرات الخارجية والرحلات التخييمية المنتظمة' : 'Perfect for regular outdoor adventures and camping trips',
      features: isArabic ? ['تغليف خفيف الوزن', 'كثافة طاقة عالية', 'مقاوم للطقس', 'تخزين مدمج'] : ['Lightweight packaging', 'High energy density', 'Weather resistant', 'Compact storage'],
      icon: Globe,
      color: 'text-green-400',
      popular: true
    },
    {
      id: 'professional-go',
      name: isArabic ? 'المهني أثناء التنقل' : 'Professional On-the-Go',
      price: '$69.99',
      period: 'monthly',
      meals: 6,
      description: isArabic ? 'تغذية مريحة لجدول أعمال مزدحم' : 'Convenient nutrition for busy work schedules',
      features: isArabic ? ['تسخين مناسب للمكاتب', 'تغذية متوازنة', 'تناول سريع', 'تغليف احترافي'] : ['Office-friendly heating', 'Balanced nutrition', 'Quick consumption', 'Professional packaging'],
      icon: Clock,
      color: 'text-blue-400',
      popular: false
    },
    {
      id: 'family-wellness',
      name: isArabic ? 'عافية الأسرة' : 'Family Wellness',
      price: '$129.99',
      period: 'monthly',
      meals: 12,
      description: isArabic ? 'وجبات عائلية مغذية للأسر المشغولة' : 'Nutritious family meals for busy households',
      features: isArabic ? ['حصص بحجم عائلي', 'خيارات مناسبة للأطفال', 'نكهات تقليدية', 'وجبات قابلة للمشاركة'] : ['Family-size portions', 'Kid-friendly options', 'Traditional flavors', 'Sharing meals'],
      icon: Heart,
      color: 'text-purple-400',
      popular: false
    }
  ]

  const oneTimePacks = [
    {
      id: 'emergency-starter',
      name: isArabic ? 'حزمة الطوارئ الأساسية' : 'Emergency Starter Pack',
      price: '$49.99',
      meals: 4,
      description: isArabic ? '4 وجبات إغاثة طارئة للاستعداد الفوري' : '4 emergency relief meals for immediate preparedness'
    },
    {
      id: 'adventure-weekend',
      name: isArabic ? 'حزمة عطلة نهاية الأسبوع للمغامرة' : 'Adventure Weekend Pack',
      price: '$29.99',
      meals: 2,
      description: isArabic ? 'وجبتان خفيفتان مثاليتان لمغامرات نهاية الأسبوع' : '2 lightweight meals perfect for weekend adventures'
    },
    {
      id: 'professional-week',
      name: isArabic ? 'حزمة أسبوع المهني' : 'Professional Week Pack',
      price: '$39.99',
      meals: 3,
      description: isArabic ? '3 وجبات مناسبة للمكتب لأسابيع العمل المزدحمة' : '3 office-friendly meals for busy work weeks'
    },
    {
      id: 'family-trial',
      name: isArabic ? 'حزمة تجربة العائلة' : 'Family Trial Pack',
      price: '$59.99',
      meals: 5,
      description: isArabic ? '5 وجبات عائلية لتجربة خدمتنا' : '5 family-style meals to try our service'
    }
  ]

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId)
    setStep(2)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order submitted:', { selectedPlan, orderType })
  }

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-teal-400 mr-3" />
              <span className="text-teal-400 font-semibold text-lg">
                {isArabic ? 'توصيل وجبات ثوري' : 'Revolutionary Meal Delivery'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{isArabic ? 'اطلب وجباتك' : 'Order Your Meals'}</h1>
            <p className="text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              {isArabic ? 'اختر من خطط الاشتراك للتسليم المنتظم أو اطلب حزم وجبات فردية. تغذية ساخنة، مستدامة، وأصيلة ثقافياً تُسلم إلى باب منزلك.' : 'Choose from our subscription plans for regular delivery or order individual meal packs. Hot, sustainable, and culturally authentic nutrition delivered to your door.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Type Selection */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
              {isArabic ? 'كيف تود الطلب؟' : 'How would you like to order?'}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                orderType === 'subscription' 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-slate-200 hover:border-teal-300'
              }`}
              onClick={() => setOrderType('subscription')}
            >
              <div className="text-center">
                <Package className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{isArabic ? 'خطط الاشتراك' : 'Subscription Plans'}</h3>
                <p className="text-slate-600 mb-4">
                  {isArabic ? 'تسليم منتظم لوجبات ملائمة لنمط حياتك مع جدولة مرنة وتوفير' : 'Regular delivery of meals tailored to your lifestyle with flexible scheduling and savings'}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    {isArabic ? 'وفر حتى 20%' : 'Save up to 20%'}
                  </span>
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    {isArabic ? 'يمكن التخطي في أي وقت' : 'Skip anytime'}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                orderType === 'one-time' 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-slate-200 hover:border-teal-300'
              }`}
              onClick={() => setOrderType('one-time')}
            >
              <div className="text-center">
                <ShoppingCart className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{isArabic ? 'شراء مرة واحدة' : 'One-Time Purchase'}</h3>
                <p className="text-slate-600 mb-4">
                  {isArabic ? 'مثالي لتجربة وجباتنا أو التخزين لاحتياجات ومناسبات محددة' : 'Perfect for trying our meals or stocking up for specific needs and occasions'}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    {isArabic ? 'بدون التزام' : 'No commitment'}
                  </span>
                  <span className="flex items-center">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    {isArabic ? 'تسليم فوري' : 'Instant delivery'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={`flex items-center ${
                    stepNumber < 3 ? 'flex-1' : ''
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= stepNumber
                        ? 'bg-teal-500 text-white'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > stepNumber ? 'bg-teal-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>{isArabic ? 'اختر الخطة' : 'Select Plan'}</span>
              <span>{isArabic ? 'تخصيص' : 'Customize'}</span>
              <span>{isArabic ? 'الدفع' : 'Checkout'}</span>
            </div>
          </div>

          {/* Step 1: Plan Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
                {orderType === 'subscription' ? (isArabic ? 'اختر خطة الاشتراك' : 'Choose Your Subscription Plan') : (isArabic ? 'اختر حزمة وجبات' : 'Select a Meal Pack')}
              </h2>
              
              {orderType === 'subscription' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subscriptionPlans.map((plan) => {
                    const IconComponent = plan.icon
                    return (
                      <motion.div
                        key={plan.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative border-2 rounded-xl p-6 cursor-pointer transition-all ${
                          plan.popular 
                            ? 'border-teal-500 shadow-lg' 
                            : 'border-slate-200 hover:border-teal-300'
                        }`}
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.popular && (
                          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <span className="bg-teal-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                              {isArabic ? 'الأكثر شعبية' : 'Most Popular'}
                            </span>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <IconComponent className={`w-12 h-12 ${plan.color} mx-auto mb-4`} />
                          <h3 className="text-xl font-semibold text-slate-900 mb-2">{plan.name}</h3>
                          <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="text-3xl font-bold text-teal-600">{plan.price}</span>
                            <span className="text-slate-500">/{plan.period}</span>
                          </div>
                          <div className="text-slate-600 mb-4">
                            {isArabic ? `${plan.meals} وجبة متضمنة` : `${plan.meals} meals included`}
                          </div>
                          <p className="text-slate-600 mb-6 text-sm">{plan.description}</p>
                          
                          <div className="space-y-2">
                            {plan.features.map((feature, index) => (
                              <div key={index} className="flex items-center space-x-2 text-sm">
                                <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                                <span className="text-slate-700">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {oneTimePacks.map((pack) => (
                    <motion.div
                      key={pack.id}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-slate-200 hover:border-teal-300 rounded-xl p-6 cursor-pointer transition-all"
                      onClick={() => handlePlanSelect(pack.id)}
                    >
                      <div className="text-center">
                        <Package className="w-12 h-12 text-teal-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">{pack.name}</h3>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <span className="text-3xl font-bold text-teal-600">{pack.price}</span>
                        </div>
                        <div className="text-slate-600 mb-4">
                          {isArabic ? `${pack.meals} وجبة متضمنة` : `${pack.meals} meals included`}
                        </div>
                        <p className="text-slate-600 text-sm">{pack.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Step 2: Customization */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
                {isArabic ? 'خصص طلبك' : 'Customize Your Order'}
              </h2>
              
              <div className="bg-slate-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">{isArabic ? 'الخطة المختارة' : 'Selected Plan'}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-slate-700">
                    {orderType === 'subscription' 
                      ? subscriptionPlans.find(p => p.id === selectedPlan)?.name
                      : oneTimePacks.find(p => p.id === selectedPlan)?.name
                    }
                  </span>
                  <span className="text-teal-600 font-bold">
                    {orderType === 'subscription' 
                      ? subscriptionPlans.find(p => p.id === selectedPlan)?.price
                      : oneTimePacks.find(p => p.id === selectedPlan)?.price
                    }
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'تكرار التسليم' : 'Delivery Frequency'}</label>
                  <select className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none">
                    <option>{isArabic ? 'كل 4 أسابيع' : 'Every 4 weeks'}</option>
                    <option>{isArabic ? 'كل 6 أسابيع' : 'Every 6 weeks'}</option>
                    <option>{isArabic ? 'كل 8 أسابيع' : 'Every 8 weeks'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'تفضيلات غذائية' : 'Dietary Preferences'}</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {(isArabic ? ['حلال', 'نباتي', 'نباتي صرف', 'خالٍ من الغلوتين'] : ['Halal', 'Vegetarian', 'Vegan', 'Gluten-Free']).map((diet) => (
                      <label key={diet} className="flex items-center space-x-2">
                        <input type="checkbox" className="text-teal-500" />
                        <span className="text-slate-700">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'تعليمات خاصة' : 'Special Instructions'}</label>
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    rows={3}
                    placeholder={isArabic ? 'أي احتياجات غذائية خاصة أو تعليمات تسليم...' : 'Any special dietary needs or delivery instructions...'}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                {isArabic ? 'متابعة إلى الدفع' : 'Continue to Checkout'}
              </button>
            </motion.div>
          )}

          {/* Step 3: Checkout */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
                {isArabic ? 'أكمل طلبك' : 'Complete Your Order'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'الاسم الكامل' : 'Full Name'}</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder={isArabic ? 'الاسم الكامل' : 'Your full name'}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'البريد الإلكتروني' : 'Email'}</label>
                    <input
                      type="email"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder={isArabic ? 'your@email.com' : 'your@email.com'}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'رقم الهاتف' : 'Phone Number'}</label>
                    <input
                      type="tel"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder={isArabic ? '+962 7X XXX XXXX' : '+1 (555) 123-4567'}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-2">{isArabic ? 'عنوان التسليم' : 'Delivery Address'}</label>
                    <input
                      type="text"
                      required
                      className="w-full p-3 border border-slate-300 rounded-lg focus:border-teal-500 focus:outline-none"
                      placeholder={isArabic ? 'عنوان الشارع' : 'Street address'}
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">{isArabic ? 'ملخص الطلب' : 'Order Summary'}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{isArabic ? 'الخطة:' : 'Plan:'}</span>
                      <span>
                        {orderType === 'subscription' 
                          ? subscriptionPlans.find(p => p.id === selectedPlan)?.name
                          : oneTimePacks.find(p => p.id === selectedPlan)?.name
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{isArabic ? 'الوجبات:' : 'Meals:'}</span>
                      <span>
                        {orderType === 'subscription' 
                          ? subscriptionPlans.find(p => p.id === selectedPlan)?.meals
                          : oneTimePacks.find(p => p.id === selectedPlan)?.meals
                        } {isArabic ? 'وجبة' : 'meals'}
                      </span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>{isArabic ? 'الإجمالي:' : 'Total:'}</span>
                      <span>
                        {orderType === 'subscription' 
                          ? subscriptionPlans.find(p => p.id === selectedPlan)?.price
                          : oneTimePacks.find(p => p.id === selectedPlan)?.price
                        }
                      </span>
                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all">
                  {isArabic ? 'إتمام الطلب' : 'Complete Order'}
                </button>
              </form>
            </motion.div>
          )}

          {/* Navigation */}
          {step > 1 && (
            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(step - 1)}
                className="border-2 border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:border-slate-400 transition-colors"
              >
                {isArabic ? 'رجوع' : 'Back'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {isArabic ? 'لماذا تختار REACHFOOD؟' : (<>Why Choose R<span className="text-orange-400">E</span>ACHF<span className="text-orange-400">OO</span>D?</>)}
            </h2>
            <p className="text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              {isArabic ? 'أكثر من مجرد راحة - نحن ملتزمون بتغذيتك وكوكبنا' : "More than just convenience - we're committed to your nutrition and our planet"}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Truck,
                title: isArabic ? 'شحن مجاني' : 'Free Shipping',
                description: isArabic ? 'توصيل مجاني لجميع خطط الاشتراك' : 'Free delivery on all subscription plans',
                color: 'text-blue-400'
              },
              {
                icon: Shield,
                title: isArabic ? 'ضمان الجودة' : 'Quality Guarantee',
                description: isArabic ? 'رضا 100% أو استرداد أموالك' : '100% satisfaction or your money back',
                color: 'text-green-400'
              },
              {
                icon: Leaf,
                title: isArabic ? 'مستدام' : 'Sustainable',
                description: isArabic ? 'تغليف قابل للزراعة يتحول إلى أعشاب' : 'Plantable packaging that grows into herbs',
                color: 'text-teal-400'
              },
              {
                icon: Star,
                title: isArabic ? 'جودة فاخرة' : 'Premium Quality',
                description: isArabic ? 'وجبات بجودة المطاعم بنكهات أصيلة' : 'Restaurant-quality meals with authentic flavors',
                color: 'text-yellow-400'
              }
            ].map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <IconComponent className={`w-12 h-12 ${benefit.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                  <p className="text-teal-100">{benefit.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Booking 