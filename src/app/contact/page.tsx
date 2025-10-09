// src/app/contact/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Mail, MapPin } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

export default function ContactPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch FAQs from Supabase
  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from("faqs")
        .select("id, question, answer");

      if (error) {
        console.error(error);
      } else {
        setFaqs(data || []);
      }
    };

    fetchFaqs();
  }, []);

  // ✅ Handle form submit → Resend API route
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setSuccess("Your message has been sent successfully!");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-6 py-16 text-black">
      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">Contact Us</h1>
        <p className="text-black mt-4">
          We’d love to hear from you. Send us a message or check our FAQs below.
        </p>
      </section>

      {/* Contact Form + Info */}
      <section className="grid md:grid-cols-2 gap-12 mb-20">
        {/* Form */}
        <div className="bg-primary p-8 rounded-xl shadow">
          <h2 className="text-2xl text-white font-bold mb-6">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full p-3 rounded bg-[#f5f7f9] border border-accent focus:border-[#F7D234]"
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full p-3 rounded bg-[#f5f7f9] border border-accent focus:border-[#F7D234]"
            />
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              required
              className="w-full p-3 rounded bg-[#f5f7f9] border border-accent focus:border-[#F7D234]"
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="w-full p-3 h-32 rounded bg-[#f5f7f9] border border-accent focus:border-[#F7D234]"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#F7D234] text-black font-semibold py-3 rounded hover:bg-[#F4D465] transition"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
            {success && <p className="text-green-500">{success}</p>}
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>

        {/* Contact Info */}
        <div className="bg-primary p-8 rounded-xl shadow space-y-6">
          <h2 className="text-2xl text-white font-bold mb-6">Our Contact</h2>
          <div className="flex items-center gap-3">
            <Mail className="text-[#F7D234]" />
            <p className="text-white">support@dutycalc.ng</p>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="text-[#F7D234]" />
            <p className="text-white">Abuja, Nigeria</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.length > 0 ? (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-[#0D0E10] p-6 rounded-lg shadow">
                <h3 className="font-semibold text-lg text-[#F7D234]">{faq.question}</h3>
                <p className="text-gray-400 mt-2">{faq.answer}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No FAQs available.</p>
          )}
        </div>
      </section>
    </main>
  );
}