import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuoteForm } from "../../components/QuoteForm";
import { getProduct, products } from "../../data/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    return { title: "Product not found" };
  }

  return {
    title: product.fullName
      ? `${product.name} — ${product.fullName}`
      : product.name,
    description: product.short,
    openGraph: {
      title: product.fullName
        ? `${product.name} — ${product.fullName}`
        : product.name,
      description: product.short,
      images: [{ url: product.hero }],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <section className="product-hero" data-reveal>
        <div className="shell product-hero-grid">
          <div className="product-hero-copy">
            <Link className="back-link" href="/products">
              ← All products
            </Link>
            <p className="eyebrow">{product.category}</p>
            <h1>{product.name}</h1>
            {product.fullName ? <h2>{product.fullName}</h2> : null}
            <p>{product.description}</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#quote">
                Request this product
              </a>
              <a
                className="button button-secondary"
                href="mailto:sales@boreviax.com"
              >
                Email sales
              </a>
            </div>
          </div>
          <figure className="product-hero-image">
            <img src={product.hero} alt={product.name} />
            {product.heroCaption ? (
              <figcaption>{product.heroCaption}</figcaption>
            ) : null}
          </figure>
        </div>
      </section>

      {product.procurementFocus ? (
        <section className="decision-strip" data-reveal>
          <div className="shell">
            <strong>Procurement focus</strong>
            <p>{product.procurementFocus}</p>
          </div>
        </section>
      ) : null}

      <section className="section specification-section" data-reveal>
        <div className="shell specification-layout">
          <div>
            <p className="eyebrow">Supplier / market reference</p>
            <h2 className="section-title">A starting specification.</h2>
            <p className="specification-intro">
              These references narrow the first conversation. The exact order
              follows the approved sample, source and project requirement.
            </p>
          </div>
          <dl className="specification-list">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {product.construction ? (
        <section className="section construction-section" data-reveal>
          <div className="shell">
            <div className="construction-heading">
              <div>
                <p className="eyebrow">Structure & process</p>
                <h2 className="section-title">
                  {product.constructionTitle ?? "Understand the build."}
                </h2>
              </div>
              {product.constructionIntro ? (
                <p>{product.constructionIntro}</p>
              ) : null}
            </div>
            <div
              className={`construction-grid${
                product.construction.some((point) => point.image)
                  ? " construction-grid-media"
                  : ""
              }`}
            >
              {product.construction.map((point, index) => (
                <article
                  key={`${point.label}-${point.title}`}
                  className={point.image ? "has-construction-image" : undefined}
                  data-reveal
                  style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                >
                  {point.image ? (
                    <figure className="construction-media">
                      <img
                        src={point.image}
                        alt={point.imageAlt ?? point.title}
                        loading="lazy"
                      />
                      {point.imageCaption ? (
                        <figcaption>{point.imageCaption}</figcaption>
                      ) : null}
                    </figure>
                  ) : null}
                  <div className="construction-card-copy">
                    <span>{point.label}</span>
                    <h3>{point.title}</h3>
                    <p>{point.copy}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.structureSpotlight ? (
        <section
          className="section structure-spotlight-section"
          id="structure-analysis"
          data-reveal
        >
          <div className="shell">
            <div className="structure-spotlight-heading">
              <div>
                <p className="eyebrow">{product.structureSpotlight.eyebrow}</p>
                <h2 className="section-title">
                  {product.structureSpotlight.title}
                </h2>
              </div>
              <p>{product.structureSpotlight.intro}</p>
            </div>

            <div className="structure-spotlight-grid">
              <figure className="structure-spotlight-visual">
                <img
                  src={product.structureSpotlight.image}
                  alt={product.structureSpotlight.imageAlt}
                  loading="lazy"
                />
                {product.structureSpotlight.note ? (
                  <figcaption>{product.structureSpotlight.note}</figcaption>
                ) : null}
              </figure>

              <div className="structure-layer-list">
                {product.structureSpotlight.layers.map((layer, index) => (
                  <article
                    key={`${layer.label}-${layer.title}`}
                    data-reveal
                    style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
                  >
                    <span>{layer.label}</span>
                    <div>
                      <h3>{layer.title}</h3>
                      <p>{layer.copy}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="structure-buyer-value">
              <div>
                <p className="eyebrow light">Procurement value</p>
                <h3>What the hybrid structure is designed to solve.</h3>
              </div>
              <ul>
                {product.structureSpotlight.buyerValue.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="section product-detail-section" data-reveal>
        <div className="shell product-detail-grid">
          <figure className="detail-image-wrap">
            <img
              src={product.detailImage}
              alt={`${product.name} construction or application detail`}
              loading="lazy"
            />
            {product.detailCaption ? (
              <figcaption>{product.detailCaption}</figcaption>
            ) : null}
          </figure>
          <div className="detail-copy">
            <p className="eyebrow">Why this construction</p>
            <h2 className="section-title">Fit the panel to the work.</h2>
            <ul className="feature-list">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            {product.variants ? (
              <div className="detail-group">
                <h3>Available families</h3>
                <div className="tag-list">
                  {product.variants.map((variant) => (
                    <span key={variant}>{variant}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {product.variantDetails ? (
        <section className="section variant-section" id="grade-guide" data-reveal>
          <div className="shell">
            <div className="variant-heading">
              <div>
                <p className="eyebrow">
                  {product.variantEyebrow ?? "Grade-by-grade guidance"}
                </p>
                <h2 className="section-title">
                  {product.variantTitle ??
                    "Specify the exact grade—not just the product family."}
                </h2>
              </div>
              <p>
                {product.variantIntro ??
                  "Select the construction that matches the finished component, service environment and evidence requirement."}
              </p>
            </div>
            <div className="variant-detail-grid">
              {product.variantDetails.map((variant, index) => (
                <article
                  className={`variant-detail-card${
                    variant.image ? " has-variant-image" : ""
                  }`}
                  key={variant.name}
                  data-reveal
                  style={{ "--reveal-delay": `${(index % 2) * 80}ms` } as CSSProperties}
                >
                  {variant.image ? (
                    <figure className="variant-media">
                      <img
                        src={variant.image}
                        alt={variant.imageAlt ?? variant.name}
                        loading="lazy"
                      />
                    </figure>
                  ) : null}
                  <span className="variant-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{variant.name}</h3>
                  <p className="variant-positioning">{variant.positioning}</p>
                  <p className="variant-construction">{variant.construction}</p>
                  <div className="variant-facts">
                    <div>
                      <h4>Best fit</h4>
                      <ul>
                        {variant.bestFor.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4>Buyer checks</h4>
                      <ul>
                        {variant.buyerChecks.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.gallery ? (
        <section
          className="section product-gallery-section"
          id="product-gallery"
          data-reveal
        >
          <div className="shell">
            <div className="gallery-heading">
              <div>
                <p className="eyebrow">
                  {product.galleryEyebrow ?? "Product evidence"}
                </p>
                <h2 className="section-title">
                  {product.galleryTitle ?? "See the profile, bend and surface."}
                </h2>
              </div>
              <p>
                {product.galleryIntro ??
                  "Real product views support the first technical discussion. The approved order sample remains the production reference."}
              </p>
            </div>
            <div
              className={
                product.galleryLayout === "rail"
                  ? "product-gallery-rail"
                  : "product-gallery-grid"
              }
              tabIndex={product.galleryLayout === "rail" ? 0 : undefined}
              aria-label={
                product.galleryLayout === "rail"
                  ? `${product.name} image gallery. Scroll horizontally to view all images.`
                  : undefined
              }
            >
              {product.gallery.map((item, index) => (
                <figure
                  key={item.src}
                  className={
                    product.galleryLayout !== "rail" &&
                    (product.gallery?.length ?? 0) > 3 &&
                    index === 0
                      ? "gallery-feature"
                      : undefined
                  }
                  data-reveal
                >
                  <img src={item.src} alt={item.alt} loading="lazy" />
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.buyerChecklist ? (
        <section className="section buyer-control-section" data-reveal>
          <div className="shell buyer-control-layout">
            <div>
              <p className="eyebrow light">Before the quotation</p>
              <h2>What a serious RFQ should define.</h2>
              <ol className="buyer-checklist">
                {product.buyerChecklist.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <p>{item}</p>
                  </li>
                ))}
              </ol>
            </div>
            <aside className="continuity-card">
              <p className="eyebrow">Supply continuity</p>
              <h3>No blanket stock promise.</h3>
              <p>
                We confirm actual inventory, raw-material readiness, production
                slot, accessories and achievable shipping date against the exact
                specification. That is more useful than an unqualified “in stock.”
              </p>
              <ul>
                <li>Approved sample and order specification</li>
                <li>Production milestones and batch checks</li>
                <li>Packing, loading and document coordination</li>
                <li>Evidence-led claim and replacement follow-up</li>
              </ul>
            </aside>
          </div>
        </section>
      ) : null}

      <section className="section applications-section" data-reveal>
        <div className="shell applications-layout">
          <div>
            <p className="eyebrow light">Typical applications</p>
            <h2>Where it earns its place.</h2>
          </div>
          <div className="application-list">
            {product.applications.map((application, index) => (
              <div key={application}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{application}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {product.referenceItems ? (
        <section className="section reference-section" data-reveal>
          <div className="shell reference-panel">
            <p className="eyebrow">Technical reference</p>
            <h2>{product.referenceTitle}</h2>
            <div className="reference-items">
              {product.referenceItems.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {product.note ? (
        <section className="evidence-note" data-reveal>
          <div className="shell">
            <strong>Order-specific evidence</strong>
            <p>{product.note}</p>
          </div>
        </section>
      ) : null}

      <section className="section product-quote" id="quote" data-reveal>
        <div className="shell quote-layout">
          <div className="quote-copy">
            <p className="eyebrow">Request a comparable quotation</p>
            <h2 className="section-title">Tell us what the panel must do.</h2>
            <p>
              Send the application, dimensions, construction, surface,
              performance target and commercial data. We will coordinate the
              unresolved details before quotation.
            </p>
          </div>
          <QuoteForm defaultProduct={product.name} />
        </div>
      </section>
    </main>
  );
}
