"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

// Full Section/Chapter mapping
const sections = [
  {
    id: 1,
    roman: "I",
    title: "Live Animals; Animal Products",
    color: "bg-green-600",
    chapters: ["Chapter 1", "Chapter 2", "Chapter 3", "Chapter 4", "Chapter 5"],
  },
  {
    id: 2,
    roman: "II",
    title: "Vegetable Products",
    color: "bg-blue-600",
    chapters: [
      "Chapter 6",
      "Chapter 7",
      "Chapter 8",
      "Chapter 9",
      "Chapter 10",
      "Chapter 11",
      "Chapter 12",
      "Chapter 13",
      "Chapter 14",
    ],
  },
  {
    id: 3,
    roman: "III",
    title: "Animal or Vegetable Fats and Oils",
    color: "bg-purple-600",
    chapters: ["Chapter 15"],
  },
  {
    id: 4,
    roman: "IV",
    title: "Prepared Foodstuffs; Beverages; Tobacco",
    color: "bg-orange-600",
    chapters: [
      "Chapter 16",
      "Chapter 17",
      "Chapter 18",
      "Chapter 19",
      "Chapter 20",
      "Chapter 21",
      "Chapter 22",
      "Chapter 23",
      "Chapter 24",
    ],
  },
  {
    id: 5,
    roman: "V",
    title: "Mineral Products",
    color: "bg-yellow-600",
    chapters: ["Chapter 25", "Chapter 26", "Chapter 27"],
  },
  {
    id: 6,
    roman: "VI",
    title: "Products of Chemical & Allied Industries",
    color: "bg-red-600",
    chapters: [
      "Chapter 28",
      "Chapter 29",
      "Chapter 30",
      "Chapter 31",
      "Chapter 32",
      "Chapter 33",
      "Chapter 34",
      "Chapter 35",
      "Chapter 36",
      "Chapter 37",
      "Chapter 38",
    ],
  },
  {
    id: 7,
    roman: "VII",
    title: "Plastics, Rubber & Articles Thereof",
    color: "bg-teal-600",
    chapters: ["Chapter 39", "Chapter 40"],
  },
  {
    id: 8,
    roman: "VIII",
    title: "Hides, Skins, Leather, Articles, Saddlery",
    color: "bg-pink-600",
    chapters: ["Chapter 41", "Chapter 42", "Chapter 43"],
  },
  {
    id: 9,
    roman: "IX",
    title: "Wood & Articles of Wood, Cork, Straw",
    color: "bg-indigo-600",
    chapters: ["Chapter 44", "Chapter 45", "Chapter 46"],
  },
  {
    id: 10,
    roman: "X",
    title: "Pulp of Wood, Paper, Paperboard",
    color: "bg-cyan-600",
    chapters: ["Chapter 47", "Chapter 48", "Chapter 49"],
  },
  {
    id: 11,
    roman: "XI",
    title: "Textiles & Textile Articles",
    color: "bg-lime-600",
    chapters: [
      "Chapter 50",
      "Chapter 51",
      "Chapter 52",
      "Chapter 53",
      "Chapter 54",
      "Chapter 55",
      "Chapter 56",
      "Chapter 57",
      "Chapter 58",
      "Chapter 59",
      "Chapter 60",
      "Chapter 61",
      "Chapter 62",
      "Chapter 63",
    ],
  },
  {
    id: 12,
    roman: "XII",
    title: "Footwear, Headgear, Umbrellas",
    color: "bg-amber-600",
    chapters: ["Chapter 64", "Chapter 65", "Chapter 66", "Chapter 67"],
  },
  {
    id: 13,
    roman: "XIII",
    title: "Articles of Stone, Plaster, Cement, Glass",
    color: "bg-fuchsia-600",
    chapters: ["Chapter 68", "Chapter 69", "Chapter 70"],
  },
  {
    id: 14,
    roman: "XIV",
    title: "Natural or Cultured Pearls, Precious Stones",
    color: "bg-rose-600",
    chapters: ["Chapter 71"],
  },
  {
    id: 15,
    roman: "XV",
    title: "Base Metals & Articles of Base Metals",
    color: "bg-emerald-600",
    chapters: [
      "Chapter 72",
      "Chapter 73",
      "Chapter 74",
      "Chapter 75",
      "Chapter 76",
      "Chapter 77",
      "Chapter 78",
      "Chapter 79",
      "Chapter 80",
      "Chapter 81",
    ],
  },
  {
    id: 16,
    roman: "XVI",
    title: "Machinery, Appliances, Electrical Equipment",
    color: "bg-sky-600",
    chapters: ["Chapter 84", "Chapter 85"],
  },
  {
    id: 17,
    roman: "XVII",
    title: "Vehicles, Aircraft, Vessels & Transport Equip.",
    color: "bg-violet-600",
    chapters: ["Chapter 86", "Chapter 87", "Chapter 88", "Chapter 89"],
  },
  {
    id: 18,
    roman: "XVIII",
    title: "Optical, Medical, Measuring Instruments",
    color: "bg-neutral-600",
    chapters: ["Chapter 90", "Chapter 91", "Chapter 92"],
  },
  {
    id: 19,
    roman: "XIX",
    title: "Arms & Ammunition",
    color: "bg-stone-600",
    chapters: ["Chapter 93"],
  },
  {
    id: 20,
    roman: "XX",
    title: "Miscellaneous Manufactured Articles",
    color: "bg-slate-600",
    chapters: ["Chapter 94", "Chapter 95", "Chapter 96"],
  },
  {
    id: 21,
    roman: "XXI",
    title: "Works of Art, Collectors’ Pieces, Antiques",
    color: "bg-gray-600",
    chapters: ["Chapter 97"],
  },
];

export default function TariffPage() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<TariffRow[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 20;
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

  // Filter for frontend
  const filtered = rows.filter(
    (row) =>
      row.hscode?.includes(search) ||
      row.description?.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));
  const resetSearch = () => {
    setSearch("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white py-10 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Customs Tariff</h1>
        <p className="text-gray-300 text-base md:text-lg">
          Explore Nigeria Customs tariff by sections, chapters, and HS codes
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search + Reset */}
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
            onClick={resetSearch}
            className="bg-gray-600 hover:bg-gray-700 text-white"
          >
            Reset
          </Button>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full ${section.color} text-white font-bold`}
                >
                  {section.roman}
                </div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {section.title}
                </h2>
              </div>
              <div className="mt-4">
                <Collapsible>
                  <CollapsibleTrigger className="text-sm text-blue-600">
                    View Chapters
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3 flex flex-wrap gap-2">
                    {section.chapters.map((ch) => (
                      <Button
                        key={ch}
                        variant="outline"
                        className="w-auto text-sm"
                      >
                        {ch}
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </div>
          ))}
        </div>

        {/* Tariff Table */}
        <div className="bg-white border border-[#09607B] rounded-xl shadow-lg p-4 md:p-6 mt-10">
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
                    <td className="p-2 text-gray-700">
                      {row.duty_rate ?? "-"}
                    </td>
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