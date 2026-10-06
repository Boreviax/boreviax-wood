import type { Product } from "../data/products";
import { categoryCopy, productCategories } from "../data/categories";
import type { Locale } from "../i18n/config";
import { ProductCard } from "./ProductCard";

export function ProductCatalogue({ products, locale = "en" }: { products: Product[]; locale?: Locale }) {
  const copy = categoryCopy[locale];
  return (
    <>
      <nav className="category-navigation shell" aria-label={copy.navigation}>
        {productCategories.map((category, index) => (
          <a href={`#${category.id}`} key={category.id}>
            {copy.categories[index].title}
            <span>{category.slugs.length}</span>
          </a>
        ))}
      </nav>
      {productCategories.map((category, index) => (
        <section className={`section product-category-section${category.slugs.length === 1 ? " is-single-category" : ""}`} id={category.id} key={category.id}>
          <div className="shell">
            <div className="section-heading-row" data-reveal>
              <div><p className="eyebrow">{String(index + 1).padStart(2, "0")}</p><h2 className="section-title">{copy.categories[index].title}</h2></div>
              <p>{copy.categories[index].intro}</p>
            </div>
            <div className="product-grid">
              {products.filter((product) => (category.slugs as readonly string[]).includes(product.slug)).map((product) => (
                <ProductCard key={product.slug} product={product} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
