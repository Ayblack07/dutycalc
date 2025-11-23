"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // Save dummy login state
    localStorage.setItem("loggedIn", "true");

    router.push("/dashboard");
  };

  const handleGoogleLogin = () => {
    // Save dummy login state
    localStorage.setItem("loggedIn", "true");

    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#09607B] p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            Dutycalc
          </h2>
          <p className="text-white text-center mb-6">
            Sign in to your account
          </p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 rounded border border-gray-300 focus:outline-none"
              required
            />
            <button
              type="submit"
              className="p-3 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
            >
              Login
            </button>
          </form>

          <div className="my-4 flex items-center">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-white text-sm">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center p-3 rounded bg-white border border-gray-300 hover:bg-gray-100 gap-2"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-white text-center text-sm">
            Don’t have an account?{" "}
            <a href="/register" className="underline font-semibold">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
