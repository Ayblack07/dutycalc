"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RotateCcw } from "lucide-react";
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
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
  const pageSize = 20;

  const [manifests, setManifests] = useState<ManifestRow[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateDepartureFrom, setDateDepartureFrom] = useState<Date | null>(null);
  const [dateDepartureTo, setDateDepartureTo] = useState<Date | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPage = async (pageNumber: number) => {
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase.from("manifest").select("*", { count: "exact" }).order("manifest_no", { ascending: false });

    // Search filter
    if (keyword.trim()) {
      query = query.ilike("manifest_no", `%${keyword}%`).or(
        `destination.ilike.%${keyword}%,command.ilike.%${keyword}%,air_shipping_line.ilike.%${keyword}%`
      );
    }

    // Registration date filter
    if (dateRegFrom || dateRegTo) {
      query = query.gte("date_of_registration", dateRegFrom ? dateRegFrom.toISOString() : "1900-01-01");
      query = query.lte("date_of_registration", dateRegTo ? endOfDay(dateRegTo).toISOString() : new Date().toISOString());
    }

    // Departure date filter
    if (dateDepartureFrom || dateDepartureTo) {
      query = query.gte("date_of_departure", dateDepartureFrom ? dateDepartureFrom.toISOString() : "1900-01-01");
      query = query.lte("date_of_departure", dateDepartureTo ? endOfDay(dateDepartureTo).toISOString() : new Date().toISOString());
    }

    const { data, count, error } = await query.range(start, end);

    if (error) {
      console.error("Supabase fetch error:", error);
    } else {
      setManifests(data || []);
      setTotalPages(count ? Math.ceil(count / pageSize) : 1);
    }
  };

  // Fetch first page on mount
  useEffect(() => {
    fetchPage(1);
  }, []);

  // Handler for filters: always reset to page 1
  const applyFilters = () => {
    setPage(1);
    fetchPage(1);
  };

  // Quick Filters
  const today = () => {
    const now = new Date();
    setDateRegFrom(startOfDay(now));
    setDateRegTo(endOfDay(now));
    applyFilters();
  };

  const thisWeek = () => {
    const now = new Date();
    setDateRegFrom(startOfWeek(now));
    setDateRegTo(endOfWeek(now));
    applyFilters();
  };

  const thisMonth = () => {
    const now = new Date();
    setDateRegFrom(startOfMonth(now));
    setDateRegTo(endOfMonth(now));
    applyFilters();
  };

  const resetFilters = () => {
    setKeyword("");
    setDateRegFrom(null);
    setDateRegTo(null);
    setDateDepartureFrom(null);
    setDateDepartureTo(null);
    setPage(1);
    fetchPage(1);
  };

  // Pagination handlers
  const prevPage = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
      fetchPage(newPage);
    }
  };
  const nextPage = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
      fetchPage(newPage);
    }
  };

  return (
    <>
      <Head>
        <title>Manifest Checker | Nigeria Customs Manifest Lookup - DutyCalc</title>
        <meta
          name="description"
          content="Search and filter registered manifests by number, destination, command, and shipping line. Stay updated with the latest Nigeria Customs cargo records using DutyCalc."
        />
        <link rel="canonical" href="https://dutycalc.ng/manifest" />
      </Head>

      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8 bg-[#F6F7F9] rounded-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#09607B]">
            DutyCalc Manifest Checker – Nigeria Customs Records
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Search and filter registered manifests by number, destination, command,
            shipping line, or date.
          </p>
        </div>

        {/* Filters */}
        <div className="space-y-4 bg-white p-4 rounded-lg shadow-sm border">
          <Input
            placeholder="Search manifests..."
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              applyFilters();
            }}
            className="w-64"
          />

          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Reg From</Label>
              <Input
                type="date"
                value={dateRegFrom ? format(dateRegFrom, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setDateRegFrom(e.target.value ? new Date(e.target.value) : null);
                  applyFilters();
                }}
              />
            </div>
            <div>
              <Label>Reg To</Label>
              <Input
                type="date"
                value={dateRegTo ? format(dateRegTo, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setDateRegTo(e.target.value ? new Date(e.target.value) : null);
                  applyFilters();
                }}
              />
            </div>
            <div>
              <Label>Departure From</Label>
              <Input
                type="date"
                value={dateDepartureFrom ? format(dateDepartureFrom, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setDateDepartureFrom(e.target.value ? new Date(e.target.value) : null);
                  applyFilters();
                }}
              />
            </div>
            <div>
              <Label>Departure To</Label>
              <Input
                type="date"
                value={dateDepartureTo ? format(dateDepartureTo, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  setDateDepartureTo(e.target.value ? new Date(e.target.value) : null);
                  applyFilters();
                }}
              />
            </div>
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={today} className="bg-primary text-white">
              Today
            </Button>
            <Button variant="outline" onClick={thisWeek} className="bg-[#607b09] text-white">
              This Week
            </Button>
            <Button variant="outline" onClick={thisMonth} className="bg-secondary text-black">
              This Month
            </Button>
            <Button className="bg-red-500 text-white hover:bg-[#4e6707]" onClick={resetFilters}>
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-lg shadow-sm bg-white">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gradient-to-r from-primary to-accent text-white">
              <tr>
                <th className="p-2">Manifest</th>
                <th className="p-2">Port of Entry</th>
                <th className="p-2">Command</th>
                <th className="p-2">Place of Departure</th>
                <th className="p-2">Air/Shipping Line</th>
                <th className="p-2">Voyage/Flight No</th>
                <th className="p-2">Date Reg</th>
                <th className="p-2">Date Dep</th>
              </tr>
            </thead>
            <tbody>
              {manifests.length > 0 ? (
                manifests.map((row, idx) => (
                  <tr
                    key={row.manifest_no}
                    className={`border-t transition-colors duration-200 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-[#F0FDF4]`}
                  >
                    <td className="p-2">{row.manifest_no}</td>
                    <td className="p-2">{row.destination}</td>
                    <td className="p-2">{row.command}</td>
                    <td className="p-2">{row.origin}</td>
                    <td className="p-2">{row.air_shipping_line}</td>
                    <td className="p-2">{row.voyage_flight_no || "-"}</td>
                    <td className="p-2">{row.date_of_registration ? format(new Date(row.date_of_registration), "yyyy-MM-dd") : "-"}</td>
                    <td className="p-2">{row.date_of_departure ? format(new Date(row.date_of_departure), "yyyy-MM-dd") : "-"}</td>
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

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <Button variant="outline" disabled={page === 1} onClick={prevPage}>
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" disabled={page >= totalPages} onClick={nextPage}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}