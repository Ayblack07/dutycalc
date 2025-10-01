"use client";

import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary to-secondary py-24 px-6 text-center text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Professional Customs <span className="text-[#F6F7F9]">Duty Calculator</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-100 max-w-2xl mx-auto">
          Accurate duty calculations, tariff lookup, manifest checking, and
          comprehensive trade resources for Nigerian import/export operations.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/calculator"
            className="bg-[#1B8B77] hover:bg-[#09607B] text-white font-semibold px-6 py-3 rounded-lg shadow-md transition"
          >
            Start Calculating
          </Link>
          <Link
            href="/tariff"
            className="bg-white text-[#09607B] border border-[#1B8B77] font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-[#F6F7F9] transition"
          >
            Learn More
          </Link>
        </div>
      </div>
    </header>
  );
}