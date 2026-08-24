import Link from "next/link";

const whatsappContacts = [
  { display: "+86 158 6690 2023", link: "8615866902023" },
  { display: "+86 188 5393 8376", link: "8618853938376" },
  { display: "+86 135 8397 2961", link: "8613583972961" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img
            src="/assets/boreviax-panels-logo.png"
            alt="Boreviax Materials Inc."
          />
          <p>
            International sales, specification coordination and delivery
            support for plywood, furniture panels, WPC and acoustic surfaces.
          </p>
        </div>

        <div>
          <p className="footer-heading">Navigate</p>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/products">Products</Link>
            <Link href="/about">About Boreviax</Link>
            <Link href="/contact">Request a Quote</Link>
            <a href="https://www.boreviax.com">Boreviax main site</a>
          </div>
        </div>

        <div>
          <p className="footer-heading">Contact</p>
          <div className="footer-links">
            <a href="mailto:sales@boreviax.com">sales@boreviax.com</a>
            {whatsappContacts.map((contact) => (
              <a
                key={contact.link}
                href={`https://wa.me/${contact.link}`}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp {contact.display}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>© {new Date().getFullYear()} Boreviax Materials Inc.</span>
        <span>Vancouver · Linyi · International supply support</span>
      </div>
    </footer>
  );
}
