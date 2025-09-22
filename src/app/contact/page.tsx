"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setStatus("✅ Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("❌ Failed to send. Try again later.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center text-white">Contact Us</h1>
      <p className="text-gray-300 text-center">We’ll get back to you as soon as possible.</p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-[#0D0E10] p-6 rounded-lg border border-[#063064]">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your Name"
          className="w-full p-3 rounded bg-white text-black border border-[#063064]"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Your Email"
          className="w-full p-3 rounded bg-white text-black border border-[#063064]"
          required
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your Message"
          rows={5}
          className="w-full p-3 rounded bg-white text-black border border-[#063064]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#F7D234] text-black font-semibold py-3 rounded hover:bg-[#e0c020]"
        >
          Send Message
        </button>
      </form>

      {status && <p className="text-center text-white">{status}</p>}
    </div>
  );
}