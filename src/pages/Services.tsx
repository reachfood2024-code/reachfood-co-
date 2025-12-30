import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { 
  Shield, 
  Mountain, 
  Building, 
  Heart,
  Globe,
  Zap,
  Users,
  Truck,
  Clock,
  Award
} from 'lucide-react'

const Services = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')
  const serviceCategories = [
    {
      category: isArabic ? 'خدمات الإغاثة الطارئة' : 'Emergency Relief Services',
      icon: Shield,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      description: isArabic ? 'نشر سريع للتغذية في مناطق الكوارث وحالات الأزمات' : 'Rapid nutrition deployment for disaster zones and crisis situations',
      applications: [
        isArabic ? 'الاستجابة للكوارث وعمليات الإغاثة' : 'Disaster response and relief operations',
        isArabic ? 'برامج التغذية في مخيمات اللاجئين' : 'Refugee camp nutrition programs',
        isArabic ? 'حِزم الاستعداد للطوارئ' : 'Emergency preparedness kits',
        isArabic ? 'دعم فرق الاستجابة الأولى' : 'First responder support'
      ],
      image: '/images/1.jpg',
      stats: { deployments: isArabic ? 'هدف: 15+ دولة' : 'Goal: 15+ countries', response: isArabic ? 'استجابة خلال 24 ساعة' : '24-hour', capacity: isArabic ? 'هدف: 10,000+ وجبة' : 'Goal: 10,000+ meals' }
    },
    {
      category: isArabic ? 'خدمات المغامرة والهواء الطلق' : 'Adventure & Outdoor Services',
      icon: Mountain,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      description: isArabic ? 'حلول تغذية خفيفة للبيئات القاسية والأنشطة الخارجية' : 'Lightweight nutrition solutions for extreme environments and outdoor activities',
      applications: [
        isArabic ? 'بعثات تسلق الجبال' : 'Mountain climbing expeditions',
        isArabic ? 'عمليات ميدانية عسكرية' : 'Military field operations',
        isArabic ? 'محطات بحثية نائية' : 'Remote research stations',
        isArabic ? 'رحلات تخييم ممتدة' : 'Extended camping trips'
      ],
      image: '/images/2.jpg',
      stats: { altitude: isArabic ? 'تم الاختبار حتى 8000م' : '8,000m tested', weight: isArabic ? 'أخف بنسبة 40%' : '40% lighter', temperature: isArabic ? 'مصمم حتى -40°م' : '-40°C rated' }
    },
    {
      category: isArabic ? 'خدمات العافية للشركات' : 'Corporate Wellness Services',
      icon: Building,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: isArabic ? 'برامج تغذية مناسبة للمكاتب للمهنيين والفرق المشغولة' : 'Office-friendly nutrition programs for busy professionals and teams',
      applications: [
        isArabic ? 'تغذية مكان العمل على مدار الساعة' : '24/7 workplace nutrition',
        isArabic ? 'برامج وجبات للعاملين عن بُعد' : 'Remote worker meal programs',
        isArabic ? 'تموين المؤتمرات والفعاليات' : 'Conference and event catering',
        isArabic ? 'دعم تغذية العاملين بالورديات' : 'Shift worker nutrition support'
      ],
      image: '/images/3.jpg',
      stats: { companies: isArabic ? 'هدف: 200+ شركة' : 'Goal: 200+ companies', productivity: isArabic ? 'هدف: +25% إنتاجية' : 'Target: +25%', satisfaction: isArabic ? 'هدف: تقييم 96%' : 'Target: 96%' }
    },
    {
      category: isArabic ? 'خدمات الرعاية الصحية وكبار السن' : 'Healthcare & Senior Services',
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/10',
      description: isArabic ? 'دعم تغذوي متخصص للمرافق الصحية ومجتمعات كبار السن' : 'Specialized nutrition support for healthcare facilities and senior communities',
      applications: [
        isArabic ? 'تغذية المرضى في المستشفيات' : 'Hospital patient nutrition',
        isArabic ? 'مرافق سكن كبار السن' : 'Senior living facilities',
        isArabic ? 'دعم الرعاية الصحية المنزلية' : 'Home healthcare support',
        isArabic ? 'برامج الحميات العلاجية' : 'Therapeutic diet programs'
      ],
      image: '/images/4.jpg',
      stats: { facilities: isArabic ? 'هدف: 150+ شريك' : 'Goal: 150+ partners', compliance: isArabic ? 'التزام غذائي 100%' : '100% dietary', satisfaction: isArabic ? 'هدف: تقييم 96%' : 'Target: 96%' }
    },
    {
      category: isArabic ? 'خدمات المؤسسات التعليمية' : 'Educational Institution Services',
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: isArabic ? 'حلول تغذية للحرم الجامعي للطلاب والبرامج التعليمية' : 'Campus nutrition solutions for students and educational programs',
      applications: [
        isArabic ? 'برامج طعام جامعية' : 'University dining programs',
        isArabic ? 'الاستعداد للطوارئ في المدارس' : 'School emergency preparedness',
        isArabic ? 'بعثات دراسية ميدانية' : 'Field study expeditions',
        isArabic ? 'برامج تبادل دولي' : 'International exchange programs'
      ],
      image: '/images/5.jpg',
      stats: { students: isArabic ? 'هدف: 50,000+ طالب' : 'Goal: 50,000+ students', schools: isArabic ? 'هدف: 75+ مؤسسة' : 'Goal: 75+ institutions', nutrition: isArabic ? 'توازن غذائي 100%' : '100% balanced' }
    },
    {
      category: isArabic ? 'خدمات التوزيع العالمية' : 'Global Distribution Services',
      icon: Globe,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
      description: isArabic ? 'سلسلة توريد وشبكة توزيع عالمية لإتاحة التغذية على نطاق واسع' : 'Worldwide supply chain and distribution network for scalable nutrition access',
      applications: [
        isArabic ? 'توزيع المساعدات الدولية' : 'International aid distribution',
        isArabic ? 'توصيل للمواقع النائية' : 'Remote location delivery',
        isArabic ? 'إمداد مؤسسي بالجملة' : 'Bulk institutional supply',
        isArabic ? 'حلول تغليف مخصصة' : 'Custom packaging solutions'
      ],
      image: '/images/6.jpg',
      stats: { countries: isArabic ? 'هدف: 25+ دولة' : 'Goal: 25+ countries', logistics: isArabic ? 'تسليم خلال 48 ساعة' : '48-hour delivery', scale: isArabic ? 'هدف: مليون+ وجبة/شهر' : 'Goal: 1M+ meals/month' }
    }
  ]

  const keyFeatures = [
    {
      icon: Zap,
      title: isArabic ? 'تفعيل خلال 3-5 دقائق' : '3-5 Minute Activation',
      description: isArabic ? 'تقنية تسخين ذاتي ثورية تعمل في أي مكان' : 'Revolutionary self-heating technology that works anywhere'
    },
    {
      icon: Clock,
      title: isArabic ? 'متاح 24/7' : '24/7 Availability',
      description: isArabic ? 'دعم على مدار الساعة وقدرات استجابة للطوارئ' : 'Round-the-clock support and emergency response capabilities'
    },
    {
      icon: Award,
      title: isArabic ? 'جودة معتمدة' : 'Certified Quality',
      description: isArabic ? 'معتمد حلال، موافق عليه من FDA، ومتوافق مع معايير الوصول' : 'Halal certified, FDA approved, and accessibility compliant'
    },
    {
      icon: Truck,
      title: isArabic ? 'تسليم عالمي' : 'Global Delivery',
      description: isArabic ? 'شبكة توزيع عالمية مع نشر سريع' : 'Worldwide distribution network with rapid deployment'
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
              <Globe className="w-8 h-8 text-teal-400 mr-3" />
              <span className="text-teal-400 font-semibold text-lg">
                {isArabic ? 'خدمات تغذية عالمية' : 'Global Nutrition Services'}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">{isArabic ? 'تصنيفات الخدمات' : 'Service Categories'}</h1>
            <p className="text-xl text-teal-100 max-w-4xl mx-auto leading-relaxed">
              {isArabic ? 'حلول تغذية شاملة مصممة لبيئات ومجتمعات متنوعة. من الإغاثة الطارئة إلى عافية الشركات، نوفر وجبات ساخنة ومغذية أينما دعت الحاجة.' : "Comprehensive nutrition solutions tailored to diverse environments and communities. From emergency relief to corporate wellness, we deliver hot, nutritious meals anywhere they're needed."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Categories Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-4">{isArabic ? 'رؤيتنا وأهدافنا' : 'Our Vision & Goals'}</h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {isArabic ? 'خدمات تغذية متخصصة نسعى لتقديمها في بيئات ومجتمعات وحالات استخدام محددة' : 'Specialized nutrition services we aim to deliver across specific environments, communities, and use cases'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {serviceCategories.map((service, index) => (
              <motion.div
                key={service.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative h-48">
                  <img 
                    src={service.image} 
                    alt={service.category}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className={`absolute top-4 left-4 p-3 rounded-full ${service.bgColor}`}>
                    <service.icon className={`w-6 h-6 ${service.color}`} />
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-3">{service.category}</h3>
                  <p className="text-slate-600 mb-4">{service.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-slate-700 mb-2">{isArabic ? 'أهم الاستخدامات:' : 'Key Applications:'}</h4>
                    <ul className="space-y-1">
                      {service.applications.map((app, appIndex) => (
                        <li key={appIndex} className="text-sm text-slate-600 flex items-start">
                          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          {app}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                    {Object.entries(service.stats).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-semibold text-teal-600">{value}</div>
                        <div className="text-xs text-slate-500 capitalize">{key}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">
              {isArabic ? 'لماذا تختار خدمات ريتشفود؟' : (<>
                {"Why Choose R"}<span className="text-orange-400">E</span>{"ACHF"}<span className="text-orange-400">OO</span>{"D Services?"}
              </>)}
            </h2>
            <p className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto">
              {isArabic ? 'حلول تغذية شاملة مدعومة بتقنية ثورية وخبرة عالمية' : 'Comprehensive nutrition solutions backed by revolutionary technology and global expertise'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: isArabic ? 'بناء الموثوقية' : 'Building Reliability',
                description: isArabic ? 'هدفنا الوصول إلى 25+ دولة بمعدل نجاح 99.9% في الحالات الحرجة' : 'Our goal: Reach 25+ countries with 99.9% success rate in critical situations',
                icon: Shield
              },
              {
                title: isArabic ? 'حلول قابلة للتوسّع' : 'Scalable Solutions',
                description: isArabic ? 'من وجبات فردية إلى عمليات نشر مؤسسية واسعة' : 'From individual meals to large-scale institutional deployments',
                icon: Zap
              },
              {
                title: isArabic ? 'دعم عالمي' : 'Global Support',
                description: isArabic ? 'شبكة دعم عالمية على مدار الساعة مع قدرات استجابة سريعة' : '24/7 worldwide support network with rapid response capabilities',
                icon: Globe
              }
            ].map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-teal-100 flex items-center justify-center">
                  <benefit.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-4">{benefit.title}</h3>
                <p className="text-slate-600">{benefit.description}</p>
              </motion.div>
            ))}
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
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
              {isArabic ? 'جاهزون لتنفيذ حلول التغذية؟' : 'Ready to Deploy Nutrition Solutions?'}
            </h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              {isArabic ? 'تواصل مع فريقنا لمناقشة متطلباتك وإنشاء حل تغذوي مخصص.' : 'Contact our team to discuss your specific requirements and create a custom nutrition solution.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isArabic ? '/ar/contact' : '/contact'}
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold py-4 px-8 rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all"
              >
                {isArabic ? 'تواصل مع فريقنا' : 'Contact Our Team'}
              </Link>
              <Link
                to={isArabic ? '/ar/shop' : '/shop'}
                className="border-2 border-teal-400 text-teal-300 font-semibold py-4 px-8 rounded-lg hover:bg-teal-400 hover:text-white transition-all"
              >
                {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services