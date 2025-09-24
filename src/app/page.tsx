"use client";
import Link from "next/link";
import Head from "next/head";
import { Calculator, Search, FileText, BookOpen, DollarSign } from "lucide-react";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools</title>
        <meta
          name="description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="DutyCalc Pro" />
        <meta property="og:title" content="DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools" />
        <meta
          property="og:description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta property="og:url" content="https://dutycalc.ng" />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#090A0B] to-[#0066E6] text-center py-24 px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Professional Customs{" "}
            <span className="text-[#F7D234]">Duty Calculator</span>
          </h1>
          <p className="mt-4 text-[#9CA3AF] max-w-2xl mx-auto">
            Accurate duty calculations, tariff lookup, manifest checking, and
            comprehensive trade resources for Nigerian import/export operations.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link
              href="/calculator"
              className="bg-[#F7D234] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4D465] transition"
            >
              Start Calculating
            </Link>
            <Link
              href="/tariff"
              className="bg-black border border-[#F7D234] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1F2937] transition"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* ✅ rest of your homepage stays unchanged */}
      </main>
    </>
  );
}