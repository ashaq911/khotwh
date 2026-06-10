import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.address.deleteMany()
  await prisma.session.deleteMany()
  await prisma.account.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Admin user
  const hashedPassword = await bcrypt.hash("password123", 12)
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@khotwh.com",
      password: hashedPassword,
      role: "ADMIN",
      updatedAt: new Date(),
    },
  })

  // Categories
  const women = await prisma.category.create({
    data: { name: "نسائي", slug: "women", sortOrder: 1 },
  })
  const men = await prisma.category.create({
    data: { name: "رجالي", slug: "men", sortOrder: 2 },
  })
  const kids = await prisma.category.create({
    data: { name: "أطفال", slug: "kids", sortOrder: 3 },
  })
  const accessories = await prisma.category.create({
    data: { name: "إكسسوارات", slug: "accessories", sortOrder: 4 },
  })

  // Subcategories
  const womenTshirts = await prisma.category.create({
    data: { name: "تي شيرت", slug: "women-tshirts", parentId: women.id, sortOrder: 1 },
  })
  const womenJackets = await prisma.category.create({
    data: { name: "جواكت", slug: "women-jackets", parentId: women.id, sortOrder: 2 },
  })
  const womenDresses = await prisma.category.create({
    data: { name: "فساتين", slug: "women-dresses", parentId: women.id, sortOrder: 3 },
  })
  const womenPants = await prisma.category.create({
    data: { name: "بناطيل", slug: "women-pants", parentId: women.id, sortOrder: 4 },
  })
  const womenSkirts = await prisma.category.create({
    data: { name: "جونلات", slug: "women-skirts", parentId: women.id, sortOrder: 5 },
  })

  const menTshirts = await prisma.category.create({
    data: { name: "تي شيرت", slug: "men-tshirts", parentId: men.id, sortOrder: 1 },
  })
  const menJackets = await prisma.category.create({
    data: { name: "جواكت", slug: "men-jackets", parentId: men.id, sortOrder: 2 },
  })
  const menPants = await prisma.category.create({
    data: { name: "بناطيل", slug: "men-pants", parentId: men.id, sortOrder: 3 },
  })
  const menSweatshirts = await prisma.category.create({
    data: { name: "سويتشيرت", slug: "men-sweatshirts", parentId: men.id, sortOrder: 4 },
  })

  const kidsTshirts = await prisma.category.create({
    data: { name: "تي شيرت", slug: "kids-tshirts", parentId: kids.id, sortOrder: 1 },
  })
  const kidsDresses = await prisma.category.create({
    data: { name: "فساتين", slug: "kids-dresses", parentId: kids.id, sortOrder: 2 },
  })
  const kidsPants = await prisma.category.create({
    data: { name: "بناطيل", slug: "kids-pants", parentId: kids.id, sortOrder: 3 },
  })

  const bags = await prisma.category.create({
    data: { name: "شنط", slug: "bags", parentId: accessories.id, sortOrder: 1 },
  })
  const watches = await prisma.category.create({
    data: { name: "ساعات", slug: "watches", parentId: accessories.id, sortOrder: 2 },
  })
  const jewelry = await prisma.category.create({
    data: { name: "إكسسوارات", slug: "jewelry", parentId: accessories.id, sortOrder: 3 },
  })
  const hats = await prisma.category.create({
    data: { name: "قبعات", slug: "hats", parentId: accessories.id, sortOrder: 4 },
  })

  // Products
  const products = [
    // Women T-Shirts
    { name: "تي شيرت نسائي بقصة ضيقة", slug: "women-slim-tshirt", price: 299, categoryId: womenTshirts.id, sizes: ["S", "M", "L", "XL"], colors: ["أسود", "أبيض", "بيج"], sku: "WTS-001", isNew: true, description: "تي شيرت نسائي بقصة ضيقة مصنوع من القطن المصري الفاخر" },
    { name: "تي شيرت نسائي بأكمام قصيرة", slug: "women-short-sleeve-tshirt", price: 259, categoryId: womenTshirts.id, sizes: ["S", "M", "L", "XL"], colors: ["وردي", "أزرق", "رمادي"], sku: "WTS-002", isFeatured: true, description: "تي شيرت نسائي بأكمام قصيرة بقصة مريحة" },
    // Women Jackets
    { name: "جاكيت جينز نسائي", slug: "women-denim-jacket", price: 899, categoryId: womenJackets.id, sizes: ["S", "M", "L", "XL"], colors: ["أزرق", "أسود"], sku: "WJK-001", isFeatured: true, description: "جاكيت جينز نسائي عصري مناسب لجميع الفصول" },
    { name: "جاكيت شتوي نسائي", slug: "women-winter-jacket", price: 1299, categoryId: womenJackets.id, sizes: ["M", "L", "XL"], colors: ["بني", "أسود", "كحلي"], sku: "WJK-002", isNew: true, description: "جاكيت شتوي نسائي مبطن بالصوف" },
    // Women Dresses
    { name: "فستان طويل أنيق", slug: "elegant-long-dress", price: 699, categoryId: womenDresses.id, sizes: ["S", "M", "L", "XL"], colors: ["أسود", "أحمر", "كحلي"], sku: "WDR-001", isFeatured: true, description: "فستان طويل أنيق مناسب للمناسبات" },
    { name: "فستان قصير بصدرية", slug: "short-cami-dress", price: 459, categoryId: womenDresses.id, sizes: ["S", "M", "L"], colors: ["بيج", "وردي", "أبيض"], sku: "WDR-002", isNew: true, description: "فستان قصير بقصة صدرية مريحة" },
    // Women Pants
    { name: "بنطلون جينز نسائي", slug: "women-jeans", price: 549, categoryId: womenPants.id, sizes: ["S", "M", "L", "XL"], colors: ["أزرق", "أسود", "رمادي"], sku: "WPN-001", description: "بنطلون جينز نسائي بقصة مستقيمة" },
    { name: "بنطلون واسع نسائي", slug: "women-wide-pants", price: 599, categoryId: womenPants.id, sizes: ["S", "M", "L", "XL"], colors: ["أسود", "بيج", "كحلي"], sku: "WPN-002", description: "بنطلون نسائي بقصة واسعة وعصرية" },
    // Women Skirts
    { name: "جونلة قصيرة مطوية", slug: "pleated-mini-skirt", price: 399, categoryId: womenSkirts.id, sizes: ["S", "M", "L"], colors: ["أسود", "رمادي", "كحلي"], sku: "WSK-001", description: "جونلة قصيرة مطوية أنيقة" },
    // Men T-Shirts
    { name: "تي شيرت رجالي كلاسيك", slug: "men-classic-tshirt", price: 249, categoryId: menTshirts.id, sizes: ["M", "L", "XL", "XXL"], colors: ["أسود", "أبيض", "رمادي", "كحلي"], sku: "MTS-001", isFeatured: true, description: "تي شيرت رجالي كلاسيك بقصة عادية" },
    { name: "تي شيرت رجالي بطبعة", slug: "men-printed-tshirt", price: 299, categoryId: menTshirts.id, sizes: ["M", "L", "XL", "XXL"], colors: ["أبيض", "أسود", "أحمر"], sku: "MTS-002", isNew: true, description: "تي شيرت رجالي بطبعة عصرية" },
    // Men Jackets
    { name: "جاكيت جلد رجالي", slug: "men-leather-jacket", price: 1599, categoryId: menJackets.id, sizes: ["M", "L", "XL", "XXL"], colors: ["أسود", "بني"], sku: "MJK-001", isFeatured: true, description: "جاكيت جلد رجالي فاخر" },
    { name: "جاكيت رياضية رجالي", slug: "men-sports-jacket", price: 799, categoryId: menJackets.id, sizes: ["M", "L", "XL", "XXL"], colors: ["أسود", "أزرق", "رمادي"], sku: "MJK-002", description: "جاكيت رياضية رجالي مريح" },
    // Men Pants
    { name: "بنطلون جينز رجالي", slug: "men-jeans", price: 599, categoryId: menPants.id, sizes: ["M", "L", "XL", "XXL"], colors: ["أزرق", "أسود", "رمادي"], sku: "MPN-001", description: "بنطلون جينز رجالي بقصة كلاسيك" },
    { name: "بنطلون كاجوال رجالي", slug: "men-casual-pants", price: 449, categoryId: menPants.id, sizes: ["M", "L", "XL", "XXL"], colors: ["بيج", "كحلي", "أسود"], sku: "MPN-002", description: "بنطلون كاجوال رجالي بقصة مستقيمة" },
    // Men Sweatshirts
    { name: "سويتشيرت رجالي", slug: "men-sweatshirt", price: 499, categoryId: menSweatshirts.id, sizes: ["M", "L", "XL", "XXL"], colors: ["رمادي", "أسود", "كحلي"], sku: "MSW-001", isFeatured: true, description: "سويتشيرت رجالي بقصة مريحة" },
    // Kids T-Shirts
    { name: "تي شيرت أطفال بطبعة كرتون", slug: "kids-cartoon-tshirt", price: 179, categoryId: kidsTshirts.id, sizes: ["2-3", "3-4", "4-5", "5-6"], colors: ["أزرق", "أحمر", "أصفر"], sku: "KTS-001", description: "تي شيرت أطفال بطبعة شخصيات كرتونية" },
    { name: "تي شيرت أطفال بنات", slug: "kids-girls-tshirt", price: 179, categoryId: kidsTshirts.id, sizes: ["2-3", "3-4", "4-5", "5-6"], colors: ["وردي", "أبيض", "بنفسجي"], sku: "KTS-002", description: "تي شيرت أطفال بنات بقصة مريحة" },
    // Kids Dresses
    { name: "فستان أطفال بنات", slug: "kids-dress", price: 349, categoryId: kidsDresses.id, sizes: ["2-3", "3-4", "4-5", "5-6"], colors: ["وردي", "أبيض", "أحمر"], sku: "KDR-001", isFeatured: true, description: "فستان أطفال بنات بتطريز أنيق" },
    // Kids Pants
    { name: "بنطلون جينز أطفال", slug: "kids-jeans", price: 249, categoryId: kidsPants.id, sizes: ["2-3", "3-4", "4-5", "5-6", "6-7"], colors: ["أزرق", "أسود"], sku: "KPN-001", description: "بنطلون جينز أطفال بقصة مريحة" },
    // Accessories - Bags
    { name: "حقيبة يد نسائية", slug: "women-handbag", price: 799, categoryId: bags.id, sizes: ["واحدة"], colors: ["أسود", "بني", "بيج"], sku: "ABG-001", isFeatured: true, description: "حقيبة يد نسائية جلدية فاخرة" },
    { name: "حقيبة ظهر", slug: "backpack", price: 599, categoryId: bags.id, sizes: ["واحدة"], colors: ["أسود", "أزرق", "رمادي"], sku: "ABG-002", description: "حقيبة ظهر عصرية مناسبة للجامعة والعمل" },
    // Accessories - Watches
    { name: "ساعة أنيقة نسائية", slug: "women-elegant-watch", price: 899, categoryId: watches.id, sizes: ["واحدة"], colors: ["ذهبي", "فضي", "وردي"], sku: "AWT-001", isNew: true, description: "ساعة أنيقة نسائية بسوار معدني" },
    { name: "ساعة رياضية رجالية", slug: "men-sports-watch", price: 699, categoryId: watches.id, sizes: ["واحدة"], colors: ["أسود", "أزرق", "أحمر"], sku: "AWT-002", description: "ساعة رياضية رجالية مقاومة للماء" },
    // Accessories - Jewelry
    { name: "عقد فضي", slug: "silver-necklace", price: 449, categoryId: jewelry.id, sizes: ["واحدة"], colors: ["فضي"], sku: "AJW-001", description: "عقد فضي أنيق بتصميم عصري" },
    { name: "سوار ذهبي", slug: "gold-bracelet", price: 599, categoryId: jewelry.id, sizes: ["واحدة"], colors: ["ذهبي"], sku: "AJW-002", isNew: true, description: "سوار ذهبي فاخر مناسب لجميع المناسبات" },
    // Accessories - Hats
    { name: "قبعة بيسبول", slug: "baseball-cap", price: 199, categoryId: hats.id, sizes: ["واحدة"], colors: ["أسود", "أحمر", "أزرق", "أبيض"], sku: "AHT-001", description: "قبعة بيسبول عصرية بتصميم كلاسيك" },
    { name: "قبعة شتوية صوف", slug: "winter-wool-hat", price: 249, categoryId: hats.id, sizes: ["واحدة"], colors: ["رمادي", "أسود", "بني", "كحلي"], sku: "AHT-002", description: "قبعة شتوية من الصوف الخالص" },
  ]

  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        description: product.description || null,
        price: product.price,
        compareAtPrice: product.isNew ? Math.round(product.price * 1.3) : null,
        sku: product.sku,
        images: JSON.stringify([`/images/products/${product.slug}.jpg`]),
        sizes: JSON.stringify(product.sizes),
        colors: JSON.stringify(product.colors),
        categoryId: product.categoryId,
        tags: JSON.stringify([]),
        inStock: true,
        isNew: product.isNew || false,
        isFeatured: product.isFeatured || false,
      },
    })
  }

  // Blog posts
  await prisma.blogPost.create({
    data: {
      title: "نصائح لاختيار الملابس المناسبة لكل فصل",
      slug: "tips-for-choosing-seasonal-clothes",
      excerpt: "تعرف على أفضل النصائح لاختيار الملابس المناسبة لكل فصل من فصول السنة",
      content: `اختيار الملابس المناسبة لكل فصل هو أمر مهم للحفاظ على الراحة والأناقة في نفس الوقت. في هذا المقال، سنقدم لك نصائح قيمة لمساعدتك في اختيار الملابس المثالية لكل فصل.

**فصل الصيف:**
- اختر الأقمشة الخفيفة مثل القطن والكتان
- الألوان الفاتحة تعكس حرارة الشمس
- ارتداء الملابس الواسعة يساعد على التهوية

**فصل الشتاء:**
- الطبقات المتعددة هي السر الأمثل للدفء
- الصوف والكشمير من أفضل الأقمشة الشتوية
- لا تنسى الإكسسوارات مثل القبعات والأوشحة

**فصل الربيع:**
- الألوان الزاهية والنقوشات المبهجة
- الجواكت الخفيفة مثالية للطقس المتقلب
- الفساتين المتوسطة الطول خيار رائع

**فصل الخريف:**
- الألوان الترابية والداكنة
- الجواكت الجينز والجلد خيارات مثالية
- الأحذية المغلقة تناسب طقس الخريف

نتمنى أن تكون هذه النصائح مفيدة لك في اختيار ملابسك لكل فصل!`,
      image: "/images/blog/seasonal-tips.jpg",
      author: "فريق خُطوة",
      published: true,
    },
  })

  await prisma.blogPost.create({
    data: {
      title: "أحدث صيحات الموضة لربيع 2026",
      slug: "spring-2026-fashion-trends",
      excerpt: "اكتشف أحدث صيحات الموضة لربيع 2026 وأناقة لا تُضاهى",
      content: `مع قدوم ربيع 2026، ظهرت العديد من الصيحات الجديدة والمثيرة في عالم الموضة. دعنا نستعرض معاً أبرز هذه الصيحات:

**الألوان الرائجة:**
- اللون الوردي الباستيل
- الأزرق السماوي
- الأخضر الزيتي
- الأصفر الخردلي

**الأقمشة المفضلة:**
- الكتان الطبيعي
- الحرير الخفيف
- القطن العضوي
- الأقمشة المعاد تدويرها

**أبرز الصيحات:**
1. البدلة الكاجوال بقصة واسعة
2. الفساتين بطبعات الأزهار الكبيرة
3. الإكسسوارات المصنوعة من الخرز
4. الأحذية المسطحة المزينة

**نصيحة الموسم:**
امزج بين القطع الكلاسيكية والقطع العصرية لتحصل على إطلالة فريدة تعبر عن شخصيتك.

تسوق أحدث صيحات الموضة الآن من متجر خُطوة!`,
      image: "/images/blog/spring-2026.jpg",
      author: "فريق خُطوة",
      published: true,
    },
  })

  await prisma.blogPost.create({
    data: {
      title: "دليل العناية بالملابس لإطالة عمرها",
      slug: "clothing-care-guide",
      excerpt: "طرق سهلة وفعالة للعناية بملابسك المفضلة وإطالة عمرها",
      content: `العناية الجيدة بالملابس تساعد في الحفاظ عليها لفترة أطول وتوفير المال. إليك دليل شامل للعناية بملابسك:

**غسل الملابس:**
- افصل الملابس حسب اللون قبل الغسيل
- اقرأ تعليمات العناية على الملصق دائماً
- استخدم الماء البارد للملابس الحساسة
- اقلب الملابس على ظهرها قبل الغسيل

**التجفيف:**
- جفف الملابس في الهواء الطلق عندما يكون ممكناً
- تجنب استخدام المجفف للملابس الصوفية والحريرية
- لا تعرض الملابس الداكنة لأشعة الشمس المباشرة

**الكي:**
- استخدم درجة حرارة مناسبة لكل نوع قماش
- اكوي الملابس وهي رطبة قليلاً للحصول على نتائج أفضل
- استخدم قطعة قماش بين المكواة والملابس الحساسة

**التخزين:**
- استخدم علاقات مناسبة للملابس المختلفة
- ضع معطرات طبيعية في الدولاب
- قم بتخزين الملابس الموسمية بعيداً عن الرطوبة

باتباع هذه النصائح، ستتمكن من الحفاظ على ملابسك المفضلة لأطول فترة ممكنة!`,
      image: "/images/blog/clothing-care.jpg",
      author: "فريق خُطوة",
      published: true,
    },
  })

  console.log("Seed completed successfully!")
  console.log("Admin user: admin@khotwh.com / password123")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
