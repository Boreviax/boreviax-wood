import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCatalogue } from "../../components/ProductCatalogue";
import { isLocalizedLocale } from "../../i18n/config";
import { getLocalizedProducts } from "../../i18n/products";

type PageProps = { params: Promise<{ locale: string }> };

const copy = {
  ms: {
    title: "Produk",
    description:
      "Terokai papan lapis dan papan teras, laminat HPL, filem PET dan PVC, WPC luaran serta panel akustik Boreviax.",
    eyebrow: "Rangkaian produk Boreviax",
    heading: "Cari bahan untuk aplikasi anda.",
    intro:
      "Lihat papan teras, permukaan hiasan, WPC luaran dan panel akustik. Kemudian padankan binaan serta kemasan dengan projek anda.",
  },
  ar: {
    title: "المنتجات",
    description:
      "استكشف الخشب الرقائقي وألواح الأساس ولامينيت HPL وأفلام PET وPVC وWPC الخارجي والألواح الصوتية من Boreviax.",
    eyebrow: "مجموعة منتجات Boreviax",
    heading: "اعثر على المادة المناسبة لاستخدامك.",
    intro:
      "تصفح ألواح الأساس والأسطح الزخرفية وWPC الخارجي والألواح الصوتية، ثم طابق التركيب والتشطيب مع مشروعك.",
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

      <ProductCatalogue products={products} locale={locale} />
    </main>
  );
}
