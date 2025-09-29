"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { AuthError, User } from "@supabase/supabase-js";

export default function AuthPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
        router.push("/dashboard");
      }
    };
    getUser();
  }, [supabase, router]);

  const handleGoogleSignup = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-4">
      <div className="w-full max-w-md bg-white shadow-soft rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary">
          Sign up / Log in
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-accent text-white px-4 py-3 rounded-lg font-semibold shadow transition"
        >
          {loading ? "Loading..." : "Continue with Google"}
        </button>
      </div>
    </div>
  );
}