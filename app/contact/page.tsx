import type { Metadata } from "next";
import { QuoteForm } from "../components/QuoteForm";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send Boreviax a complete board-material RFQ by WhatsApp or email.",
  alternates: {
    canonical: "/contact",
    languages: { en: "/contact", "ms-MY": "/ms/contact", ar: "/ar/contact" },
  },
};

const whatsappContacts = [
  { display: "+86 158 6690 2023", link: "8615866902023" },
  { display: "+86 188 5393 8376", link: "8618853938376" },
  { display: "+86 135 8397 2961", link: "8613583972961" },
];

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero contact-hero">
        <div className="shell contact-hero-grid">
          <div>
            <p className="eyebrow light">Request a quote</p>
            <h1>Six fields create a better RFQ.</h1>
          </div>
          <p>
            Share the product, size, quantity, destination, application and
            required date. We will coordinate the missing technical details.
          </p>
        </div>
      </section>

      <section className="section contact-section">
        <div className="shell quote-layout">
          <div className="quote-copy">
            <p className="eyebrow">Direct response</p>
            <h2 className="section-title">Choose WhatsApp or email.</h2>
            <p>
              The form prepares a structured message on your device. No enquiry
              is sent until you confirm it in WhatsApp or your email app.
            </p>
            <div className="direct-contacts">
              <a href="mailto:sales@boreviax.com">
                <span>Email</span>
                <strong>sales@boreviax.com</strong>
              </a>
              {whatsappContacts.map((contact, index) => (
                <a
                  key={contact.link}
                  href={`https://wa.me/${contact.link}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>WhatsApp {index + 1}</span>
                  <strong>{contact.display}</strong>
                </a>
              ))}
            </div>
          </div>
          <QuoteForm />
        </div>
      </section>
    </main>
  );
}
