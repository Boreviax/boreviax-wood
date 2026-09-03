import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteForm } from "../../../components/QuoteForm";
import {
  isLocalizedLocale,
  localizedLocales,
  localizePath,
  productPageCopy,
} from "../../../i18n/config";
import {
  getLocalizedProduct,
  getLocalizedProducts,
} from "../../../i18n/products";

type ProductPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export function generateStaticParams() {
  return localizedLocales.flatMap((locale) =>
    getLocalizedProducts(locale).map((product) => ({
      locale,
      slug: product.slug,
    })),
  );
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocalizedLocale(locale)) return {};
  const product = getLocalizedProduct(locale, slug);
  if (!product) return { title: productPageCopy[locale].notFound };
  const title = product.fullName
    ? `${product.name} — ${product.fullName}`
    : product.name;

  return {
    title,
    description: product.short,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: {
        en: `/products/${slug}`,
        "ms-MY": `/ms/products/${slug}`,
        ar: `/ar/products/${slug}`,
      },
    },
    openGraph: {
      title,
      description: product.short,
      url: `/${locale}/products/${slug}`,
      locale: locale === "ms" ? "ms_MY" : "ar",
      images: [{ url: product.hero }],
    },
  };
}

export default async function LocalizedProductPage({ params }: ProductPageProps) {
  const { locale, slug } = await params;
  if (!isLocalizedLocale(locale)) notFound();
  const product = getLocalizedProduct(locale, slug);
  if (!product) notFound();
  const page = productPageCopy[locale];

  return (
    <main>
      <section className="product-hero" data-reveal>
        <div className="shell product-hero-grid">
          <div className="product-hero-copy">
            <Link className="back-link" href={localizePath("/products", locale)}>
              <span aria-hidden="true">{locale === "ar" ? "→" : "←"}</span>{" "}
              {page.allProducts}
            </Link>
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            {product.fullName ? <h2>{product.fullName}</h2> : null}
            <p>{product.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#quote">
                {page.requestProduct}
              </a>
              <a className="button button-secondary" href="mailto:sales@boreviax.com">
                {page.emailSales}
              </a>
            </div>
          </div>
          <figure className="product-hero-image">
            <img src={product.hero} alt={product.name} />
            {product.heroCaption ? <figcaption>{product.heroCaption}</figcaption> : null}
          </figure>
        </div>
      </section>

      {product.procurementFocus ? (
        <section className="decision-strip" data-reveal>
          <div className="shell"><strong>{page.procurementFocus}</strong><p>{product.procurementFocus}</p></div>
        </section>
      ) : null}

      <section className="section specification-section" data-reveal>
        <div className="shell specification-layout">
          <div><p className="eyebrow">{page.marketReference}</p><h2 className="section-title">{page.startingSpec}</h2><p className="specification-intro">{page.specIntro}</p></div>
          <dl className="specification-list">
            {product.specs.map((spec) => <div key={spec.label}><dt>{spec.label}</dt><dd>{spec.value}</dd></div>)}
          </dl>
        </div>
      </section>

      {product.construction ? (
        <section className="section construction-section" data-reveal>
          <div className="shell">
            <div className="construction-heading"><div><p className="eyebrow">{page.structureProcess}</p><h2 className="section-title">{product.constructionTitle ?? page.understandBuild}</h2></div>{product.constructionIntro ? <p>{product.constructionIntro}</p> : null}</div>
            <div className={`construction-grid${product.construction.some((point) => point.image) ? " construction-grid-media" : ""}`}>
              {product.construction.map((point, index) => (
                <article key={`${point.label}-${point.title}`} className={point.image ? "has-construction-image" : undefined} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}>
                  {point.image ? <figure className="construction-media"><img src={point.image} alt={point.imageAlt ?? point.title} loading="lazy" />{point.imageCaption ? <figcaption>{point.imageCaption}</figcaption> : null}</figure> : null}
                  <div className="construction-card-copy"><span>{point.label}</span><h3>{point.title}</h3><p>{point.copy}</p></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.structureSpotlight ? (
        <section className="section structure-spotlight-section" id="structure-analysis" data-reveal>
          <div className="shell">
            <div className="structure-spotlight-heading"><div><p className="eyebrow">{product.structureSpotlight.eyebrow}</p><h2 className="section-title">{product.structureSpotlight.title}</h2></div><p>{product.structureSpotlight.intro}</p></div>
            <div className="structure-spotlight-grid">
              <figure className="structure-spotlight-visual"><img src={product.structureSpotlight.image} alt={product.structureSpotlight.imageAlt} loading="lazy" />{product.structureSpotlight.note ? <figcaption>{product.structureSpotlight.note}</figcaption> : null}</figure>
              <div className="structure-layer-list">{product.structureSpotlight.layers.map((layer, index) => <article key={`${layer.label}-${layer.title}`} data-reveal style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}><span>{layer.label}</span><div><h3>{layer.title}</h3><p>{layer.copy}</p></div></article>)}</div>
            </div>
            <aside className="structure-buyer-value"><div><p className="eyebrow light">{page.procurementValue}</p><h3>{page.hybridPurpose}</h3></div><ul>{product.structureSpotlight.buyerValue.map((item) => <li key={item}>{item}</li>)}</ul></aside>
          </div>
        </section>
      ) : null}

      <section className="section product-detail-section" data-reveal>
        <div className="shell product-detail-grid">
          <figure className="detail-image-wrap"><img src={product.detailImage} alt={`${product.name} — ${page.detailAlt}`} loading="lazy" />{product.detailCaption ? <figcaption>{product.detailCaption}</figcaption> : null}</figure>
          <div className="detail-copy"><p className="eyebrow">{page.constructionReason}</p><h2 className="section-title">{page.fitPanel}</h2><ul className="feature-list">{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>{product.variants ? <div className="detail-group"><h3>{page.availableFamilies}</h3><div className="tag-list">{product.variants.map((variant) => <span key={variant}>{variant}</span>)}</div></div> : null}</div>
        </div>
      </section>

      {product.variantDetails ? (
        <section className="section variant-section" id="grade-guide" data-reveal>
          <div className="shell">
            <div className="variant-heading"><div><p className="eyebrow">{product.variantEyebrow ?? page.gradeGuidance}</p><h2 className="section-title">{product.variantTitle ?? page.exactGrade}</h2></div><p>{product.variantIntro ?? page.gradeIntro}</p></div>
            <div className="variant-detail-grid">
              {product.variantDetails.map((variant, index) => (
                <article className={`variant-detail-card${variant.image ? " has-variant-image" : ""}`} key={variant.name} data-reveal style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as CSSProperties}>
                  {variant.image ? <figure className="variant-media"><img src={variant.image} alt={variant.imageAlt ?? variant.name} loading="lazy" /></figure> : null}
                  <span className="variant-number">{String(index + 1).padStart(2, "0")}</span><h3>{variant.name}</h3><p className="variant-positioning">{variant.positioning}</p><p className="variant-construction">{variant.construction}</p>
                  <div className="variant-facts"><div><h4>{page.bestFit}</h4><ul>{variant.bestFor.map((item) => <li key={item}>{item}</li>)}</ul></div><div><h4>{page.buyerChecks}</h4><ul>{variant.buyerChecks.map((item) => <li key={item}>{item}</li>)}</ul></div></div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.gallery ? (
        <section className="section product-gallery-section" id="product-gallery" data-reveal>
          <div className="shell">
            <div className="gallery-heading"><div><p className="eyebrow">{product.galleryEyebrow ?? page.productEvidence}</p><h2 className="section-title">{product.galleryTitle ?? page.seeProfile}</h2></div><p>{product.galleryIntro ?? page.galleryIntro}</p></div>
            <div className={product.galleryLayout === "rail" ? "product-gallery-rail" : "product-gallery-grid"} tabIndex={product.galleryLayout === "rail" ? 0 : undefined} aria-label={product.galleryLayout === "rail" ? `${product.name}. ${page.galleryLabel}` : undefined}>
              {product.gallery.map((item, index) => <figure key={item.src} className={product.galleryLayout !== "rail" && (product.gallery?.length ?? 0) > 3 && index === 0 ? "gallery-feature" : undefined} data-reveal><img src={item.src} alt={item.alt} loading="lazy" /><figcaption>{item.caption}</figcaption></figure>)}
            </div>
          </div>
        </section>
      ) : null}

      {product.buyerChecklist ? (
        <section className="section buyer-control-section" data-reveal>
          <div className="shell buyer-control-layout">
            <div><p className="eyebrow light">{page.beforeQuote}</p><h2>{page.seriousRfq}</h2><ol className="buyer-checklist">{product.buyerChecklist.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p></li>)}</ol></div>
            <aside className="continuity-card"><p className="eyebrow">{page.continuity}</p><h3>{page.noBlanketStock}</h3><p>{page.continuityCopy}</p><ul>{page.continuityItems.map((item) => <li key={item}>{item}</li>)}</ul></aside>
          </div>
        </section>
      ) : null}

      <section className="section applications-section" data-reveal>
        <div className="shell applications-layout"><div><p className="eyebrow light">{page.applications}</p><h2>{page.earnsPlace}</h2></div><div className="application-list">{product.applications.map((application, index) => <div key={application}><span>{String(index + 1).padStart(2, "0")}</span><p>{application}</p></div>)}</div></div>
      </section>

      {product.referenceItems ? <section className="section reference-section" data-reveal><div className="shell reference-panel"><p className="eyebrow">{page.technicalReference}</p><h2>{product.referenceTitle}</h2><div className="reference-items">{product.referenceItems.map((item) => <span key={item}>{item}</span>)}</div></div></section> : null}

      {product.note ? <section className="evidence-note" data-reveal><div className="shell"><strong>{page.orderEvidence}</strong><p>{product.note}</p></div></section> : null}

      <section className="section product-quote" id="quote" data-reveal>
        <div className="shell quote-layout"><div className="quote-copy"><p className="eyebrow">{page.comparableQuote}</p><h2 className="section-title">{page.tellUs}</h2><p>{page.quoteIntro}</p></div><QuoteForm defaultProduct={product.name} locale={locale} /></div>
      </section>
    </main>
  );
}
