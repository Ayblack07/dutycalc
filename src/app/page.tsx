"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Calculator,
  Search,
  FileText,
  BookOpen,
  DollarSign,
  BarChart,
  Database,
  RefreshCcw,
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
    <main>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          <span className="text-white">Customs Duty Calculator</span>
        </h1>
        <p className="mt-4 text-background max-w-2xl mx-auto">
          Welcome to DutyCalc, your trusted partner in seamless import and export operations. 
          Our platform is designed to simplify complex logistics, offering tools and resources 
          to help you navigate international trade with ease. From comprehensive duty calculations, 
          to stress-free manifest checker, we empower businesses and individuals alike to make 
          informed decisions and optimize their supply chains. Experience efficiency, transparency, 
          and reliability, all in one place.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            href="/calculator"
            className="bg-accent text-white font-semibold px-6 py-3 rounded-lg shadow-soft hover:bg-accent-dark transition"
          >
            Start Calculating
          </Link>
          <Link
            href="/tariff"
            className="bg-white border border-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-background transition"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Highlights Section (Updated) */}
      <section className="bg-background py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Accuracy */}
          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary mx-auto">
              <BarChart size={28} />
            </div>
            <h3 className="text-3xl font-bold text-primary">99.9%</h3>
            <p className="text-gray-600">Proven Calculation Accuracy</p>
          </div>

          {/* Database */}
          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary mx-auto">
              <Database size={28} />
            </div>
            <h3 className="text-3xl font-bold text-secondary">10,000+</h3>
            <p className="text-gray-600">HS Codes in our Database</p>
          </div>

          {/* Updates */}
          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent/10 text-accent mx-auto">
              <RefreshCcw size={28} />
            </div>
            <h3 className="text-3xl font-bold text-accent">24/7</h3>
            <p className="text-gray-600">Live Real-time Updates</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-background py-20 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Complete Trade Platform
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Everything you need for successful import/export operations in Nigeria
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Duty Calculator */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-primary/10 text-primary mx-auto">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Duty Calculator
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Accurate customs duty calculations with real-time exchange rates.
            </p>
            <div className="text-center">
              <Link
                href="/calculator"
                className="text-accent font-semibold hover:underline"
              >
                Explore Duty Calculator →
              </Link>
            </div>
          </div>

          {/* Tariff Lookup */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-secondary/10 text-secondary mx-auto">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Tariff Lookup
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Search HS codes and tariff classifications with a full database.
            </p>
            <div className="text-center">
              <Link
                href="/tariff"
                className="text-accent font-semibold hover:underline"
              >
                Explore Tariff Lookup →
              </Link>
            </div>
          </div>

          {/* Manifest Check */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-accent/10 text-accent mx-auto">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Manifest Check
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Verify Bill of Lading and Airway Bill details for documentation.
            </p>
            <div className="text-center">
              <Link
                href="/manifest"
                className="text-accent font-semibold hover:underline"
              >
                Explore Manifest Check →
              </Link>
            </div>
          </div>

          {/* Learning Hub */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-primary/10 text-primary mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Learning Hub
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              Comprehensive guides, tutorials, and glossaries for trade ops.
            </p>
            <div className="text-center">
              <Link
                href="/learning-hub"
                className="text-accent font-semibold hover:underline"
              >
                Explore Learning Hub →
              </Link>
            </div>
          </div>

          {/* Exchange Rate */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-secondary/10 text-secondary mx-auto">
              <DollarSign size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2 text-center">
              Exchange Rates
            </h3>
            <p className="text-gray-600 mb-4 text-center">
              View and track the latest customs exchange rates from Supabase.
            </p>
            <div className="text-center">
              <Link
                href="/exchange-rate"
                className="text-accent font-semibold hover:underline"
              >
                Explore Exchange Rates →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-background py-20 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Latest News
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition"
              >
                <h3 className="text-xl font-bold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {item.content
                    ? item.content.length > 140
                      ? item.content.slice(0, 140) + "…"
                      : item.content
                    : ""}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    By {item.author ?? "DutyCalc"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="mt-4">
                  <Link
                    href={`/news/${item.id}`}
                    className="text-accent font-semibold hover:underline"
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