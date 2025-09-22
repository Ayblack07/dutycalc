// src/app/page.tsx
"use client";
import Link from "next/link";
import { Calculator, Search, FileText, BookOpen} from "lucide-react";

export default function HomePage() {
  return (
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

      {/* Highlights Section */}
      <section className="bg-black py-16 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-3xl font-bold text-[#0066E6]">99.9%</h3>
          <p className="text-gray-400">Calculation Accuracy</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#F7D234]">10,000+</h3>
          <p className="text-gray-400">HS Codes Database</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-green-500">24/7</h3>
          <p className="text-gray-400">Real-time Updates</p>
        </div>
      </section>
      {/* News Section */}
<section className="container mx-auto px-6 py-16">
  <h2 className="text-3xl font-bold text-white mb-8">Latest News</h2>
  <div className="grid md:grid-cols-3 gap-6">
    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-lg">
      <h3 className="font-semibold text-lg text-[#F7D234]">
        Nigeria Customs Updates Import Duty Rates for 2024
      </h3>
      <p className="text-sm text-gray-400 mt-2">
        The Nigeria Customs Service has updated its import duty rates in line
        with global market changes...
      </p>
      <Link
        href="/news"
        className="text-[#0066E6] font-medium mt-3 inline-block hover:underline"
      >
        Read More →
      </Link>
    </div>

    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-lg">
      <h3 className="font-semibold text-lg text-[#F7D234]">
        New HS Codes Introduced for Agricultural Products
      </h3>
      <p className="text-sm text-gray-400 mt-2">
        Traders importing agricultural goods should take note of new HS codes
        that came into effect this month...
      </p>
      <Link
        href="/news"
        className="text-[#0066E6] font-medium mt-3 inline-block hover:underline"
      >
        Read More →
      </Link>
    </div>

    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-lg">
      <h3 className="font-semibold text-lg text-[#F7D234]">
        Customs Duty E-Payment Now Mandatory at Ports
      </h3>
      <p className="text-sm text-gray-400 mt-2">
        The Nigeria Customs Service has announced that all duty payments must
        now be processed electronically...
      </p>
      <Link
        href="/news"
        className="text-[#0066E6] font-medium mt-3 inline-block hover:underline"
      >
        Read More →
      </Link>
    </div>
  </div>
</section>

      {/* Feature Cards */}
<section className="bg-[#0D0E10] py-20 px-6">
  <h2 className="text-3xl font-bold text-white text-center mb-12">
    Complete Trade Platform
  </h2>
  <p className="text-gray-400 text-center mb-12">
    Everything you need for successful import/export operations in Nigeria
  </p>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
    {/* Duty Calculator */}
    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#0066E6]/20 text-[#0066E6] mx-auto">
        <Calculator size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">Duty Calculator</h3>
      <p className="text-gray-400 mb-4 text-center">
        Accurate customs duty calculations with real-time exchange rates.
      </p>
      <div className="text-center">
        <Link
          href="/calculator"
          className="text-[#F7D234] font-semibold hover:underline"
        >
          Explore Duty Calculator →
        </Link>
      </div>
    </div>

    {/* Tariff Lookup */}
    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#F7D234]/20 text-[#F7D234] mx-auto">
        <Search size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">Tariff Lookup</h3>
      <p className="text-gray-400 mb-4 text-center">
        Search HS codes and tariff classifications with a full database.
      </p>
      <div className="text-center">
        <Link
          href="/tariff"
          className="text-[#F7D234] font-semibold hover:underline"
        >
          Explore Tariff Lookup →
        </Link>
      </div>
    </div>

    {/* Manifest Check */}
    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-green-500/20 text-green-500 mx-auto">
        <FileText size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">Manifest Check</h3>
      <p className="text-gray-400 mb-4 text-center">
        Verify Bill of Lading and Airway Bill details for documentation.
      </p>
      <div className="text-center">
        <Link
          href="/manifest"
          className="text-[#F7D234] font-semibold hover:underline"
        >
          Explore Manifest Check →
        </Link>
      </div>
    </div>

    {/* Learning Hub */}
    <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
      <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-purple-500/20 text-purple-500 mx-auto">
        <BookOpen size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-2 text-center">Learning Hub</h3>
      <p className="text-gray-400 mb-4 text-center">
        Comprehensive guides, tutorials, and glossaries for trade ops.
      </p>
      <div className="text-center">
        <Link
          href="/learning"
          className="text-[#F7D234] font-semibold hover:underline"
        >
          Explore Learning Hub →
        </Link>
      </div>
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-[#090A0B] to-[#0066E6] text-center py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Ready to Streamline Your Operations?
        </h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Join thousands of customs professionals who trust DutyCalc Pro for
          accurate calculations and comprehensive trade support.
        </p>
        <Link
          href="/calculator"
          className="bg-[#F7D234] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4D465] transition"
        >
          Get Started Now
        </Link>
      </section>
    </main>
  );
}