import Link from "next/link";
import type { Product } from "../data/products";
import { commonCopy, localizePath, type Locale } from "../i18n/config";

export function ProductCard({
  product,
  locale = "en",
}: {
  product: Product;
  locale?: Locale;
}) {
  return (
    <Link
      className="product-card"
      href={localizePath(`/products/${product.slug}`, locale)}
      data-reveal
    >
      <div className="product-card-image">
        <img src={product.hero} alt={product.name} loading="lazy" />
        <span>{commonCopy[locale].explore}</span>
      </div>
      <div className="product-card-copy">
        <p>{product.category}</p>
        <h3>{product.name}</h3>
        {product.fullName ? <h4>{product.fullName}</h4> : null}
        <div className="card-rule" />
        <span>{product.short}</span>
      </div>
    </Link>
  );
}
