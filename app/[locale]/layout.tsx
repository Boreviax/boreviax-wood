import { notFound } from "next/navigation";
import {
  isLocalizedLocale,
  localizedLocales,
} from "../i18n/config";

export const dynamicParams = false;

export function generateStaticParams() {
  return localizedLocales.map((locale) => ({ locale }));
}

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocalizedLocale(locale)) {
    notFound();
  }

  return (
    <div
      className="localized-site"
      lang={locale === "ms" ? "ms-MY" : "ar"}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {children}
    </div>
  );
}
