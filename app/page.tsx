import Link from "next/link";
import { ProductCard } from "./components/ProductCard";
import { products } from "./data/products";

const coreProducts = products.slice(0, 7);
const surfaceProducts = products.slice(7);
const priorityProducts = products.filter((product) =>
  ["flexible-plywood", "duraply", "functional-plywood"].includes(product.slug),
);

export default function Home() {
  return (
    <main>
      <section className="home-hero" data-reveal>
        <img
          className="hero-background"
          src="/assets/hero-forest.webp"
          alt=""
          aria-hidden="true"
        />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p className="eyebrow light">
            Plywood · Furniture panels · WPC · Acoustic surfaces
          </p>
          <h1>Panel supply built to prevent production surprises.</h1>
          <p className="hero-lead">
            Boreviax aligns the panel construction, approved sample, production
            source, evidence, packing and delivery plan—so purchasing teams can
            protect quality, lead time and production continuity.
          </p>
          <div className="hero-actions">
            <Link className="button button-light" href="/products">
              Explore products
            </Link>
            <Link className="button button-outline-light" href="/contact">
              Start an RFQ
            </Link>
          </div>
          <div className="hero-facts" aria-label="Commercial references">
            <div>
              <strong>15 years</strong>
              <span>Cross-border panel trade experience</span>
            </div>
            <div>
              <strong>9 families</strong>
              <span>Panels, WPC and acoustic surfaces</span>
            </div>
            <div>
              <strong>One route</strong>
              <span>Specification to after-sales closure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section intro-section" data-reveal>
        <div className="shell split-intro">
          <div>
            <p className="eyebrow">Procurement decisions, made accountable</p>
            <h2 className="section-title">
              A panel purchase is not only a price per sheet.
            </h2>
          </div>
          <div className="intro-copy">
            <p>
              A qualified buyer needs to know whether the approved construction
              can be reproduced, whether the report matches the exact order,
              whether the promised date is achievable and who closes a claim if
              something goes wrong. Boreviax coordinates those questions through
              one international sales and service contact.
            </p>
            <Link className="text-link" href="/about">
              How Boreviax works <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="material-impact-section" data-reveal>
        <img
          className="material-impact-background"
          src="/assets/responsible-material-background.webp"
          alt="Wood-textured globe surrounded by green leaves"
          loading="lazy"
        />
        <div className="material-impact-shade" />
        <div className="shell material-impact-content">
          <div>
            <p className="eyebrow light">Responsible material decisions</p>
            <h2>Lower waste starts with the right specification.</h2>
            <p>
              Matching the construction to the application, approving a real
              production sample and controlling repeat batches can reduce rejected
              sheets, rework and premature replacement across the supply chain.
            </p>
            <p className="material-impact-note">
              Sourcing documents, emissions data and environmental claims are
              confirmed against the exact product and order—not inferred from the image.
            </p>
          </div>
        </div>
      </section>

      <section className="section priority-section" data-reveal>
        <div className="shell section-heading-row">
          <div>
            <p className="eyebrow">Priority plywood solutions</p>
            <h2 className="section-title">Three problems. Three deliberate constructions.</h2>
          </div>
          <p>
            Curved forms, finish-critical lamination and performance-led projects
            require more than a generic plywood specification.
          </p>
        </div>
        <div className="shell product-grid priority-product-grid">
          {priorityProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section products-section" id="products" data-reveal>
        <div className="shell section-heading-row">
          <div>
            <p className="eyebrow">Core panel range</p>
            <h2 className="section-title">Compare the construction, not the label.</h2>
          </div>
          <p>
            Density, veneer lay-up, surface quality, machining, moisture, fire,
            fixing strength and documented performance each change the buying decision.
          </p>
        </div>
        <div className="shell product-grid">
          {coreProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section surface-section" data-reveal>
        <div className="shell section-heading-row">
          <div>
            <p className="eyebrow">Outdoor & acoustic surfaces</p>
            <h2 className="section-title">Systems beyond the flat panel.</h2>
          </div>
          <p>
            Coordinated profiles, finishes and installation accessories for
            exterior composite projects and sound-absorbing interiors.
          </p>
        </div>
        <div className="shell product-grid product-grid-two">
          {surfaceProducts.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="section procurement-risk-section" data-reveal>
        <div className="shell procurement-risk-layout">
          <div>
            <p className="eyebrow light">What purchasing must prevent</p>
            <h2>Four risks are more expensive than the price difference.</h2>
          </div>
          <div className="procurement-risk-grid">
            {[
              [
                "01",
                "Wrong construction",
                "A cheaper board can create routing failure, warping, delamination or an unsuitable finish when the application was never defined.",
              ],
              [
                "02",
                "Unrepeatable batches",
                "The approved sample only has value when moisture, density, lay-up, colour and surface controls are carried into production.",
              ],
              [
                "03",
                "Unrealistic availability",
                "We verify real stock, raw-material readiness, production slot and accessory completeness instead of giving a blanket inventory promise.",
              ],
              [
                "04",
                "Unclosed claims",
                "Packing records, inspection evidence and one after-sales contact create a practical route for correction, replacement or claim closure.",
              ],
            ].map(([number, title, copy]) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="section dispatch-section"
        id="dispatch-evidence"
        data-reveal
      >
        <div className="shell dispatch-layout">
          <div className="dispatch-copy">
            <p className="eyebrow">Packing & dispatch coordination</p>
            <h2 className="section-title">
              Shipment readiness should be visible before the container closes.
            </h2>
            <p>
              These supplied Boreviax packing views illustrate the checks that
              sit behind dispatch: package protection, banding, batch separation,
              markings, quantity and loading readiness. Actual stock and packing
              are confirmed against each order specification.
            </p>
          </div>
          <div className="dispatch-gallery">
            <figure data-reveal>
              <img
                src="/assets/company-packed-stock-1.webp"
                alt="Boreviax-branded export panel packages arranged in a clean warehouse"
                loading="lazy"
              />
              <figcaption>
                Protective packages grouped for quantity, marking and handling checks.
              </figcaption>
            </figure>
            <figure data-reveal>
              <img
                src="/assets/company-packed-stock-2.webp"
                alt="Rows of Boreviax-branded export panel packages prepared for dispatch"
                loading="lazy"
              />
              <figcaption>
                Batch-separated packages prepared for final dispatch coordination.
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="section selection-section" data-reveal>
        <div className="shell selection-layout">
          <div className="selection-visual">
            <img
              src="/assets/duraply-finishes.webp"
              alt="Decorative panel finish samples"
              loading="lazy"
            />
          </div>
          <div className="selection-copy">
            <p className="eyebrow">Application-first selection</p>
            <h2 className="section-title">
              A comparable quotation starts with the same technical question.
            </h2>
            <ol className="selection-steps">
              <li>
                <span>01</span>
                <div>
                  <h3>Define the application</h3>
                  <p>Finished component, loading, environment, process and expected service life.</p>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <h3>Confirm the exact build</h3>
                  <p>Core, ply count, density profile, adhesive, treatment, face and finish route.</p>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <h3>Match the evidence</h3>
                  <p>Current emission, moisture, fire, structural or acoustic evidence for that build.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      </section>

      <section className="section process-section" data-reveal>
        <div className="shell">
          <p className="eyebrow light">A clearer buying process</p>
          <div className="process-heading">
            <h2>From first question to delivered order.</h2>
            <Link className="button button-outline-light" href="/contact">
              Send six RFQ fields
            </Link>
          </div>
          <div className="process-grid">
            {[
              ["01", "Specify", "Align application, construction, finish, tolerance and evidence."],
              ["02", "Confirm", "Check the production source, real availability and achievable date."],
              ["03", "Control", "Follow the approved sample, batch checks, milestones and documents."],
              ["04", "Protect", "Coordinate packing, loading, delivery and after-sales closure."],
            ].map(([number, title, copy]) => (
              <article key={number} data-reveal>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta" data-reveal>
        <div className="shell cta-panel">
          <div>
            <p className="eyebrow">Ready for a comparable quotation?</p>
            <h2>Send the board type, size, quantity, destination and required date.</h2>
          </div>
          <Link className="button button-primary" href="/contact">
            Request a quote
          </Link>
        </div>
      </section>
    </main>
  );
}
