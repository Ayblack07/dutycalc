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

export default function ExchangeRateClient() {
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
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-white">
        Exchange Rates
      </h1>

      <Card className="bg-[#0D0E10] text-white shadow-md">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Current Exchange Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* ✅ Mobile responsive scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-700 text-left text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-800">
                  <th className="border border-gray-700 px-3 sm:px-4 py-2">
                    Name
                  </th>
                  <th className="border border-gray-700 px-3 sm:px-4 py-2">
                    Code
                  </th>
                  <th className="border border-gray-700 px-3 sm:px-4 py-2">
                    Value (₦)
                  </th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr
                    key={rate.id}
                    className="hover:bg-gray-900 transition-colors"
                  >
                    <td className="border border-gray-700 px-3 sm:px-4 py-2 whitespace-nowrap">
                      {rate.name}
                    </td>
                    <td className="border border-gray-700 px-3 sm:px-4 py-2 whitespace-nowrap">
                      {rate.code}
                    </td>
                    <td className="border border-gray-700 px-3 sm:px-4 py-2 font-bold bg-gradient-to-r from-green-500 via-green-300 to-orange-200 bg-clip-text text-transparent animate-pulse whitespace-nowrap">
                      {rate.value.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}