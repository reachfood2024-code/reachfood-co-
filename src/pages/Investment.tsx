import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  Shield, 
  Globe, 
  Award,
  Handshake,
  Leaf,
  Building
} from 'lucide-react'
import { useLocation } from 'react-router-dom'

const Investment = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')

  const investmentHighlights = [
    {
      icon: DollarSign,
      title: isArabic ? 'سوق ضخم' : 'Massive Market',
      description: isArabic ? 'يُقدر سوقنا المستهدف في منطقة الشرق الأوسط وشمال أفريقيا بـ 3.8 مليار دولار، مع شريحة قابلة للخدمة فوراً بقيمة 1.9 مليار دولار.' : 'Our target market in the MENA region is valued at $3.8 billion, with an immediate serviceable segment of $1.9 billion.',
      color: 'text-green-400',
      bgColor: 'bg-green-500/10'
    },
    {
      icon: TrendingUp,
      title: isArabic ? 'نمو مثبت' : 'Proven Traction',
      description: isArabic ? 'المبيعات المبكرة والشراكات تؤكد الطلب.' : 'Early sales and partnerships validate demand.',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    },
    {
      icon: Target,
      title: isArabic ? 'نموذج مربح' : 'Profitable Model',
      description: isArabic ? 'إيرادات متوقعة بـ 282,000 دولار وأرباح 222,000 دولار من 27,000 وحدة سنوياً.' : 'Projected $282,000 in revenue and $222,000 in profit from 27,000 units per year.',
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10'
    },
    {
      icon: Shield,
      title: isArabic ? 'ابتكار محمي ببراءة اختراع' : 'Patented Innovation',
      description: isArabic ? 'تغليفنا يجمع بين الاستدامة والراحة، مما يمنحنا ميزة تنافسية قوية.' : 'Our packaging combines sustainability and convenience, giving us a defensible competitive edge.',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10'
    }
  ]

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
              <TrendingUp className="w-8 h-8 text-teal-400 mr-3" />
              <span className="text-teal-400 font-semibold text-lg">
                {isArabic ? 'فرصة استثمارية' : 'Investment Opportunity'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {isArabic ? 'استثمر في مستقبل الغذاء المستدام' : 'Invest in the Future of Sustainable Food'}
            </h1>
            <p className="text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نحن نحول البحث المبتكر إلى تأثير حقيقي في العالم. مدعومون بمستشارين خبراء ومتأصلين في خبرة أكاديمية ومهنية قوية، فريقنا في مهمة لإحداث ثورة في صناعة الغذاء من خلال التغليف الصديق للبيئة المحمي ببراءة اختراع والمنتجات الجاهزة للإعداد المستوحاة محلياً.'
                : 'We are transforming innovative research into real-world impact. Backed by expert advisors and rooted in strong academic and professional experience, our team is on a mission to revolutionize the food industry through patented, eco-friendly packaging and locally inspired ready-to-eat products.'
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Investment Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
              {isArabic ? 'نقاط القوة الاستثمارية' : 'Investment Highlights'}
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نحن نبحث عن مستثمرين استراتيجيين يؤمنون بالنمو القائم على الأثر'
                : 'We are seeking strategic investors who believe in impact-driven growth'
              }
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {investmentHighlights.map((highlight, index) => {
              const IconComponent = highlight.icon
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-xl p-6 shadow-lg hover:shadow-xl group hover:scale-105 transition-all duration-300 border-2 border-teal-400 hover:border-teal-300"
                  style={{ backgroundColor: '#2d6f7b' }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="relative mb-6">
                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white mb-4">
                      <IconComponent className={`w-8 h-8 ${highlight.color}`} />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3">{highlight.title}</h3>
                  <p className="text-teal-100 leading-relaxed">{highlight.description}</p>
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
            <p className="text-2xl text-slate-700 mb-8 font-medium">
              {isArabic 
                ? 'لنبني مستقبل الغذاء المستدام معاً'
                : "Let's build the future of sustainable food together"
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {isArabic ? 'كن مستثمراً' : 'Become an Investor'}
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Partnership Opportunities */}
      <section className="py-20 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {isArabic ? 'فرص الشراكة' : 'Partnership Opportunities'}
            </h2>
            <p className="text-xl text-white max-w-4xl mx-auto leading-relaxed mb-8">
              {isArabic ? 'انمو معنا كن شريكاً استراتيجياً' : 'Grow With Us Become a Strategic Partner'}
            </p>
            <p className="text-lg text-white max-w-4xl mx-auto leading-relaxed">
              {isArabic 
                ? 'نحن نبحث بنشاط عن شركاء رؤيويين للانضمام إلى مهمتنا. من خلال الجمع بين وصولك وخبرتك مع ابتكارنا، يمكننا فتح أسواق جديدة وتقديم حلول غذائية مستدامة على نطاق واسع.'
                : 'We are actively seeking visionary partners to join our mission. By combining your reach and expertise with our innovation, we can unlock new markets and deliver sustainable food solutions at scale.'
              }
            </p>
          </motion.div>

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
                  className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl p-6 text-center hover:bg-white/20 hover:border-white/50 transition-all duration-300"
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                >
                  <IconComponent className={`w-16 h-16 ${benefit.color} mx-auto mb-4`} />
                  <h3 className="text-xl font-semibold text-white mb-3">{benefit.title}</h3>
                  <p className="text-white leading-relaxed">
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
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              {isArabic 
                ? 'سواء كنت موزعاً أو تاجراً تجزئة أو مؤسسة بحثية — نرحب بالشركاء الذين يتشاركون رؤيتنا.'
                : "Whether you're a distributor, retailer, or research institution — we welcome partners who share our vision."
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-orange-500 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl border-2 border-white"
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

          <div className="space-y-12">
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-teal-900 via-slate-900 to-teal-900">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-teal-400 hover:to-teal-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isArabic ? 'كن مستثمراً' : 'Become an Investor'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-400 hover:to-orange-500 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {isArabic ? 'انضم كشريك' : 'Join as a Partner'}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Investment
