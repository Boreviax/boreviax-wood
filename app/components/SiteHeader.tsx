"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  commonCopy,
  languageLabels,
  localeFromPathname,
  localizePath,
  type Locale,
} from "../i18n/config";

const languageOrder: Locale[] = ["en", "ms", "ar"];

export function SiteHeader() {
  const pathname = usePathname();
  const locale = localeFromPathname(pathname);
  const copy = commonCopy[locale];
  const direction = locale === "ar" ? "rtl" : "ltr";
  const links = [
    { href: "/", label: copy.nav.home },
    { href: "/products", label: copy.nav.products },
    { href: "/about", label: copy.nav.about },
    { href: "/contact", label: copy.nav.quote },
  ];

  useEffect(() => {
    document.documentElement.lang = locale === "ms" ? "ms-MY" : locale;
    document.documentElement.dir = direction;
  }, [direction, locale]);

  return (
    <header className="site-header" lang={locale} dir={direction}>
      <div className="shell header-inner">
        <Link
          href={localizePath("/", locale)}
          className="brand"
          aria-label={`Boreviax Panels — ${copy.nav.home}`}
        >
          <img
            src="/assets/boreviax-panels-logo.png"
            alt="Boreviax Materials Inc."
          />
        </Link>

        <nav className="desktop-nav" aria-label={copy.nav.primary}>
          {links.map((link) => (
            <Link key={link.href} href={localizePath(link.href, locale)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <details className="language-menu">
          <summary aria-label={copy.nav.language}>
            <span aria-hidden="true">◎</span>
            {languageLabels[locale]}
          </summary>
          <div>
            {languageOrder.map((language) => (
              <Link
                key={language}
                href={localizePath(pathname, language)}
                hrefLang={language === "ms" ? "ms-MY" : language}
                aria-current={language === locale ? "page" : undefined}
              >
                {languageLabels[language]}
              </Link>
            ))}
          </div>
        </details>

        <details className="mobile-menu">
          <summary aria-label={copy.nav.open}>
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label={copy.nav.mobile}>
            {links.map((link) => (
              <Link key={link.href} href={localizePath(link.href, locale)}>
                {link.label}
              </Link>
            ))}
            <div className="mobile-language-links" aria-label={copy.nav.language}>
              {languageOrder.map((language) => (
                <Link
                  key={language}
                  href={localizePath(pathname, language)}
                  hrefLang={language === "ms" ? "ms-MY" : language}
                  aria-current={language === locale ? "page" : undefined}
                >
                  {languageLabels[language]}
                </Link>
              ))}
            </div>
          </nav>
        </details>
      </div>
    </header>
  );
}
