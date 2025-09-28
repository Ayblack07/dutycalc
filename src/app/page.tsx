"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calculator,
  Search,
  FileText,
  BookOpen,
  DollarSign,
} from "lucide-react";
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
    d
      ? new Date(d).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";

  return (
    <main className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-[#2D3748] text-center py-24 px-6 rounded-b-3xl shadow-md">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
          Professional Customs <span className="text-blue-200">Calculator</span>
        </h1>
        <p className="mt-4 text-blue-100 max-w-2xl mx-auto leading-relaxed">
          Accurate duty calculations, tariff lookup, manifest checking, and
          comprehensive trade resources for Nigerian import/export operations.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/calculator"
            className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
          >
            Start Calculating
          </Link>
          <Link
            href="/tariff"
            className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-white py-12 px-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto -mt-12 rounded-xl shadow-lg">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-blue-700">99.9%</h3>
          <p className="text-gray-600">Calculation Accuracy</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-green-600">10,000+</h3>
          <p className="text-gray-600">HS Codes Database</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-orange-500">24/7</h3>
          <p className="text-gray-600">Real-time Updates</p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Complete Trade Platform
        </h2>
        <p className="text-gray-500 text-center mb-12 max-w-xl mx-auto">
          Everything you need for successful import/export operations in Nigeria
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {/* Card */}
          {[
            {
              title: "Duty Calculator",
              desc: "Accurate customs duty calculations with real-time exchange rates.",
              href: "/calculator",
              icon: <Calculator size={28} />,
              color: "bg-blue-100 text-blue-600",
            },
            {
              title: "Tariff Lookup",
              desc: "Search HS codes and tariff classifications with a full database.",
              href: "/tariff",
              icon: <Search size={28} />,
              color: "bg-green-100 text-green-600",
            },
            {
              title: "Manifest Check",
              desc: "Verify Bill of Lading and Airway Bill details for documentation.",
              href: "/manifest",
              icon: <FileText size={28} />,
              color: "bg-orange-100 text-orange-600",
            },
            {
              title: "Learning Hub",
              desc: "Comprehensive guides, tutorials, and glossaries for trade ops.",
              href: "/learning-hub",
              icon: <BookOpen size={28} />,
              color: "bg-purple-100 text-purple-600",
            },
            {
              title: "Exchange Rates",
              desc: "View and track the latest customs exchange rates from Supabase.",
              href: "/exchange-rate",
              icon: <DollarSign size={28} />,
              color: "bg-pink-100 text-pink-600",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div
                className={`flex items-center justify-center w-16 h-16 mb-4 rounded-xl ${item.color} mx-auto`}
              >
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                {item.title}
              </h3>
              <p className="text-gray-500 mb-4 text-center">{item.desc}</p>
              <div className="text-center">
                <Link
                  href={item.href}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Explore →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News Section */}
      <section className="bg-white py-20 px-6">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
          Latest News
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.content
                    ? item.content.length > 140
                      ? item.content.slice(0, 140) + "…"
                      : item.content
                    : ""}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>By {item.author ?? "DutyCalc"}</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/news/${item.id}`}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <p className="text-gray-600 text-center col-span-3">
              No news available
            </p>
          )}
        </div>
      </section>
    </main>
  );
}