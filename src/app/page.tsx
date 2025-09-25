"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head"; // ✅ SEO
import { createClient } from "@supabase/supabase-js";
import {
  Calculator,
  Search,
  FileText,
  BookOpen,
  DollarSign,
} from "lucide-react";

// ✅ Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  created_at: string;
};

export default function HomePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      const { data, error } = await supabase
        .from("news")
        .select("id, title, slug, excerpt, author, created_at")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.error("Error fetching news:", error.message);
      } else {
        setNews(data || []);
      }
      setLoading(false);
    }

    fetchNews();
  }, []);

  // ✅ Date formatter
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  return (
    <>
      {/* ✅ SEO META TAGS */}
      <Head>
        <title>DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools</title>
        <meta
          name="description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="DutyCalc Pro" />
        <meta property="og:title" content="DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools" />
        <meta
          property="og:description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta property="og:url" content="https://dutycalc.ng" />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-[#090A0B] to-[#0066E6] text-center py-24 px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Professional Customs{" "}
            <span className="text-[#F7D234]">Duty Calculator</span>
          </h1>
          <p className="mt-4 text-[#9CA3AF] max-w-2xl mx-auto">
            Accurate duty calculations, tariff lookup, manifest checking, and
            comprehensive trade resources for Nigerian import/export operations.
          </p>
          <div className="mt-8 flex justify-center gap-6">
            <Link
              href="/calculator"
              className="bg-[#F7D234] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4D465] transition"
            >
              Start Calculating
            </Link>
            <Link
              href="/tariff"
              className="bg-black border border-[#F7D234] text-white font-semibold px-6 py-3 rounded-lg hover:bg-[#1F2937] transition"
            >
              Learn More
            </Link>
          </div>
        </section>

        {/* Highlights Section */}
        <section className="bg-black py-16 text-center grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-3xl font-bold text-[#0066E6]">99.9%</h3>
            <p className="text-gray-400">Calculation Accuracy</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-[#F7D234]">10,000+</h3>
            <p className="text-gray-400">HS Codes Database</p>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-green-500">24/7</h3>
            <p className="text-gray-400">Real-time Updates</p>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="bg-[#0D0E10] py-20 px-6">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Complete Trade Platform
          </h2>
          <p className="text-gray-400 text-center mb-12">
            Everything you need for successful import/export operations in Nigeria
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
            {/* Duty Calculator */}
            <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#0066E6]/20 text-[#0066E6] mx-auto">
                <Calculator size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Duty Calculator</h3>
              <p className="text-gray-400 mb-4 text-center">
                Accurate customs duty calculations with real-time exchange rates.
              </p>
              <div className="text-center">
                <Link href="/calculator" className="text-[#F7D234] font-semibold hover:underline">
                  Explore Duty Calculator →
                </Link>
              </div>
            </div>

            {/* Tariff Lookup */}
            <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-[#F7D234]/20 text-[#F7D234] mx-auto">
                <Search size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Tariff Lookup</h3>
              <p className="text-gray-400 mb-4 text-center">
                Search HS codes and tariff classifications with a full database.
              </p>
              <div className="text-center">
                <Link href="/tariff" className="text-[#F7D234] font-semibold hover:underline">
                  Explore Tariff Lookup →
                </Link>
              </div>
            </div>

            {/* Manifest Check */}
            <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-green-500/20 text-green-500 mx-auto">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Manifest Check</h3>
              <p className="text-gray-400 mb-4 text-center">
                Verify Bill of Lading and Airway Bill details for documentation.
              </p>
              <div className="text-center">
                <Link href="/manifest" className="text-[#F7D234] font-semibold hover:underline">
                  Explore Manifest Check →
                </Link>
              </div>
            </div>

            {/* Learning Hub */}
            <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-purple-500/20 text-purple-500 mx-auto">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Learning Hub</h3>
              <p className="text-gray-400 mb-4 text-center">
                Comprehensive guides, tutorials, and glossaries for trade ops.
              </p>
              <div className="text-center">
                <Link href="/learning" className="text-[#F7D234] font-semibold hover:underline">
                  Explore Learning Hub →
                </Link>
              </div>
            </div>

            {/* Exchange Rate */}
            <div className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition">
              <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-xl bg-yellow-500/20 text-yellow-500 mx-auto">
                <DollarSign size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 text-center">Exchange Rates</h3>
              <p className="text-gray-400 mb-4 text-center">
                View and track the latest customs exchange rates from Supabase.
              </p>
              <div className="text-center">
                <Link href="/exchange-rate" className="text-[#F7D234] font-semibold hover:underline">
                  Explore Exchange Rates →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ News Section (appears after Feature Cards, before CTA) */}
        <section className="bg-black py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Latest Trade News
            </h2>
            {loading ? (
              <p className="text-gray-400 text-center">Loading news...</p>
            ) : news.length === 0 ? (
              <p className="text-gray-400 text-center">No news articles available yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition"
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      By <span className="text-[#F7D234]">{item.author}</span> ·{" "}
                      {formatDate(item.created_at)}
                    </p>
                    <p className="text-gray-400 mb-4">{item.excerpt}</p>
                    <div>
                      <Link
                        href={`/news/${item.slug}`}
                        className="text-[#F7D234] font-semibold hover:underline"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-[#090A0B] to-[#0066E6] text-center py-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
            Ready to Streamline Your Operations?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of freight forwarders who trust DutyCalc Pro for
            accurate calculations and clearing assistance.
          </p>
          <Link
            href="/contact"
            className="bg-[#F7D234] text-black font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-[#F4D465] transition"
          >
            Contact Us Now
          </Link>
        </section>
      </main>
    </>
  );
}