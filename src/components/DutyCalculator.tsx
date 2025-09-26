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

  // currencies list
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

  // fetch currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      const { data } = await supabase
        .from("exchange_rate")
        .select("code")
        .order("code", { ascending: true });

      if (!data) return;
      const unique = Array.from(new Set(data.map((r: { code: string }) => r.code)));
      setCurrencies(unique);
    };
    fetchCurrencies();
  }, [supabase]);

  // conversions
  const invoiceNGN = (invoice || 0) * (invoiceExchangeRate || 0);
  const freightNGN = (freight || 0) * (freightExchangeRate || 0);
  const calculatedInsurance = (invoiceNGN + freightNGN) * 0.015;
  const finalInsurance =
    manualInsurance && insurance !== undefined ? insurance : calculatedInsurance;

  // duty calc
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
    }).format(amount);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 bg-[#F6F7F9] rounded-lg">
      {/* Page Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-[#09607B]">
          Customs Duty Calculator
        </h1>
        <p className="text-gray-600">
          Calculate import duties & taxes for Nigeria quickly and accurately
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#09607B] to-[#1B8B77] text-white px-3 py-2 rounded-md text-lg">
              Input Values
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mode */}
            <div>
              <Label>Calculation Mode</Label>
              <Select onValueChange={setCalculationType} defaultValue="withVAT">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="withVAT">With VAT</SelectItem>
                  <SelectItem value="noVAT">No VAT</SelectItem>
                  <SelectItem value="idec">IDEC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice */}
            <div>
              <Label>Invoice</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={invoice ?? ""}
                  onChange={(e) =>
                    setInvoice(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  placeholder="Amount"
                />
                <Select
                  onValueChange={(v) => setInvoiceCurrency(v)}
                  defaultValue={invoiceCurrency}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={invoiceExchangeRate}
                  onChange={(e) => setInvoiceExchangeRate(Number(e.target.value))}
                  className="w-24"
                />
              </div>
              {invoice !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
                  = {formatCurrency(invoiceNGN)}
                </p>
              )}
            </div>

            {/* Freight */}
            <div>
              <Label>Freight</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={freight ?? ""}
                  onChange={(e) =>
                    setFreight(e.target.value ? parseFloat(e.target.value) : undefined)
                  }
                  placeholder="Amount"
                />
                <Select
                  onValueChange={(v) => setFreightCurrency(v)}
                  defaultValue={freightCurrency}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-56">
                    {currencies.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={freightExchangeRate}
                  onChange={(e) => setFreightExchangeRate(Number(e.target.value))}
                  className="w-24"
                />
              </div>
              {freight !== undefined && (
                <p className="text-sm text-gray-500 mt-1">
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
                <p className="text-sm text-gray-500 mt-1">
                  Auto: {formatCurrency(calculatedInsurance)}
                </p>
              )}
            </div>

            {/* Duty & Levy */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Duty Rate (%)</Label>
                <Input
                  type="number"
                  value={dutyRate || ""}
                  onChange={(e) => setDutyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Levy Rate (%)</Label>
                <Input
                  type="number"
                  value={levyRate || ""}
                  onChange={(e) => setLevyRate(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="bg-white shadow-md border border-gray-200">
          <CardHeader>
            <CardTitle className="bg-gradient-to-r from-[#607B09] to-[#1B8B77] text-white px-3 py-2 rounded-md text-lg flex justify-between items-center">
              <span>Results</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => toast({ title: "Copied!" })}>
                  <Copy className="w-4 h-4 mr-1" /> Copy
                </Button>
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Download className="w-4 h-4 mr-1" /> PDF
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between font-semibold">
                <span>CIF:</span>
                <span className="text-[#09607B]">{formatCurrency(cif)}</span>
              </div>

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

              <div className="flex justify-between font-bold border-t pt-2 mt-2">
                <span>{getCalculationLabel()}:</span>
                <span className="text-[#607B09]">{formatCurrency(getFinalTotal())}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}