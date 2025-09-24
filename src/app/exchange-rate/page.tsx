"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabaseClient";

type ExchangeRate = {
  id: number;
  code: string;
  name: string;
  value: number;
  date: string;
};

export default function ExchangeRatePage() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);

  useEffect(() => {
    const fetchRates = async () => {
      const { data, error } = await supabase
        .from("exchange_rate")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
      } else {
        setRates(data || []);
      }
    };

    fetchRates();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Exchange Rates</h1>
      <Card className="bg-[#0D0E10] text-white shadow-md">
        <CardHeader>
          <CardTitle>Current Exchange Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse border border-gray-700 text-left">
            <thead>
              <tr className="bg-gray-800">
                <th className="border border-gray-700 px-4 py-2">Name</th>
                <th className="border border-gray-700 px-4 py-2">Code</th>
                <th className="border border-gray-700 px-4 py-2">Value (₦)</th>
              </tr>
            </thead>
            <tbody>
              {rates.map((rate) => (
                <tr key={rate.id} className="hover:bg-gray-900">
                  <td className="border border-gray-700 px-4 py-2">
                    {rate.name}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {rate.code}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 font-semibold bg-gradient-to-r from-red-400 via-orange-300 to-green-500 bg-clip-text text-transparent animate-pulse">
                    {rate.value.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}