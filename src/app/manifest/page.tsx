import ManifestClient from "./ManifestClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifest Checker | Nigeria Customs Manifest Lookup - DutyCalc",
  description:
    "Search and filter registered manifests by number, destination, command, and shipping line. Stay updated with the latest Nigeria Customs cargo records using DutyCalc.",
  alternates: {
    canonical: "https://dutycalc.ng/manifest",
  },
  openGraph: {
    title: "DutyCalc Manifest Checker",
    description:
      "Quickly search and view Nigerian customs manifests online using DutyCalc.",
    url: "https://dutycalc.ng/manifest",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DutyCalc Manifest Checker",
    description:
      "Nigeria Customs manifest lookup and filtering tool for air and sea cargo records.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ManifestPage() {
  return <ManifestClient />;
}