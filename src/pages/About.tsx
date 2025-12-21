import { motion } from 'framer-motion'
import { Lightbulb, Heart, Leaf, Globe } from 'lucide-react'
import { useLocation } from 'react-router-dom'

const About = () => {
  const location = useLocation()
  const isArabic = location.pathname.startsWith('/ar')
  const foundingValues = [
    {
      icon: Lightbulb,
      title: isArabic ? 'ابتكار قائم على البحث' : 'Innovation based research',
      description: isArabic ? 'ريادة تقنيات غذائية رائدة تُغير طريقة الوصول إلى التغذية عالمياً' : 'Pioneering breakthrough food technology that transforms how nutrition is accessed worldwide',
      color: 'text-orange-400'
    },
    {
      icon: Heart,
      title: isArabic ? 'أثر' : 'Our Future Goals',
      description: isArabic ? 'ابتكار حلول للإغاثة الطارئة والمغامرة والحياة المهنية وعافية الأسرة' : 'Creating solutions for emergency relief, adventure, professional life, and family wellness',
      color: 'text-red-400'
    },
    {
      icon: Leaf,
      title: isArabic ? 'استدامة' : 'Sustainability',
      description: isArabic ? 'بناء اقتصاد دائري يصبح فيه التغليف جزءاً من النظام البيئي' : 'Building a circular economy where packaging becomes part of the natural ecosystem',
      color: 'text-green-400'
    },
    {
      icon: Globe,
      title: isArabic ? 'إتاحة الوصول' : 'Accessibility',
      description: isArabic ? 'ضمان وصول التغذية إلى جميع المجتمعات بغض النظر عن الظروف أو القدرات' : 'Ensuring nutrition is accessible to all communities regardless of circumstances or abilities',
      color: 'text-blue-400'
    }
  ]

  const teamMembers = [
    {
      name: 'Amera Otoum',
      role: isArabic ? 'الرئيس التنفيذي ومسؤول التغليف' : 'CEO & Packaging CPO',
      background: isArabic ? 'باحثة في الاقتصاد وعلم النفس البيئي. خبيرة في العمل في حالات الطوارئ وتمكين المجتمعات الضعيفة.' : 'Researcher in Economics and Environmental Psychology. Expert working in emergencies and empowering vulnerable communities.',
      expertise: isArabic ? 'ماجستير: الموارد الاقتصادية والبيئية، بكالوريوس: الهندسة الزراعية' : 'MSc: Economic and Environmental Resources, BS: Agricultural Engineering',
      email: 'Ameraaloto@gmail.com',
      phone: '+962 792977610',
      image: '/images/amera.jpg'
    },
    {
      name: isArabic ? 'د. الجوهرة السبيعي' : 'Dr.Aljawharah Alsubaie',
      role: isArabic ? 'مستشار غذائي' : 'Food Advisor',
      background: isArabic ? 'باحثة في الفعالية العلاجية. قدمت براءة اختراع عام 2014 لحلوى مبتكرة للعناية بالأسنان. تدريب في مستشفيات NHS.' : 'Researcher in Therapeutic Effectiveness. Filed Patent in 2014, Patent in innovative candy for dental care. Hospital training in NHS hospitals.',
      expertise: isArabic ? 'دكتوراه في الصيدلة (دكتوراه مهنية)' : 'Doctor of Pharmacy (professional doctorate)',
      email: 'jalkhuzem@gmail.com',
      image: '/images/Aljawharah Alsubaie.jpg'
    },
    {
      name: isArabic ? 'د. علي علي رضا' : 'Dr. Ali Ali Redha',
      role: isArabic ? 'مستشار البحث والتطوير الغذائي' : 'Food R&D Advisor',
      background: isArabic ? 'باحث في المركبات الغذائية النشطة بيولوجياً' : 'Researcher in Food Bioactives',
      expertise: isArabic ? 'دكتوراه: الغذاء والتغذية والصحة، ماجستير: الكيمياء التحليلية، بكالوريوس: الكيمياء' : 'PhD: Food, Nutrition & Health, MSc: Analytical Chemistry, BSc: Chemistry',
      email: 'ali96chemx@gmail.com',
      image: '/images/Ali Ali Redha.jpg'
    },
    {
      name: isArabic ? 'د. محمود الخطيب' : 'Dr. Mahmoud Alkhateib',
      role: isArabic ? 'مستشار التغذية في حالات الطوارئ' : 'Food For Emergency Advisor',
      background: isArabic ? 'عمل كمستشار تغذية في الهلال الأحمر القطري في الصومال (2011) وقاد جهود التغذية في مخيمات إدارة الكوارث (2012-2018). شارك في اجتماعات ودورات إقليمية في عمان والدوحة، بما في ذلك قيادة مهمة تقييم سوء التغذية في اليمن (2012).' : 'Served as QRC Consultant Dietitian in Somalia (2011) and led nutrition efforts in multiple disaster management camps (2012–2018). Participated in key regional meetings and courses in Amman and Doha, including leading the Yemen malnutrition assessment mission (2012) and delivering expert presentations (2016–2018).',
      expertise: isArabic ? 'التغذية الطارئة، إدارة الكوارث، تقييم سوء التغذية' : 'Emergency Nutrition, Disaster Management, Malnutrition Assessment',
      email: 'mahmoudalkhateib@hotmail.com',
      image: '/images/Mahmoud Alkhatib.jpg'
    },
    {
      name: 'Enes Hurmuzlu',
      role: isArabic ? 'مطور ومستشار تقني' : 'Developer & Tech Advisor',
      background: isArabic ? 'عالم رياضيات ومبرمج من العراق/تركيا. لديه خبرة في تطوير تطبيقات الموبايل، استشارات الذكاء الاصطناعي، وتعليم الرياضيات. عمل مع شركات ناشئة في أمريكا وفنلندا والأردن، وطور تطبيقات iOS وAndroid، ونشر أكثر من 60 محاضرة رياضيات عبر الإنترنت. ممثل فريق العراق في الأولمبياد الدولي للرياضيات 2025 وخريج برنامج Yale Young Global Scholars.' : 'Mathematician and programmer from Iraq/Türkiye with experience in full-stack mobile development, AI advising, and mathematics education. Worked with startups in the US, Finland, and Jordan, developed iOS and Android applications, and published 60+ online math lectures. IMO 2025 Iraq Team Representative and Yale Young Global Scholars alumnus.',
      expertise: isArabic ? 'تطوير تطبيقات الموبايل، الذكاء الاصطناعي، تعليم الرياضيات' : 'Full-Stack Mobile Development, AI Advising, Mathematics Education',
      email: 'enesalhurmuzi@gmail.com',
      image: '/images/anes.jpg'
    },
    {
      name: isArabic ? 'عزالدين زلاق' : 'Azeddine Zellag',
      role: isArabic ? 'مطور Full Stack' : 'Full Stack Developer',
      background: isArabic ? 'مطور Full Stack يحمل ماجستير في علم النفس. متخصص في بناء منصات SaaS عالية الإيرادات وتطبيقات الذكاء الاصطناعي التي تعطي الأولوية للسلوك البشري وتجربة المستخدم. خبير في Next.js وهندسة تطبيقات الموبايل، مع التركيز على الترجمة الصوتية ووكلاء الذكاء الاصطناعي المعرفي.' : 'Full Stack Developer holding a Master\'s degree in Psychology. Specializes in building high-revenue SaaS platforms and AI-driven applications that prioritize human behavior and user experience. Expert in Next.js and mobile architecture, with a focus on voice translation and cognitive AI agents.',
      expertise: isArabic ? 'هندسة Full-Stack، تكامل الذكاء الاصطناعي والصوت، تجربة المستخدم القائمة على علم النفس' : 'Full-Stack Architecture, AI & Voice Integration, Psychology-Driven UX',
      email: 'autonomy.owner@gmail.com',
      image: '/images/azeddinezellag.jpg'
    }
  ]

  const milestones = [
    {
      year: '2023',
      title: isArabic ? 'تعاون بحثي' : 'Research Collaboration',
      description: isArabic ? 'أطلقنا تعاوناً مع مجموعة أبحاث المرأة و ReashSci' : 'Launched collaboration with Women\'s Research Group and ReashSci'
    },
    {
      year: '2024',
      title: isArabic ? 'تقدير وجوائز' : 'Award Recognition',
      description: isArabic ? 'فزنا بجائزة أفضل ملصق بحثي (الأمن الغذائي والتعافي الصحي) مع ReashSci' : 'Won Best Research Poster Award (Food Security & Health Recovery) with ReashSci'
    },
    {
      year: '2025',
      title: isArabic ? 'تطوير الابتكار' : 'Innovation Development',
      description: isArabic ? 'طورنا تغليفاً صديقاً للبيئة وأكثر من 12 وصفة للتعافي الصحي' : 'Developed eco-friendly packaging and 12+ health recovery food recipes'
    },
    {
      year: '2025',
      title: isArabic ? 'نشر بحثي' : 'Research Publication',
      description: isArabic ? 'نشرنا بحثاً عن وصفات فريدة والزراعة المستدامة للبيئات القاسية' : 'Published research on unique recipes & sustainable agriculture for harsh environments'
    },
    {
      year: '2026–2027',
      title: isArabic ? 'فعاليات عالمية' : 'Global Events',
      description: isArabic ? 'خدمنا في فعاليات عالمية كبرى شملت الحج والعمرة وكأس العالم، مقدمين وجبات مستدامة وأصيلة ثقافياً' : 'Served at major global events including Hajj, Umrah, and the World Cup, providing sustainable and culturally authentic meals'
    }
  ]

  const stats = [
    {
      number: '5',
      unit: isArabic ? 'دقائق' : 'Minutes',
      description: isArabic ? 'وقت التسخين من درجة الغرفة إلى 65° م' : 'Heating time from ambient to 65°C'
    },
    {
      number: '100%',
      unit: isArabic ? 'قابل للزراعة والتحلل' : 'Plantable and Biodegradable',
      description: isArabic ? 'التغليف يتحول إلى زهور برية ويستخدم كنظام زراعة مائية' : 'Packaging transforms into wildflowers and using as hypotonic Agriculture system'
    },
    {
      number: '15+',
      unit: isArabic ? 'دولة' : 'Countries',
      description: isArabic ? 'عمليات الإغاثة الطارئة' : 'Emergency relief deployments'
    },
    {
      number: '+1M',
      unit: isArabic ? 'وجبة' : 'Meals',
      description: isArabic ? 'خدمة المهنيين والعائلات ذات أنماط الحياة المزدحمة' : 'Serving professionals and families with busy lifestyles'
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
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              R<span className="text-orange-400">E</span>ACHF<span className="text-orange-400">OO</span>D
              <span className="block text-teal-400">{isArabic ? 'نكهات الابتكار' : 'Flavors of Innovation'}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-teal-300 mb-8">
              {isArabic ? 'العمل الجماعي' : 'Team Work'}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {isArabic ? 'انطلقت ReachFood من قناعة بأن الحصول على التغذية لا ينبغي أن يُقيد بالظروف. نحن ندمج علوم الغذاء المتقدمة مع الابتكار المستدام لتقديم وجبات ساخنة ومغذية إلى أي مكان في العالم.' : 'Founded on the belief that nutrition should never be limited by circumstance, ReachFood combines cutting-edge food science with sustainable innovation to deliver hot, nutritious meals anywhere in the world.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                {isArabic ? 'قصتنا' : 'Our Story'}
              </h2>
              <div className="space-y-6 text-slate-700">
                <p>
                  {isArabic ? 'بدأت رحلتنا في ReachSci — حيث انطلق كل شيء. هناك أطلقنا تدخلاً في مدغشقر، البلد الذي يواجه المجاعة وانعدام الأمن الغذائي ونقصاً واسعاً في فيتامين أ. جمعنا ReachSci كفريق لمواجهة هذا التحدي الملح.' : 'Our journey began at ReachSci — the place where it all started. There, we launched an intervention in Madagascar, a country struggling with famine, food insecurity, and widespread vitamin A deficiency. ReachSci brought our team together to take on this urgent challenge.'}
                </p>
                <p>
                  {isArabic ? 'هناك تعلمنا كيف نحول البحث إلى ابتكار حقيقي، وألهمتنا تلك التجربة للمضي أبعد. طورنا وجبات غذائية متكاملة باستخدام محاصيل محلية، صممت لتغذية المجتمعات ودعم الزراعة المحلية.' : 'It was there we learned how to transform research into real innovation and that experience inspired us to go even further. We developed complete, nutritious meals using local crops, designed to nourish communities while supporting local agriculture.'}
                </p>
                <p>
                  {isArabic ? 'هكذا وُلدت ReachFood: طعام لا يكتفي بالإشباع، بل يشفي ويدعم وينمو من جديد.' : "That's how ReachFood was born: food that not only feeds, but heals, sustains, and grows again."}
                </p>
                <p>
                  {isArabic ? 'شكر من القلب لـ ReachSci، وتقدير خاص للدكتور محمد العوامي، رئيس ReachSci ومشرفنا، على توجيهه ودعمه في هذه الرحلة.' : 'A heartfelt thanks to ReachSci, and special credit to Dr. Mohammed alawami, the President of ReachSci and our supervisor, for his guidance and support on this journey.'}
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img 
                src="/images/ourstorya.jpg" 
                alt="ReachFood founders in emergency relief setting"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/20 to-transparent rounded-lg"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Founding Values */}
      <section className="py-20 relative bg-white">
        {/* Background Image */}
        <img 
          src="/images/hero5a.jpg"
          alt="ReachFood difference background"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Background Overlay */}
        <div className="absolute inset-0 bg-slate-900/70"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isArabic ? 'قيمنا المؤسسة' : 'Our Founding Values'}
            </h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              {isArabic ? 'هذه المبادئ الأساسية توجه كل قرار نتخذه وكل ابتكار نسعى إليه' : 'These core principles guide every decision we make and every innovation we pursue'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {foundingValues.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
                  <value.icon className={`w-8 h-8 text-teal-400`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-teal-100">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {isArabic ? 'تعرف على فريقنا' : 'Meet Our Team'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {isArabic ? 'خبراء يجمعهم هدف واحد: جعل التغذية متاحة للجميع في كل مكان' : 'Experts united by a shared vision of making nutrition accessible to everyone, everywhere'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">{member.name}</h3>
                  <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                  <p className="text-slate-600 mb-3 text-sm">{member.background}</p>
                  <p className="text-slate-500 text-sm mb-4">{member.expertise}</p>
                  {(member.email || member.phone) && (
                    <div className="border-t pt-4">
                      {member.email && (
                        <p className="text-xs text-slate-500 mb-1">
                          <span className="font-medium">{isArabic ? 'البريد:' : 'Email:'}</span> {member.email}
                        </p>
                      )}
                      {member.phone && (
                        <p className="text-xs text-slate-500">
                          <span className="font-medium">{isArabic ? 'هاتف:' : 'Tel:'}</span> <span dir="ltr">{member.phone}</span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              {isArabic ? 'رحلتنا' : 'Our Journey'}
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              {isArabic ? 'من الفكرة إلى الأثر العالمي — المحطات التي شكّلت ReachFood' : 'From concept to global impact - the milestones that shaped ReachFood'}
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line - left on mobile, center on desktop */}
            <div className="absolute left-4 md:left-1/2 md:transform md:-translate-x-px h-full w-0.5 bg-teal-200"></div>

            {milestones.map((milestone, index) => (
              <motion.div
                key={`${milestone.year}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative flex items-center mb-8 md:mb-12 ${
                  index % 2 === 0 ? 'md:justify-start' : 'md:justify-end'
                }`}
              >
                {/* Mobile: full width card with left padding. Desktop: alternating sides */}
                <div className={`w-full pl-12 md:pl-0 md:w-5/12 ${
                  index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'
                }`}>
                  <div className="bg-gradient-to-br from-orange-500 to-orange-600 border border-orange-400 rounded-lg p-4 md:p-6 shadow-lg">
                    <div className="text-xl md:text-2xl font-bold text-white mb-2">{milestone.year}</div>
                    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 md:mb-3">{milestone.title}</h3>
                    <p className="text-sm md:text-base text-orange-100">{milestone.description}</p>
                  </div>
                </div>

                {/* Timeline dot - left on mobile, center on desktop */}
                <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 w-3 h-3 md:w-4 md:h-4 bg-teal-500 rounded-full border-2 md:border-4 border-white shadow-lg"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-gradient-to-br from-teal-900 via-slate-900 to-teal-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {isArabic ? 'أهدافنا المستقبلية' : 'Our Future Goals'}
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {isArabic ? 'رؤيتنا وطموحاتنا لتحويل مستقبل التغذية عالمياً' : 'Our vision and ambitions for transforming the future of nutrition globally'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.description}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-teal-400 mb-2">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold text-white mb-2">
                  {stat.unit}
                </div>
                <div className="text-slate-300">
                  {stat.description}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About