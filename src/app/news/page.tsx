// src/app/news/page.tsx
import Link from "next/link";

export default function NewsPage() {
  const newsItems = [
    {
      title: "Nigeria Customs Updates Import Duty Rates for 2024",
      excerpt:
        "The Nigeria Customs Service has updated its import duty rates in line with global market changes. Importers should review the new guidelines...",
      date: "September 10, 2025",
    },
    {
      title: "New HS Codes Introduced for Agricultural Products",
      excerpt:
        "Traders importing agricultural goods should take note of new HS codes that came into effect this month, simplifying classification and duty payments...",
      date: "September 7, 2025",
    },
    {
      title: "Customs Duty E-Payment Now Mandatory at Ports",
      excerpt:
        "The Nigeria Customs Service has announced that all duty payments must now be processed electronically to improve transparency...",
      date: "September 1, 2025",
    },
    {
      title: "FG to Review Tariff Structures in 2025 Budget",
      excerpt:
        "The Federal Government is set to review tariff structures in the 2025 budget, with a focus on easing trade barriers and boosting exports...",
      date: "August 28, 2025",
    },
    {
      title: "Automation Reduces Cargo Clearance Time by 30%",
      excerpt:
        "New automation tools at Apapa and Tin Can Island ports have reduced clearance time by 30%, boosting efficiency for importers...",
      date: "August 20, 2025",
    },
    {
      title: "NCS Partners with Banks for Seamless Duty Payments",
      excerpt:
        "In collaboration with commercial banks, the NCS has rolled out a new payment system to make duty remittance faster and more secure...",
      date: "August 15, 2025",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090A0B] to-[#0D0E10] px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Latest News</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-[#0D0E10] to-[#1F2937] p-6 rounded-xl shadow hover:scale-105 transition"
            >
              <p className="text-sm text-gray-400 mb-2">{item.date}</p>
              <h2 className="text-xl font-semibold text-[#F7D234] mb-2">
                {item.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4">{item.excerpt}</p>
              <Link
                href={`/news/${index + 1}`} // later dynamic route
                className="text-[#0066E6] font-medium hover:underline"
              >
                Read Full Article →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}