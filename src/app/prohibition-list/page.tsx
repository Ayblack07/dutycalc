"use client";

import { useState } from "react";

export default function ProhibitionListPage() {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Prohibition List</h1>
      <p className="text-gray-700 mb-8">
        Below is the official prohibition list for imports and exports as
        published by customs. Select a tab to view details.
      </p>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("import")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "import"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Import
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "export"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Export
        </button>
      </div>

      {/* Import Section */}
      {activeTab === "import" && (
        <section>
          <h2 className="text-2xl font-semibold text-red-700 mb-4">
            Import Prohibition List
          </h2>
          <div className="prose max-w-none text-gray-800">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Live or Dead Birds including Frozen Poultry</strong> – HS
                Codes 0105.1100 – 0105.9900, 0106.3100 – 0106.3900, 0207.1100 –
                0207.3600 and 0210.9900
              </li>
              <li>
                <strong>Pork, Beef</strong> – HS Codes 0201.1000 – 0204.5000,
                0206.1000 – 0206.9000, 0210.1000 – 0210.2000
              </li>
              <li>
                <strong>Birds Eggs</strong> – HS Code 0407.0000; excluding
                hatching eggs
              </li>
              <li>
                <strong>Refined Vegetable Oils and Fats</strong> – HS Code
                1507.1000.00 – 1516.2000.29 [but excluding refined Linseed,
                Castor and Olive oils. Crude vegetable oil are however NOT banned
                from importation]
              </li>
              <li>
                <strong>Cane or Beet Sugar...</strong> – HS Code 1701.91.1000 –
                1701.99.9000 in retail packs
              </li>
              <li>
                <strong>Cocoa Butter, Powder and Cakes</strong> – HS Codes
                1802.00.0000 – 1803.20000, 1805.001000 – 1805.00.9000,
                1806.10.0000 – 1806.20.0000 and 1804.00.0000
              </li>
              <li>
                <strong>Spaghetti/ Noodles</strong> – HS Codes 1902.1100 –
                1902.30.0000
              </li>
              <li>
                <strong>Fruit Juice in Retail Packs</strong> – HS Codes
                2009.11.0012 – 2009.11.0013 – 2009.9000.99
              </li>
              <li>
                <strong>Waters & Non-alcoholic beverages</strong> – HS Codes
                2201.1000 – 2201.90.00, 2202.10.00 – 2202.9000.99 (excl. energy
                drinks e.g. Power Horse). Beer & Stout HS Code 2203.0010.00 –
                2203.0090.00
              </li>
              <li>
                <strong>Bagged Cement</strong> – HS Code 2523.2900.22
              </li>
              <li>
                <strong>Medicaments</strong> falling under Headings 3003 and
                3004 such as: Paracetamol, Cotrimoxazole, Metronidazole,
                Chloroquine, etc. (see full list in law).
              </li>
              <li>
                <strong>Waste Pharmaceuticals</strong> – HS Code 3006.9200
              </li>
              <li>
                <strong>Mineral or Chemical Fertilisers</strong> – HS Code
                3105.10.00.00 – 3105.90.00.00 (excluding organic)
              </li>
              <li>
                <strong>Soaps and Detergents</strong> – HS Code 3401.11.1000 –
                3402.90.0000 (in retail packs only)
              </li>
              <li>
                <strong>Mosquito Repellant Coils</strong> – HS Code 3808.9110.91
              </li>
              <li>
                <strong>Rethreaded and used tyres</strong> – HS Code
                4012.2010.00 (excluding truck tyres sized 11.00 x 20 and above)
              </li>
              <li>
                <strong>Papers, Boards, Tissue & Exercise Books</strong> – HS
                Codes 4808.1000, 4819.1000, 4818.1000 – 4818.9000, 4820.2000
              </li>
              <li>
                <strong>Telephone Re-charge Cards and Vouchers</strong> – HS
                Code 4911.9990.91
              </li>
              <li>
                <strong>Carpets and other Textile Floor Coverings</strong> – HS
                Codes 5701.10.000 – 5705.00.0000
              </li>
              <li>
                <strong>Footwears, Bags and Suitcases</strong> – HS Codes
                6401.1000.11 – 6405.9000.99 and 4202.1100.10 – 4202.9900.99
              </li>
              <li>
                <strong>Hollow Glass Bottles </strong> exceeding 150ml – HS Codes
                7010.9021.29, 7010.9031.00
              </li>
              <li>
                <strong>Used Compressors / ACs / Fridges</strong> – HS Codes
                8414.3000, 8415.1000.11 – 8415.9000.99, 8418.1000.11 –
                8418.69.0000
              </li>
              <li>
                <strong>Used Motor Vehicles</strong> above 12 years – HS Codes
                8703.10.0000 – 8703.90.0000
              </li>
              <li>
                <strong>Ball Point Pens</strong> – HS Code 9608.10.0000
              </li>
              <li>
                <strong>Tomato Paste or Concentrate</strong> – HS Codes
                2002100000, 2002902000, 2002909000
              </li>
              <li>
                <strong>Goods in Schedule 4</strong>: absolutely prohibited
                items.
              </li>
            </ul>
          </div>
        </section>
      )}

      {/* Export Section (placeholder for now) */}
      {activeTab === "export" && (
        <section>
          <h2 className="text-2xl font-semibold text-green-700 mb-4">
            Export Prohibition List
          </h2>
          <p className="text-gray-700">
            Export prohibition list will be provided here. (e.g., crude oil,
            timber, wildlife products, etc.)
          </p>
        </section>
      )}
    </div>
  );
}