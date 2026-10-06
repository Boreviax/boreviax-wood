import Link from "next/link";
import type { Product } from "../data/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      className="product-card"
      href={`/products/${product.slug}`}
      data-reveal
    >
      <div className="product-card-image">
        <img src={product.hero} alt={product.name} loading="lazy" />
        <span>Explore</span>
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
