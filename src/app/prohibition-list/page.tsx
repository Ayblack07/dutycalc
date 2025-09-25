"use client";

import { useState } from "react";

export default function ProhibitionListPage() {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-[#0a1a3f] text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Prohibition List</h1>
      <p className="mb-8">
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
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Import
        </button>
        <button
          onClick={() => setActiveTab("export")}
          className={`px-4 py-2 rounded-t-lg font-semibold ${
            activeTab === "export"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Export
        </button>
      </div>

      {/* Import Section */}
      {activeTab === "import" && (
        <section>
          <h2 className="text-2xl bg-blue-900 font-semibold text-red-400 mb-4 p-2 rounded">
            Import Prohibition List
          </h2>
          <div className="prose max-w-none text-white">
            <ol className="list-decimal pl-6 space-y-2">
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
              {/* ... keep rest of your items ... */}
              <li>
                <strong>Tomato Paste or Concentrate</strong> – HS Codes
                2002100000, 2002902000, 2002909000
              </li>
            </ol>

            {/* Internal link */}
            <p className="mt-6">
              <a href="#absolute" className="text-yellow-300 underline">
                (Goods that are absolutely prohibited items)
              </a>
            </p>
          </div>

          {/* Target section */}
          <div id="absolute" className="mt-12 p-4 bg-blue-800 rounded">
            <h3 className="text-xl font-bold mb-2">Absolutely Prohibited Items</h3>
            <p>
              These are items under <strong>Schedule 4</strong> which are
              completely banned from importation regardless of purpose or license.
            </p>
          </div>
        </section>
      )}

      {/* Export Section */}
      {activeTab === "export" && (
        <section>
          <h2 className="text-2xl font-semibold text-green-400 mb-4">
            Export Prohibition List
          </h2>
          <p>
            Export prohibition list will be provided here. (e.g., crude oil,
            timber, wildlife products, etc.)
          </p>
        </section>
      )}
    </div>
  );
}