"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FileDown, FileSpreadsheet, RotateCcw } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export type ManifestRow = {
  sno: number;
  manifest: string;
  destination: string;
  command: string;
  origin: string;
  airline: string;
  voyageNo?: string;
  dateReg: Date;
  dateArrival: Date;
};

const manifestData: ManifestRow[] = [
  {
    sno: 1,
    manifest: "MNF001",
    destination: "Lagos",
    command: "CMD01",
    origin: "Abuja",
    airline: "Air Peace",
    voyageNo: "AP123",
    dateReg: new Date("2025-09-09"),
    dateArrival: new Date("2025-09-12"),
  },
  {
    sno: 2,
    manifest: "MNF002",
    destination: "London",
    command: "CMD02",
    origin: "New York",
    airline: "British Airways",
    voyageNo: "BA456",
    dateReg: new Date("2025-09-15"),
    dateArrival: new Date("2025-09-17"),
  },
];

export default function ManifestPage() {
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateArrivalFrom, setDateArrivalFrom] = useState<Date | null>(null);
  const [dateArrivalTo, setDateArrivalTo] = useState<Date | null>(null);

  const filtered = useMemo(() => {
    return manifestData.filter((row) => {
      const kw = keyword.toLowerCase();
      const matchKeyword =
        !kw ||
        row.manifest.toLowerCase().includes(kw) ||
        row.destination.toLowerCase().includes(kw) ||
        row.command.toLowerCase().includes(kw) ||
        row.airline.toLowerCase().includes(kw);

      const matchReg =
        (!dateRegFrom && !dateRegTo) ||
        (dateRegFrom && dateRegTo &&
          isWithinInterval(row.dateReg, {
            start: startOfDay(dateRegFrom),
            end: endOfDay(dateRegTo),
          })) ||
        (dateRegFrom && !dateRegTo && row.dateReg >= startOfDay(dateRegFrom)) ||
        (!dateRegFrom && dateRegTo && row.dateReg <= endOfDay(dateRegTo));

      const matchArrival =
        (!dateArrivalFrom && !dateArrivalTo) ||
        (dateArrivalFrom && dateArrivalTo &&
          isWithinInterval(row.dateArrival, {
            start: startOfDay(dateArrivalFrom),
            end: endOfDay(dateArrivalTo),
          })) ||
        (dateArrivalFrom && !dateArrivalTo && row.dateArrival >= startOfDay(dateArrivalFrom)) ||
        (!dateArrivalFrom && dateArrivalTo && row.dateArrival <= endOfDay(dateArrivalTo));

      return matchKeyword && matchReg && matchArrival;
    });
  }, [keyword, dateRegFrom, dateRegTo, dateArrivalFrom, dateArrivalTo]);

  const resetFilters = () => {
    setKeyword("");
    setDateRegFrom(null);
    setDateRegTo(null);
    setDateArrivalFrom(null);
    setDateArrivalTo(null);
  };

  const setToday = () => {
    const today = new Date();
    setDateRegFrom(today);
    setDateRegTo(today);
  };
  const setThisWeek = () => {
    const today = new Date();
    setDateRegFrom(startOfWeek(today));
    setDateRegTo(endOfWeek(today));
  };
  const setThisMonth = () => {
    const today = new Date();
    setDateRegFrom(startOfMonth(today));
    setDateRegTo(endOfMonth(today));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Cargo Manifest</h1>
        <p className="text-gray-300">Track and filter recent cargo manifests</p>
      </div>

      {/* Filters */}
      <div className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] p-4 md:p-6 rounded-xl shadow-md border border-[#063064]">
        <h2 className="text-lg font-semibold text-white mb-4">Filter & Search</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <Label className="text-white text-sm">Keyword</Label>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search by manifest, command, destination, airline"
              className="bg-white text-black border border-[#063064] w-full"
            />
          </div>

          <div>
            <Label className="text-white text-sm">Date of Registration (From)</Label>
            <Input
              type="date"
              value={dateRegFrom ? format(dateRegFrom, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateRegFrom(e.target.value ? new Date(e.target.value) : null)}
              className="bg-white text-black border border-[#063064] w-full"
            />
          </div>
          <div>
            <Label className="text-white text-sm">Date of Registration (To)</Label>
            <Input
              type="date"
              value={dateRegTo ? format(dateRegTo, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateRegTo(e.target.value ? new Date(e.target.value) : null)}
              className="bg-white text-black border border-[#063064] w-full"
            />
          </div>

          <div>
            <Label className="text-white text-sm">Arrival Date (From)</Label>
            <Input
              type="date"
              value={dateArrivalFrom ? format(dateArrivalFrom, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateArrivalFrom(e.target.value ? new Date(e.target.value) : null)}
              className="bg-white text-black border border-[#063064] w-full"
            />
          </div>
          <div>
            <Label className="text-white text-sm">Arrival Date (To)</Label>
            <Input
              type="date"
              value={dateArrivalTo ? format(dateArrivalTo, "yyyy-MM-dd") : ""}
              onChange={(e) => setDateArrivalTo(e.target.value ? new Date(e.target.value) : null)}
              className="bg-white text-black border border-[#063064] w-full"
            />
          </div>
        </div>

        {/* Quick filters */}
        <div className="flex flex-wrap gap-2 mt-4">
          <Button onClick={setToday} className="bg-[#063064] text-white w-full sm:w-auto">
            Today
          </Button>
          <Button onClick={setThisWeek} className="bg-[#063064] text-white w-full sm:w-auto">
            This Week
          </Button>
          <Button onClick={setThisMonth} className="bg-[#063064] text-white w-full sm:w-auto">
            This Month
          </Button>
          <Button
            variant="outline"
            onClick={resetFilters}
            className="border-red-500 text-red-500 hover:bg-red-600 hover:text-white w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4 mr-1" /> Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0D0E10] p-4 md:p-6 rounded-xl border border-[#063064] text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
          <h2 className="text-lg font-semibold">Latest Manifests</h2>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
              <FileDown className="w-4 h-4 mr-2" /> PDF
            </Button>
            <Button className="bg-yellow-500 hover:bg-yellow-600 text-black w-full sm:w-auto">
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Excel
            </Button>
          </div>
        </div>

        {/* Scrollable on mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#063064] text-white">
                <th className="p-2">S/No</th>
                <th className="p-2">Manifest</th>
                <th className="p-2">Destination</th>
                <th className="p-2">Command</th>
                <th className="p-2">Origin</th>
                <th className="p-2">Air/Shipping Line</th>
                <th className="p-2">Voyage/Flight No</th>
                <th className="p-2">Date of Registration</th>
                <th className="p-2">Arrival Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr
                  key={row.sno}
                  className={`hover:bg-[#2c3446] ${i % 2 === 0 ? "bg-[#1a237e]/40" : "bg-[#004d40]/40"}`}
                >
                  <td className="p-2">{row.sno}</td>
                  <td className="p-2">{row.manifest}</td>
                  <td className="p-2">{row.destination}</td>
                  <td className="p-2">{row.command}</td>
                  <td className="p-2">{row.origin}</td>
                  <td className="p-2">{row.airline}</td>
                  <td className="p-2">{row.voyageNo ?? "-"}</td>
                  <td className="p-2">{format(row.dateReg, "yyyy-MM-dd")}</td>
                  <td className="p-2">{format(row.dateArrival, "yyyy-MM-dd")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Section */}
      <div className="bg-gradient-to-br from-[#0D0E10] to-[#1a1f2e] p-4 md:p-6 rounded-xl border border-[#063064] text-white">
        <h2 className="text-lg font-semibold mb-2">Submit Your Waybill / Bill of Lading</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Enter Air Waybill / Bill of Lading number"
            className="flex-1 bg-white text-black border border-[#063064]"
          />
          <Link href="/contact">
            <Button className="w-full sm:w-auto bg-[#F7D234] text-black hover:bg-[#e0c020]">
              Submit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}