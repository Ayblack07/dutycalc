"use client";

import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Simplify Your Customs Duties
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Use our calculator and tools to estimate tariffs, check manifests, and
          stay updated with the latest trade news.
        </p>
        <Button size="lg">Try the Calculator</Button>
      </div>
    </header>
  );
}