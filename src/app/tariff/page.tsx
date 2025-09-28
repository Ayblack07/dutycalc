"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, RotateCcw } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type TariffRow = {
  id: number;
  hscode: string;
  description: string;
  duty_rate: number | null;
  vat: number | null;
  levy: number | null;
  date: string;
};

// All HS Sections & Chapters
const sections = [
  { name: "Section I – Live Animals: Animal Products", chapters: [1, 2, 3, 4, 5] },
  { name: "Section II – Vegetable Products", chapters: [6, 7, 8, 9, 10, 11, 12, 13, 14] },
  { name: "Section III – Animal or Vegetable Fats and Oils", chapters: [15] },
  { name: "Section IV – Prepared Foodstuffs; Beverages; Tobacco", chapters: [16, 17, 18, 19, 20, 21, 22, 23, 24] },
  { name: "Section V – Mineral Products", chapters: [25, 26, 27] },
  { name: "Section VI – Products of the Chemical or Allied Industries", chapters: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38] },
  { name: "Section VII – Plastics and Articles; Rubber and Articles", chapters: [39, 40] },
  { name: "Section VIII – Hides, Skins, Leather, Articles; Saddlery", chapters: [41, 42, 43] },
  { name: "Section IX – Wood and Articles; Cork; Manufactures of Straw", chapters: [44, 45, 46] },
  { name: "Section X – Pulp of Wood; Paper and Paperboard", chapters: [47, 48, 49] },
  { name: "Section XI – Textiles and Textile Articles", chapters: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63] },
  { name: "Section XII – Footwear, Headgear, Umbrellas, Walking Sticks", chapters: [64, 65, 66, 67] },
  { name: "Section XIII – Articles of Stone, Plaster, Cement, Asbestos, Mica", chapters: [68, 69, 70] },
  { name: "Section XIV – Natural or Cultured Pearls; Precious Stones", chapters: [71] },
  { name: "Section XV – Base Metals and Articles of Base Metal", chapters: [72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83] },
  { name: "Section XVI – Machinery, Mechanical Appliances; Electrical Equipment", chapters: [84, 85] },
  { name: "Section XVII – Vehicles, Aircraft, Vessels", chapters: [86, 87, 88, 89] },
  { name: "Section XVIII – Optical, Photographic, Measuring Instruments", chapters: [90, 91, 92] },
  { name: "Section XIX – Arms and Ammunition", chapters: [93] },
  { name: "Section XX – Miscellaneous Manufactured Articles", chapters: [94, 95, 96] },
  { name: "Section XXI – Works of Art, Collectors’ Pieces, Antiques", chapters: [97] },
  { name: "Section XXII – Special Transactions (Reserved)", chapters: [98, 99] },
];

export default function TariffPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TariffRow[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
  const [totalPages, setTotalPages] = useState(1);

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [openSections, setOpenSections] = useState<number[]>([]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const resetFilters = () => {
    setSearch("");
    setSelectedChapter(null);
    setPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage - 1;

      let query = supabase.from("tariff").select("*", { count: "exact" });

      if (search.trim() !== "") {
        query = query.or(`hscode.ilike.%${search}%,description.ilike.%${search}%`);
      }

      if (selectedChapter !== null) {
        const prefix = String(selectedChapter).padStart(2, "0");
        query = query.ilike("hscode", `${prefix}%`);
      }

      const { data, error, count } = await query.range(start, end);

      if (!error) {
        setRows(data || []);
        if (count) setTotalPages(Math.ceil(count / rowsPerPage));
      }
    };

    fetchData();
  }, [page, search, selectedChapter]);

  const filtered = rows.filter(
    (row) =>
      row.hscode?.includes(search) ||
      row.description?.toLowerCase().includes(search.toLowerCase())
  );

  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white py-10 px-4">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Customs Tariff</h1>
        <p className="text-gray-300 text-base md:text-lg">
          Browse tariffs by section, chapter, or search directly
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section & Chapter Navigation */}
        <div className="grid gap-4">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md text-black border border-gray-200">
              <div
                onClick={() => toggleSection(index)}
                className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 rounded-t-xl"
              >
                <h2 className="font-semibold">{section.name}</h2>
                {openSections.includes(index) ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
              {openSections.includes(index) && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-4 py-3">
                  {section.chapters.map((ch) => (
                    <Button
                      key={ch}
                      variant={selectedChapter === ch ? "default" : "outline"}
                      onClick={() => {
                        setSelectedChapter(ch);
                        setPage(1);
                      }}
                      className="w-full"
                    >
                      Chapter {ch}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Search + Reset */}
        <div className="flex gap-2">
          <Input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by HS code or description"
            className="bg-white text-black border border-[#09607B] w-full"
          />
          <Button
            onClick={resetFilters}
            variant="outline"
            className="flex items-center gap-1 border-[#09607B] text-[#09607B]"
          >
            <RotateCcw className="w-4 h-4" /> Reset
          </Button>
        </div>

        {/* Tariff Table */}
        <div className="bg-white border border-[#09607B] rounded-xl shadow-lg p-4 md:p-6">
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
                    className={`hover:bg-gray-100 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                  >
                    <td className="p-2 text-gray-700">{row.id}</td>
                    <td className="p-2 text-gray-700">{row.hscode}</td>
                    <td className="p-2 text-gray-700">{row.description}</td>
                    <td className="p-2 text-gray-700">{row.duty_rate ?? "-"}</td>
                    <td className="p-2 text-gray-700">{row.vat ?? "-"}</td>
                    <td className="p-2 text-gray-700">{row.levy ?? "-"}</td>
                    <td className="p-2 text-gray-700">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <span className="text-sm text-gray-600">
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