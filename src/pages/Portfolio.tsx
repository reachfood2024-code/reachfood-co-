import { motion } from 'framer-motion'
import { 
  Globe, 
  Award,
  Handshake,
  Building,
  Leaf,
  DollarSign
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

const Portfolio = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')

  const partnershipBenefits = [
    {
      icon: Globe,
      title: isArabic ? 'التوسع الإقليمي' : 'Regional Expansion',
      description: isArabic ? 'حضور مباشر في الأسواق المحلية مع وصول قوي عبر الإنترنت.' : 'Direct presence in local markets plus strong online reach.',
      color: 'text-teal-400'
    },
    {
      icon: Award,
      title: isArabic ? 'نكهات محلية، معايير عالمية' : 'Local Flavors, Global Standards',
      description: isArabic ? 'نصمم منتجاتنا حول المحاصيل المحلية والأذواق التقليدية، مع ضمان الجودة العالمية.' : 'We design products around local crops and traditional tastes, while ensuring international quality.',
      color: 'text-blue-400'
    },
    {
      icon: Handshake,
      title: isArabic ? 'قيم مشتركة' : 'Shared Values',
      description: isArabic ? 'نحن مدفوعون بالأثر والاستدامة والتعاون طويل الأمد.' : 'We are driven by impact, sustainability, and long term collaboration.',
      color: 'text-green-400'
    }
  ]

  const competitiveAdvantages = [
    {
      title: isArabic ? 'الحضور في السوق' : 'Market Presence',
      description: isArabic ? 'على عكس معظم المنافسين الذين يركزون فقط على القنوات الإلكترونية، نجمع بين الحضور الميداني في السوق والوصول القوي عبر الإنترنت، وتغليفنا الصديق للبيئة الحاصل على براءة اختراع يميزنا.' : 'Unlike most competitors who focus only on online channels, we combine on-the-ground market presence with strong online visibility and our patented eco-friendly packaging makes us stand out.',
      icon: Building
    },
    {
      title: isArabic ? 'التركيز المحلي' : 'Local Focus',
      description: isArabic ? 'بينما يتجاهل الآخرون التفضيلات المحلية، نحن نتبنى المحاصيل المحلية والنكهات التقليدية.' : 'While others overlook local preferences, we embrace local crops and traditional flavors.',
      icon: Leaf
    },
    {
      title: isArabic ? 'الوصول بأسعار معقولة' : 'Affordable Access',
      description: isArabic ? 'بينما تبقى أسعارهم مرتفعة، نحافظ على أسعار منتجاتنا معقولة وسهلة الوصول.' : 'While their prices remain high, we keep our products affordable and accessible.',
      icon: DollarSign
    }
  ]

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
              <Handshake className="w-8 h-8 text-white mr-3" />
              <span className="text-white font-semibold text-lg">
                {isArabic ? 'فرص الشراكة' : 'Partnership Opportunities'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {isArabic ? 'انمو معنا كن شريكاً استراتيجياً' : 'Grow With Us Become a Strategic Partner'}
            </h1>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نحن نبحث بنشاط عن شركاء رؤيويين للانضمام إلى مهمتنا. من خلال الجمع بين وصولك وخبرتك مع ابتكارنا، يمكننا فتح أسواق جديدة وتقديم حلول غذائية مستدامة على نطاق واسع.'
                : 'We are actively seeking visionary partners to join our mission. By combining your reach and expertise with our innovation, we can unlock new markets and deliver sustainable food solutions at scale.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partnershipBenefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900 rounded-xl p-8 text-center hover:shadow-xl transition-all duration-300 border-2 border-teal-400"
                  whileHover={{ 
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                >
                  <IconComponent className={`w-16 h-16 ${benefit.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-teal-100 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              )
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className="text-xl text-slate-700 mb-8 max-w-3xl mx-auto">
              {isArabic 
                ? 'سواء كنت موزعاً أو تاجراً تجزئة أو مؤسسة بحثية — نرحب بالشركاء الذين يتشاركون رؤيتنا.'
                : "Whether you're a distributor, retailer, or research institution — we welcome partners who share our vision."
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isArabic ? 'انضم كشريك' : 'Join as a Partner'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {isArabic ? 'لماذا نحن؟' : 'Why Us'}
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {isArabic 
                ? 'ما يجعلنا مختلفين في السوق'
                : 'What sets us apart in the market'
              }
            </p>
          </motion.div>

          <div className="space-y-8">
            {competitiveAdvantages.map((advantage, index) => {
              const IconComponent = advantage.icon
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  className="flex items-center gap-8 bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{advantage.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">{advantage.description}</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {isArabic ? 'شركاؤنا' : 'Our Partners'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {isArabic
                ? 'نفخر بالتعاون مع شركاء استراتيجيين يشاركوننا رؤيتنا'
                : 'We are proud to collaborate with strategic partners who share our vision'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center justify-items-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-slate-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm"
            >
              <img
                src="/images/reachsci-logo.webp"
                alt="ReachSci"
                className="h-32 w-auto mx-auto object-contain"
              />
              <h3 className="text-xl font-semibold text-slate-900 text-center mt-4">ReachSci</h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-slate-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 w-full max-w-sm"
            >
              <img
                src="/images/doyen-logo.jpg"
                alt="Doyen Food Technology"
                className="h-32 w-auto mx-auto object-contain"
              />
              <h3 className="text-xl font-semibold text-slate-900 text-center mt-4">
                {isArabic ? 'دوين لتقنيات الغذاء' : 'Doyen Food Technology'}
              </h3>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-8">
              {isArabic ? 'ابدأ رحلتك معنا اليوم' : 'Start Your Journey With Us Today'}
            </h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-12">
              {isArabic 
                ? 'انضم إلى ثورة الغذاء المستدام وكن جزءاً من التغيير الذي يحدث فرقاً في العالم'
                : 'Join the sustainable food revolution and be part of the change that makes a difference in the world'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isArabic ? 'انضم كشريك' : 'Join as a Partner'}
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Portfolio 