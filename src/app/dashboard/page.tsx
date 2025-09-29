"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

type Profile = {
  first_name: string;
  last_name: string;
};

export default function Dashboard() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    getProfile();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">DutyCalc Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome,{" "}
            {profile
              ? `${profile.first_name} ${profile.last_name}`
              : "Loading..."}
            🎉
          </h2>
          <p className="text-gray-600 mt-2">
            Here you can manage your calculations, subscription, and account.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-primary/10 border border-primary rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-primary">
              Duty Calculator
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              Calculate duties with accuracy.
            </p>
          </div>

          <div className="bg-secondary/10 border border-secondary rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-secondary">Tariff Lookup</h3>
            <p className="text-sm text-gray-600 mt-2">
              Explore tariffs and HS codes.
            </p>
          </div>

          <div className="bg-accent/10 border border-accent rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-accent">Learning Hub</h3>
            <p className="text-sm text-gray-600 mt-2">
              Access resources and guides.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}