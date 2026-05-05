import { useLocation } from 'react-router-dom'

export function useIsArabic(): boolean {
  const location = useLocation()
  return location.pathname.startsWith('/ar')
}

type Dictionary = Record<string, { en: string; ar: string }>

export const dict: Dictionary = {
  // Generic
  orderNow: { en: 'Order Now', ar: 'اطلب الآن' },
  shopNow: { en: 'Shop Now', ar: 'تسوق الآن' },
  learnMore: { en: 'Learn More', ar: 'اعرف المزيد' },
  exploreProducts: { en: 'Explore Products', ar: 'استكشف المنتجات' },

  // ParallaxHero
  heroBadge: { en: 'Revolutionary Food Technology', ar: 'تقنية غذائية ثورية' },
  heroParagraph: {
    en: 'ReachFood offers self-heating, ready to eat meals delivered in eco-friendly, biodegradable, and plantable packaging also available as a standalone packaging products. Our solution replaces single use plastics with sustainable materials, improving food access anytime, anywhere, while reducing environmental, health impact. It is designed for food providers serving busy professionals, athletes, large events, emergency situations, and NGOs, and is supported by a digital application that tracks environmental footprint and plastic waste reduction across the food system.',
    ar: 'تقدم ReachFood وجبات ذاتية التسخين جاهزة للأكل ضمن تغليف صديق للبيئة، قابل للتحلل والزراعة، ومتوفر أيضاً كمنتجات تغليف مستقلة. يستبدل حلنا البلاستيك ذا الاستخدام الواحد بمواد مستدامة، مما يحسّن الوصول إلى الغذاء في أي وقت وأي مكان، ويقلل من الأثر البيئي والصحي. صُمم لمزودي الأغذية الذين يخدمون المهنيين المشغولين والرياضيين والفعاليات الكبرى وحالات الطوارئ والمنظمات غير الحكومية، ومدعوم بتطبيق رقمي يتتبع البصمة البيئية وتقليل النفايات البلاستيكية عبر منظومة الغذاء.'
  },

  // Footer
  footerTagline: {
    en: 'Revolutionizing nutrition with eco-friendly self heating meals and sustainable packaging. Bringing hot, culturally authentic food to emergency zones, adventures, and busy lives worldwide.',
    ar: 'نحدث ثورة في التغذية بوجبات ذاتية التسخين صديقة للبيئة وتغليف مستدام. نوصل طعاماً ساخناً وأصيلاً ثقافياً لمناطق الطوارئ والمغامرات والحياة المزدحمة حول العالم.'
  },
  products: { en: 'Products', ar: 'المنتجات' },
  innovationLab: { en: 'Innovation Lab', ar: 'مختبر الابتكار' },
  ourStory: { en: 'Our Story', ar: 'قصتنا' },
  shop: { en: 'Shop Now', ar: 'تسوق الآن' },
  subscriptions: { en: 'Subscriptions', ar: 'الاشتراكات' },
  categories: { en: 'Categories', ar: 'الفئات' },
  emergencyRelief: { en: 'Emergency Relief', ar: 'الإغاثة الطارئة' },
  adventureMeals: { en: 'Adventure Meals', ar: 'وجبات المغامرة' },
  professionalQuick: { en: 'Professional Quick', ar: 'وجبات للمهنيين' },
  familyWellness: { en: 'Family Wellness', ar: 'عافية الأسرة' },
  athletes: { en: 'Athletes', ar: 'الرياضيون' },
  contact: { en: 'Contact', ar: 'تواصل' },
  globalDistribution: { en: 'Global Distribution', ar: 'توزيع عالمي' },
  support247: { en: '24/7 Emergency Support', ar: 'دعم طارئ 24/7' },
  partners: { en: 'Partners', ar: 'الشركاء' },
  ngoPartnerships: { en: 'NGO Partnerships', ar: 'شراكات المنظمات غير الربحية' },
  corporateSales: { en: 'Corporate Sales', ar: 'مبيعات الشركات' },
  distributionNetwork: { en: 'Distribution Network', ar: 'شبكة التوزيع' },
  privacyPolicy: { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  termsOfService: { en: 'Terms of Service', ar: 'شروط الاستخدام' },
  sustainability: { en: 'Sustainability', ar: 'الاستدامة' },
  accessibility: { en: 'Accessibility', ar: 'إمكانية الوصول' },

  // Home hero headings
  smartMeals: { en: 'Smart Meals for Real Lives', ar: 'وجبات ذكية لحياة حقيقية' },
  technologyMakesDifference: { en: 'Technology That Makes a Difference', ar: 'تقنية تُحدث فرقاً' },
  joinMovement: { en: 'Join the Movement', ar: 'انضم إلى الحركة' },
}

export function tr(key: keyof typeof dict, isArabic: boolean): string {
  return dict[key][isArabic ? 'ar' : 'en']
}


