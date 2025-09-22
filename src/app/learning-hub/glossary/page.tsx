"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Example glossary terms (can expand later)
const glossaryData = [
  { term: "Manifest", definition: "A document listing cargo, passengers, and other details for transportation." },
  { term: "Bill of Lading", definition: "A legal document issued by a carrier to acknowledge receipt of cargo for shipment." },
  { term: "Waybill", definition: "A document prepared by a carrier with details of the shipment, route, and consignee." },
  { term: "Consignee", definition: "The person or company to whom goods are delivered." },
  { term: "Demurrage", definition: "Charges payable to the owner of a chartered ship on failure to load or discharge the ship within the agreed time." },
];

export default function GlossaryPage() {
  const [search, setSearch] = useState("");

  const filtered = glossaryData.filter((item) =>
    item.term.toLowerCase().includes(search.toLowerCase()) ||
    item.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Glossary</h1>
        <p className="text-gray-300">
          Quick definitions of common cargo and shipping terms.
        </p>
      </div>

      {/* Search Bar */}
      <div>
        <Input
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white text-black border border-[#063064]"
        />
      </div>

      {/* Glossary List */}
      <div className="space-y-4">
        {filtered.map((item, index) => (
          <Card
            key={index}
            className="bg-gradient-to-r from-[#1e293b] to-[#0f172a] text-white border border-[#063064]"
          >
            <CardHeader>
              <CardTitle className="text-lg">{item.term}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{item.definition}</p>
            </CardContent>
          </Card>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-400 text-center">No terms found.</p>
        )}
      </div>
    </div>
  );
}