import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import type { Metadata } from "next";

// ✅ Add global site-wide SEO metadata here
export const metadata: Metadata = {
  title: {
    default: "DutyCalc – Nigeria Customs Duty Calculator",
    template: "%s | DutyCalc",
  },
  description:
    "Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations.",
  metadataBase: new URL("https://dutycalc.ng"),
  openGraph: {
    type: "website",
    url: "https://dutycalc.ng",
    title: "DutyCalc Pro – Nigeria Customs Duty Calculator",
    description:
      "Accurate duty calculations, tariff lookup, manifest checker, and exchange rates for Nigeria imports & exports.",
    siteName: "DutyCalc Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "DutyCalc – Nigeria Customs Duty Calculator",
    description:
      "Accurate duty calculations, tariff lookup, manifest checker, and exchange rates for Nigeria imports & exports.",
  },
  robots: {
    index: true,
    follow: true,
  },
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