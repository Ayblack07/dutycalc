import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";

// ✅ Global site-wide SEO metadata
export const metadata: Metadata = {
  title: {
    default: "DutyCalc",
    template: "%s | DutyCalc",
  },
  description:
    "Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations.",
  metadataBase: new URL("https://dutycalc.ng"),
  openGraph: {
    type: "website",
    url: "https://dutycalc.ng",
    title: "DutyCalc",
    description:
      "Accurate duty calculations, tariff lookup, manifest checker, and exchange rates for Nigeria imports & exports.",
    siteName: "DutyCalc",
  },
  twitter: {
    card: "summary_large_image",
    title: "DutyCalc",
    description:
      "Accurate duty calculations, tariff lookup, manifest checker, and exchange rates for Nigeria imports & exports.",
  },
  robots: {
    index: true,
    follow: true,
  },

  // ✅ Add favicon/logo here
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-32x32.png", // High-res tab bar icon
    apple: "/apple-touch-icon.png", // iOS/iPadOS home screen icon
  },
  manifest: "/site.webmanifest", // For PWA support
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F6F7F9] text-gray-800">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}