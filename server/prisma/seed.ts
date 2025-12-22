import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@reachfood.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: 'Admin',
        lastName: 'User',
        role: 'super_admin',
      },
    });
    console.log(`Created admin user: ${adminEmail}`);
  } else {
    console.log('Admin user already exists');
  }

  // Create sample products
  const products = [
    {
      nameEn: 'Re-Collagen',
      nameAr: 'ري-كولاجين',
      descriptionEn: 'Premium self-heating meal with collagen benefits. Authentic MENA flavors with high nutritional value.',
      descriptionAr: 'وجبة ذاتية التسخين مميزة مع فوائد الكولاجين. نكهات الشرق الأوسط الأصيلة مع قيمة غذائية عالية.',
      price: 12.00,
      category: 'Wellness',
      badgeEn: 'Health Focused',
      badgeAr: 'صحي',
      imageUrl: '/images/re-collagen.jpg',
      featuresEn: ['Self-heating technology', 'Authentic MENA flavors', 'High nutrition', 'Halal certified', 'Plantable packaging'],
      featuresAr: ['تقنية التسخين الذاتي', 'نكهات الشرق الأوسط الأصيلة', 'قيمة غذائية عالية', 'حلال معتمد', 'تغليف قابل للزراعة'],
      isFeatured: true,
      stockQuantity: 100,
    },
    {
      nameEn: 'Re-Protein',
      nameAr: 'ري-بروتين',
      descriptionEn: 'Gourmet protein-rich meal with premium ingredients. Traditional cooking methods with instant preparation.',
      descriptionAr: 'وجبة غنية بالبروتين بمكونات فاخرة. طرق طهي تقليدية مع تحضير فوري.',
      price: 8.00,
      category: 'Gourmet',
      badgeEn: 'Gourmet Choice',
      badgeAr: 'اختيار الذواقة',
      imageUrl: '/images/re-protein.jpg',
      featuresEn: ['Gourmet variety', 'Traditional cooking', 'Premium ingredients', 'Cultural authenticity', 'Instant preparation'],
      featuresAr: ['تنوع فاخر', 'طهي تقليدي', 'مكونات مميزة', 'أصالة ثقافية', 'تحضير فوري'],
      isFeatured: true,
      stockQuantity: 150,
    },
  ];

  for (const product of products) {
    const existing = await prisma.product.findFirst({
      where: { nameEn: product.nameEn },
    });

    if (!existing) {
      await prisma.product.create({ data: product });
      console.log(`Created product: ${product.nameEn}`);
    }
  }

  // Create subscription plans
  const plans = [
    {
      nameEn: 'Emergency Preparedness',
      nameAr: 'الاستعداد للطوارئ',
      descriptionEn: 'Perfect for emergency preparedness with extended shelf life meals.',
      descriptionAr: 'مثالي للاستعداد للطوارئ مع وجبات ذات صلاحية ممتدة.',
      monthlyPrice: 89.99,
      annualPrice: 890.00,
      savings: 178.00,
      mealsPerMonth: 8,
      featuresEn: ['Mixed emergency selection', 'Extended shelf life', 'Priority shipping', 'Emergency planning guide', 'Bulk discounts'],
      featuresAr: ['تشكيلة طوارئ متنوعة', 'صلاحية ممتدة', 'شحن بأولوية', 'دليل تخطيط الطوارئ', 'خصومات بالجملة'],
      isPopular: false,
    },
    {
      nameEn: 'Adventure Explorer',
      nameAr: 'مستكشف المغامرات',
      descriptionEn: 'High-energy meals designed for outdoor adventures and exploration.',
      descriptionAr: 'وجبات عالية الطاقة مصممة للمغامرات الخارجية والاستكشاف.',
      monthlyPrice: 49.99,
      annualPrice: 490.00,
      savings: 98.00,
      mealsPerMonth: 4,
      featuresEn: ['High-energy outdoor meals', 'Ultra-lightweight packaging', 'Weather-resistant', 'Adventure meal planning', 'Gear partnerships'],
      featuresAr: ['وجبات خارجية عالية الطاقة', 'تغليف خفيف الوزن', 'مقاوم للطقس', 'تخطيط وجبات المغامرة', 'شراكات المعدات'],
      isPopular: true,
    },
    {
      nameEn: 'Professional On-the-Go',
      nameAr: 'المحترف أثناء التنقل',
      descriptionEn: 'Quick, nutritious meals for busy professionals.',
      descriptionAr: 'وجبات سريعة ومغذية للمحترفين المشغولين.',
      monthlyPrice: 69.99,
      annualPrice: 690.00,
      savings: 140.00,
      mealsPerMonth: 6,
      featuresEn: ['Quick preparation', 'Office-friendly', 'Balanced nutrition', 'Premium packaging', 'Flexible delivery'],
      featuresAr: ['تحضير سريع', 'مناسب للمكتب', 'تغذية متوازنة', 'تغليف فاخر', 'توصيل مرن'],
      isPopular: false,
    },
    {
      nameEn: 'Family Wellness',
      nameAr: 'صحة العائلة',
      descriptionEn: 'Family-sized portions with variety for everyone.',
      descriptionAr: 'حصص بحجم عائلي مع تنوع للجميع.',
      monthlyPrice: 129.99,
      annualPrice: 1290.00,
      savings: 258.00,
      mealsPerMonth: 12,
      featuresEn: ['Family portions', 'Variety pack', 'Kid-friendly options', 'Nutritional balance', 'Family discounts'],
      featuresAr: ['حصص عائلية', 'تشكيلة متنوعة', 'خيارات مناسبة للأطفال', 'توازن غذائي', 'خصومات عائلية'],
      isPopular: false,
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findFirst({
      where: { nameEn: plan.nameEn },
    });

    if (!existing) {
      await prisma.subscriptionPlan.create({ data: plan });
      console.log(`Created subscription plan: ${plan.nameEn}`);
    }
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
