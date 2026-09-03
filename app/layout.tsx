import type { Metadata } from "next";
import { MotionObserver } from "./components/MotionObserver";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://wood.boreviax.com"),
  title: {
    default: "Boreviax Panels | Plywood, MDF, WPC & Acoustic Panels",
    template: "%s | Boreviax Panels",
  },
  description:
    "International supply and specification support for plywood, MDF, particle board, FOSB, WPC and wooden slat acoustic panels.",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      "ms-MY": "/ms",
      ar: "/ar",
    },
  },
  openGraph: {
    title: "Boreviax Panels",
    description:
      "Panel materials specified around the application, finish and project requirement.",
    url: "https://wood.boreviax.com",
    siteName: "Boreviax Panels",
    images: [
      {
        url: "/assets/hero-forest.webp",
        width: 2000,
        height: 1252,
        alt: "Forest canopy representing Boreviax Panels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/assets/favicon.png",
    shortcut: "/assets/favicon.png",
    apple: "/assets/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionObserver />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
