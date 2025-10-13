import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";
import Script from "next/script";

// ✅ Global site-wide SEO metadata
export const metadata: Metadata = {
  title: {
    default: "DutyCalc",
    template: "%s | DutyCalc",
  },
  description:
    "Accurate Nigeria Customs duty calculator, Duty calculator, tariff lookup, check manifest, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations.",
  metadataBase: new URL("https://dutycalc.ng"),
  openGraph: {
    type: "website",
    url: "https://dutycalc.ng",
    title: "DutyCalc",
    description:
      "Accurate duty calculations, tariff lookup, check manifest, duty calculator, manifest checker, and exchange rates for Nigeria imports & exports.",
    siteName: "DutyCalc",
    images: [
      {
        url: "https://dutycalc.ng/og-image.png",
        width: 1200,
        height: 630,
        alt: "DutyCalc – Nigeria Customs Duty Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DutyCalc",
    description:
      "Accurate duty calculations, tariff lookup, manifest checker, and exchange rates for Nigeria imports & exports.",
    images: ["https://dutycalc.ng/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {/* ✅ Structured Data for Google */}
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DutyCalc.ng",
              url: "https://dutycalc.ng",
              logo: "https://dutycalc.ng/apple-touch-icon.png",
              sameAs: [
                "https://www.facebook.com/dutycalc",
                "https://www.twitter.com/dutycalc",
                "https://www.linkedin.com/company/dutycalc",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+234-000-000-0000",
                contactType: "customer support",
                areaServed: "NG",
                availableLanguage: "English",
              },
            }),
          }}
        />

        {/* ✅ Website Schema (helps with site links) */}
        <Script
          id="website-schema"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DutyCalc",
              url: "https://dutycalc.ng",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://dutycalc.ng/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>

      <body className="bg-[#F6F7F9] text-gray-800 antialiased">
        <Navbar />
        <main className="min-h-screen" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}