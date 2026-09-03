"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  commonCopy,
  localeFromPathname,
  localizePath,
} from "../i18n/config";

const whatsappContacts = [
  { display: "+86 158 6690 2023", link: "8615866902023" },
  { display: "+86 188 5393 8376", link: "8618853938376" },
  { display: "+86 135 8397 2961", link: "8613583972961" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = commonCopy[locale];

  return (
    <footer className="site-footer" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <div className="shell footer-grid">
        <div className="footer-brand">
          <img
            src="/assets/boreviax-panels-logo.png"
            alt="Boreviax Materials Inc."
          />
          <p>{copy.footer.description}</p>
        </div>

        <div>
          <p className="footer-heading">{copy.footer.navigate}</p>
          <div className="footer-links">
            <Link href={localizePath("/", locale)}>{copy.nav.home}</Link>
            <Link href={localizePath("/products", locale)}>{copy.nav.products}</Link>
            <Link href={localizePath("/about", locale)}>{copy.footer.about}</Link>
            <Link href={localizePath("/contact", locale)}>{copy.nav.quote}</Link>
            <a href="https://www.boreviax.com">{copy.footer.mainSite}</a>
          </div>
        </div>

        <div>
          <p className="footer-heading">{copy.footer.contact}</p>
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
        <span>{copy.footer.location}</span>
      </div>
    </footer>
  );
}
