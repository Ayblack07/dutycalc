"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    router.push("/dashboard");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#09607B] p-8">
          <h2 className="text-3xl font-bold text-white text-center mb-6">
            DutyCalc.ng
          </h2>
          <p className="text-white text-center mb-6">Create a new account</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {["firstName", "lastName", "email", "phone", "password", "confirmPassword"].map((field) => (
              <div key={field} className="relative">
                <input
                  type={field.includes("password") ? "password" : field === "email" ? "email" : "text"}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  className="peer p-3 w-full rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                <label
                  htmlFor={field}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-300 peer-focus:text-xs peer-focus:text-yellow-500"
                >
                  {field.replace(/([A-Z])/g, " $1").toUpperCase()}
                </label>
              </div>
            ))}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData((prev) => ({ ...prev, agreedToTerms: e.target.checked }))}
                required
                className="h-4 w-4 text-yellow-500 focus:ring-yellow-500"
              />
              <label htmlFor="agreedToTerms" className="ml-2 text-white text-sm">
                I agree to the{" "}
                <a href="/terms" className="underline font-semibold">
                  terms and conditions
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded bg-yellow-500 text-white font-semibold hover:bg-yellow-600"
            >
              Create Account
            </button>
          </form>

          <div className="my-4 flex items-center">
            <hr className="flex-1 border-gray-300" />
            <span className="px-2 text-white text-sm">or</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <button
            onClick={() => alert("Google login clicked")}
            className="flex items-center justify-center w-full py-3 rounded bg-white border border-gray-300 hover:bg-gray-100 gap-2"
          >
            <img
              src="/google-icon.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="mt-6 text-white text-center text-sm">
            Already have an account?{" "}
            <a href="/login" className="underline font-semibold">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}