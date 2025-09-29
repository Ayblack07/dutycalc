// app/pricing/page.tsx
"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import useUser from "@/lib/useUser";
import { useRouter } from "next/navigation";

// dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () =>
    import("react-paystack").then((mod) => {
      // prefer named export if present
      return (mod as any).PaystackButton || (mod as any).default;
    }),
  { ssr: false }
);

export default function PricingPage() {
  const { user, profile, loading, refreshProfile } = useUser();
  const router = useRouter();

  // Paystack public key from env
  const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_KEY || "";

  const basicAmount = 2500 * 100; // ₦2,500 (in kobo)
  const proAmount = 3000 * 100; // ₦3,000 (in kobo)
  const yearlyBasicAmount = 2000 * 100 * 12; // approximate (example)
  const yearlyProAmount = 2500 * 100 * 12; // approximate (example)

  const commonConfig = useMemo(
    () => ({
      publicKey: PAYSTACK_PUBLIC_KEY,
      email: user?.email ?? "no-reply@dutycalc.ng",
      // reference will be overridden per purchase below
    }),
    [PAYSTACK_PUBLIC_KEY, user?.email]
  );

  // Called when Paystack returns success
  const handleSuccess = async (reference: any, plan: string) => {
    try {
      // call your API route to persist subscription
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, reference }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        // refresh local profile
        await refreshProfile?.();
        // optional navigate to dashboard
        router.push("/dashboard");
      } else {
        console.warn("Subscription API failure:", json);
        // still refresh profile client-side
        await refreshProfile?.();
      }
    } catch (err) {
      console.error("Error in subscription flow:", err);
    }
  };

  const handleClose = () => {
    // user closed the Paystack modal
    console.log("Paystack checkout closed");
  };

  // helper to create config per plan
  const createPaystackProps = (amount: number, planKey: string) => {
    const reference = `${planKey}-${Date.now()}`;
    return {
      email: commonConfig.email,
      amount,
      publicKey: commonConfig.publicKey,
      text: "Pay Now",
      metadata: { plan: planKey },
      reference,
      onSuccess: (ref: any) => handleSuccess(ref, planKey),
      onClose: handleClose,
      className:
        "inline-block px-4 py-2 rounded-md font-semibold text-white shadow transition",
    } as any;
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-primary mb-4">Pricing</h1>
        <p className="text-gray-600 mb-8">
          Choose a plan that suits your needs. You can change or cancel your
          subscription anytime.
        </p>

        {/* Current plan summary */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Your account</h3>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user?.email ?? "Not signed in"}</p>
            </div>
            <div className="p-4 bg-white rounded-md shadow-sm">
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">
                {profile?.subscription_plan ?? "Free"}
                {" • "}
                {profile?.subscription_status ?? "inactive"}
              </p>
            </div>
          </div>
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Free */}
          <div className="bg-white p-6 rounded-xl shadow-soft text-center">
            <h4 className="text-xl font-semibold mb-2">Free</h4>
            <p className="text-gray-600 mb-4">2 calculations / month</p>
            <div className="mb-4">
              <span className="text-3xl font-bold">₦0</span>
            </div>
            <div>
              <Link
                href={user ? "/dashboard" : "/auth"}
                className="inline-block px-4 py-2 bg-[#2D3748] text-white rounded-md"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Basic */}
          <div className="bg-white p-6 rounded-xl shadow-soft text-center">
            <h4 className="text-xl font-semibold mb-2">Basic</h4>
            <p className="text-gray-600 mb-4">Monthly: ₦2,500 • Yearly: ₦2,000/mo</p>
            <div className="mb-4">
              <span className="text-3xl font-bold">₦2,500</span>
              <span className="text-sm text-gray-500"> /month</span>
            </div>

            <div className="flex flex-col gap-2">
              {commonConfig.publicKey ? (
                <>
                  <PaystackButton
                    {...createPaystackProps(basicAmount, "basic-month")}
                    className="bg-accent"
                  />
                  <PaystackButton
                    {...createPaystackProps(yearlyBasicAmount, "basic-year")}
                    className="bg-primary"
                  />
                </>
              ) : (
                <div className="text-sm text-red-500">
                  Paystack public key not configured.
                </div>
              )}
            </div>
          </div>

          {/* Pro */}
          <div className="bg-white p-6 rounded-xl shadow-soft text-center">
            <h4 className="text-xl font-semibold mb-2">Pro</h4>
            <p className="text-gray-600 mb-4">Monthly: ₦3,000 • Yearly: ₦2,500/mo</p>
            <div className="mb-4">
              <span className="text-3xl font-bold">₦3,000</span>
              <span className="text-sm text-gray-500"> /month</span>
            </div>

            <div className="flex flex-col gap-2">
              {commonConfig.publicKey ? (
                <>
                  <PaystackButton
                    {...createPaystackProps(proAmount, "pro-month")}
                    className="bg-accent"
                  />
                  <PaystackButton
                    {...createPaystackProps(yearlyProAmount, "pro-year")}
                    className="bg-primary"
                  />
                </>
              ) : (
                <div className="text-sm text-red-500">
                  Paystack public key not configured.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick note */}
        <div className="mt-8 text-sm text-gray-600">
          <p>
            After a successful payment, your subscription will be activated and
            saved to your profile. To change details, visit your account
            settings.
          </p>
        </div>
      </div>
    </div>
  );
}