"use client";

import { JSX, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { format } from "date-fns";

type TariffRow = {
  hsCode: string;
  description: string;
  dutyRate?: number | null; // percent
  vat?: number | null; // percent
  levy?: number | null; // percent
  date: string; // ISO date or displayable string
};

// ----------------------
// Mock sample data (replace with your real data / API later)
// ----------------------
const SAMPLE_TARIFF: TariffRow[] = [
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
    description: "Other horses",
    dutyRate: 10,
    vat: null,
    levy: 2,
    date: "2020-02-12",
  },
  // ... add more sample items as needed (this is just illustrative)
];

// ----------------------
// Tariff page component
// ----------------------
export default function TariffPage(): JSX.Element {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 10;

  // ----------------------
  // Filtered list
  // ----------------------
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SAMPLE_TARIFF;
    return SAMPLE_TARIFF.filter((r) => {
      return (
        r.hsCode.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    });
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const gotoFirst = () => setPage(1);
  const gotoLast = () => setPage(totalPages);

  // ----------------------
  // PDF export (dynamic import)
  // ----------------------
  const exportPDF = async (): Promise<void> => {
    // dynamic import + proper typing without 'any'
    const jsPDFModule = (await import("jspdf")) as typeof import("jspdf");
    // plugin
    await import("jspdf-autotable");

    // jsPDF type
    type JsPDFType = import("jspdf").jsPDF;

    // autoTable options type (minimal)
    type AutoTableOptions = {
      head?: (string | number)[][];
      body?: (string | number)[][];
      startY?: number;
      styles?: { fontSize?: number };
      headStyles?: Record<string, unknown>;
      alternateRowStyles?: Record<string, unknown>;
      [key: string]: unknown;
    };

    const { jsPDF } = jsPDFModule;
    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text("DutyCalc — Tariff Export", 14, 20);
    doc.setFontSize(10);
    doc.text(`Rows exported: ${filtered.length}`, 14, 28);

    const tableBody: (string | number)[][] = filtered.map((r) => [
      r.hsCode,
      r.description,
      r.dutyRate !== null && r.dutyRate !== undefined ? `${r.dutyRate}%` : "",
      r.vat !== null && r.vat !== undefined ? `${r.vat}%` : "",
      r.levy !== null && r.levy !== undefined ? `${r.levy}%` : "",
      r.date,
    ]);

    // call autoTable: safe typing by declaring docWithTable
    const docWithTable = doc as JsPDFType & {
      autoTable?: (opts: AutoTableOptions) => void;
    };

    docWithTable.autoTable?.({
      startY: 36,
      head: [["HS Code", "Description", "Duty", "VAT", "Levy", "Date"]],
      body: tableBody,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [6, 48, 100], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save(`tariff-export-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // ----------------------
  // Excel/CSV export (dynamic)
  // ----------------------
  const exportExcel = async (): Promise<void> => {
    // dynamic import and typed cast
    const XLSX = (await import("xlsx")) as typeof import("xlsx");

    const worksheet = XLSX.utils.json_to_sheet(
      filtered.map((r) => ({
        "HS Code": r.hsCode,
        Description: r.description,
        Duty: r.dutyRate ?? "",
        VAT: r.vat ?? "",
        Levy: r.levy ?? "",
        Date: r.date,
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tariff");
    XLSX.writeFile(workbook, `tariff-export-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-white">Tariff Lookup</h1>
        <p className="text-gray-400">Search HS codes, descriptions and download the tariff list.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Label className="text-white">Search</Label>
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search HS code or description"
            className="bg-white text-black"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={exportPDF} className="bg-green-600 hover:bg-green-700">
            <FileDown className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button onClick={exportExcel} className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0E10] p-4 rounded-lg border border-[#063064] text-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#063064] text-white">
              <tr>
                <th className="py-2 px-3 text-left">HS Code</th>
                <th className="py-2 px-3 text-left">Description</th>
                <th className="py-2 px-3 text-left">Duty</th>
                <th className="py-2 px-3 text-left">VAT</th>
                <th className="py-2 px-3 text-left">Levy</th>
                <th className="py-2 px-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.hsCode} className="border-t border-gray-800 hover:bg-[#11131a]">
                  <td className="py-2 px-3 align-top">{row.hsCode}</td>
                  <td className="py-2 px-3">{row.description}</td>
                  <td className="py-2 px-3">{row.dutyRate ?? ""}</td>
                  <td className="py-2 px-3">{row.vat ?? ""}</td>
                  <td className="py-2 px-3">{row.levy ?? ""}</td>
                  <td className="py-2 px-3">{format(new Date(row.date), "yyyy-MM-dd")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Button onClick={gotoFirst} disabled={page === 1} variant="outline">First</Button>
            <Button onClick={prev} disabled={page === 1} variant="outline">Prev</Button>
            <span className="text-sm text-gray-300 px-3">Page {page} / {totalPages}</span>
            <Button onClick={next} disabled={page === totalPages} variant="outline">Next</Button>
            <Button onClick={gotoLast} disabled={page === totalPages} variant="outline">Last</Button>
          </div>

          <div className="text-sm text-gray-400">
            Showing {paginated.length} of {filtered.length} results
          </div>
        </div>
      </div>
    </div>
  );
}