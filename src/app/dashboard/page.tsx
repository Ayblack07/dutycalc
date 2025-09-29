"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

export default function DashboardPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [trialDaysLeft, setTrialDaysLeft] = useState<number | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);

        // Dummy trial days left (replace with DB logic)
        setTrialDaysLeft(25);
      }
    };
    fetchUser();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:block">
        <div className="p-4 text-xl font-bold text-primary">DutyCalc</div>
        <nav className="space-y-2 p-4">
          <Link href="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">🏠 Dashboard</Link>
          <Link href="/calculator" className="block px-3 py-2 rounded hover:bg-gray-100">🧮 Calculator</Link>
          <Link href="/tariff" className="block px-3 py-2 rounded hover:bg-gray-100">🔍 Tariff Lookup</Link>
          <Link href="/manifest" className="block px-3 py-2 rounded hover:bg-gray-100">📑 Manifest</Link>
          <Link href="/learning-hub" className="block px-3 py-2 rounded hover:bg-gray-100">📚 Learning Hub</Link>
          <Link href="/pricing" className="block px-3 py-2 rounded hover:bg-gray-100">💳 Pricing</Link>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        <div className="bg-white shadow-soft rounded-xl p-6">
          <h1 className="text-2xl font-bold text-primary">
            Welcome {user?.user_metadata?.full_name || "Guest"} 👋
          </h1>
          <p className="text-gray-600">
            {trialDaysLeft
              ? `Your free trial ends in ${trialDaysLeft} days.`
              : "Loading trial info..."}
          </p>
          {trialDaysLeft !== null && trialDaysLeft <= 0 && (
            <Link
              href="/pricing"
              className="inline-block mt-4 bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg shadow"
            >
              Upgrade Now
            </Link>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/calculator" className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            🧮 <span className="font-semibold">Run Calculator</span>
          </Link>
          <Link href="/tariff" className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            🔍 <span className="font-semibold">Tariff Lookup</span>
          </Link>
          <Link href="/manifest" className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            📑 <span className="font-semibold">Check Manifest</span>
          </Link>
        </div>

        {/* Learning Hub Preview */}
        <div className="bg-white rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-bold text-primary mb-4">Learning Hub</h2>
          <ul className="space-y-2 text-gray-700">
            <li>📘 How to use DutyCalc effectively</li>
            <li>📘 Understanding Tariff Codes</li>
            <li>📘 Import duty basics in Nigeria</li>
          </ul>
          <Link
            href="/learning-hub"
            className="inline-block mt-4 text-primary font-semibold"
          >
            Explore more →
          </Link>
        </div>
      </main>
    </div>
  );
}