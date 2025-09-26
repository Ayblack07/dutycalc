"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Row type
type TariffRow = {
  id: number;
  hscode: string;
  description: string;
  duty_rate: number | null;
  vat: number | null;
  levy: number | null;
  date: string;
};

export default function TariffPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TariffRow[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 50;
  const [totalPages, setTotalPages] = useState(1);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase.from("tariff").select("*", { count: "exact" });

      if (search.trim() !== "") {
        query = query.or(
          `hscode.ilike.%${search}%,description.ilike.%${search}%`
        );
      }

      const { data, error, count } = await query.range(start, end);

      if (!error) {
        setRows(data || []);
        if (count) setTotalPages(Math.ceil(count / rowsPerPage));
      }
    };

    fetchData();
  }, [page, search]);

  // Filter
  const filtered = rows.filter(
    (row) =>
      row.hscode?.includes(search) ||
      row.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  // Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Customs Tariff - Current Page", 14, 15);

    autoTable(doc, {
      startY: 22,
      head: [["S/No", "HS Code", "Description", "Duty %", "VAT %", "Levy %", "Date"]],
      body: filtered.map((row) => [
        row.id,
        row.hscode,
        row.description,
        row.duty_rate ?? "-",
        row.vat ?? "-",
        row.levy ?? "-",
        row.date,
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [6, 48, 100] },
    });

    doc.save("tariff.pdf");
  };

  // Export Excel
  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      filtered.map((row) => ({
        "S/No": row.id,
        "HS Code": row.hscode,
        Description: row.description,
        "Duty %": row.duty_rate ?? "-",
        "VAT %": row.vat ?? "-",
        "Levy %": row.levy ?? "-",
        Date: row.date,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tariff");
    XLSX.writeFile(wb, "tariff.xlsx");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white py-10 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Customs Tariff
        </h1>
        <p className="text-gray-300 text-base md:text-lg">
          Check applicable duty, VAT & levy for import items
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search + Export */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by HS code or description"
            className="bg-white text-black border border-[#09607B] w-full md:w-1/2"
          />
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button
              onClick={exportPDF}
              className="bg-red-600 hover:bg-red-700 text-white w-full sm:w-auto"
            >
              <FileDown className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-[#09607B] rounded-xl shadow-lg backdrop-blur-sm p-4 md:p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#09607B] to-[#07546b] text-white">
                  <th className="p-2">S/No</th>
                  <th className="p-2">HS Code</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Duty %</th>
                  <th className="p-2">VAT %</th>
                  <th className="p-2">Levy %</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#2c3446] ${
                      i % 2 === 0 ? "bg-[#1B8B77]" : "bg-[#1B8B77]/40"
                    }`}
                  >
                    <td className="p-2">{row.id}</td>
                    <td className="p-2">{row.hscode}</td>
                    <td className="p-2">{row.description}</td>
                    <td className="p-2">{row.duty_rate ?? "-"}</td>
                    <td className="p-2">{row.vat ?? "-"}</td>
                    <td className="p-2">{row.levy ?? "-"}</td>
                    <td className="p-2">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <span className="text-sm text-gray-400">
              Page {page} of {totalPages || 1}
            </span>
            <div className="flex gap-2">
              <Button
                onClick={prevPage}
                disabled={page === 1}
                className="bg-[#09607B] text-white disabled:opacity-50"
              >
                Prev
              </Button>
              <Button
                onClick={nextPage}
                disabled={page === totalPages || totalPages === 0}
                className="bg-[#09607B] text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}