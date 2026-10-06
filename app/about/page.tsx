import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how Boreviax coordinates panel specifications, production sources, quality follow-up, export and after-sales support.",
};

export default function AboutPage() {
  return (
    <main>
      <section className="page-hero about-hero" data-reveal>
        <div className="shell about-hero-grid">
          <div>
            <p className="eyebrow light">About Boreviax Panels</p>
            <h1>One accountable cross-border contact.</h1>
          </div>
          <p>
            Boreviax Materials Inc. is an international sales and project
            coordination company—not a single factory. We match the application
            to selected production sources and stay responsible for the
            commercial and delivery process.
          </p>
        </div>
      </section>

      <section className="section about-story" data-reveal>
        <div className="shell story-grid">
          <div>
            <p className="eyebrow">What buyers actually need</p>
            <h2 className="section-title">
              A reliable process matters as much as the sheet itself.
            </h2>
          </div>
          <div className="story-copy">
            <p>
              A panel description is not an order specification. Core species,
              density, adhesive, face quality, tolerance, finishing route and
              test evidence can change the result even when two quotations use
              the same product name.
            </p>
            <p>
              Our team brings 15 years of cross-border panel trade experience.
              We translate the buyer’s intended use into a comparable RFQ,
              coordinate the appropriate supply source and follow the order
              through production, documents, packing, shipping and after-sales.
            </p>
          </div>
        </div>
      </section>

      <section className="section responsibilities-section" data-reveal>
        <div className="shell">
          <p className="eyebrow">Our responsibility</p>
          <div className="responsibility-grid">
            {[
              ["01", "Specification alignment", "Clarify application, dimensions, construction, surface, finish and evidence."],
              ["02", "Source & availability", "Match the requirement to a suitable source and verify real stock, raw-material readiness or production capacity."],
              ["03", "Production follow-up", "Track approved samples, milestones, quantity, packing and shipment readiness."],
              ["04", "Documentation", "Coordinate order-specific compliance, inspection and export documents."],
              ["05", "Delivery support", "Follow logistics milestones and keep the buyer informed through delivery."],
              ["06", "After-sales closure", "Coordinate evidence, root-cause review and practical resolution when issues arise."],
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

      <section className="section commercial-section" data-reveal>
        <div className="shell commercial-grid">
          <div>
            <p className="eyebrow light">Commercial reference</p>
            <h2>Clear fields make faster quotations.</h2>
          </div>
          <dl>
            <div>
              <dt>MOQ</dt>
              <dd>Normally one container under the current supplier reference</dd>
            </div>
            <div>
              <dt>Quotation basis</dt>
              <dd>FOB Qingdao is the normal basis</dd>
            </div>
            <div>
              <dt>Export packing</dt>
              <dd>Steel bands with MDF or plywood protective sheets</dd>
            </div>
            <div>
              <dt>Typical lead time</dt>
              <dd>Standard sizes usually within 15 days after confirmation*</dd>
            </div>
          </dl>
          <p className="commercial-footnote">
            *Subject to quantity, finish, documentation and production schedule.
          </p>
        </div>
      </section>

      <section className="section final-cta" data-reveal>
        <div className="shell cta-panel">
          <div>
            <p className="eyebrow">Have a panel requirement?</p>
            <h2>Start with the application—not a generic product name.</h2>
          </div>
          <Link className="button button-primary" href="/contact">
            Start an RFQ
          </Link>
        </div>
      </section>
    </main>
  );
}
