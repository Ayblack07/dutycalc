"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  FileDown,
  FileSpreadsheet,
  RotateCcw,
} from "lucide-react";
import {
  format,
  isWithinInterval,
  startOfDay,
  endOfDay,
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
  dateReg: string; // from DB as string
  dateArrival: string;
};

export default function ManifestPage() {
  const [manifests, setManifests] = useState<ManifestRow[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateArrivalFrom, setDateArrivalFrom] = useState<Date | null>(null);
  const [dateArrivalTo, setDateArrivalTo] = useState<Date | null>(null);

  // Fetch data from Supabase on load
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

  // Filtering
  const filtered = useMemo(() => {
    return manifests.filter((row) => {
      const kw = keyword.toLowerCase();
      const matchKeyword =
        !kw ||
        row.manifest.toLowerCase().includes(kw) ||
        row.destination.toLowerCase().includes(kw) ||
        row.command.toLowerCase().includes(kw) ||
        row.airline.toLowerCase().includes(kw);

      const regDate = new Date(row.dateReg);
      const arrivalDate = new Date(row.dateArrival);

      const matchReg =
        (!dateRegFrom && !dateRegTo) ||
        (dateRegFrom &&
          dateRegTo &&
          isWithinInterval(regDate, {
            start: startOfDay(dateRegFrom),
            end: endOfDay(dateRegTo),
          })) ||
        (dateRegFrom && !dateRegTo && regDate >= startOfDay(dateRegFrom)) ||
        (!dateRegFrom && dateRegTo && regDate <= endOfDay(dateRegTo));

      const matchArrival =
        (!dateArrivalFrom && !dateArrivalTo) ||
        (dateArrivalFrom &&
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
          arrivalDate <= endOfDay(dateArrivalTo));

      return matchKeyword && matchReg && matchArrival;
    });
  }, [manifests, keyword, dateRegFrom, dateRegTo, dateArrivalFrom, dateArrivalTo]);

  // Reset filters
  const resetFilters = () => {
    setKeyword("");
    setDateRegFrom(null);
    setDateRegTo(null);
    setDateArrivalFrom(null);
    setDateArrivalTo(null);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Cargo Manifests</h1>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <Label>Search</Label>
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search manifest, destination, airline..."
          />
        </div>

        <div>
          <Label>Date Registered (From)</Label>
          <Input
            type="date"
            value={dateRegFrom ? format(dateRegFrom, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              setDateRegFrom(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>

        <div>
          <Label>Date Registered (To)</Label>
          <Input
            type="date"
            value={dateRegTo ? format(dateRegTo, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              setDateRegTo(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>

        <div>
          <Label>Date Arrival (From)</Label>
          <Input
            type="date"
            value={dateArrivalFrom ? format(dateArrivalFrom, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              setDateArrivalFrom(
                e.target.value ? new Date(e.target.value) : null
              )
            }
          />
        </div>

        <div>
          <Label>Date Arrival (To)</Label>
          <Input
            type="date"
            value={dateArrivalTo ? format(dateArrivalTo, "yyyy-MM-dd") : ""}
            onChange={(e) =>
              setDateArrivalTo(e.target.value ? new Date(e.target.value) : null)
            }
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={resetFilters} variant="secondary">
            <RotateCcw className="w-4 h-4 mr-2" /> Reset
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2 text-left">S/No</th>
              <th className="px-4 py-2 text-left">Manifest</th>
              <th className="px-4 py-2 text-left">Destination</th>
              <th className="px-4 py-2 text-left">Command</th>
              <th className="px-4 py-2 text-left">Origin</th>
              <th className="px-4 py-2 text-left">Airline</th>
              <th className="px-4 py-2 text-left">Voyage No</th>
              <th className="px-4 py-2 text-left">Date Registered</th>
              <th className="px-4 py-2 text-left">Date Arrival</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700 bg-gray-900">
            {filtered.length > 0 ? (
              filtered.map((row) => (
                <tr key={row.sno}>
                  <td className="px-4 py-2">{row.sno}</td>
                  <td className="px-4 py-2">{row.manifest}</td>
                  <td className="px-4 py-2">{row.destination}</td>
                  <td className="px-4 py-2">{row.command}</td>
                  <td className="px-4 py-2">{row.origin}</td>
                  <td className="px-4 py-2">{row.airline}</td>
                  <td className="px-4 py-2">{row.voyageNo || "-"}</td>
                  <td className="px-4 py-2">
                    {format(new Date(row.dateReg), "dd MMM yyyy")}
                  </td>
                  <td className="px-4 py-2">
                    {format(new Date(row.dateArrival), "dd MMM yyyy")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  No manifests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}