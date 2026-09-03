import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "../../components/ProductCard";
import { isLocalizedLocale } from "../../i18n/config";
import { getLocalizedProducts } from "../../i18n/products";

type PageProps = { params: Promise<{ locale: string }> };

const copy = {
  ms: {
    title: "Produk",
    description:
      "Terokai pilihan papan lapis, MDF, papan partikel, FOSB, WPC dan panel akustik Boreviax.",
    eyebrow: "Rangkaian produk Boreviax",
    heading: "Pilih risiko yang mahu dielakkan.",
    intro:
      "Bandingkan binaan setara berdasarkan aplikasi, beban, pemesinan, persekitaran, kemasan, pelan bekalan dan bukti yang diperlukan.",
  },
  ar: {
    title: "المنتجات",
    description:
      "استكشف حلول Boreviax من الخشب الرقائقي وMDF والألواح الحبيبية وFOSB وWPC والألواح الصوتية.",
    eyebrow: "مجموعة منتجات Boreviax",
    heading: "حدّد المشكلة التي تريد تجنبها.",
    intro:
      "قارن التركيبات المتكافئة بحسب الاستخدام والحمولة والتشغيل الآلي والبيئة والتشطيب وخطة التوريد والأدلة المطلوبة.",
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
      canonical: `/${locale}/products`,
      languages: {
        en: "/products",
        "ms-MY": "/ms/products",
        ar: "/ar/products",
      },
    },
  };
}

export default async function LocalizedProductsPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const page = copy[locale];
  const products = getLocalizedProducts(locale);

  return (
    <main>
      <section className="page-hero compact-hero" data-reveal>
        <div className="shell">
          <p className="eyebrow light">{page.eyebrow}</p>
          <h1>{page.heading}</h1>
          <p>{page.intro}</p>
        </div>
      </section>

      <section className="section products-index" data-reveal>
        <div className="shell product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} locale={locale} />
          ))}
        </div>
      </section>
    </main>
  );
}
