"use client";

import { useState } from "react";
import Link from "next/link";

export default function ProhibitionListPage() {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-primary text-white rounded-lg shadow-lg">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-6 text-center">Prohibition List</h1>
      <p className="mb-8 text-center text-gray-200">
        Below is the official prohibition list for imports and exports as
        published by the <link href="https://customs.gov.ng">Nigeria Customs Service.</link> Select a tab to view details.
      </p>

      {/* Tabs */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("import")}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "import"
              ? "bg-secondary text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Import
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-6 py-2 rounded-t-lg font-semibold transition ${
            activeTab === "export"
              ? "bg-secondary text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          Export
        </button>
      </div>

      {/* Import Section */}
      {activeTab === "import" && (
        <section>
          <h2 className="text-2xl font-bold mb-6 text-yellow-400">
            Import Prohibition List
          </h2>
          <div className="prose max-w-none text-white">
            <ol className="list-decimal pl-6 space-y-3">
              <li>
              Live or Dead Birds including Frozen Poultry –
                HS Codes 0105.1100 – 0105.9900, 0106.3100 – 0106.3900, 0207.1100
                – 0207.3600 and 0210.9900
              </li>
              <li>
                Pork, Beef – HS Codes 0201.1000 – 0204.5000,
                0206.1000 – 0206.9000, 0210.1000 – 0210.2000
              </li>
              <li>
                Birds Eggs – HS Code 0407.0000 (excluding
                hatching eggs)
              </li>
              <li>
                Refined Vegetable Oils and Fats – HS Codes
                1507.1000.00 – 1516.2000.29 (excl. refined Linseed, Castor, Olive
                oils; crude vegetable oils NOT banned)
              </li>
              <li>
                Cane or Beet Sugar and Chemically Pure Sucrose –
                HS Codes 1701.91.1000 – 1701.99.9000 in retail packs
              </li>
              <li>
                Medicaments under Headings 3003 & 3004, such as:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>Paracetamol (tablets & syrups)</li>
                  <li>Cotrimoxazole (tablets & syrups)</li>
                  <li>Metronidazole (tablets & syrups)</li>
                  <li>Chloroquine (tablets & syrups)</li>
                  <li>
                    Haematinic formulations (Ferrous Sulphate, Ferrous Gluconate,
                    Folic Acid, Vitamin B Complex tablets – except modified
                    release)
                  </li>
                  <li>Multivitamins (tablets, capsules, syrups – excl. special)</li>
                  <li>Aspirin tablets (excl. modified release & soluble)</li>
                  <li>Magnesium Trisilicate (tabs & suspensions)</li>
                  <li>Piperazine (tabs & syrups)</li>
                  <li>Levamisole (tabs & syrups)</li>
                  <li>Clotrimazole cream</li>
                  <li>Penicillin / Gentamycin ointments</li>
                  <li>Pyrantel Pamoate (tabs & syrups)</li>
                  <li>Intravenous Fluids (Dextrose, Normal Saline, etc.)</li>
                </ul>
              </li>
              <li>
                Waste Pharmaceuticals – HS Code 3006.9200
              </li>
              <li>
                Soaps & Detergents – HS Codes 3401.11.1000 –
                3402.90.0000 (in retail packs only)
              </li>
              <li>
                Used Motor Vehicles above 12 years – HS Codes
                8703.10.0000 – 8703.90.0000
              </li>
              <li>
                Tomato Paste / Concentrate – HS Codes 2002100000,
                2002902000, 2002909000
              </li>
            </ol>

            {/* Schedule 4 link */}
            <p className="mt-6">
              <Link
                href="#schedule4"
                className="underline text-yellow-400 hover:text-yellow-300"
              >
                Goods: Schedule 4: <link href="https://customs.gov.ng/?page_id=3077">The Importation of which is absolutely prohibited</link>
              </Link>
            </p>
          </div>
        </section>
      )}

      {activeTab === "export" && (
  <section>
    <h2 className="text-2xl font-bold mb-6 text-green-400">
      Export Prohibition List
    </h2>
    <div className="prose max-w-none text-white">
      <ol className="list-decimal pl-6 space-y-3">
        <li>Maize</li>
        <li>Timber (rough or sawn)</li>
        <li>
          Raw hides and skin (including Wet Blue and unfinished leather) —
          HS Codes 4101.2000.00 – 4108.9200.00
        </li>
        <li>Scrap metals</li>
        <li>Unprocessed rubber latex and rubber lumps</li>
        <li>Artifacts & Antiquities</li>
        <li>
          Wildlife animals classified as endangered species and their
          derivatives (e.g. crocodile, elephant, lizard, eagle, monkey,
          zebra, lion, etc.)
        </li>
        {/* Add more if you have more items */}
      </ol>
    </div>
  </section>
)}
    </div>
  );
}