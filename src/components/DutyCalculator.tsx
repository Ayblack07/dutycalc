"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Download, Link as LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

// -------------------------------------------------

export default function DutyCalculator() {
  const { toast } = useToast();

  // States
  const [dutyRate, setDutyRate] = useState<number>(0);
  const [levyRate, setLevyRate] = useState<number>(0);
  const [invoice, setInvoice] = useState<number | undefined>(undefined);
  const [freight, setFreight] = useState<number | undefined>(undefined);
  const [currency, setCurrency] = useState<string>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(0); // ✅ no default
  const [manualExchangeRate, setManualExchangeRate] = useState<boolean>(false);
  const [insurance, setInsurance] = useState<number | undefined>(undefined); // ✅ no default
  const [manualInsurance, setManualInsurance] = useState<boolean>(false);
  const [calculationType, setCalculationType] = useState<string>("withVAT");

  // ✅ Fetch latest exchange rate from Supabase when currency changes
  useEffect(() => {
    const fetchRate = async () => {
      if (!manualExchangeRate) {
        const { data, error } = await supabase
          .from("exchange_rate")
          .select("value")
          .eq("code", currency)
          .order("date", { ascending: false })
          .limit(1)
          .single();

        if (!error && data) {
          setExchangeRate(data.value);
        }
      }
    };
    fetchRate();
  }, [currency, manualExchangeRate]);

  // NGN values
  const invoiceNGN = (invoice || 0) * exchangeRate;
  const freightNGN = (freight || 0) * exchangeRate;

  // Insurance
  const calculatedInsurance = (invoiceNGN + freightNGN) * 0.015;
  const finalInsurance = manualInsurance
    ? insurance || 0
    : calculatedInsurance;

  // Calculations
  const cif = invoiceNGN + freightNGN + finalInsurance;
  const fcs = invoiceNGN * 0.04;
  const duty = cif * (dutyRate / 100);
  const levy = cif * (levyRate / 100);
  const surcharge = duty * 0.07;
  const etls = cif * 0.005;
  const vat = (cif + fcs + surcharge + etls + duty + levy) * 0.075;

  const totalDuty = fcs + surcharge + etls + duty + levy + vat;
  const noVat = fcs + surcharge + etls + duty + levy;
  const withIdec = fcs + etls;

  // Pick mode
  const getFinalTotal = () => {
    switch (calculationType) {
      case "noVAT":
        return noVat;
      case "idec":
        return withIdec;
      default:
        return totalDuty;
    }
  };

  const getCalculationLabel = () => {
    switch (calculationType) {
      case "noVAT":
        return "Total (No VAT)";
      case "idec":
        return "Total (IDEC)";
      default:
        return "Total Duty";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 2,
    }).format(amount);

  // Copy breakdown
  const copyBreakdown = () => {
    let breakdown = `DUTY CALC - CUSTOMS DUTY CALCULATION
==================================================
Invoice: ${currency} ${invoice || 0} → ${formatCurrency(invoiceNGN)}
Freight: ${currency} ${freight || 0} → ${formatCurrency(freightNGN)}
Exchange Rate: ${exchangeRate}
Insurance: ${formatCurrency(finalInsurance)}

CIF: ${formatCurrency(cif)}
`;

    if (calculationType === "idec") {
      breakdown += `FCS (4%): ${formatCurrency(fcs)}
ETLS (0.5%): ${formatCurrency(etls)}
`;
    } else {
      breakdown += `FCS (4%): ${formatCurrency(fcs)}
Duty (${dutyRate}%): ${formatCurrency(duty)}
Levy (${levyRate}%): ${formatCurrency(levy)}
Surcharge (7%): ${formatCurrency(surcharge)}
ETLS (0.5%): ${formatCurrency(etls)}
`;
      if (calculationType === "withVAT") {
        breakdown += `VAT (7.5%): ${formatCurrency(vat)}\n`;
      }
    }

    breakdown += `\n${getCalculationLabel()}: ${formatCurrency(getFinalTotal())}`;

    navigator.clipboard.writeText(breakdown);
    toast({
      title: "Copied!",
      description: "Breakdown copied to clipboard.",
    });
  };

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(16);
    doc.text("Dutycalc", 14, 12);

    // Title
    doc.setFontSize(14);
    doc.text("Customs Duty Calculation", 14, 20);

    // Build table body
    const tableBody: (string | number)[][] = [
      ["Invoice", `${currency} ${invoice || 0} → ${formatCurrency(invoiceNGN)}`],
      ["Freight", `${currency} ${freight || 0} → ${formatCurrency(freightNGN)}`],
      ["Exchange Rate", exchangeRate],
      ["Insurance", formatCurrency(finalInsurance)],
      ["CIF", formatCurrency(cif)],
    ];

    if (calculationType === "idec") {
      tableBody.push(
        ["FCS (4%)", formatCurrency(fcs)],
        ["ETLS (0.5%)", formatCurrency(etls)]
      );
    } else {
      tableBody.push(
        ["FCS (4%)", formatCurrency(fcs)],
        ["Duty", formatCurrency(duty)],
        ["Levy", formatCurrency(levy)],
        ["Surcharge (7%)", formatCurrency(surcharge)],
        ["ETLS (0.5%)", formatCurrency(etls)]
      );
      if (calculationType === "withVAT") {
        tableBody.push(["VAT (7.5%)", formatCurrency(vat)]);
      }
    }

    tableBody.push([getCalculationLabel(), formatCurrency(getFinalTotal())]);

    // Table
    autoTable(doc, {
      startY: 26,
      head: [["Item", "Value"]],
      body: tableBody,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 2 },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.text("Generated from dutycalc.ng", 14, pageHeight - 8);

    doc.save("duty-calculation.pdf");

    toast({
      title: "PDF Downloaded",
      description: "Your duty calculation PDF is ready.",
    });
  };

  // -------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Customs Duty Calculator</h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Calculate import duties & taxes for Nigeria
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-to-br from-[#0D0E10] via-[#1b2a4a] to-[#063064] text-white border border-blue-900 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Input Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div className="w-full">
                <Label>Calculation Mode</Label>
                <Select onValueChange={setCalculationType} defaultValue="withVAT">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-black text-white">
                    <SelectItem value="withVAT">WITH VAT</SelectItem>
                    <SelectItem value="noVAT">NO VAT</SelectItem>
                    <SelectItem value="idec">IDEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href="/tariff">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs px-2 py-1 flex items-center"
                >
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Check Tariff
                </Button>
              </Link>
            </div>

            <div>
              <Label>Invoice ({currency})</Label>
              <Input
                type="number"
                value={invoice ?? ""}
                onChange={(e) =>
                  setInvoice(e.target.value ? parseFloat(e.target.value) : undefined)
                }
              />
              {invoice !== undefined && (
                <p className="text-sm text-gray-400">
                  = {formatCurrency(invoiceNGN)}
                </p>
              )}
            </div>

            <div>
              <Label>Freight ({currency})</Label>
              <Input
                type="number"
                value={freight ?? ""}
                onChange={(e) =>
                  setFreight(e.target.value ? parseFloat(e.target.value) : undefined)
                }
              />
              {freight !== undefined && (
                <p className="text-sm text-gray-400">
                  = {formatCurrency(freightNGN)}
                </p>
              )}
            </div>

            <div>
              <Label>Currency</Label>
              <Select onValueChange={setCurrency} defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exchange Rate (NGN)</Label>
              <Input
                type="number"
                value={exchangeRate || ""}
                onChange={(e) => {
                  setExchangeRate(parseFloat(e.target.value) || 0);
                  setManualExchangeRate(true);
                }}
              />
            </div>

            <div>
              <Label>Insurance (NGN)</Label>
              <Input
                type="number"
                value={insurance ?? ""}
                onChange={(e) => {
                  setInsurance(e.target.value ? parseFloat(e.target.value) : undefined);
                  setManualInsurance(true);
                }}
              />
              {!manualInsurance && insurance === undefined && (
                <p className="text-sm text-gray-400">
                  Auto: {formatCurrency(calculatedInsurance)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <Label>Duty Rate (%)</Label>
                <Input
                  type="number"
                  value={dutyRate || ""}
                  onChange={(e) => setDutyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Label>Levy Rate (%)</Label>
                  <Input
                    type="number"
                    value={levyRate || ""}
                    onChange={(e) => setLevyRate(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <Link href="/exchange-rate">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs px-2 py-1 flex items-center"
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    Exchange Rates
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-gradient-to-br from-[#0D0E10] via-[#1b2a4a] to-[#063064] text-white border border-blue-900 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span>Results</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={copyBreakdown}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  onClick={downloadPDF}
                  className="bg-[#ff0000] hover:bg-[#cc0000] text-white"
                >
                  <Download className="w-4 h-4 mr-1" /> PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {/* CIF */}
              <div className="flex justify-between font-semibold">
                <span>CIF:</span>
                <span className="text-yellow-200">{formatCurrency(cif)}</span>
              </div>

              {calculationType === "idec" ? (
                <>
                  <div className="flex justify-between">
                    <span>FCS (4%):</span>
                    <span>{formatCurrency(fcs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETLS (0.5%):</span>
                    <span>{formatCurrency(etls)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span>FCS (4%):</span>
                    <span>{formatCurrency(fcs)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duty:</span>
                    <span>{formatCurrency(duty)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Levy:</span>
                    <span>{formatCurrency(levy)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Surcharge (7%):</span>
                    <span>{formatCurrency(surcharge)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ETLS (0.5%):</span>
                    <span>{formatCurrency(etls)}</span>
                  </div>
                  {calculationType === "withVAT" && (
                    <div className="flex justify-between">
                      <span>VAT (7.5%):</span>
                      <span>{formatCurrency(vat)}</span>
                    </div>
                  )}
                </>
              )}

              <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
                <span>{getCalculationLabel()}:</span>
                <span className="text-green-500">
                  {formatCurrency(getFinalTotal())}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}