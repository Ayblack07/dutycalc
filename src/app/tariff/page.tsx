"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";

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

type Section = {
  id: string;
  title: string;
  chapters: number[];
  color: string;
};

const sections: Section[] = [
  { id: "I", title: "Live Animals; Animal Products", chapters: [1, 2, 3, 4, 5], color: "bg-pink-500" },
  { id: "II", title: "Vegetable Products", chapters: [6, 7, 8, 9, 10, 11, 12, 13, 14], color: "bg-green-500" },
  { id: "III", title: "Animal or Vegetable Fats & Oils", chapters: [15], color: "bg-yellow-500" },
  { id: "IV", title: "Prepared Foodstuffs; Beverages", chapters: [16, 17, 18, 19, 20, 21, 22, 23], color: "bg-orange-500" },
  { id: "V", title: "Mineral Products", chapters: [25, 26, 27], color: "bg-blue-500" },
  { id: "VI", title: "Products of Chemical Industries", chapters: [28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38], color: "bg-purple-500" },
  { id: "VII", title: "Plastics & Rubber", chapters: [39, 40], color: "bg-red-500" },
  { id: "VIII", title: "Hides, Skins, Leather & Saddlery", chapters: [41, 42, 43], color: "bg-teal-500" },
  { id: "IX", title: "Wood & Articles of Wood", chapters: [44, 45, 46], color: "bg-lime-500" },
  { id: "X", title: "Pulp of Wood, Paper & Printing", chapters: [47, 48, 49], color: "bg-indigo-500" },
  { id: "XI", title: "Textiles & Textile Articles", chapters: [50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63], color: "bg-pink-600" },
  { id: "XII", title: "Footwear, Headgear", chapters: [64, 65, 66, 67], color: "bg-emerald-500" },
  { id: "XIII", title: "Articles of Stone, Plaster, Cement", chapters: [68, 69, 70], color: "bg-cyan-500" },
  { id: "XIV", title: "Natural or Cultured Pearls", chapters: [71], color: "bg-amber-500" },
  { id: "XV", title: "Base Metals & Articles of Base Metal", chapters: [72, 73, 74, 75, 76, 78, 79, 80, 81, 82, 83], color: "bg-fuchsia-500" },
  { id: "XVI", title: "Machinery & Mechanical Appliances", chapters: [84, 85], color: "bg-rose-500" },
  { id: "XVII", title: "Vehicles, Aircraft & Vessels", chapters: [86, 87, 88, 89], color: "bg-sky-500" },
  { id: "XVIII", title: "Optical, Photographic, Medical Instruments", chapters: [90, 91, 92], color: "bg-violet-500" },
  { id: "XIX", title: "Arms & Ammunition", chapters: [93], color: "bg-gray-500" },
  { id: "XX", title: "Miscellaneous Manufactured Articles", chapters: [94, 95, 96], color: "bg-stone-500" },
  { id: "XXI", title: "Works of Art, Miscellaneous", chapters: [97, 98, 99], color: "bg-yellow-600" },
];

export default function TariffPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TariffRow[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 10;

  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

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

      if (selectedChapter) {
        const prefix = selectedChapter.toString().padStart(2, "0");
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
    <div className="min-h-screen bg-gradient-to-br from-accent to-primary text-white py-10 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Customs Tariff</h1>
        <p className="text-gray-300 text-base md:text-lg">
          Check applicable duty, VAT & levy for import items
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search */}
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
          <Button
            onClick={() => {
              setSearch("");
              setSelectedChapter(null);
              setPage(1);
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Reset
          </Button>
        </div>

        {/* Table */}
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
                    className={`hover:bg-gray-100 ${
                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
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

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col items-center text-center cursor-pointer"
              onClick={() =>
                setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )
              }
            >
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg ${section.color}`}
              >
                {section.id}
              </div>
              <h2 className="mt-3 text-lg font-semibold text-gray-800">
                {section.title}
              </h2>

              {/* Collapsible chapters */}
              {expandedSection === section.id && (
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {section.chapters.map((ch) => (
                    <Button
                      key={ch}
                      onClick={(e) => {
                        e.stopPropagation(); // prevent collapsing when clicking button
                        setSelectedChapter(ch);
                        setPage(1);
                      }}
                      size="sm"
                      className={`${
                        selectedChapter === ch
                          ? "bg-[#09607B] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Ch {ch}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}