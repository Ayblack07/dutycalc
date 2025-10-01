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
    <main className="min-h-screen"> {/* Ensure main takes full height */}
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-accent text-center py-24 px-6 overflow-hidden">
        {/* Optional: Add a subtle pattern or overlay */}
        <div className="absolute inset-0 bg-white opacity-5 mix-blend-overlay pointer-events-none"></div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
          Customs Duty <span className="text-accent-light">Calculator</span>
        </h1>
        <p className="mt-4 text-lg text-white max-w-3xl mx-auto opacity-90 leading-relaxed">
          Welcome to DutyCalc, your trusted partner in seamless import and export
          operations. Our platform is designed to simplify complex logistics,
          offering tools and resources to help you navigate international trade
          with ease. From comprehensive duty calculations, to stress-free
          manifest checker, we empower businesses and individuals alike to make
          informed decisions and optimize their supply chains. Experience
          efficiency, transparency, and reliability, all in one place.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/calculator"
            className="inline-flex items-center justify-center bg-accent text-white font-bold px-8 py-4 rounded-full shadow-soft hover:bg-accent-dark transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Start Calculating <Calculator className="ml-2" size={20} />
          </Link>
          <Link
            href="/tariff"
            className="inline-flex items-center justify-center bg-white border-2 border-primary text-primary font-bold px-8 py-4 rounded-full hover:bg-primary-light hover:text-primary-dark transition-all duration-300 transform hover:-translate-y-1 text-lg"
          >
            Explore Tariffs <Search className="ml-2" size={20} />
          </Link>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="bg-background py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Accuracy */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-primary-light text-primary mx-auto border-4 border-primary/20">
              <BarChart size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-extrabold text-primary mb-2">99.9%</h3>
            <p className="text-light-text text-lg">Proven Calculation Accuracy</p>
          </div>

          {/* Database */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-secondary-light text-secondary mx-auto border-4 border-secondary/20">
              <Database size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-extrabold text-secondary mb-2">10,000+</h3>
            <p className="text-light-text text-lg">HS Codes in our Database</p>
          </div>

          {/* Updates */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 transform hover:-translate-y-2">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-accent-light text-accent mx-auto border-4 border-accent/20">
              <RefreshCcw size={36} strokeWidth={2.5} />
            </div>
            <h3 className="text-4xl font-extrabold text-accent mb-2">Live</h3>
            <p className="text-light-text text-lg">Real-time Regulations & Rates</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-gradient-to-br from-background to-gray-50 py-20 px-6">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-4">
          Complete Trade Platform
        </h2>
        <p className="text-light-text text-xl text-center max-w-3xl mx-auto mb-16">
          Everything you need for successful import/export operations in Nigeria.
          Streamline your workflow with our integrated tools.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Duty Calculator */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center border border-border">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary-light text-primary">
              <Calculator size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Duty Calculator</h3>
            <p className="text-light-text mb-6 flex-grow">
              Accurate customs duty calculations with real-time exchange rates and up-to-date regulations.
            </p>
            <Link
              href="/calculator"
              className="mt-auto bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-primary-dark transition-colors duration-300 text-base"
            >
              Explore Tool
            </Link>
          </div>

          {/* Tariff Lookup */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center border border-border">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary-light text-secondary">
              <Search size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Tariff Lookup</h3>
            <p className="text-light-text mb-6 flex-grow">
              Search HS codes and tariff classifications within our comprehensive and frequently updated database.
            </p>
            <Link
              href="/tariff"
              className="mt-auto bg-secondary text-white font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-secondary-dark transition-colors duration-300 text-base"
            >
              Explore Tool
            </Link>
          </div>

          {/* Manifest Check */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center border border-border">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-accent-light text-accent">
              <FileText size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Manifest Check</h3>
            <p className="text-light-text mb-6 flex-grow">
              Verify Bill of Lading and Airway Bill details, ensuring accuracy and smoother documentation processes.
            </p>
            <Link
              href="/manifest"
              className="mt-auto bg-accent text-white font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-accent-dark transition-colors duration-300 text-base"
            >
              Explore Tool
            </Link>
          </div>

          {/* Learning Hub */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center border border-border">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-primary-light text-primary">
              <BookOpen size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Learning Hub</h3>
            <p className="text-light-text mb-6 flex-grow">
              Access comprehensive guides, insightful tutorials, and essential glossaries for all trade operations.
            </p>
            <Link
              href="/learning-hub"
              className="mt-auto bg-primary text-white font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-primary-dark transition-colors duration-300 text-base"
            >
              Explore Hub
            </Link>
          </div>

          {/* Exchange Rate */}
          <div className="bg-card p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col items-center text-center border border-border">
            <div className="flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-secondary-light text-secondary">
              <DollarSign size={28} strokeWidth={2} />
            </div>
            <h3 className="text-2xl font-bold text-text mb-3">Exchange Rates</h3>
            <p className="text-light-text mb-6 flex-grow">
              View and track the latest official customs exchange rates directly from our Supabase integration.
            </p>
            <Link
              href="/exchange-rate"
              className="mt-auto bg-secondary text-white font-semibold px-6 py-3 rounded-full shadow-soft hover:bg-secondary-dark transition-colors duration-300 text-base"
            >
              Explore Rates
            </Link>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="bg-gray-50 py-20 px-6">
        <h2 className="text-4xl font-extrabold text-primary text-center mb-4">
          Latest News & Updates
        </h2>
        <p className="text-light-text text-xl text-center max-w-3xl mx-auto mb-16">
          Stay informed with the newest developments in customs regulations, trade policies, and DutyCalc features.
        </p>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-news-bg p-8 rounded-2xl shadow-soft hover:shadow-glow transition-all duration-300 flex flex-col border border-border"
              >
                <h3 className="text-2xl font-bold text-text mb-3">
                  <Link href={`/news/${item.id}`} className="news-link-highlight">
                    {item.title}
                  </Link>
                </h3>
                <p className="text-light-text text-base mb-4 flex-grow">
                  {item.content
                    ? item.content.length > 180 // Increased content preview
                      ? item.content.slice(0, 180) + "…"
                      : item.content
                    : "No content preview available."}
                </p>
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-border/50">
                  <p className="font-medium">By {item.author ?? "DutyCalc"}</p>
                  <p className="text-xs">{formatDate(item.created_at)}</p>
                </div>
              </article>
            ))
          ) : (
            <p className="text-light-text text-center col-span-full py-10 text-xl">
              No news available at the moment. Please check back later!
            </p>
          )}
        </div>
      </section>
    </main>
  );
}