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

  const filtered = useMemo(() => {
    return manifests.filter((row) => {
      const kw = keyword.toLowerCase();
      const matchKeyword =
        !kw ||
        row.manifest.toLowerCase().includes(kw) ||
        row.destination.toLowerCase().includes(kw) ||
        row.command.toLowerCase().includes(kw) ||
        row.airline.toLowerCase().includes(kw);

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

  // 👇 Quick filters
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
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search manifests..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-64"
        />
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

      {/* 🚀 Render table here with {filtered} */}
    </div>
  );
}