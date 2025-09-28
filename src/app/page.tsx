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
          Welcome to DutyCalc, your trusted partner in seamless import and export
          operations. Our platform is designed to simplify complex logistics,
          offering tools and resources to help you navigate international trade
          with ease. From comprehensive duty calculations, to stress-free
          manifest checker, we empower businesses and individuals alike to make
          informed decisions and optimize their supply chains. Experience
          efficiency, transparency, and reliability, all in one place.
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

      {/* Highlights Section */}
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
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Duty Calculator</h3>
            <p className="text-gray-600 mb-4">
              Accurate customs duty calculations with real-time exchange rates.
            </p>
            <Link
              href="/calculator"
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-primary-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Tariff Lookup */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary">
              <Search size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Tariff Lookup</h3>
            <p className="text-gray-600 mb-4">
              Search HS codes and tariff classifications with a full database.
            </p>
            <Link
              href="/tariff"
              className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-secondary-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Manifest Check */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent/10 text-accent">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Manifest Check</h3>
            <p className="text-gray-600 mb-4">
              Verify Bill of Lading and Airway Bill details for documentation.
            </p>
            <Link
              href="/manifest"
              className="bg-accent text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-accent-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Learning Hub */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Learning Hub</h3>
            <p className="text-gray-600 mb-4">
              Comprehensive guides, tutorials, and glossaries for trade ops.
            </p>
            <Link
              href="/learning-hub"
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-primary-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Exchange Rate */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary">
              <DollarSign size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Exchange Rates</h3>
            <p className="text-gray-600 mb-4">
              View and track the latest customs exchange rates from Supabase.
            </p>
            <Link
              href="/exchange-rate"
              className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-secondary-dark transition"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-[#cee9f1] py-20 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Latest News
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col justify-between"
              >
                <div>
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
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <p>By {item.author ?? "DutyCalc"}</p>
                  <p>{formatDate(item.created_at)}</p>
                </div>
                <Link
                  href={`/news/${item.id}`}
                  className="bg-accent text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-accent-dark transition text-center"
                >
                  Read More
                </Link>
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