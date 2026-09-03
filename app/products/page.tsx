import type { Metadata } from "next";
import { ProductCard } from "../components/ProductCard";
import { products } from "../data/products";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Explore Boreviax plywood, MDF, particle board, FOSB, WPC and acoustic panel solutions.",
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
          <h1>Choose the failure to prevent.</h1>
          <p>
            Compare like-for-like constructions by application, loading,
            machining, environment, finish, supply plan and required evidence.
          </p>
        </div>
      </section>

      <section className="section products-index" data-reveal>
        <div className="shell product-grid">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
