import DutyCalculator from "@/components/DutyCalculator";

export const metadata = {
  title: "Customs Duty Calculator - DutyCalc",
  description:
    "Easily calculate Nigerian customs duties with real-time exchange rates, tariffs, and accurate results.",
};

export default function CalculatorPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <DutyCalculator />
    </main>
  );
}