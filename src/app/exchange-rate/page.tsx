"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { exchangeRatesData } from "@/data/exchangeRates";

export default function ExchangeRatePage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Exchange Rates</h1>
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
              {exchangeRatesData.map((rate) => (
                <tr key={rate.code} className="hover:bg-gray-900">
                  <td className="border border-gray-700 px-4 py-2">
                    {rate.name}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {rate.code}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
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