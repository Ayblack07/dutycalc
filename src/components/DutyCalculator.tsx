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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function DutyCalculator() {
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  // currencies list (codes) fetched from supabase
  const [currencies, setCurrencies] = useState<string[]>([]);

  // Invoice-specific
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("USD");
  const [invoiceExchangeRate, setInvoiceExchangeRate] = useState<number>(1550);
  const [manualInvoiceRate, setManualInvoiceRate] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<number | undefined>(undefined);

  // Freight-specific
  const [freightCurrency, setFreightCurrency] = useState<string>("USD");
  const [freightExchangeRate, setFreightExchangeRate] = useState<number>(1550);
  const [manualFreightRate, setManualFreightRate] = useState<boolean>(false);
  const [freight, setFreight] = useState<number | undefined>(undefined);

  // Other states
  const [dutyRate, setDutyRate] = useState<number>(0);
  const [levyRate, setLevyRate] = useState<number>(0);
  const [insurance, setInsurance] = useState<number | undefined>(undefined);
  const [manualInsurance, setManualInsurance] = useState<boolean>(false);
  const [calculationType, setCalculationType] = useState<string>("withVAT");

  // fetch list of currency codes once on mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      const { data, error } = await supabase
        .from("exchange_rate")
        .select("code")
        .order("code", { ascending: true });

      if (error) {
        console.error("Failed to fetch currency codes:", error);
        return;
      }
      if (!data) return;
      const unique = Array.from(new Set(data.map((r: {code : string}) => r.code)));
      setCurrencies(unique);
      // set defaults if not already set
      if (!invoiceCurrency && unique.length > 0) setInvoiceCurrency(unique[0]);
      if (!freightCurrency && unique.length > 0) setFreightCurrency(unique[0]);
    };
    fetchCurrencies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // fetch most recent invoice exchange rate when invoiceCurrency changes (unless manual)
  useEffect(() => {
    const fetchRate = async () => {
      if (!invoiceCurrency || manualInvoiceRate) return;
      const { data, error } = await supabase
        .from("exchange_rate")
        .select("value")
        .eq("code", invoiceCurrency)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (!error && data && typeof data.value === "number") {
        setInvoiceExchangeRate(data.value);
      }
    };
    fetchRate();
  }, [invoiceCurrency, manualInvoiceRate, supabase]);

  // fetch most recent freight exchange rate when freightCurrency changes (unless manual)
  useEffect(() => {
    const fetchRate = async () => {
      if (!freightCurrency || manualFreightRate) return;
      const { data, error } = await supabase
        .from("exchange_rate")
        .select("value")
        .eq("code", freightCurrency)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      if (!error && data && typeof data.value === "number") {
        setFreightExchangeRate(data.value);
      }
    };
    fetchRate();
  }, [freightCurrency, manualFreightRate, supabase]);

  // NGN conversions (live previews)
  const invoiceNGN = (invoice || 0) * (invoiceExchangeRate || 0);
  const freightNGN = (freight || 0) * (freightExchangeRate || 0);

  // Insurance calculation: 1.5% of (invoiceNGN + freightNGN), unless manual override
  const calculatedInsurance = (invoiceNGN + freightNGN) * 0.015;
  const finalInsurance =
    manualInsurance && insurance !== undefined ? insurance : calculatedInsurance;

  // core calculations (use invoiceNGN and freightNGN)
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

  // COPY breakdown (includes both currencies & NGN values)
  const copyBreakdown = () => {
    let breakdown = `DUTY CALC - CUSTOMS DUTY CALCULATION
==================================================
Invoice: ${invoiceCurrency} ${invoice ?? 0} → ${formatCurrency(invoiceNGN)}
Invoice Exchange Rate: ${invoiceExchangeRate}
Freight: ${freightCurrency} ${freight ?? 0} → ${formatCurrency(freightNGN)}
Freight Exchange Rate: ${freightExchangeRate}
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

  // PDF (shows invoice/freight currencies & conversions)
  const downloadPDF = () => {
    const doc = new jsPDF();

    // Header + title
    doc.setFontSize(16);
    doc.text("Dutycalc", 14, 12);
    doc.setFontSize(14);
    doc.text("Customs Duty Calculation", 14, 20);

    // table body with clear entries
    const tableBody: (string | number)[][] = [
      [
        "Invoice",
        `${invoiceCurrency} ${invoice ?? 0} → ${formatCurrency(invoiceNGN)}`,
      ],
      [
        "Invoice Exchange Rate",
        invoiceExchangeRate !== undefined ? invoiceExchangeRate : "-",
      ],
      [
        "Freight",
        `${freightCurrency} ${freight ?? 0} → ${formatCurrency(freightNGN)}`,
      ],
      [
        "Freight Exchange Rate",
        freightExchangeRate !== undefined ? freightExchangeRate : "-",
      ],
      ["Insurance", formatCurrency(finalInsurance)],
      ["CIF", formatCurrency(cif)],
    ];

    if (calculationType === "idec") {
      tableBody.push(["FCS (4%)", formatCurrency(fcs)]);
      tableBody.push(["ETLS (0.5%)", formatCurrency(etls)]);
    } else {
      tableBody.push(["FCS (4%)", formatCurrency(fcs)]);
      tableBody.push(["Duty", formatCurrency(duty)]);
      tableBody.push(["Levy", formatCurrency(levy)]);
      tableBody.push(["Surcharge (7%)", formatCurrency(surcharge)]);
      tableBody.push(["ETLS (0.5%)", formatCurrency(etls)]);
      if (calculationType === "withVAT") {
        tableBody.push(["VAT (7.5%)", formatCurrency(vat)]);
      }
    }

    tableBody.push([getCalculationLabel(), formatCurrency(getFinalTotal())]);

    autoTable(doc, {
      startY: 28,
      head: [["Item", "Value"]],
      body: tableBody,
      theme: "grid",
      styles: {
        fontSize: 11,
        cellPadding: { top: 1.5, right: 2, bottom: 1.5, left: 2 },
      },
      headStyles: { fillColor: [40, 40, 40], textColor: 255 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.text("Generated from dutycalc.ng", 14, pageHeight - 8);

    doc.save("duty-calculation.pdf");

    toast({
      title: "PDF Downloaded",
      description: "Your duty calculation PDF is ready.",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Customs Duty Calculator</h1>
        <p className="text-black text-sm sm:text-base">
          Calculate import duties & taxes for Nigeria
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white border border-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Input Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode + Tariff link (kept unchanged) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="w-full">
                <Label>Calculation Mode</Label>
                <div>
                  <Select onValueChange={setCalculationType} defaultValue="withVAT">
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#021b22] text-white">
                      <SelectItem value="withVAT">WITH VAT</SelectItem>
                      <SelectItem value="noVAT">NO VAT</SelectItem>
                      <SelectItem value="idec">IDEC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Link href="/tariff" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#607b09] hover:[#4c6307] text-white w-full sm:w-auto"
                >
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Check Tariff
                </Button>
              </Link>
            </div>

            {/* Invoice block */}
            <div>
              <Label>Invoice</Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Input
                  type="number"
                  value={invoice ?? ""}
                  onChange={(e) =>
                    setInvoice(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  placeholder="Amount (leave empty if none)"
                />

                <div className="flex gap-2 items-center">
                  <div>
                    <Label className="sr-only">Invoice Currency</Label>
                    <Select
                      onValueChange={(v) => {
                        setInvoiceCurrency(v);
                        setManualInvoiceRate(false);
                      }}
                      defaultValue={invoiceCurrency}
                    >
                      <SelectTrigger className="border border-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#021b22] text-white max-h-60 overflow-y-auto">
                        {currencies.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="sr-only">Invoice Exchange Rate</Label>
                    <Input
                      type="number"
                      value={invoiceExchangeRate ?? ""}
                      onChange={(e) => {
                        setInvoiceExchangeRate(parseFloat(e.target.value) || 0);
                        setManualInvoiceRate(true);
                      }}
                      className="w-36"
                    />
                  </div>
                </div>
              </div>

              {invoice !== undefined && (
                <p className="text-sm text-white mt-1">
                  = {formatCurrency(invoiceNGN)}
                </p>
              )}
            </div>

            {/* Freight block */}
            <div>
              <Label>Freight</Label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Input
                  type="number"
                  value={freight ?? ""}
                  onChange={(e) =>
                    setFreight(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  placeholder="Amount (leave empty if none)"
                />

                <div className="flex gap-2 items-center">
                  <div>
                    <Label className="sr-only">Freight Currency</Label>
                    <Select
                      onValueChange={(v) => {
                        setFreightCurrency(v);
                        setManualFreightRate(false);
                      }}
                      defaultValue={freightCurrency}
                    >
                      <SelectTrigger className="border border-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#021b22] text-white max-h-60 overflow-y-auto">
                        {currencies.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="sr-only">Freight Exchange Rate</Label>
                    <Input
                      type="number"
                      value={freightExchangeRate ?? ""}
                      onChange={(e) => {
                        setFreightExchangeRate(parseFloat(e.target.value) || 0);
                        setManualFreightRate(true);
                      }}
                      className="w-36"
                    />
                  </div>
                </div>
              </div>

              {freight !== undefined && (
                <p className="text-sm text-white mt-1">
                  = {formatCurrency(freightNGN)}
                </p>
              )}
            </div>

            {/* Insurance */}
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
              {!manualInsurance && (
                <p className="text-sm text-white mt-1">
                  Auto: {formatCurrency(calculatedInsurance)}
                </p>
              )}
            </div>

            {/* Duty & Levy */}
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
                    className="bg-[#607b09] hover:[#4c6307] text-white"
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
        <Card className="bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white border border-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white pb-2">
              <span>Results</span>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  size="sm"
                  onClick={copyBreakdown}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                >
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  onClick={downloadPDF}
                  className="bg-[#ff0000] hover:bg-[#cc0000] text-white flex-1 sm:flex-none"
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

              <div className="flex justify-between font-bold border-t border-white pt-2 mt-2">
                <span>{getCalculationLabel()}:</span>
                <span className="text-green-500">{formatCurrency(getFinalTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}