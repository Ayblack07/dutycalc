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

  const [currencies, setCurrencies] = useState<string[]>([]);
  const [invoiceCurrency, setInvoiceCurrency] = useState<string>("USD");
  const [invoiceExchangeRate, setInvoiceExchangeRate] = useState<number>(1550);
  const [manualInvoiceRate, setManualInvoiceRate] = useState<boolean>(false);
  const [invoice, setInvoice] = useState<number | undefined>(undefined);

  const [freightCurrency, setFreightCurrency] = useState<string>("USD");
  const [freightExchangeRate, setFreightExchangeRate] = useState<number>(1550);
  const [manualFreightRate, setManualFreightRate] = useState<boolean>(false);
  const [freight, setFreight] = useState<number | undefined>(undefined);

  const [dutyRate, setDutyRate] = useState<number>(0);
  const [levyRate, setLevyRate] = useState<number>(0);
  const [insurance, setInsurance] = useState<number | undefined>(undefined);
  const [manualInsurance, setManualInsurance] = useState<boolean>(false);
  const [calculationType, setCalculationType] = useState<string>("withVAT");

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
      const unique = Array.from(new Set(data.map((r: { code: string }) => r.code)));
      setCurrencies(unique);
      if (!invoiceCurrency && unique.length > 0) setInvoiceCurrency(unique[0]);
      if (!freightCurrency && unique.length > 0) setFreightCurrency(unique[0]);
    };
    fetchCurrencies();
  }, []);

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

  const invoiceNGN = (invoice || 0) * (invoiceExchangeRate || 0);
  const freightNGN = (freight || 0) * (freightExchangeRate || 0);
  const calculatedInsurance = (invoiceNGN + freightNGN) * 0.015;
  const finalInsurance =
    manualInsurance && insurance !== undefined ? insurance : calculatedInsurance;

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
            {/* Mode + Tariff */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div className="w-full">
                <Label>Calculation Mode</Label>
                <Select onValueChange={setCalculationType} defaultValue="withVAT">
                  <SelectTrigger className="border border-white">
                    <SelectValue placeholder="Select Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#021b22] text-white">
                    <SelectItem value="withVAT">WITH VAT</SelectItem>
                    <SelectItem value="noVAT">NO VAT</SelectItem>
                    <SelectItem value="idec">IDEC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Link href="/tariff" className="w-full sm:w-auto">
                <Button
                  size="sm"
                  className="bg-[#607B09] hover:bg-[#4c6307] text-white w-full sm:w-auto"
                >
                  <LinkIcon className="w-3 h-3 mr-1" />
                  Check Tariff
                </Button>
              </Link>
            </div>

            {/* Invoice */}
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
                  className="placeholder:text-white/70 border border-white"
                />
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="number"
                    value={invoiceExchangeRate ?? ""}
                    onChange={(e) => {
                      setInvoiceExchangeRate(parseFloat(e.target.value) || 0);
                      setManualInvoiceRate(true);
                    }}
                    className="w-36 placeholder:text-white/70 border border-white"
                  />
                </div>
              </div>
            </div>

            {/* Freight */}
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
                  className="placeholder:text-white/70 border border-white"
                />
                <div className="flex gap-2 items-center">
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
                  <Input
                    type="number"
                    value={freightExchangeRate ?? ""}
                    onChange={(e) => {
                      setFreightExchangeRate(parseFloat(e.target.value) || 0);
                      setManualFreightRate(true);
                    }}
                    className="w-36 placeholder:text-white/70 border border-white"
                  />
                </div>
              </div>
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
                className="placeholder:text-white/70 border border-white"
              />
            </div>

            {/* Duty & Levy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <Label>Duty Rate (%)</Label>
                <Input
                  type="number"
                  value={dutyRate || ""}
                  onChange={(e) => setDutyRate(parseFloat(e.target.value) || 0)}
                  className="placeholder:text-white/70 border border-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-full">
                  <Label>Levy Rate (%)</Label>
                  <Input
                    type="number"
                    value={levyRate || ""}
                    onChange={(e) => setLevyRate(parseFloat(e.target.value) || 0)}
                    className="placeholder:text-white/70 border border-white"
                  />
                </div>
                <Link href="/exchange-rate">
                  <Button
                    size="sm"
                    className="bg-[#607B09] hover:bg-[#4c6307] text-white"
                  >
                    <LinkIcon className="w-3 h-3 mr-1" />
                    Exchange Rates
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="bg-gradient-to-br from-[#09607B] to-[#1B8B77] text-white border border-white rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between font-bold border-t border-white pt-2 mt-2">
              <span>{getCalculationLabel()}:</span>
              <span className="text-green-500">{formatCurrency(getFinalTotal())}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}