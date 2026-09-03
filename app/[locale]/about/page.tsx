import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocalizedLocale, localizePath } from "../../i18n/config";

type PageProps = { params: Promise<{ locale: string }> };

const copy = {
  ms: {
    title: "Tentang Kami",
    description:
      "Ketahui cara Boreviax menyelaras spesifikasi panel, sumber pengeluaran, susulan kualiti, eksport dan sokongan selepas jualan.",
    heroEyebrow: "Tentang Boreviax Panels",
    heroTitle: "Satu perhubungan rentas sempadan yang bertanggungjawab.",
    heroCopy:
      "Boreviax Materials Inc. ialah syarikat jualan antarabangsa dan penyelarasan projek—bukan sebuah kilang tunggal. Kami memadankan aplikasi dengan sumber pengeluaran terpilih dan kekal bertanggungjawab terhadap proses komersial serta penghantaran.",
    needEyebrow: "Keperluan sebenar pembeli",
    needTitle: "Proses yang boleh dipercayai sama penting dengan panel itu sendiri.",
    story: [
      "Penerangan produk bukanlah spesifikasi pesanan. Spesies teras, ketumpatan, pelekat, kualiti muka, toleransi, laluan kemasan dan bukti ujian boleh mengubah hasil walaupun dua sebut harga menggunakan nama produk yang sama.",
      "Pasukan kami membawa pengalaman 15 tahun dalam perdagangan panel rentas sempadan. Kami menukar tujuan penggunaan pembeli kepada RFQ yang boleh dibandingkan, menyelaras sumber bekalan yang sesuai dan mengikuti pesanan melalui pengeluaran, dokumentasi, pembungkusan, penghantaran serta perkhidmatan selepas jualan.",
    ],
    responsibility: "Tanggungjawab kami",
    responsibilities: [
      ["01", "Penyelarasan spesifikasi", "Jelaskan aplikasi, dimensi, binaan, permukaan, kemasan dan bukti."],
      ["02", "Sumber & ketersediaan", "Padankan keperluan dengan sumber yang sesuai dan sahkan stok sebenar, kesiapsiagaan bahan mentah atau kapasiti pengeluaran."],
      ["03", "Susulan pengeluaran", "Jejaki sampel yang diluluskan, pencapaian, kuantiti, pembungkusan dan kesiapsiagaan penghantaran."],
      ["04", "Dokumentasi", "Selaraskan dokumen pematuhan, pemeriksaan dan eksport yang khusus untuk pesanan."],
      ["05", "Sokongan penghantaran", "Ikuti pencapaian logistik dan maklumkan perkembangan kepada pembeli sehingga penghantaran."],
      ["06", "Penyelesaian selepas jualan", "Selaraskan bukti, analisis punca dan penyelesaian praktikal apabila berlaku masalah."],
    ],
    commercial: "Rujukan komersial",
    commercialTitle: "Maklumat yang jelas mempercepat sebut harga.",
    terms: [
      ["MOQ", "Biasanya satu kontena mengikut rujukan pembekal semasa"],
      ["Asas sebut harga", "FOB Qingdao ialah asas yang biasa digunakan"],
      ["Pembungkusan eksport", "Gelung keluli dengan kepingan pelindung MDF atau papan lapis"],
      ["Tempoh lazim", "Saiz standard biasanya dalam masa 15 hari selepas pengesahan*"],
    ],
    footnote: "*Tertakluk pada kuantiti, kemasan, dokumentasi dan jadual pengeluaran.",
    ctaEyebrow: "Ada keperluan panel?",
    ctaTitle: "Mulakan dengan aplikasi—bukan nama produk umum.",
    ctaButton: "Mulakan RFQ",
  },
  ar: {
    title: "من نحن",
    description:
      "تعرّف على كيفية تنسيق Boreviax لمواصفات الألواح ومصادر الإنتاج ومتابعة الجودة والتصدير ودعم ما بعد البيع.",
    heroEyebrow: "عن Boreviax Panels",
    heroTitle: "جهة واحدة مسؤولة عبر الحدود.",
    heroCopy:
      "Boreviax Materials Inc. شركة للمبيعات الدولية وتنسيق المشاريع، وليست مصنعًا واحدًا. نطابق الاستخدام مع مصادر إنتاج مختارة ونظل مسؤولين عن المسار التجاري وعملية التسليم.",
    needEyebrow: "ما يحتاجه المشتري فعليًا",
    needTitle: "موثوقية العملية لا تقل أهمية عن اللوح نفسه.",
    story: [
      "وصف اللوح ليس مواصفة طلب. فقد تغيّر فصيلة خشب اللب والكثافة واللاصق وجودة الوجه والتفاوت ومسار التشطيب وأدلة الاختبار النتيجة، حتى عندما يحمل عرضان الاسم نفسه للمنتج.",
      "يمتلك فريقنا خبرة 15 عامًا في تجارة الألواح عبر الحدود. نحول الاستخدام المطلوب إلى طلب سعر قابل للمقارنة، وننسق مصدر التوريد المناسب، ونتابع الطلب خلال الإنتاج والمستندات والتعبئة والشحن وخدمة ما بعد البيع.",
    ],
    responsibility: "مسؤوليتنا",
    responsibilities: [
      ["01", "مواءمة المواصفات", "توضيح الاستخدام والأبعاد والتركيب والسطح والتشطيب والأدلة."],
      ["02", "المصدر والتوفر", "مطابقة المتطلبات مع مصدر مناسب والتحقق من المخزون الفعلي أو جاهزية المواد الخام أو الطاقة الإنتاجية."],
      ["03", "متابعة الإنتاج", "متابعة العينات المعتمدة والمراحل والكمية والتعبئة وجاهزية الشحن."],
      ["04", "المستندات", "تنسيق مستندات المطابقة والفحص والتصدير الخاصة بكل طلب."],
      ["05", "دعم التسليم", "متابعة مراحل الخدمات اللوجستية وإبقاء المشتري على اطلاع حتى التسليم."],
      ["06", "إغلاق خدمات ما بعد البيع", "تنسيق الأدلة ومراجعة السبب الجذري والحل العملي عند ظهور مشكلة."],
    ],
    commercial: "مرجع تجاري",
    commercialTitle: "البيانات الواضحة تسرّع عرض السعر.",
    terms: [
      ["الحد الأدنى للطلب", "عادةً حاوية واحدة وفق مرجع المورّد الحالي"],
      ["أساس عرض السعر", "يُستخدم FOB Qingdao عادةً كأساس للسعر"],
      ["تعبئة التصدير", "أطواق فولاذية مع ألواح حماية من MDF أو الخشب الرقائقي"],
      ["المدة المعتادة", "المقاسات القياسية عادةً خلال 15 يومًا بعد التأكيد*"],
    ],
    footnote: "*تخضع للكمية والتشطيب والمستندات وجدول الإنتاج.",
    ctaEyebrow: "هل لديك متطلبات للألواح؟",
    ctaTitle: "ابدأ بالاستخدام، وليس باسم منتج عام.",
    ctaButton: "ابدأ طلب السعر",
  },
} as const;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) return {};
  const page = copy[locale];
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/${locale}/about`,
      languages: { en: "/about", "ms-MY": "/ms/about", ar: "/ar/about" },
    },
  };
}

export default async function LocalizedAboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const page = copy[locale];

  return (
    <main>
      <section className="page-hero about-hero" data-reveal>
        <div className="shell about-hero-grid">
          <div>
            <p className="eyebrow light">{page.heroEyebrow}</p>
            <h1>{page.heroTitle}</h1>
          </div>
          <p>{page.heroCopy}</p>
        </div>
      </section>

      <section className="section about-story" data-reveal>
        <div className="shell story-grid">
          <div>
            <p className="eyebrow">{page.needEyebrow}</p>
            <h2 className="section-title">{page.needTitle}</h2>
          </div>
          <div className="story-copy">
            {page.story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="section responsibilities-section" data-reveal>
        <div className="shell">
          <p className="eyebrow">{page.responsibility}</p>
          <div className="responsibility-grid">
            {page.responsibilities.map(([number, title, text]) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section commercial-section" data-reveal>
        <div className="shell commercial-grid">
          <div>
            <p className="eyebrow light">{page.commercial}</p>
            <h2>{page.commercialTitle}</h2>
          </div>
          <dl>
            {page.terms.map(([term, value]) => (
              <div key={term}>
                <dt>{term}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="commercial-footnote">{page.footnote}</p>
        </div>
      </section>

      <section className="section final-cta" data-reveal>
        <div className="shell cta-panel">
          <div>
            <p className="eyebrow">{page.ctaEyebrow}</p>
            <h2>{page.ctaTitle}</h2>
          </div>
          <Link className="button button-primary" href={localizePath("/contact", locale)}>
            {page.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  );
}
