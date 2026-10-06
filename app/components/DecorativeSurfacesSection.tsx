import Link from "next/link";
import { getDecorativeProducts, surfaceCopy } from "../data/surfaces";
import { localizePath, type Locale } from "../i18n/config";
import { ProductCard } from "./ProductCard";

export function DecorativeSurfacesSection({ locale = "en" }: { locale?: Locale }) {
  const copy = surfaceCopy[locale];
  return (
    <section className="section decorative-surfaces-section" id="decorative-surfaces" data-reveal>
      <div className="shell section-heading-row">
        <div><p className="eyebrow">{copy.category}</p><h2 className="section-title">{copy.homeTitle}</h2></div>
        <p>{copy.homeIntro}</p>
      </div>
      <div className="shell product-grid">
        {getDecorativeProducts(locale).map((product) => <ProductCard key={product.slug} product={product} locale={locale} />)}
      </div>
      <div className="shell surface-collection-link"><Link className="text-link" href={localizePath("/products#decorative-surfaces", locale)}>{copy.browse} <span aria-hidden="true">↗</span></Link></div>
    </section>
  );
}
