"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "₦0",
    description: "Great for testing the platform",
    features: ["2 calculations per month", "Limited access to features"],
    buttonText: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Basic",
    price: "₦2,500 / month",
    yearly: "₦2,000 / month (yearly billing)",
    description: "For regular users",
    features: ["Unlimited calculations", "Basic support"],
    buttonText: "Choose Basic",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₦3,000 / month",
    yearly: "₦2,500 / month (yearly billing)",
    description: "Best for professionals and businesses",
    features: [
      "All features unlocked",
      "Priority support",
      "Unlimited calculations",
    ],
    buttonText: "Choose Pro",
    href: "/signup",
    highlight: true,
  },
];

export default function PricingPage() {
  return (
    <div className="bg-[#F6F7F9] min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl font-bold text-[#2D3748] mb-4">Pricing Plans</h1>
        <p className="text-gray-600 mb-12">
          Choose the plan that works best for you. Upgrade anytime.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl shadow-lg p-8 flex flex-col ${
                plan.highlight
                  ? "bg-white border-2 border-[#1B8B77]"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h2 className="text-2xl font-bold text-[#2D3748] mb-2">
                {plan.name}
              </h2>
              <p className="text-xl font-semibold text-[#09607B]">{plan.price}</p>
              {plan.yearly && (
                <p className="text-sm text-gray-500">{plan.yearly}</p>
              )}
              <p className="text-gray-600 my-4">{plan.description}</p>

              <ul className="text-left flex-1 space-y-2 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={18} className="text-[#1B8B77]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center px-4 py-2 rounded-lg font-semibold transition ${
                  plan.highlight
                    ? "bg-[#1B8B77] hover:bg-[#09607B] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-[#2D3748]"
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}