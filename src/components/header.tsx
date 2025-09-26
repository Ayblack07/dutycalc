"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-slate-50 py-20 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
          Simplify Your Customs Duties
        </h1>
        <p className="text-lg md:text-xl text-slate-600 mb-8">
          Use our calculator and tools to estimate tariffs, check manifests, and
          stay updated with the latest trade news.
        </p>
        <Button
          size="lg"
          className="bg-primary text-black hover:bg-yellow-400 font-semibold px-8 py-4 rounded-xl shadow-soft"
        >
          Try the Calculator
        </Button>
      </div>
    </header>
  );
}