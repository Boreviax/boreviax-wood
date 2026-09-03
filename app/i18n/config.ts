export const localizedLocales = ["ms", "ar"] as const;
export type LocalizedLocale = (typeof localizedLocales)[number];
export type Locale = "en" | LocalizedLocale;

export function isLocalizedLocale(value: string): value is LocalizedLocale {
  return localizedLocales.includes(value as LocalizedLocale);
}

export function localeFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
  return isLocalizedLocale(firstSegment) ? firstSegment : "en";
}

export function stripLocale(pathname: string) {
  const stripped = pathname.replace(/^\/(ms|ar)(?=\/|$)/, "");
  return stripped || "/";
}

export function localizePath(pathname: string, locale: Locale) {
  const basePath = stripLocale(pathname);
  return locale === "en" ? basePath : `/${locale}${basePath === "/" ? "" : basePath}`;
}

export const languageLabels: Record<Locale, string> = {
  en: "English",
  ms: "Bahasa Melayu",
  ar: "العربية",
};

export const commonCopy = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      about: "About",
      quote: "Request a Quote",
      primary: "Primary navigation",
      mobile: "Mobile navigation",
      open: "Open navigation",
      language: "Language",
    },
    footer: {
      description:
        "International sales, specification coordination and delivery support for plywood, furniture panels, WPC and acoustic surfaces.",
      navigate: "Navigate",
      about: "About Boreviax",
      mainSite: "Boreviax main site",
      contact: "Contact",
      location: "Vancouver · Linyi · International supply support",
    },
    explore: "Explore",
  },
  ms: {
    nav: {
      home: "Utama",
      products: "Produk",
      about: "Tentang Kami",
      quote: "Minta Sebut Harga",
      primary: "Navigasi utama",
      mobile: "Navigasi mudah alih",
      open: "Buka navigasi",
      language: "Bahasa",
    },
    footer: {
      description:
        "Jualan antarabangsa, penyelarasan spesifikasi dan sokongan penghantaran untuk papan lapis, panel perabot, WPC dan permukaan akustik.",
      navigate: "Navigasi",
      about: "Tentang Boreviax",
      mainSite: "Laman utama Boreviax",
      contact: "Hubungi kami",
      location: "Vancouver · Linyi · Sokongan bekalan antarabangsa",
    },
    explore: "Lihat produk",
  },
  ar: {
    nav: {
      home: "الرئيسية",
      products: "المنتجات",
      about: "من نحن",
      quote: "طلب عرض سعر",
      primary: "التنقل الرئيسي",
      mobile: "تنقل الهاتف",
      open: "فتح قائمة التنقل",
      language: "اللغة",
    },
    footer: {
      description:
        "مبيعات دولية وتنسيق للمواصفات ودعم للتسليم لمنتجات الخشب الرقائقي وألواح الأثاث وWPC والأسطح الصوتية.",
      navigate: "التنقل",
      about: "عن Boreviax",
      mainSite: "الموقع الرئيسي لـ Boreviax",
      contact: "تواصل معنا",
      location: "فانكوفر · ليني · دعم التوريد الدولي",
    },
    explore: "عرض المنتج",
  },
} as const;

export const quoteFormCopy = {
  en: {
    product: "Product / board type",
    productPlaceholder: "e.g. Duraply",
    size: "Size / thickness",
    sizePlaceholder: "e.g. 1220 × 2440 × 18 mm",
    quantity: "Quantity",
    quantityPlaceholder: "Sheets or containers",
    destination: "Destination",
    destinationPlaceholder: "City / port / country",
    application: "Application / performance target",
    applicationPlaceholder:
      "Finish, emission, moisture, fire, structural or acoustic requirement",
    requiredDate: "Required date",
    requiredDatePlaceholder: "Target production or arrival date",
    contact: "Name / company",
    contactPlaceholder: "How should we address you?",
    chooseWhatsApp: "Choose a WhatsApp contact",
    sendWhatsApp: "Send via WhatsApp",
    sendEmail: "Send by email",
    note: "Your information is used only to prepare and respond to this enquiry.",
    greeting: "Hello Boreviax, I would like a board-material quotation.",
    subject: "Board RFQ",
    newEnquiry: "New enquiry",
  },
  ms: {
    product: "Produk / jenis papan",
    productPlaceholder: "cth. Duraply",
    size: "Saiz / ketebalan",
    sizePlaceholder: "cth. 1220 × 2440 × 18 mm",
    quantity: "Kuantiti",
    quantityPlaceholder: "Bilangan kepingan atau kontena",
    destination: "Destinasi",
    destinationPlaceholder: "Bandar / pelabuhan / negara",
    application: "Aplikasi / sasaran prestasi",
    applicationPlaceholder:
      "Keperluan kemasan, pelepasan, kelembapan, kebakaran, struktur atau akustik",
    requiredDate: "Tarikh diperlukan",
    requiredDatePlaceholder: "Tarikh sasaran pengeluaran atau ketibaan",
    contact: "Nama / syarikat",
    contactPlaceholder: "Bagaimanakah kami patut menghubungi anda?",
    chooseWhatsApp: "Pilih nombor WhatsApp",
    sendWhatsApp: "Hantar melalui WhatsApp",
    sendEmail: "Hantar melalui e-mel",
    note: "Maklumat anda hanya digunakan untuk menyediakan dan menjawab pertanyaan ini.",
    greeting: "Salam Boreviax, saya ingin mendapatkan sebut harga bahan papan.",
    subject: "RFQ bahan papan",
    newEnquiry: "Pertanyaan baharu",
  },
  ar: {
    product: "المنتج / نوع اللوح",
    productPlaceholder: "مثال: Duraply",
    size: "المقاس / السماكة",
    sizePlaceholder: "مثال: 1220 × 2440 × 18 مم",
    quantity: "الكمية",
    quantityPlaceholder: "عدد الألواح أو الحاويات",
    destination: "الوجهة",
    destinationPlaceholder: "المدينة / الميناء / الدولة",
    application: "الاستخدام / الأداء المطلوب",
    applicationPlaceholder:
      "متطلبات التشطيب أو الانبعاثات أو الرطوبة أو الحريق أو الأداء الإنشائي أو الصوتي",
    requiredDate: "التاريخ المطلوب",
    requiredDatePlaceholder: "تاريخ الإنتاج أو الوصول المستهدف",
    contact: "الاسم / الشركة",
    contactPlaceholder: "كيف يمكننا مخاطبتك؟",
    chooseWhatsApp: "اختر رقم WhatsApp",
    sendWhatsApp: "إرسال عبر WhatsApp",
    sendEmail: "إرسال بالبريد الإلكتروني",
    note: "تُستخدم معلوماتك فقط لإعداد هذا الاستفسار والرد عليه.",
    greeting: "مرحبًا Boreviax، أود الحصول على عرض سعر لمواد الألواح.",
    subject: "طلب عرض سعر للألواح",
    newEnquiry: "استفسار جديد",
  },
} as const;

export const productPageCopy = {
  ms: {
    notFound: "Produk tidak ditemui",
    allProducts: "Semua produk",
    requestProduct: "Minta sebut harga produk ini",
    emailSales: "E-mel bahagian jualan",
    procurementFocus: "Fokus perolehan",
    marketReference: "Rujukan pembekal / pasaran",
    startingSpec: "Spesifikasi permulaan.",
    specIntro:
      "Rujukan ini membantu memfokuskan perbincangan awal. Pesanan sebenar tertakluk pada sampel yang diluluskan, sumber pengeluaran dan keperluan projek.",
    structureProcess: "Struktur & proses",
    understandBuild: "Fahami binaan panel.",
    procurementValue: "Nilai perolehan",
    hybridPurpose: "Tujuan yang perlu dicapai oleh struktur hibrid.",
    constructionReason: "Mengapa binaan ini dipilih",
    fitPanel: "Padankan panel dengan kerja.",
    availableFamilies: "Keluarga produk tersedia",
    gradeGuidance: "Panduan mengikut gred",
    exactGrade: "Nyatakan gred yang tepat—bukan sekadar keluarga produk.",
    gradeIntro:
      "Pilih binaan yang sepadan dengan komponen siap, persekitaran penggunaan dan bukti yang diperlukan.",
    bestFit: "Paling sesuai untuk",
    buyerChecks: "Semakan pembeli",
    productEvidence: "Bukti produk",
    seeProfile: "Lihat profil, lenturan dan permukaan.",
    galleryIntro:
      "Paparan produk sebenar menyokong perbincangan teknikal awal. Sampel pesanan yang diluluskan kekal sebagai rujukan pengeluaran.",
    galleryLabel: "Galeri imej. Tatal secara mendatar untuk melihat semua imej.",
    beforeQuote: "Sebelum sebut harga",
    seriousRfq: "Perkara yang perlu ditetapkan dalam RFQ yang lengkap.",
    continuity: "Kesinambungan bekalan",
    noBlanketStock: "Tiada janji stok secara umum.",
    continuityCopy:
      "Kami mengesahkan inventori sebenar, kesiapsiagaan bahan mentah, slot pengeluaran, aksesori dan tarikh penghantaran yang boleh dicapai berdasarkan spesifikasi tepat. Ini lebih berguna daripada dakwaan ‘ada stok’ tanpa syarat.",
    continuityItems: [
      "Sampel diluluskan dan spesifikasi pesanan",
      "Pencapaian pengeluaran dan pemeriksaan kelompok",
      "Penyelarasan pembungkusan, pemuatan dan dokumen",
      "Susulan tuntutan dan penggantian berasaskan bukti",
    ],
    applications: "Aplikasi lazim",
    earnsPlace: "Tempat produk ini memberi nilai.",
    technicalReference: "Rujukan teknikal",
    orderEvidence: "Bukti khusus pesanan",
    comparableQuote: "Minta sebut harga yang boleh dibandingkan",
    tellUs: "Beritahu kami fungsi yang perlu dicapai oleh panel.",
    quoteIntro:
      "Hantar aplikasi, dimensi, binaan, permukaan, sasaran prestasi dan maklumat komersial. Kami akan menyelaraskan butiran yang belum lengkap sebelum menyediakan sebut harga.",
    detailAlt: "butiran binaan atau aplikasi",
  },
  ar: {
    notFound: "المنتج غير موجود",
    allProducts: "جميع المنتجات",
    requestProduct: "طلب عرض لهذا المنتج",
    emailSales: "مراسلة قسم المبيعات",
    procurementFocus: "محور قرار الشراء",
    marketReference: "مرجع المورّد / السوق",
    startingSpec: "مواصفات أولية.",
    specIntro:
      "تساعد هذه المراجع على تحديد نطاق النقاش الأولي. ويعتمد الطلب النهائي على العينة المعتمدة ومصدر الإنتاج ومتطلبات المشروع.",
    structureProcess: "التركيب وعملية الإنتاج",
    understandBuild: "تعرّف على تركيب اللوح.",
    procurementValue: "قيمة الشراء",
    hybridPurpose: "المشكلات التي صُمم التركيب الهجين لمعالجتها.",
    constructionReason: "لماذا هذا التركيب",
    fitPanel: "طابق اللوح مع الاستخدام.",
    availableFamilies: "الفئات المتاحة",
    gradeGuidance: "دليل الدرجات",
    exactGrade: "حدّد الدرجة بدقة، وليس فئة المنتج فقط.",
    gradeIntro:
      "اختر التركيب المطابق للمكوّن النهائي وبيئة الاستخدام والأدلة المطلوبة.",
    bestFit: "أفضل استخدام",
    buyerChecks: "نقاط تحقق المشتري",
    productEvidence: "أدلة المنتج",
    seeProfile: "شاهد القطاع والانحناء والسطح.",
    galleryIntro:
      "تدعم صور المنتج الفعلي النقاش الفني الأولي، بينما تظل عينة الطلب المعتمدة هي مرجع الإنتاج.",
    galleryLabel: "معرض صور. مرّر أفقيًا لعرض جميع الصور.",
    beforeQuote: "قبل عرض السعر",
    seriousRfq: "ما الذي يجب أن يحدده طلب عرض السعر المهني؟",
    continuity: "استمرارية التوريد",
    noBlanketStock: "لا وعود عامة بتوفر المخزون.",
    continuityCopy:
      "نؤكد المخزون الفعلي وجاهزية المواد الخام وموعد الإنتاج والملحقات وتاريخ الشحن الممكن وفق المواصفات الدقيقة. وهذا أدق من عبارة «متوفر في المخزون» من دون شروط.",
    continuityItems: [
      "العينة المعتمدة ومواصفات الطلب",
      "مراحل الإنتاج وفحوصات الدفعات",
      "تنسيق التعبئة والتحميل والمستندات",
      "متابعة المطالبات والاستبدال بالأدلة",
    ],
    applications: "الاستخدامات الشائعة",
    earnsPlace: "أين يحقق هذا المنتج قيمته.",
    technicalReference: "مرجع فني",
    orderEvidence: "أدلة خاصة بالطلب",
    comparableQuote: "اطلب عرض سعر قابلًا للمقارنة",
    tellUs: "أخبرنا بما يجب أن يحققه اللوح.",
    quoteIntro:
      "أرسل الاستخدام والأبعاد والتركيب والسطح والأداء المطلوب والبيانات التجارية. وسننسق التفاصيل غير المحسومة قبل إعداد عرض السعر.",
    detailAlt: "تفاصيل التركيب أو الاستخدام",
  },
} as const;
