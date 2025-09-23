"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
} from "date-fns";
import { supabase } from "@/lib/supabaseClient";

export type ManifestRow = {
  sno: number;
  manifest: string;
  destination: string;
  command: string;
  origin: string;
  airline: string;
  voyageNo?: string;
  dateReg: string;
  dateArrival: string;
};

export default function ManifestPage() {
  const [manifests, setManifests] = useState<ManifestRow[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateArrivalFrom, setDateArrivalFrom] = useState<Date | null>(null);
  const [dateArrivalTo, setDateArrivalTo] = useState<Date | null>(null);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // 🔹 Fetch from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("manifest").select("*");
      if (error) {
        console.error("Supabase error:", error);
      } else {
        setManifests(data || []);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filtering
  const filtered = useMemo(() => {
    return manifests.filter((row) => {
      const kw = keyword.toLowerCase();
      const matchKeyword =
        !kw ||
        row.manifest?.toLowerCase().includes(kw) ||
        row.destination?.toLowerCase().includes(kw) ||
        row.command?.toLowerCase().includes(kw) ||
        row.airline?.toLowerCase().includes(kw);

      const regDate = row.dateReg ? new Date(row.dateReg) : null;
      const arrivalDate = row.dateArrival ? new Date(row.dateArrival) : null;

      const matchReg =
        (!dateRegFrom && !dateRegTo) ||
        (regDate &&
          ((dateRegFrom &&
            dateRegTo &&
            isWithinInterval(regDate, {
              start: startOfDay(dateRegFrom),
              end: endOfDay(dateRegTo),
            })) ||
            (dateRegFrom && !dateRegTo && regDate >= startOfDay(dateRegFrom)) ||
            (!dateRegFrom && dateRegTo && regDate <= endOfDay(dateRegTo))));

      const matchArrival =
        (!dateArrivalFrom && !dateArrivalTo) ||
        (arrivalDate &&
          ((dateArrivalFrom &&
            dateArrivalTo &&
            isWithinInterval(arrivalDate, {
              start: startOfDay(dateArrivalFrom),
              end: endOfDay(dateArrivalTo),
            })) ||
            (dateArrivalFrom &&
              !dateArrivalTo &&
              arrivalDate >= startOfDay(dateArrivalFrom)) ||
            (!dateArrivalFrom &&
              dateArrivalTo &&
              arrivalDate <= endOfDay(dateArrivalTo))));

      return matchKeyword && matchReg && matchArrival;
    });
  }, [manifests, keyword, dateRegFrom, dateRegTo, dateArrivalFrom, dateArrivalTo]);

  // 🔹 Pagination logic
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filtered.slice(start, end);
  }, [filtered, currentPage, rowsPerPage]);

  // 🔹 Quick filters
  const today = () => {
    const now = new Date();
    setDateRegFrom(startOfDay(now));
    setDateRegTo(endOfDay(now));
  };
  const thisWeek = () => {
    const now = new Date();
    setDateRegFrom(startOfWeek(now));
    setDateRegTo(endOfWeek(now));
  };
  const thisMonth = () => {
    const now = new Date();
    setDateRegFrom(startOfMonth(now));
    setDateRegTo(endOfMonth(now));
  };
  const resetFilters = () => {
    setKeyword("");
    setDateRegFrom(null);
    setDateRegTo(null);
    setDateArrivalFrom(null);
    setDateArrivalTo(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* 🔹 Filters */}
      <div className="space-y-4">
        <Input
          placeholder="Search manifests..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-64"
        />

        <div className="flex flex-wrap gap-4">
          <div>
            <Label>Reg From</Label>
            <Input
              type="date"
              onChange={(e) =>
                setDateRegFrom(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <Label>Reg To</Label>
            <Input
              type="date"
              onChange={(e) =>
                setDateRegTo(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <Label>Arrival From</Label>
            <Input
              type="date"
              onChange={(e) =>
                setDateArrivalFrom(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
            />
          </div>
          <div>
            <Label>Arrival To</Label>
            <Input
              type="date"
              onChange={(e) =>
                setDateArrivalTo(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        {/* 🔹 Quick Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={today}>
            Today
          </Button>
          <Button variant="outline" onClick={thisWeek}>
            This Week
          </Button>
          <Button variant="outline" onClick={thisMonth}>
            This Month
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={resetFilters}
          >
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* 🔹 Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
            <tr>
              <th className="p-2">S/N</th>
              <th className="p-2">Manifest</th>
              <th className="p-2">Destination</th>
              <th className="p-2">Command</th>
              <th className="p-2">Origin</th>
              <th className="p-2">Airline</th>
              <th className="p-2">Voyage No</th>
              <th className="p-2">Date Reg</th>
              <th className="p-2">Date Arrival</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((row) => (
                <tr key={row.sno} className="border-t hover:bg-gray-50">
                  <td className="p-2">{row.sno}</td>
                  <td className="p-2">{row.manifest}</td>
                  <td className="p-2">{row.destination}</td>
                  <td className="p-2">{row.command}</td>
                  <td className="p-2">{row.origin}</td>
                  <td className="p-2">{row.airline}</td>
                  <td className="p-2">{row.voyageNo || "-"}</td>
                  <td className="p-2">
                    {row.dateReg ? format(new Date(row.dateReg), "yyyy-MM-dd") : "-"}
                  </td>
                  <td className="p-2">
                    {row.dateArrival ? format(new Date(row.dateArrival), "yyyy-MM-dd") : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={9}>
                  No manifests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <Label>Rows per page:</Label>
          <select
            className="border rounded p-1"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Prev
          </Button>
          <span>
            Page {currentPage} of {totalPages || 1}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}