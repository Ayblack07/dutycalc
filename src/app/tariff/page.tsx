import TariffPageClient from "./TariffPageClient";

export const metadata = {
  title: "Tariff Lookup - DutyCalc",
  description:
    "Find accurate Nigeria Customs tariffs by HS code or product name with DutyCalc’s powerful lookup tool.",
  alternates: {
    canonical: "https://dutycalc.ng/tariff",
  },
  openGraph: {
    title: "Tariff Lookup - DutyCalc",
    description:
      "Find accurate Nigeria Customs tariffs by HS code or product name with DutyCalc’s powerful lookup tool.",
    url: "https://dutycalc.ng/tariff",
    siteName: "DutyCalc",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tariff Lookup - DutyCalc",
    description:
      "Search Nigeria Customs tariffs by HS code or product name using DutyCalc’s easy lookup tool.",
  },
};

export default function TariffPage() {
  return <TariffPageClient />;
}