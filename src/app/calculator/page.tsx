import DutyCalculator from "@/components/DutyCalculator";

export default function CalculatorPage() {
  return (
    <main className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">
        Customs Duty Calculator
      </h1>
      <DutyCalculator />
    </main>
  );
}