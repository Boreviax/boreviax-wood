import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuoteForm } from "../../components/QuoteForm";
import { isLocalizedLocale } from "../../i18n/config";

type PageProps = { params: Promise<{ locale: string }> };

const whatsappContacts = [
  { display: "+86 158 6690 2023", link: "8615866902023" },
  { display: "+86 188 5393 8376", link: "8618853938376" },
  { display: "+86 135 8397 2961", link: "8613583972961" },
];

const copy = {
  ms: {
    title: "Minta Sebut Harga",
    description:
      "Hantar RFQ bahan papan yang lengkap kepada Boreviax melalui WhatsApp atau e-mel.",
    eyebrow: "Minta sebut harga",
    heading: "Enam maklumat menghasilkan RFQ yang lebih tepat.",
    intro:
      "Kongsikan produk, saiz, kuantiti, destinasi, aplikasi dan tarikh diperlukan. Kami akan menyelaraskan butiran teknikal yang belum lengkap.",
    direct: "Maklum balas terus",
    choose: "Pilih WhatsApp atau e-mel.",
    note:
      "Borang ini menyediakan mesej berstruktur pada peranti anda. Tiada pertanyaan dihantar sehingga anda mengesahkannya dalam WhatsApp atau aplikasi e-mel.",
    email: "E-mel",
  },
  ar: {
    title: "طلب عرض سعر",
    description:
      "أرسل إلى Boreviax طلب عرض سعر متكاملًا لمواد الألواح عبر WhatsApp أو البريد الإلكتروني.",
    eyebrow: "طلب عرض سعر",
    heading: "ستة بنود تجعل طلب السعر أكثر دقة.",
    intro:
      "شارك المنتج والمقاس والكمية والوجهة والاستخدام والتاريخ المطلوب، وسننسق التفاصيل الفنية الناقصة.",
    direct: "استجابة مباشرة",
    choose: "اختر WhatsApp أو البريد الإلكتروني.",
    note:
      "يُعد النموذج رسالة منظمة على جهازك، ولا يُرسل أي استفسار حتى تؤكده في WhatsApp أو تطبيق البريد الإلكتروني.",
    email: "البريد الإلكتروني",
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
      canonical: `/${locale}/contact`,
      languages: {
        en: "/contact",
        "ms-MY": "/ms/contact",
        ar: "/ar/contact",
      },
    },
  };
}

export default async function LocalizedContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const page = copy[locale];

  return (
    <main>
      <section className="page-hero contact-hero">
        <div className="shell contact-hero-grid">
          <div>
            <p className="eyebrow light">{page.eyebrow}</p>
            <h1>{page.heading}</h1>
          </div>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="shell quote-layout">
          <div className="quote-copy">
            <p className="eyebrow">{page.direct}</p>
            <h2 className="section-title">{page.choose}</h2>
            <p>{page.note}</p>
            <div className="direct-contacts">
              <a href="mailto:sales@boreviax.com">
                <span>{page.email}</span>
                <strong>sales@boreviax.com</strong>
              </a>
              {whatsappContacts.map((contact, index) => (
                <a
                  key={contact.link}
                  href={`https://wa.me/${contact.link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>WhatsApp {index + 1}</span>
                  <strong>{contact.display}</strong>
                </a>
              ))}
            </div>
          </div>
          <QuoteForm locale={locale} />
        </div>
      </section>
    </main>
  );
}
