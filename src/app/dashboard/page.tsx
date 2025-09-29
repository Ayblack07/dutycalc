"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

// Supabase user type
type User = {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        router.push("/login"); // redirect if not logged in
      } else {
        setUser({
          id: data.user.id,
          email: data.user.email!,
          user_metadata: data.user.user_metadata,
        });
      }
    };

    getUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {user ? (
        <div className="space-y-4">
          <p>
            Welcome,{" "}
            <span className="font-semibold">
              {user.user_metadata?.full_name ?? user.email}
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
}