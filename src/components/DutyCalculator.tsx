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
import { Copy, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Link from "next/link";
import { exchangeRatesData } from "@/data/exchangeRates";

// Convert array to map for easier lookup
const exchangeRates: Record<string, number> = exchangeRatesData.reduce(
  (acc, curr) => {
    acc[curr.code] = curr.value;
    return acc;
  },
  {} as Record<string, number>
);

export default function DutyCalculator() {
  const { toast } = useToast();

  // States
  const [dutyRate, setDutyRate] = useState<number>(0);
  const [levyRate, setLevyRate] = useState<number>(0);
  const [invoice, setInvoice] = useState<number>(0);
  const [freight, setFreight] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("USD");
  const [exchangeRate, setExchangeRate] = useState<number>(1550);
  const [manualExchangeRate, setManualExchangeRate] = useState<boolean>(false);
  const [insurance, setInsurance] = useState<number>(0);
  const [manualInsurance, setManualInsurance] = useState<boolean>(false);
  const [calculationType, setCalculationType] = useState<string>("withVAT");

  // Auto-update exchange rate
  useEffect(() => {
    if (
      !manualExchangeRate &&
      exchangeRates[currency as keyof typeof exchangeRates]
    ) {
      setExchangeRate(exchangeRates[currency as keyof typeof exchangeRates]);
    }
  }, [currency, manualExchangeRate]);

  // Convert invoice/freight into NGN
  const invoiceNGN = invoice * exchangeRate;
  const freightNGN = freight * exchangeRate;

  // Insurance calculation
  const calculatedInsurance = manualInsurance
    ? insurance
    : (invoiceNGN + freightNGN) * 0.015;
  const finalInsurance = manualInsurance ? insurance : calculatedInsurance;

  // Main calculations
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

  // Pick calculation mode
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

  // Copy breakdown (matches calculation type)
  const copyBreakdown = () => {
    let breakdown = `
DUTY CALC - CUSTOMS DUTY CALCULATION
====================================
Invoice: ${currency} ${invoice.toLocaleString()} → ${formatCurrency(invoiceNGN)}
Freight: ${currency} ${freight.toLocaleString()} → ${formatCurrency(freightNGN)}
Exchange Rate: ${exchangeRate}
Insurance: ${formatCurrency(finalInsurance)}

RESULTS:
CIF: ${formatCurrency(cif)}
`;

    if (calculationType === "idec") {
      breakdown += `
FCS (4%): ${formatCurrency(fcs)}
ETLS (0.5%): ${formatCurrency(etls)}
`;
    } else {
      breakdown += `
FCS (4%): ${formatCurrency(fcs)}
Duty (${dutyRate}%): ${formatCurrency(duty)}
Levy (${levyRate}%): ${formatCurrency(levy)}
Surcharge (7%): ${formatCurrency(surcharge)}
ETLS (0.5%): ${formatCurrency(etls)}
`;

      if (calculationType === "withVAT") {
        breakdown += `VAT (7.5%): ${formatCurrency(vat)}\n`;
      }
    }

    breakdown += `
TOTAL:
${getCalculationLabel()}: ${formatCurrency(getFinalTotal())}
    `;

    navigator.clipboard.writeText(breakdown);
    toast({
      title: "Breakdown Copied!",
      description: "Calculation breakdown copied to clipboard.",
    });
  };

  // Download PDF (matches calculation type)
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Duty Calc - Customs Duty Calculation", 14, 20);

    const tableBody: (string | number)[][] = [
      ["Invoice", `${currency} ${invoice} → ${formatCurrency(invoiceNGN)}`],
      ["Freight", `${currency} ${freight} → ${formatCurrency(freightNGN)}`],
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

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Value"]],
      body: tableBody,
      theme: "grid",
      styles: {
        fontSize: 12,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [0, 0, 0],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });

    doc.save("duty-calculation.pdf");
    toast({
      title: "PDF Downloaded",
      description: "Your duty calculation has been saved as PDF.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Customs Duty Calculator</h1>
        <p className="text-gray-300">
          Calculate accurate import duties and taxes for Nigeria
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-to-b from-[#3f3f3f] to-black text-white border border-blue-900 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Input Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Calculation Mode at top */}
            <div>
              <Label>Calculation Mode</Label>
              <Select onValueChange={setCalculationType} defaultValue="withVAT">
                <SelectTrigger>
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  <SelectItem
                    value="withVAT"
                    className="hover:bg-[#F7D234] hover:text-black data-[state=checked]:bg-[#F7D234] data-[state=checked]:text-black"
                  >
                    WITH VAT
                  </SelectItem>
                  <SelectItem
                    value="noVAT"
                    className="hover:bg-[#F7D234] hover:text-black data-[state=checked]:bg-[#F7D234] data-[state=checked]:text-black"
                  >
                    NO VAT
                  </SelectItem>
                  <SelectItem
                    value="idec"
                    className="hover:bg-[#F7D234] hover:text-black data-[state=checked]:bg-[#F7D234] data-[state=checked]:text-black"
                  >
                    IDEC
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Invoice ({currency})</Label>
              <Input
                type="number"
                value={invoice}
                onChange={(e) => setInvoice(parseFloat(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-400">
                = {formatCurrency(invoiceNGN)}
              </p>
            </div>

            <div>
              <Label>Freight ({currency})</Label>
              <Input
                type="number"
                value={freight}
                onChange={(e) => setFreight(parseFloat(e.target.value) || 0)}
              />
              <p className="text-sm text-gray-400">
                = {formatCurrency(freightNGN)}
              </p>
            </div>

            <div>
              <Label>Currency</Label>
              <Select onValueChange={setCurrency} defaultValue="USD">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black text-white">
                  {Object.keys(exchangeRates).map((curr) => (
                    <SelectItem
                      key={curr}
                      value={curr}
                      className="hover:bg-[#F7D234] hover:text-black data-[state=checked]:bg-[#F7D234] data-[state=checked]:text-black"
                    >
                      {curr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Exchange Rate (NGN)</Label>
              <Input
                type="number"
                value={exchangeRate}
                onChange={(e) => {
                  setExchangeRate(parseFloat(e.target.value) || 0);
                  setManualExchangeRate(true);
                }}
              />
              <p className="text-xs text-gray-400">
                You can enter your desired exchange rate value
              </p>
            </div>

            <div>
              <Label>Insurance (NGN)</Label>
              <Input
                type="number"
                value={insurance}
                onChange={(e) => {
                  setInsurance(parseFloat(e.target.value) || 0);
                  setManualInsurance(true);
                }}
              />
              {!manualInsurance && (
                <p className="text-sm text-gray-400">
                  Auto: {formatCurrency(calculatedInsurance)}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Duty Rate (%)</Label>
                <Input
                  type="number"
                  value={dutyRate}
                  onChange={(e) => setDutyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Levy Rate (%)</Label>
                <Input
                  type="number"
                  value={levyRate}
                  onChange={(e) => setLevyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-gradient-to-b from-[#3f3f3f] to-black text-white border border-blue-900 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between border-b border-gray-700 pb-2">
              <span>Calculation Results</span>
              <div className="flex gap-2">
                <Button onClick={copyBreakdown} size="sm" variant="outline" 
                className="bg-[#036336] hover:bg-[#063064] hover:text-white transition-colors">
                  <Copy  />
                  Copy
                </Button>
                <Button onClick={downloadPDF} size="sm" variant="outline" 
                className="bg-[#c4683e] hover:bg-[#990909] hover:text-white transition-colors">
                  <Download  />
                  PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between border-b border-gray-700 pb-1">
                <span>CIF:</span>
                <span>{formatCurrency(cif)}</span>
              </div>

              {/* Conditionally show based on calc type */}
              <div className="space-y-1 pt-2">
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
              </div>

              {/* Total */}
              <div className="flex justify-between font-bold border-t border-gray-700 pt-2 mt-2">
                <span>{getCalculationLabel()}:</span>
                <span>{formatCurrency(getFinalTotal())}</span>
              </div>
            </div>

            {/* Check exchange rate */}
            <div className="mt-6 text-center">
              <Link href="/exchange-rate">
                <Button className="bg-[#F7D234] text-black hover:bg-yellow-400">
                  Check Exchange Rates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}