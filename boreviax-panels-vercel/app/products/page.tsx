import type { Metadata } from "next";
import { ProductCatalogue } from "../components/ProductCatalogue";
import { products } from "../data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Boreviax plywood and core boards, HPL decorative laminate, PET and PVC films, exterior WPC and acoustic panels.",
  alternates: {
    canonical: "/products",
    languages: {
      en: "/products",
      "ms-MY": "/ms/products",
      ar: "/ar/products",
    },
  },
};

export default function ProductsPage() {
  return (
    <main>
      <section className="page-hero compact-hero" data-reveal>
        <div className="shell">
          <p className="eyebrow light">Boreviax product range</p>
          <h1>Find the material for your application.</h1>
          <p>
            Browse core boards, decorative surfaces, exterior WPC and acoustic
            panels. Then match the construction and finish to your project.
          </p>
        </div>
      </section>

      <ProductCatalogue products={products} />
    </main>
  );
}
