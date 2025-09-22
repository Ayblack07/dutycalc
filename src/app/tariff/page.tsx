"use client";

import { useState } from "react";
import { FileText, Percent, Shield } from "lucide-react";
import tariffData from "@/data/tariff.json"; // ✅ Import JSON file

export default function TariffPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = tariffData.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(tariffData.length / rowsPerPage);

  return (
    <main className="bg-[#0D0E10] min-h-screen text-white py-12 px-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Nigerian Customs Tariff Lookup
      </h1>

      <div className="overflow-x-auto bg-gradient-to-br from-[#0D0E10] to-[#1F2937] rounded-xl shadow-lg">
        <table className="min-w-full border border-gray-700 rounded-lg">
          <thead className="bg-[#090A0B] text-gray-300">
            <tr>
              <th className="py-3 px-4 text-left flex items-center gap-2">
                <FileText size={18} /> HS Code
              </th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left flex items-center gap-2">
                <Percent size={18} /> Duty Rate (%)
              </th>
              <th className="py-3 px-4 text-left flex items-center gap-2">
                <Percent size={18} /> VAT (%)
              </th>
              <th className="py-3 px-4 text-left flex items-center gap-2">
                <Shield size={18} /> Levy (%)
              </th>
              <th className="py-3 px-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((row, idx) => (
              <tr
                key={idx}
                className="border-t border-gray-700 hover:bg-[#1F2937] transition"
              >
                <td className="py-3 px-4">{row.hsCode}</td>
                <td className="py-3 px-4">{row.description}</td>
                <td className="py-3 px-4">{row.dutyRate ?? "-"}</td>
                <td className="py-3 px-4">{row.vat ?? "-"}</td>
                <td className="py-3 px-4">{row.levy ?? "-"}</td>
                <td className="py-3 px-4">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-[#0066E6] text-white disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-4 py-2 rounded-lg ${
              currentPage === i + 1
                ? "bg-[#F7D234] text-black font-bold"
                : "bg-[#1F2937] text-gray-300 hover:bg-[#2D3748]"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 rounded-lg bg-[#0066E6] text-white disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </main>
  );
}