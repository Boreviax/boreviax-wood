import Link from "next/link";
import { getSurfaceDecors, surfaceContent, surfaceCopy, type SurfaceSlug } from "../data/surfaces";
import { localizePath, type Locale } from "../i18n/config";
import { SurfaceCatalogue } from "./SurfaceCatalogue";

export function SurfaceProductPage({ slug, locale = "en" }: { slug: SurfaceSlug; locale?: Locale }) {
  const product = surfaceContent[locale][slug];
  const copy = surfaceCopy[locale];
  const decors = getSurfaceDecors(slug);
  const groups = Array.from(new Set(decors.map((decor) => decor.group)));
  const highlights = groups.slice(0, 3).map((group) => decors.find((decor) => decor.group === group)!);
  return (
    <main>
      <section className="product-hero surface-product-hero" data-reveal>
        <div className="shell product-hero-grid">
          <div className="product-hero-copy">
            <Link className="back-link" href={localizePath("/products#decorative-surfaces", locale)}><span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span> {copy.category}</Link>
            <p className="eyebrow">{copy.collection}</p><h1>{product.name}</h1><p>{product.description}</p>
            <div className="hero-actions"><a className="button button-primary" href="#quote">{copy.sample}</a><a className="button button-secondary" href="#decors">{copy.viewDecors}</a></div>
            <a className="text-link surface-download" href="/catalogues/boreviax-surface-collection.pdf" download>{copy.download} <span aria-hidden="true">↓</span></a>
          </div>
          <figure className="product-hero-image"><img src={`/assets/surfaces/${slug}-hero.webp`} alt={product.name} width={1361} height={1150} /></figure>
        </div>
      </section>

      <section className="decision-strip" data-reveal><div className="shell"><strong>{copy.material}</strong><p>{product.focus}</p></div></section>

      <section className="section surface-material-section" data-reveal>
        <div className="shell">
          <div className="section-heading-row"><div><p className="eyebrow">{copy.material}</p><h2 className="section-title">{product.detailTitle}</h2></div><p>{product.detailIntro}</p></div>
          <div className="surface-feature-grid">
            {product.points.map((point, index) => <article key={point.title} data-reveal><figure><img src={highlights[index].image} alt={highlights[index].name} width={highlights[index].width} height={highlights[index].height} loading="lazy" /><figcaption><bdi dir="ltr">{highlights[index].name}</bdi></figcaption></figure><div><h3>{point.title}</h3><p>{point.text}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="section applications-section" data-reveal>
        <div className={`shell ${slug === "hpl" ? "surface-applications-grid" : "applications-layout"}`}>
          <div><p className="eyebrow light">{copy.applications}</p><h2>{copy.applicationsTitle}</h2>{slug === "hpl" ? <img className="surface-interior-photo" src="/assets/surfaces/hpl-interior.webp" alt={`${product.name} — ${copy.applications}`} width={1417} height={1010} loading="lazy" /> : null}</div>
          <div className="application-list">{product.applications.map((application, index) => <div key={application}><span>{String(index + 1).padStart(2, "0")}</span><p>{application}</p></div>)}</div>
        </div>
      </section>

      <section className="section surface-specification" data-reveal>
        <div className="shell specification-layout">
          <div><p className="eyebrow">{copy.beforeOrder}</p><h2 className="section-title">{copy.quoteEyebrow}</h2><p className="specification-intro">{product.note}</p></div>
          <ol className="surface-order-checks">{product.checks.map((check) => <li key={check}>{check}</li>)}</ol>
        </div>
      </section>
      <SurfaceCatalogue decors={decors} productName={product.name} locale={locale} />
    </main>
  );
}
