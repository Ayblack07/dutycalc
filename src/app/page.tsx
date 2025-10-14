"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
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

      if (!error && data) setNews(data as NewsItem[]);
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
      {/* SEO HEAD */}
      <Head>
        <title>
          Nigeria Customs Duty Calculator & Daily Manifest Checker | DutyCalc
        </title>
        <meta
          name="description"
          content="DutyCalc is Nigeria’s #1 Customs Duty Calculator and Daily Manifest Checker. Instantly calculate import duties, verify shipping manifests, and access real-time tariff rates for Apapa, Tin Can, Onne, and all major Nigerian ports."
        />
        <meta
          name="keywords"
          content="Nigeria customs duty calculator, import duty Nigeria, manifest checker, daily manifest update, tariff lookup, HS code Nigeria, customs valuation, Apapa port duty, Tin Can import duty"
        />
        <meta property="og:title" content="Nigeria Customs Duty Calculator & Manifest Checker" />
        <meta
          property="og:description"
          content="Calculate import duties and verify manifests instantly with DutyCalc — trusted by shippers, clearing agents, and logistics professionals across Nigeria."
        />
        <meta property="og:url" content="https://www.dutycalc.ng" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.dutycalc.ng/og-image.jpg" />
        <link rel="canonical" href="https://www.dutycalc.ng" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "DutyCalc",
              url: "https://www.dutycalc.ng",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.dutycalc.ng/manifest?search={query}",
                "query-input": "required name=query",
              },
              description:
                "DutyCalc helps importers and clearing agents calculate Nigeria Customs duties, verify daily manifests, and check tariff rates with real-time updates.",
            }),
          }}
        />
      </Head>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-accent text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Nigeria Customs Duty Calculator & Daily Manifest Checker
        </h1>
        <p className="mt-4 text-background max-w-2xl mx-auto">
          DutyCalc helps you calculate Nigeria Customs import and export duties
          in seconds. You can also check daily shipping manifests updated
          directly from major Nigerian ports — including Apapa, Tin Can, and
          Onne. Whether you’re an importer, freight forwarder, or customs agent,
          DutyCalc makes trade compliance and cargo tracking simple, accurate,
          and fast.
        </p>
        <div className="mt-8 flex justify-center gap-6">
          <Link
            href="/calculator"
            className="bg-accent text-white font-semibold px-6 py-3 rounded-lg shadow-soft hover:bg-accent-dark transition"
          >
            Start Calculating
          </Link>
          <Link
            href="/manifest"
            className="bg-white border border-accent text-primary font-semibold px-6 py-3 rounded-lg hover:bg-background transition"
          >
            Check Manifest
          </Link>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-background py-6 px-3">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary mx-auto">
              <BarChart size={28} />
            </div>
            <h3 className="text-3xl font-bold text-primary">99.9%</h3>
            <p className="text-gray-600">Proven Calculation Accuracy</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary mx-auto">
              <Database size={28} />
            </div>
            <h3 className="text-3xl font-bold text-secondary">10,000+</h3>
            <p className="text-gray-600">HS Codes in Database</p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-soft hover:shadow-glow transition">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent/10 text-accent mx-auto">
              <RefreshCcw size={28} />
            </div>
            <h3 className="text-3xl font-bold text-accent">24/7</h3>
            <p className="text-gray-600">Real-Time Manifest Updates</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-background py-20 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-6">
          Simplify Nigeria Customs & Trade Operations
        </h2>
        <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
          DutyCalc provides instant duty calculations, daily manifests, tariff
          lookup, and live exchange rates — everything you need for stress-free
          customs clearance and documentation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Calculator */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-primary/10 text-primary">
              <Calculator size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Duty Calculator
            </h3>
            <p className="text-gray-600 mb-4">
              Get fast, accurate import duty estimates using verified customs
              rates and exchange values.
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
              Search for HS codes, tariff categories, and import classifications
              within Nigeria’s customs schedule.
            </p>
            <Link
              href="/tariff"
              className="bg-secondary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-secondary-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Manifest Checker */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-accent/10 text-accent">
              <FileText size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">
              Manifest Checker
            </h3>
            <p className="text-gray-600 mb-4">
              Check and verify Bills of Lading, Airway Bills, and vessel manifests updated daily.
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
              Get free guides and tutorials on customs, shipping, and trade
              compliance in Nigeria.
            </p>
            <Link
              href="/learning-hub"
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg shadow-soft hover:bg-primary-dark transition"
            >
              Explore
            </Link>
          </div>

          {/* Exchange Rates */}
          <div className="bg-white p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col items-center text-center">
            <div className="flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-secondary/10 text-secondary">
              <DollarSign size={28} />
            </div>
            <h3 className="text-xl font-bold text-primary mb-2">Exchange Rates</h3>
            <p className="text-gray-600 mb-4">
              Track daily CBN and customs exchange rates updated automatically.
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
      <section className="bg-gray-100 py-20 px-6">
        <h2 className="text-3xl font-bold text-primary text-center mb-12">
          Latest News
        </h2>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.length > 0 ? (
            news.map((item) => (
              <article
                key={item.id}
                className="bg-[#effbff] p-6 rounded-xl shadow-soft hover:shadow-glow transition flex flex-col justify-between"
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