"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, FileSpreadsheet } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(20); // show 20 per page
  const [tariffData, setTariffData] = useState<TariffRow[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all rows from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("tariff")
        .select("*")
        .order("id", { ascending: true });

      if (error) console.error(error);
      else setTariffData(data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // 🔎 Filter first (on ALL rows)
  const filtered = tariffData.filter(
    (row) =>
      row.hscode?.toLowerCase().includes(search.toLowerCase()) ||
      row.description?.toLowerCase().includes(search.toLowerCase())
  );

  // 📄 Then paginate
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const currentRows = filtered.slice(startIndex, startIndex + rowsPerPage);

  // Handlers
  const nextPage = () => setPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setPage((p) => Math.max(p - 1, 1));

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
          Customs Tariff
        </h1>
        <p className="text-gray-300">
          Search through {tariffData.length} tariff records
        </p>
      </div>

      {/* Search + Export */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <Input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page on new search
          }}
          placeholder="Search by HS code or description"
          className="bg-white text-black border border-[#063064] w-full md:w-1/2"
        />
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
            <FileDown className="w-4 h-4 mr-2" /> PDF
          </Button>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-black w-full sm:w-auto">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0E10] p-4 md:p-6 rounded-xl border border-[#063064] text-white">
        {loading ? (
          <p className="text-center text-gray-400">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-[#063064] to-[#00509E] text-white">
                  <th className="p-2">HS Code</th>
                  <th className="p-2">Description</th>
                  <th className="p-2">Duty %</th>
                  <th className="p-2">VAT %</th>
                  <th className="p-2">Levy %</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((row, i) => (
                  <tr
                    key={row.id}
                    className={`hover:bg-[#2c3446] ${
                      i % 2 === 0 ? "bg-[#1a237e]/40" : "bg-[#004d40]/40"
                    }`}
                  >
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
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages || 1}
          </span>
          <div className="flex gap-2">
            <Button
              onClick={prevPage}
              disabled={page === 1}
              className="bg-[#063064] text-white disabled:opacity-50"
            >
              Prev
            </Button>
            <Button
              onClick={nextPage}
              disabled={page === totalPages || totalPages === 0}
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