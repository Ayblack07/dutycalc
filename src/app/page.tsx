"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Head from "next/head";
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

  // ✅ format date helper
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
        <title>
          DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools
        </title>
        <meta
          name="description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="DutyCalc Pro" />
        <meta
          property="og:title"
          content="DutyCalc Pro – Nigeria Customs Duty Calculator, Tariff & Trade Tools"
        />
        <meta
          property="og:description"
          content="Accurate Nigeria Customs duty calculator, tariff lookup, manifest checker, learning hub, and exchange rates. Trusted by importers/exporters for reliable trade operations."
        />
        <meta property="og:url" content="https://dutycalc.ng" />
        <meta property="og:type" content="website" />
      </Head>

      <main>
        {/* Hero, Highlights, Feature Cards... */}

        {/* ✅ News Section */}
        <section className="bg-black py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Latest Trade News
            </h2>
            {loading ? (
              <p className="text-gray-400 text-center">Loading news...</p>
            ) : news.length === 0 ? (
              <p className="text-gray-400 text-center">
                No news articles available yet.
              </p>
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
        {/* ... keep your CTA ... */}
      </main>
    </>
  );
}