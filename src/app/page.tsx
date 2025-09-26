"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Calculator, Search, FileText, BookOpen, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

type NewsItem = {
  id: number;
  title: string;
  content?: string;
  author?: string;
  created_at?: string | null;
};

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, content, author, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (!error && data) {
        setNews(data as NewsItem[]);
      } else if (error) {
        console.error("Failed to fetch news:", error);
      }
    };

    fetchNews();
  }, []);

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  return (
    <main>
      {/* Hero Section */}
      <section className="bg-slate-100 text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-[#1E3A8A]">
          Professional Customs{" "}
          <span className="text-[#F59E0B]">Duty Calculator</span>
        </h1>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Accurate duty calculations, tariff lookup, manifest checking, and
          comprehensive trade resources for Nigerian import/export operations.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            href="/calculator"
            className="bg-[#F59E0B] text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#d97706] transition"
          >
            Start Calculating
          </Link>
          <Link
            href="/tariff"
            className="bg-[#1E3A8A] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1E40AF] transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-16 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-3xl font-bold text-[#1E3A8A]">99.9%</h3>
          <p className="text-gray-600">Calculation Accuracy</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-[#F59E0B]">10,000+</h3>
          <p className="text-gray-600">HS Codes Database</p>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-green-600">24/7</h3>
          <p className="text-gray-600">Real-time Updates</p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-slate-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center mb-12">
          Complete Trade Platform
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Everything you need for successful import/export operations in Nigeria
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Duty Calculator */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#1E3A8A]/10 text-[#1E3A8A] mx-auto">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">Duty Calculator</h3>
            <p className="text-gray-600 mb-4 text-center">
              Accurate customs duty calculations with real-time exchange rates.
            </p>
            <div className="text-center">
              <Link href="/calculator" className="text-[#F59E0B] font-semibold hover:underline">
                Explore Duty Calculator →
              </Link>
            </div>
          </div>

          {/* Tariff Lookup */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">Tariff Lookup</h3>
            <p className="text-gray-600 mb-4 text-center">
              Search HS codes and tariff classifications with a full database.
            </p>
            <div className="text-center">
              <Link href="/tariff" className="text-[#F59E0B] font-semibold hover:underline">
                Explore Tariff Lookup →
              </Link>
            </div>
          </div>

          {/* Manifest Check */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-green-500/10 text-green-600 mx-auto">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">Manifest Check</h3>
            <p className="text-gray-600 mb-4 text-center">
              Verify Bill of Lading and Airway Bill details for documentation.
            </p>
            <div className="text-center">
              <Link href="/manifest" className="text-[#F59E0B] font-semibold hover:underline">
                Explore Manifest Check →
              </Link>
            </div>
          </div>

          {/* Learning Hub */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-purple-500/10 text-purple-600 mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">Learning Hub</h3>
            <p className="text-gray-600 mb-4 text-center">
              Comprehensive guides, tutorials, and glossaries for trade ops.
            </p>
            <div className="text-center">
              <Link href="/learning-hub" className="text-[#F59E0B] font-semibold hover:underline">
                Explore Learning Hub →
              </Link>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-yellow-500/10 text-yellow-600 mx-auto">
              <DollarSign size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1E3A8A] mb-2 text-center">Exchange Rates</h3>
            <p className="text-gray-600 mb-4 text-center">
              View and track the latest customs exchange rates from Supabase.
            </p>
            <div className="text-center">
              <Link href="/exchange-rate" className="text-[#F59E0B] font-semibold hover:underline">
                Explore Exchange Rates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-bold text-[#1E3A8A] text-center mb-12">Latest News</h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-slate-100 p-6 rounded-xl shadow hover:scale-105 transition border border-gray-200"
              >
                <h3 className="text-xl font-bold text-[#1E3A8A] mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">
                  {item.content ? (item.content.length > 140 ? item.content.slice(0, 140) + "…" : item.content) : ""}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">By {item.author ?? "DutyCalc"}</p>
                  <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
                </div>
                <div className="mt-4">
                  <Link href={`/news/${item.id}`} className="text-[#F59E0B] font-semibold hover:underline">
                    Read More →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-3">No news available</p>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#1E3A8A] text-center py-16">
        <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
          Ready to Streamline Your Operations?
        </h2>
        <p className="text-gray-200 mb-8 max-w-2xl mx-auto">
          Join thousands of freight forwarders who trust DutyCalc for
          accurate calculations and clearing assistance.
        </p>
        <Link
          href="/contact"
          className="bg-[#F59E0B] text-black font-semibold px-6 py-3 rounded-lg shadow hover:bg-[#d97706] transition"
        >
          Contact Us Now
        </Link>
      </section>
    </main>
  );
}