import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="shell">
        <p className="eyebrow">404</p>
        <h1>This panel page was not found.</h1>
        <p>Return to the product range or start a new quotation request.</p>
        <div className="hero-actions">
          <Link className="button button-primary" href="/products">
            View products
          </Link>
          <Link className="button button-secondary" href="/contact">
            Request a quote
          </Link>
        </div>
      </div>
    </main>
  );
}
