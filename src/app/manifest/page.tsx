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
  manifest_no: string;
  destination: string;
  command: string;
  origin: string;
  air_shipping_line: string;
  voyage_flight_no?: string;
  date_of_registration: string;
  date_of_departure: string;
};

export default function ManifestPage() {
  const [manifests, setManifests] = useState<ManifestRow[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateDepartureFrom, setDateDepartureFrom] = useState<Date | null>(null);
  const [dateDepartureTo, setDateDepartureTo] = useState<Date | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Fetch from Supabase (sorted by manifest number DESC)
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("manifest")
        .select("*");

      if (error) {
        console.error("Supabase error:", error);
      } else {
        // Sort manifests manually by numeric part of manifest_no
        const sorted = (data || []).sort((a, b) => {
          const numA = parseInt(a.manifest_no.replace(/\D/g, ""), 10);
          const numB = parseInt(b.manifest_no.replace(/\D/g, ""), 10);
          return numB - numA; // descending
        });
        setManifests(sorted);
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
        row.manifest_no?.toLowerCase().includes(kw) ||
        row.destination?.toLowerCase().includes(kw) ||
        row.command?.toLowerCase().includes(kw) ||
        row.air_shipping_line?.toLowerCase().includes(kw);

      const regDate = row.date_of_registration
        ? new Date(row.date_of_registration)
        : null;
      const departureDate = row.date_of_departure
        ? new Date(row.date_of_departure)
        : null;

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

      const matchDeparture =
        (!dateDepartureFrom && !dateDepartureTo) ||
        (departureDate &&
          ((dateDepartureFrom &&
            dateDepartureTo &&
            isWithinInterval(departureDate, {
              start: startOfDay(dateDepartureFrom),
              end: endOfDay(dateDepartureTo),
            })) ||
            (dateDepartureFrom &&
              !dateDepartureTo &&
              departureDate >= startOfDay(dateDepartureFrom)) ||
            (!dateDepartureFrom &&
              dateDepartureTo &&
              departureDate <= endOfDay(dateDepartureTo))));

      return matchKeyword && matchReg && matchDeparture;
    });
  }, [manifests, keyword, dateRegFrom, dateRegTo, dateDepartureFrom, dateDepartureTo]);

  // Pagination slice
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  // Quick filters
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
    setDateDepartureFrom(null);
    setDateDepartureTo(null);
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* Filters */}
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
              className="text-white placeholder-gray-400"
              onChange={(e) =>
                setDateRegFrom(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <Label>Reg To</Label>
            <Input
              type="date"
              className="text-white placeholder-gray-400"
              onChange={(e) =>
                setDateRegTo(e.target.value ? new Date(e.target.value) : null)
              }
            />
          </div>
          <div>
            <Label>Departure From</Label>
            <Input
              type="date"
              className="text-white placeholder-gray-400"
              onChange={(e) =>
                setDateDepartureFrom(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
            />
          </div>
          <div>
            <Label>Departure To</Label>
            <Input
              type="date"
              className="text-white placeholder-gray-400"
              onChange={(e) =>
                setDateDepartureTo(
                  e.target.value ? new Date(e.target.value) : null
                )
              }
            />
          </div>
        </div>

        {/* Quick Filter Buttons */}
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

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full border-collapse, bg-blue-900 : bg-blue-950">
          <thead className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
            <tr>
              {/* Removed S/N column */}
              <th className="p-2">Manifest</th>
              <th className="p-2">Port of Entry</th>
              <th className="p-2">Command</th>
              <th className="p-2">Place of departure</th>
              <th className="p-2">Air/Shipping Line</th>
              <th className="p-2">Voyage/Flight No</th>
              <th className="p-2">Date Reg</th>
              <th className="p-2">Date dep</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length > 0 ? (
              paginated.map((row, idx) => (
                <tr
                  key={row.manifest_no}
                  className={`border-t transition-all duration-200 ${
                    idx % 2 === 0 ? "bg-black" : "bg-gray-400"
                  } hover:bg-gradient-to-r hover:from-indigo-600 hover:to-indigo-500 hover:shadow-md hover:rounded-md`}
                >
                  <td className="p-2">{row.manifest_no}</td>
                  <td className="p-2">{row.destination}</td>
                  <td className="p-2">{row.command}</td>
                  <td className="p-2">{row.origin}</td>
                  <td className="p-2">{row.air_shipping_line}</td>
                  <td className="p-2">{row.voyage_flight_no || "-"}</td>
                  <td className="p-2">
                    {row.date_of_registration
                      ? format(new Date(row.date_of_registration), "yyyy-MM-dd")
                      : "-"}
                  </td>
                  <td className="p-2">
                    {row.date_of_departure
                      ? format(new Date(row.date_of_departure), "yyyy-MM-dd")
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={8}>
                  No manifests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span>
          Page {page} of {Math.ceil(filtered.length / pageSize)}
        </span>
        <Button
          variant="outline"
          disabled={page >= Math.ceil(filtered.length / pageSize)}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}