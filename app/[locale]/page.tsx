import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "../components/ProductCard";
import { isLocalizedLocale, localizePath } from "../i18n/config";
import { getLocalizedProducts } from "../i18n/products";

type PageProps = { params: Promise<{ locale: string }> };

const copy = {
  ms: {
    metaTitle: "Boreviax Panels | Papan Lapis, MDF, WPC & Panel Akustik",
    metaDescription:
      "Bekalan antarabangsa dan sokongan spesifikasi untuk papan lapis, MDF, papan partikel, FOSB, WPC dan panel akustik bilah kayu.",
    heroEyebrow: "Papan lapis · Panel perabot · WPC · Permukaan akustik",
    heroTitle: "Bekalan panel yang dibina untuk mengelakkan kejutan pengeluaran.",
    heroLead:
      "Boreviax menyelaraskan binaan panel, sampel diluluskan, sumber pengeluaran, bukti, pembungkusan dan pelan penghantaran supaya pasukan pembelian dapat melindungi kualiti, tempoh siap dan kesinambungan pengeluaran.",
    explore: "Terokai produk",
    startRfq: "Mulakan RFQ",
    factsLabel: "Rujukan komersial",
    facts: [
      ["15 tahun", "Pengalaman perdagangan panel rentas sempadan"],
      ["9 keluarga", "Panel, WPC dan permukaan akustik"],
      ["Satu laluan", "Daripada spesifikasi hingga penyelesaian selepas jualan"],
    ],
    introEyebrow: "Keputusan perolehan yang boleh dipertanggungjawabkan",
    introTitle: "Pembelian panel bukan sekadar harga bagi setiap kepingan.",
    introCopy:
      "Pembeli yang berkelayakan perlu tahu sama ada binaan diluluskan boleh dihasilkan semula, sama ada laporan sepadan dengan pesanan tepat, sama ada tarikh dijanjikan boleh dicapai dan siapa yang menyelesaikan tuntutan jika berlaku masalah. Boreviax menyelaraskan semua persoalan ini melalui satu perhubungan jualan dan perkhidmatan antarabangsa.",
    how: "Cara Boreviax berfungsi",
    videoEyebrow: "Pengeluaran sedang berjalan",
    videoTitle: "Lihat barisan panel automatik beroperasi.",
    videoIntro:
      "Pengendalian dan penekanan automatik membantu menghasilkan panel secara konsisten. Sumber, binaan, spesifikasi dan laluan pemeriksaan bagi setiap pesanan Boreviax disahkan secara berasingan.",
    videoFallback: "Pelayar anda tidak menyokong video terbenam.",
    videoCaptionTitle: "Pengendalian panel automatik dan kitaran penekanan",
    videoCaption:
      "Rakaman pengeluaran sebagai rujukan; sumber dan kawalan pengeluaran sebenar disahkan bagi setiap pesanan.",
    materialAlt: "Globus bertekstur kayu dikelilingi daun hijau",
    materialEyebrow: "Keputusan bahan yang bertanggungjawab",
    materialTitle: "Pengurangan sisa bermula dengan spesifikasi yang betul.",
    materialCopy:
      "Memadankan binaan dengan aplikasi, meluluskan sampel pengeluaran sebenar dan mengawal kelompok berulang dapat mengurangkan kepingan ditolak, kerja semula dan penggantian pramatang dalam rantaian bekalan.",
    materialNote:
      "Dokumen sumber, data pelepasan dan tuntutan alam sekitar disahkan berdasarkan produk dan pesanan tepat—bukan dibuat kesimpulan daripada imej.",
    priorityEyebrow: "Penyelesaian papan lapis utama",
    priorityTitle: "Tiga masalah. Tiga binaan yang dirancang khusus.",
    priorityIntro:
      "Bentuk melengkung, laminasi kritikal kemasan dan projek berasaskan prestasi memerlukan lebih daripada spesifikasi papan lapis umum.",
    coreEyebrow: "Rangkaian panel teras",
    coreTitle: "Bandingkan binaan, bukan sekadar label.",
    coreIntro:
      "Ketumpatan, susunan venir, kualiti permukaan, pemesinan, kelembapan, kebakaran, kekuatan pemasangan dan prestasi didokumenkan semuanya mempengaruhi keputusan pembelian.",
    surfaceEyebrow: "Permukaan luar & akustik",
    surfaceTitle: "Sistem yang melangkaui panel rata.",
    surfaceIntro:
      "Profil, kemasan dan aksesori pemasangan yang diselaraskan untuk projek komposit luaran dan ruang dalaman penyerap bunyi.",
    riskEyebrow: "Risiko yang mesti dielakkan oleh pembelian",
    riskTitle: "Empat risiko ini lebih mahal daripada perbezaan harga.",
    risks: [
      ["01", "Binaan yang salah", "Papan lebih murah boleh menyebabkan kegagalan pemesinan, meleding, delaminasi atau kemasan tidak sesuai apabila aplikasi tidak ditetapkan."],
      ["02", "Kelompok tidak konsisten", "Sampel diluluskan hanya bernilai apabila kawalan kelembapan, ketumpatan, susunan lapisan, warna dan permukaan diteruskan ke pengeluaran."],
      ["03", "Ketersediaan tidak realistik", "Kami menyemak stok sebenar, kesiapsiagaan bahan mentah, slot pengeluaran dan kelengkapan aksesori, bukan memberi janji inventori secara umum."],
      ["04", "Tuntutan tidak diselesaikan", "Rekod pembungkusan, bukti pemeriksaan dan satu perhubungan selepas jualan menyediakan laluan praktikal untuk pembetulan, penggantian atau penutupan tuntutan."],
    ],
    dispatchEyebrow: "Penyelarasan pembungkusan & penghantaran",
    dispatchTitle: "Kesiapsiagaan penghantaran perlu kelihatan sebelum kontena ditutup.",
    dispatchCopy:
      "Paparan pembungkusan Boreviax ini menunjukkan pemeriksaan sebelum penghantaran: perlindungan bungkusan, pengikatan, pengasingan kelompok, penandaan, kuantiti dan kesiapsiagaan pemuatan. Stok dan pembungkusan sebenar disahkan bagi setiap spesifikasi pesanan.",
    dispatchAlt1: "Bungkusan panel eksport Boreviax tersusun di gudang",
    dispatchCap1: "Bungkusan pelindung dikumpulkan untuk pemeriksaan kuantiti, penandaan dan pengendalian.",
    dispatchAlt2: "Barisan bungkusan panel eksport Boreviax sedia dihantar",
    dispatchCap2: "Bungkusan diasingkan mengikut kelompok untuk penyelarasan penghantaran akhir.",
    selectionAlt: "Sampel kemasan panel hiasan",
    selectionEyebrow: "Pemilihan berasaskan aplikasi",
    selectionTitle: "Sebut harga yang setara bermula dengan soalan teknikal yang sama.",
    selectionSteps: [
      ["01", "Tetapkan aplikasi", "Komponen siap, beban, persekitaran, proses dan jangka hayat perkhidmatan."],
      ["02", "Sahkan binaan tepat", "Teras, bilangan lapisan, profil ketumpatan, pelekat, rawatan, muka dan laluan kemasan."],
      ["03", "Padankan bukti", "Bukti pelepasan, kelembapan, kebakaran, struktur atau akustik semasa bagi binaan tersebut."],
    ],
    processEyebrow: "Proses pembelian yang lebih jelas",
    processTitle: "Daripada pertanyaan pertama hingga pesanan diterima.",
    processButton: "Hantar enam maklumat RFQ",
    processSteps: [
      ["01", "Tentukan", "Selaraskan aplikasi, binaan, kemasan, toleransi dan bukti."],
      ["02", "Sahkan", "Semak sumber pengeluaran, ketersediaan sebenar dan tarikh yang boleh dicapai."],
      ["03", "Kawal", "Ikuti sampel diluluskan, pemeriksaan kelompok, pencapaian dan dokumen."],
      ["04", "Lindungi", "Selaraskan pembungkusan, pemuatan, penghantaran dan penyelesaian selepas jualan."],
    ],
    ctaEyebrow: "Bersedia untuk sebut harga yang boleh dibandingkan?",
    ctaTitle: "Hantar jenis papan, saiz, kuantiti, destinasi dan tarikh diperlukan.",
    ctaButton: "Minta sebut harga",
  },
  ar: {
    metaTitle: "Boreviax Panels | الخشب الرقائقي وMDF وWPC والألواح الصوتية",
    metaDescription:
      "توريد دولي ودعم للمواصفات لمنتجات الخشب الرقائقي وMDF والألواح الحبيبية وFOSB وWPC والألواح الصوتية ذات الشرائح الخشبية.",
    heroEyebrow: "خشب رقائقي · ألواح أثاث · WPC · أسطح صوتية",
    heroTitle: "توريد ألواح يحدّ من مفاجآت الإنتاج.",
    heroLead:
      "تنسق Boreviax تركيب اللوح والعينة المعتمدة ومصدر الإنتاج والأدلة والتعبئة وخطة التسليم، كي تحمي فرق الشراء الجودة والمدة واستمرارية الإنتاج.",
    explore: "استكشف المنتجات",
    startRfq: "ابدأ طلب السعر",
    factsLabel: "مراجع تجارية",
    facts: [
      ["15 عامًا", "خبرة في تجارة الألواح عبر الحدود"],
      ["9 فئات", "ألواح وWPC وأسطح صوتية"],
      ["مسار واحد", "من المواصفات حتى إغلاق خدمات ما بعد البيع"],
    ],
    introEyebrow: "قرارات شراء واضحة المسؤولية",
    introTitle: "شراء الألواح لا يقتصر على سعر اللوح.",
    introCopy:
      "يحتاج المشتري المؤهل إلى معرفة ما إذا كان التركيب المعتمد قابلًا للتكرار، وما إذا كان التقرير يطابق الطلب نفسه، وما إذا كان الموعد قابلًا للتحقيق، ومن يتولى إغلاق المطالبة عند حدوث مشكلة. تنسق Boreviax هذه المسائل من خلال جهة اتصال دولية واحدة للمبيعات والخدمة.",
    how: "كيف تعمل Boreviax",
    videoEyebrow: "الإنتاج أثناء التشغيل",
    videoTitle: "شاهد خط إنتاج ألواح آليًا أثناء العمل.",
    videoIntro:
      "تساعد المناولة والكبس الآليان على إنتاج متكرر ومتسق. ويُعتمد مصدر الإنتاج والتركيب والمواصفات ومسار الفحص لكل طلب من Boreviax بصورة مستقلة.",
    videoFallback: "متصفحك لا يدعم الفيديو المضمّن.",
    videoCaptionTitle: "مناولة آلية للألواح ودورة الكبس",
    videoCaption:
      "لقطات تمثيلية للإنتاج؛ ويُعتمد مصدر الإنتاج الفعلي وضوابطه لكل طلب على حدة.",
    materialAlt: "كرة أرضية بملمس خشبي تحيط بها أوراق خضراء",
    materialEyebrow: "قرارات مسؤولة بشأن المواد",
    materialTitle: "تقليل الهدر يبدأ بالمواصفات الصحيحة.",
    materialCopy:
      "تساعد مطابقة التركيب مع الاستخدام واعتماد عينة إنتاج فعلية وضبط الدفعات المتكررة على تقليل الألواح المرفوضة وإعادة العمل والاستبدال المبكر في سلسلة التوريد.",
    materialNote:
      "تُعتمد مستندات المصدر وبيانات الانبعاثات والادعاءات البيئية وفق المنتج والطلب المحددين، ولا تُستنتج من الصورة.",
    priorityEyebrow: "حلول الخشب الرقائقي ذات الأولوية",
    priorityTitle: "ثلاث مشكلات، وثلاثة تراكيب مقصودة.",
    priorityIntro:
      "تحتاج الأشكال المنحنية والتصفيح الحساس للتشطيب والمشاريع القائمة على الأداء إلى أكثر من مواصفة عامة للخشب الرقائقي.",
    coreEyebrow: "مجموعة الألواح الأساسية",
    coreTitle: "قارن التركيب، لا الاسم فقط.",
    coreIntro:
      "تؤثر الكثافة وترتيب القشرة وجودة السطح والتشغيل والرطوبة والحريق وقوة التثبيت والأداء الموثق جميعها في قرار الشراء.",
    surfaceEyebrow: "أسطح خارجية وصوتية",
    surfaceTitle: "أنظمة تتجاوز اللوح المسطح.",
    surfaceIntro:
      "قطاعات وتشطيبات وملحقات تركيب منسقة لمشاريع المواد المركبة الخارجية والمساحات الداخلية الماصة للصوت.",
    riskEyebrow: "ما يجب أن تمنعه إدارة المشتريات",
    riskTitle: "أربعة مخاطر تفوق كلفتها فرق السعر.",
    risks: [
      ["01", "التركيب الخاطئ", "قد يؤدي اللوح الأرخص إلى فشل التشغيل أو الالتواء أو انفصال الطبقات أو تشطيب غير مناسب إذا لم يُحدد الاستخدام."],
      ["02", "دفعات غير متكررة", "لا تكون للعينة المعتمدة قيمة إلا إذا استمرت ضوابط الرطوبة والكثافة وترتيب الطبقات واللون والسطح في الإنتاج."],
      ["03", "توفر غير واقعي", "نتحقق من المخزون الفعلي وجاهزية المواد الخام وموعد الإنتاج واكتمال الملحقات بدل تقديم وعد عام بالمخزون."],
      ["04", "مطالبات غير مغلقة", "توفر سجلات التعبئة وأدلة الفحص وجهة واحدة لخدمات ما بعد البيع مسارًا عمليًا للتصحيح أو الاستبدال أو إغلاق المطالبة."],
    ],
    dispatchEyebrow: "تنسيق التعبئة والشحن",
    dispatchTitle: "يجب أن تكون جاهزية الشحنة ظاهرة قبل إغلاق الحاوية.",
    dispatchCopy:
      "توضح صور تعبئة Boreviax فحوصات ما قبل الشحن: حماية العبوات والربط وفصل الدفعات والعلامات والكمية وجاهزية التحميل. ويُعتمد المخزون والتعبئة الفعليان وفق مواصفات كل طلب.",
    dispatchAlt1: "عبوات ألواح تصدير Boreviax مرتبة في مستودع",
    dispatchCap1: "عبوات محمية ومجمعة لفحص الكمية والعلامات والمناولة.",
    dispatchAlt2: "صفوف من عبوات ألواح Boreviax جاهزة للشحن",
    dispatchCap2: "عبوات مفصولة حسب الدفعة لتنسيق الشحن النهائي.",
    selectionAlt: "عينات تشطيب ألواح زخرفية",
    selectionEyebrow: "اختيار يبدأ بالاستخدام",
    selectionTitle: "يبدأ عرض السعر القابل للمقارنة بالسؤال الفني نفسه.",
    selectionSteps: [
      ["01", "حدّد الاستخدام", "المكوّن النهائي والحمولة والبيئة والعملية والعمر الخدمي المتوقع."],
      ["02", "أكد التركيب الدقيق", "اللب وعدد الطبقات وتوزيع الكثافة واللاصق والمعالجة والوجه ومسار التشطيب."],
      ["03", "طابق الأدلة", "أدلة الانبعاثات أو الرطوبة أو الحريق أو الأداء الإنشائي أو الصوتي الحالية لذلك التركيب."],
    ],
    processEyebrow: "عملية شراء أوضح",
    processTitle: "من السؤال الأول حتى تسليم الطلب.",
    processButton: "أرسل بنود طلب السعر الستة",
    processSteps: [
      ["01", "حدّد", "واءم الاستخدام والتركيب والتشطيب والتفاوت والأدلة."],
      ["02", "أكد", "تحقق من مصدر الإنتاج والتوفر الفعلي والتاريخ الممكن."],
      ["03", "اضبط", "تابع العينة المعتمدة وفحوصات الدفعات والمراحل والمستندات."],
      ["04", "احمِ", "نسق التعبئة والتحميل والتسليم وإغلاق خدمات ما بعد البيع."],
    ],
    ctaEyebrow: "هل أنت مستعد لعرض سعر قابل للمقارنة؟",
    ctaTitle: "أرسل نوع اللوح والمقاس والكمية والوجهة والتاريخ المطلوب.",
    ctaButton: "اطلب عرض سعر",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return {};
  const page = copy[locale];
  return {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/", "ms-MY": "/ms", ar: "/ar" },
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: `/${locale}`,
      locale: locale === "ms" ? "ms_MY" : "ar",
    },
  };
}

export default async function LocalizedHome({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const page = copy[locale];
  const products = getLocalizedProducts(locale);
  const coreProducts = products.slice(0, 7);
  const surfaceProducts = products.slice(7);
  const priorityProducts = products.filter((product) =>
    ["flexible-plywood", "duraply", "functional-plywood"].includes(product.slug),
  );

  return (
    <main>
      <section className="home-hero" data-reveal>
        <img className="hero-background" src="/assets/hero-forest.webp" alt="" aria-hidden="true" />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p className="eyebrow light">{page.heroEyebrow}</p>
          <h1>{page.heroTitle}</h1>
          <p className="hero-lead">{page.heroLead}</p>
          <div className="hero-actions">
            <Link className="button button-light" href={localizePath("/products", locale)}>{page.explore}</Link>
            <Link className="button button-outline-light" href={localizePath("/contact", locale)}>{page.startRfq}</Link>
          </div>
          <div className="hero-facts" aria-label={page.factsLabel}>
            {page.facts.map(([value, label]) => <div key={value}><strong>{value}</strong><span>{label}</span></div>)}
          </div>
        </div>
      </section>

      <section className="section intro-section" data-reveal>
        <div className="shell split-intro">
          <div><p className="eyebrow">{page.introEyebrow}</p><h2 className="section-title">{page.introTitle}</h2></div>
          <div className="intro-copy"><p>{page.introCopy}</p><Link className="text-link" href={localizePath("/about", locale)}>{page.how} <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <section className="section production-video-section" data-reveal>
        <div className="shell">
          <div className="section-heading-row production-video-heading"><div><p className="eyebrow">{page.videoEyebrow}</p><h2 className="section-title">{page.videoTitle}</h2></div><p>{page.videoIntro}</p></div>
          <figure className="production-video-frame" data-reveal>
            <video controls playsInline preload="metadata" poster="/assets/panel-production-line-poster.webp" aria-describedby={`production-video-caption-${locale}`}>
              <source src="/assets/panel-production-line.mp4" type="video/mp4" />{page.videoFallback}
            </video>
            <figcaption id={`production-video-caption-${locale}`}><strong>{page.videoCaptionTitle}</strong><span>{page.videoCaption}</span></figcaption>
          </figure>
        </div>
      </section>

      <section className="material-impact-section" data-reveal>
        <img className="material-impact-background" src="/assets/responsible-material-background.webp" alt={page.materialAlt} loading="lazy" />
        <div className="material-impact-shade" />
        <div className="shell material-impact-content"><div><p className="eyebrow light">{page.materialEyebrow}</p><h2>{page.materialTitle}</h2><p>{page.materialCopy}</p><p className="material-impact-note">{page.materialNote}</p></div></div>
      </section>

      <section className="section priority-section" data-reveal>
        <div className="shell section-heading-row"><div><p className="eyebrow">{page.priorityEyebrow}</p><h2 className="section-title">{page.priorityTitle}</h2></div><p>{page.priorityIntro}</p></div>
        <div className="shell product-grid priority-product-grid">{priorityProducts.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
      </section>

      <section className="section products-section" id="products" data-reveal>
        <div className="shell section-heading-row"><div><p className="eyebrow">{page.coreEyebrow}</p><h2 className="section-title">{page.coreTitle}</h2></div><p>{page.coreIntro}</p></div>
        <div className="shell product-grid">{coreProducts.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
      </section>

      <section className="section surface-section" data-reveal>
        <div className="shell section-heading-row"><div><p className="eyebrow">{page.surfaceEyebrow}</p><h2 className="section-title">{page.surfaceTitle}</h2></div><p>{page.surfaceIntro}</p></div>
        <div className="shell product-grid product-grid-two">{surfaceProducts.map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}</div>
      </section>

      <section className="section procurement-risk-section" data-reveal>
        <div className="shell procurement-risk-layout"><div><p className="eyebrow light">{page.riskEyebrow}</p><h2>{page.riskTitle}</h2></div><div className="procurement-risk-grid">{page.risks.map(([number, title, text]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
      </section>

      <section className="section dispatch-section" id="dispatch-evidence" data-reveal>
        <div className="shell dispatch-layout">
          <div className="dispatch-copy"><p className="eyebrow">{page.dispatchEyebrow}</p><h2 className="section-title">{page.dispatchTitle}</h2><p>{page.dispatchCopy}</p></div>
          <div className="dispatch-gallery">
            <figure data-reveal><img src="/assets/company-packed-stock-1.webp" alt={page.dispatchAlt1} loading="lazy" /><figcaption>{page.dispatchCap1}</figcaption></figure>
            <figure data-reveal><img src="/assets/company-packed-stock-2.webp" alt={page.dispatchAlt2} loading="lazy" /><figcaption>{page.dispatchCap2}</figcaption></figure>
          </div>
        </div>
      </section>

      <section className="section selection-section" data-reveal>
        <div className="shell selection-layout"><div className="selection-visual"><img src="/assets/duraply-finishes.webp" alt={page.selectionAlt} loading="lazy" /></div><div className="selection-copy"><p className="eyebrow">{page.selectionEyebrow}</p><h2 className="section-title">{page.selectionTitle}</h2><ol className="selection-steps">{page.selectionSteps.map(([number, title, text]) => <li key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></div></div>
      </section>

      <section className="section process-section" data-reveal>
        <div className="shell"><p className="eyebrow light">{page.processEyebrow}</p><div className="process-heading"><h2>{page.processTitle}</h2><Link className="button button-outline-light" href={localizePath("/contact", locale)}>{page.processButton}</Link></div><div className="process-grid">{page.processSteps.map(([number, title, text]) => <article key={number} data-reveal><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div>
      </section>

      <section className="section final-cta" data-reveal>
        <div className="shell cta-panel"><div><p className="eyebrow">{page.ctaEyebrow}</p><h2>{page.ctaTitle}</h2></div><Link className="button button-primary" href={localizePath("/contact", locale)}>{page.ctaButton}</Link></div>
      </section>
    </main>
  );
}
