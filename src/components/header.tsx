"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-slate-100 py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-[#1E3A8A]">
          Simplify Your Customs Duties
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Use our calculator and tools to estimate tariffs, check manifests, and
          stay updated with the latest trade news.
        </p>
        <Button
          size="lg"
          className="bg-[#F59E0B] hover:bg-[#d97706] text-black font-semibold px-6 py-3 rounded-lg shadow"
        >
          Try the Calculator
        </Button>
      </div>
    </header>
  );
}