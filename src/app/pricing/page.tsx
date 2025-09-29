"use client";

import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₦0",
    desc: "Try DutyCalc with limited access",
    features: ["2 calculations / month", "Basic Tariff Lookup"],
    cta: "Get Started",
    href: "/signup",
  },
  {
    name: "Basic",
    price: "₦2,500 / month",
    desc: "Affordable access for individuals",
    features: ["Unlimited calculations", "Tariff & Manifest Lookup"],
    cta: "Subscribe",
    href: "/signup",
    highlight: true,
  },
  {
    name: "Pro",
    price: "₦3,000 / month",
    desc: "Full access for professionals & businesses",
    features: [
      "Unlimited everything",
      "Learning Hub premium",
      "Priority support",
    ],
    cta: "Subscribe",
    href: "/signup",
  },
];

export default function PricingPage() {
  return (
    <div className="bg-background min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold text-primary">Pricing Plans</h1>
        <p className="text-gray-600 mt-2">
          Choose a plan that fits your needs.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl p-6 shadow-soft bg-white border ${
              plan.highlight ? "border-primary shadow-glow" : "border-gray-200"
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-800">{plan.name}</h2>
            <p className="text-2xl font-bold text-primary mt-2">{plan.price}</p>
            <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>

            <ul className="mt-4 space-y-2 text-sm text-gray-700">
              {plan.features.map((f) => (
                <li key={f}>✅ {f}</li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className="block mt-6 bg-primary hover:bg-accent text-white px-4 py-2 rounded-lg font-semibold transition"
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}