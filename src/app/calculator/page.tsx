import type { Metadata } from "next";
import DutyCalculator from "@/components/DutyCalculator";

export const metadata: Metadata = {
  title: "Nigeria Customs Duty Calculator | DutyCalc",
  description:
    "Easily calculate Nigeria customs duty, import tariff, and VAT for cars and goods using DutyCalc — the most accurate and updated customs calculator in Nigeria.",
  keywords: [
    "Nigeria customs duty calculator",
    "Duty calculator",
    "Calculate duty",
    "Nigeria Duty",
    "How to calculate duty",
    "Import duty calculator",
    "import duty calculator Nigeria",
    "car import duty Nigeria",
    "customs tariff Nigeria",
    "DutyCalc",
  ],
  alternates: {
    canonical: "https://dutycalc.ng/calculator",
  },
  openGraph: {
    title: "Nigeria Customs Duty Calculator | DutyCalc",
    description:
      "Calculate customs duties, import tariffs, and VAT instantly with Nigeria’s leading customs calculator — DutyCalc.",
    url: "https://dutycalc.ng/calculator",
    siteName: "DutyCalc",
    images: [
      {
        url: "https://dutycalc.ng/og-image.png", // optional if you have one
        width: 1200,
        height: 630,
        alt: "Nigeria Customs Duty Calculator",
      },
    ],
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nigeria Customs Duty Calculator | DutyCalc",
    description:
      "Calculate customs duty and tariffs instantly with DutyCalc — accurate and up to date with Nigeria Customs rates.",
    images: ["https://dutycalc.ng/og-image.png"],
  },
};

export default function CalculatorPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <DutyCalculator />
    </main>
  );
}