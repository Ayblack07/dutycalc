"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, FileSpreadsheet } from "lucide-react";

// ✅ Type for Tariff Data
export type TariffRow = {
  hsCode: string;
  description: string;
  dutyRate: number;
  vat?: number | null;
  levy?: number | null;
  date: string;
};

// ✅ Example Tariff Data (replace with real JSON later)
const tariffData: TariffRow[] = [
  {
    hsCode: "0101210000",
    description: "Live purebred breeding horses",
    dutyRate: 5,
    vat: 0,
    levy: 5,
    date: "2020-02-12",
  },
  {
    hsCode: "0101290000",
    description: "Other live horses",
    dutyRate: 10,
    vat: null,
    levy: null,
    date: "2020-02-12",
  },
  {
    hsCode: "0101300000",
    description: "Live asses",
    dutyRate: 5,
    vat: 0,
    levy: null,
    date: "2020-02-12",
  },
];

// ✅ Pagination settings
const ROWS_PER_PAGE = 10;

export default function TariffPage() {
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(1);

  // ✅ Filtering
  const filtered = useMemo(() => {
    const kw = keyword.toLowerCase();
    return tariffData.filter(
      (row) =>
        row.hsCode.toLowerCase().includes(kw) ||
        row.description.toLowerCase().includes(kw)
    );
  }, [keyword]);

  // ✅ Pagination
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE
  );

  // ✅ Export PDF
  const exportPDF = async () => {
    const [{ jsPDF }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);
    const doc = new jsPDF();

    const body = filtered.map((r) => [
      r.hsCode,
      r.description,
      r.dutyRate,
      r.vat ?? "-",
      r.levy ?? "-",
      r.date,
    ]);

    doc.autoTable({
      head: [["HS Code", "Description", "Duty (%)", "VAT (%)", "Levy (%)", "Date"]],
      body,
      startY: 20,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [6, 48, 100], textColor: 255 },
      alternateRowStyles: { fillColor: [240, 240, 240] },
    });

    doc.save("tariff-data.pdf");
  };

  // ✅ Export Excel (CSV)
  const exportExcel = () => {
    const csvRows = [
      ["HS Code", "Description", "Duty (%)", "VAT (%)", "Levy (%)", "Date"].join(","),
      ...filtered.map((r) =>
        [
          r.hsCode,
          `"${r.description}"`, // quote to handle commas
          r.dutyRate,
          r.vat ?? "-",
          r.levy ?? "-",
          r.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tariff-data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">
          Nigerian Customs Tariff
        </h1>
        <p className="text-gray-300">
          Browse HS codes, duty rates, VAT, and levy details
        </p>
      </div>

      {/* Search */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-6 rounded-xl shadow-md border border-[#063064]">
        <h2 className="text-lg font-semibold text-white mb-4">
          Search Tariff
        </h2>
        <Input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1); // reset to first page when searching
          }}
          placeholder="Search by HS code or description"
          className="bg-white text-black border border-[#063064]"
        />
      </div>

      {/* Table Section */}
      <div className="bg-[#0D0E10] p-6 rounded-xl border border-[#063064] text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Tariff Table</h2>
          <div className="flex gap-3">
            <Button onClick={exportPDF} className="bg-green-600 hover:bg-green-700">
              <FileDown className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button
              onClick={exportExcel}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#063064] text-white">
                <th className="p-2">HS Code</th>
                <th className="p-2">Description</th>
                <th className="p-2">Duty (%)</th>
                <th className="p-2">VAT (%)</th>
                <th className="p-2">Levy (%)</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row, i) => (
                <tr
                  key={row.hsCode}
                  className={`hover:bg-[#2c3446] ${
                    i % 2 === 0 ? "bg-[#1a237e]/40" : "bg-[#004d40]/40"
                  }`}
                >
                  <td className="p-2">{row.hsCode}</td>
                  <td className="p-2">{row.description}</td>
                  <td className="p-2">{row.dutyRate}%</td>
                  <td className="p-2">{row.vat ?? "-"}</td>
                  <td className="p-2">{row.levy ?? "-"}</td>
                  <td className="p-2">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="bg-[#063064] text-white disabled:opacity-50"
            >
              Prev
            </Button>
            <Button
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage((p) => p + 1)}
              className="bg-[#063064] text-white disabled:opacity-50"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}