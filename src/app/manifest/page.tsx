"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { FileDown, FileSpreadsheet, RotateCcw } from "lucide-react";
import { format, isWithinInterval, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/lib/supabaseClient"; // 👈 import client

export type ManifestRow = {
  sno: number;
  manifest: string;
  destination: string;
  command: string;
  origin: string;
  airline: string;
  voyageNo?: string;
  dateReg: string;    // comes from DB as string
  dateArrival: string;
};

export default function ManifestPage() {
  const [manifests, setManifests] = useState<ManifestRow[]>([]);
  const [keyword, setKeyword] = useState("");
  const [dateRegFrom, setDateRegFrom] = useState<Date | null>(null);
  const [dateRegTo, setDateRegTo] = useState<Date | null>(null);
  const [dateArrivalFrom, setDateArrivalFrom] = useState<Date | null>(null);
  const [dateArrivalTo, setDateArrivalTo] = useState<Date | null>(null);

  // 👇 Fetch data from Supabase on load
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from("manifests").select("*");
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
        (dateRegFrom && dateRegTo &&
          isWithinInterval(regDate, {
            start: startOfDay(dateRegFrom),
            end: endOfDay(dateRegTo),
          })) ||
        (dateRegFrom && !dateRegTo && regDate >= startOfDay(dateRegFrom)) ||
        (!dateRegFrom && dateRegTo && regDate <= endOfDay(dateRegTo));

      const matchArrival =
        (!dateArrivalFrom && !dateArrivalTo) ||
        (dateArrivalFrom && dateArrivalTo &&
          isWithinInterval(arrivalDate, {
            start: startOfDay(dateArrivalFrom),
            end: endOfDay(dateArrivalTo),
          })) ||
        (dateArrivalFrom && !dateArrivalTo && arrivalDate >= startOfDay(dateArrivalFrom)) ||
        (!dateArrivalFrom && dateArrivalTo && arrivalDate <= endOfDay(dateArrivalTo));

      return matchKeyword && matchReg && matchArrival;
    });
  }, [manifests, keyword, dateRegFrom, dateRegTo, dateArrivalFrom, dateArrivalTo]);

  // Reset & quick filters stay same as your code...

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-8">
      {/* same JSX UI you wrote, just swap "manifestData" with "filtered" */}
      ...
    </div>
  );
}