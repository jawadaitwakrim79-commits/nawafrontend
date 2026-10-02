export type Slug = "oud" | "shafaq" | "safa";

export interface ProductData {
  slug: Slug;
  nameAr: string;
  fullNameAr: string;
  enemyAr: string;
  ritualAr: string;
  oneLine: string;
  price: number;
  proofPoints: string[];
  ritualSteps: string[];
  faqSeeds: { q: string; a: string }[];
  materialsTable: { thing: string; does: string; matters: string }[];
  crossSellOrder: Slug[];
  imageSrcs: string[];
}

export const PRODUCTS: Record<Slug, ProductData> = {
  oud: {
    slug: "oud",
    nameAr: "نوا عود",
    fullNameAr: "مبخرة عود كمبودي ذكية",
    enemyAr: "رائحة البيت الباهتة",
    ritualAr: "طقس الاستقبال",
    oneLine: "تطلّع ريحة العود الكمبودي بدون فحم وبدون ما تحرق القطعة.",
    price: 199,
    proofPoints: [
      "بدون فحم. الريحة تطلع والدخان ما يخنق المجلس.",
      "حرارة الجهاز تشتغل على القطعة، ما تحرقها على جمر.",
      "للمجلس ولحظة الدخول، مو عطر حمام قوي.",
    ],
    ritualSteps: [
      "حطّي قطعة العود في المكان المخصص.",
      "شغّلي الجهاز واتركيه يدفّي.",
      "أغلقي الباب دقايق عشان الريحة تهدأ في المجلس.",
      "استقبلي ضيوفكِ، أو اجلسي أنتِ أول وحدة.",
    ],
    faqSeeds: [
      { q: "هل تحتاج فحم؟", a: "لا." },
      { q: "هل الريحة تبقى في الستارة؟", a: "العود يعلق أخف من الفحم، والتهوية بعد المجلس تخففه." },
      { q: "هل ينفع لشقة؟", a: "نعم، لأنه ما فيه جمر." },
      { q: "وش أحط فيه؟", a: "عود. لا حطّي بخور مجهول أو زيت في مكان القطعة إلا إذا مواصفات الجهاز قالت ذلك." },
      { q: "الدفع؟", a: "عند الاستلام، ونتصل نأكّد العنوان." },
      { q: "إذا ما عجبتني؟", a: "٣٠ يوم والقطعة سليمة." },
    ],
    materialsTable: [
      { thing: "حجرة التسخين", does: "تدفّي قطعة العود بدل الجمر", matters: "ريحة أنظف ومجلس بلا دخان فحم" },
      { thing: "الجسم الخارجي", does: "يعزل الحرارة عن اليد", matters: "استخدام هادي قدام الضيوف" },
      { thing: "مكان القطعة", does: "يثبت العود داخل الجهاز", matters: "ما ينسكب على الطاولة" },
      { thing: "الخامة الدقيقة والموديل", does: "من كرت المواصفات", matters: "ما نختلق رقم" },
    ],
    crossSellOrder: ["shafaq", "safa"],
    imageSrcs: [
      "/images/products/oud-1.webp",
      "/images/products/oud-2.webp",
      "/images/products/oud-3.webp",
      "/images/products/oud-4.webp",
    ],
  },
  shafaq: {
    slug: "shafaq",
    nameAr: "نوا شفق",
    fullNameAr: "بروجكتر شفق سينمائي",
    enemyAr: "جو الغرفة الممل",
    ritualAr: "طقس السهرة",
    oneLine: "يفرش ضوء الشفق على السقف ويغيّر جو الغرفة من لمبة بيضاء.",
    price: 199,
    proofPoints: [
      "يغيّر السقف والجدار، فالغرفة ما تبقى لمبة وحدة.",
      "الضوء دافي، مناسب للسهرة مو لشغل الظهر.",
      "هادي. الجو يجي من المشهد، مو من صوت جهاز.",
    ],
    ritualSteps: [
      "حطّيه مقابل السقف أو الجدار الفاضي.",
      "طفّي اللمبة البيضاء.",
      "اختاري مشهد الشفق الأهدى.",
      "اجلسي. الغرفة صارت غير.",
    ],
    faqSeeds: [
      { q: "هل هو تلفزيون؟", a: "لا. مشهد ضوئي للغرفة." },
      { q: "هل ينفع في غرفة نوم؟", a: "نعم، على مشهد هادي، ويبعد عن العين مباشرة." },
      { q: "هل يأثر على النوم؟", a: "ما نعد بعلاج. هو جو مساء، والغرف اللي تبي ضوء شغل تخليه مطفّي." },
      { q: "الصوت؟", a: "المطلوب جهاز هادي. إذا المواصفات فيها ديسيبل، نكتب الرقم من ورقة المصنّع فقط." },
      { q: "مع العود؟", a: "هذا أقوى استخدام: ريحة وضوء مع بعض." },
      { q: "الضمان في الكلام؟", a: "٣٠ يوم ترجيع إذا القطعة كاملة." },
    ],
    materialsTable: [
      { thing: "وحدة الإسقاط", does: "ترسم مشهد الشفق على سطح الغرفة", matters: "السقف ما يبقى فاضي" },
      { thing: "عدسة / غطاء", does: "يوزّع الضوء بدالى بقعة حادة", matters: "الجو يعم الغرفة" },
      { thing: "إضاءة دافية", does: "تبعد عن الأبيض القاسي", matters: "السهرة تصير ألين" },
      { thing: "اللومن والواط", does: "من كرت المواصفات", matters: "ما نختلق رقم" },
    ],
    crossSellOrder: ["oud", "safa"],
    imageSrcs: [
      "/images/products/shafaq-1.webp",
      "/images/products/shafaq-2.webp",
      "/images/products/shafaq-3.webp",
      "/images/products/shafaq-4.webp",
    ],
  },
  safa: {
    slug: "safa",
    nameAr: "نوا صفاء",
    fullNameAr: "منقّي هواء HEPA-13 بالعطر",
    enemyAr: "غبار الرياض وكتمة البيت",
    ritualAr: "طقس الهواء",
    oneLine: "فلتر HEPA-13 يمسك غبار الرياض، والعطر يجي في خانة وحده.",
    price: 199,
    proofPoints: [
      "فلتر HEPA-13 يمسك الغبار الناعم اللي تلمّينه كل يوم.",
      "العطر منفصل. ما نقول إن الريحة هي اللي تنقّي.",
      "لبيت الرياض: غبرة وكتمة، مو ادعاء طبّي.",
    ],
    ritualSteps: [
      "شغّليه في المجلس أو غرفة الجلوس، مو مخبّى في الممر.",
      "خلّي الباب والشباك على وضعكِ المعتاد، والجهاز يشتغل بهدوء.",
      "إذا تبين ريحة، حطّي العطر في خانته، مو على الفلتر.",
      "نظّفي أو بدّلي الفلتر لما المؤشر أو المدة في كرت الجهاز تقول ذلك.",
    ],
    faqSeeds: [
      { q: "هل يغني عن التكييف؟", a: "لا. يمسك الغبار في هواء الغرفة." },
      { q: "هل يعالج الحساسية أو الربو؟", a: "لا. إذا عندها حالة، تسأل طبيبتها. إحنا نبيع فلتر وغبار." },
      { q: "وش معنى HEPA-13؟", a: "فئة H13 في EN 1822: التقاط 99.95٪ على الأقل عند أصعب حجم جسيم." },
      { q: "العطر إجباري؟", a: "لا. الفلتر يشتغل بدونه." },
      { q: "صوت؟", a: "نكتب الرقم فقط إذا موجود في ورقة الجهاز." },
      { q: "الأطفال والحيوانات؟", a: "الجهاز الكهربائي ينحط في مكان ثابت وما ينغطّى." },
    ],
    materialsTable: [
      { thing: "فلتر HEPA-13 (H13)", does: "يمسك الجسيمات الدقيقة حسب EN 1822", matters: "غبار الرياض ما يبقى في الهواء" },
      { thing: "مدخل الهواء ومخرجه", does: "يحرّك هواء الغرفة عبر الفلتر", matters: "الكتمة تخف لأن الهواء يتحرك ويتصفّى" },
      { thing: "خانة العطر", does: "ريحة خفيفة بعد التنقية", matters: "ما نخلط العطر بوظيفة الفلتر" },
      { thing: "مؤشر الفلتر إن وجد", does: "يقول متى يتغير", matters: "الأداء ما يموت بصمت" },
    ],
    crossSellOrder: ["oud", "shafaq"],
    imageSrcs: [
      "/images/products/safa-1.webp",
      "/images/products/safa-2.webp",
      "/images/products/safa-3.webp",
      "/images/products/safa-4.webp",
    ],
  },
};

export const PRODUCTS_ARRAY = [PRODUCTS.oud, PRODUCTS.shafaq, PRODUCTS.safa];

export const REVIEWS = [
  { text: "المجلس كان نظيف وريحته واقفة. العود على الجهاز غير الفحم.", author: "نورة", city: "الرياض" },
  { text: "طفيت اللمبة وحطيت الشفق. الغرفة صارت سهرة.", author: "منى", city: "جدة" },
  { text: "الغبرة ترجع بعد الظهر. الجهاز ما سوّى معجزة، بس الطاولة ما تعبّي مثل أول.", author: "أمل", city: "الرياض" },
];

/**
 * Choose upsell product given current cart slugs.
 * Priority: oud → shafaq → safa
 * If all three present, upsell another oud.
 */
export function getUpsellSlug(presentSlugs: Set<Slug>): Slug {
  const priority: Slug[] = ["oud", "shafaq", "safa"];
  for (const s of priority) {
    if (!presentSlugs.has(s)) return s;
  }
  return "oud"; // all three present
}
