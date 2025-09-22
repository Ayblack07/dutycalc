// src/app/news/[id]/page.tsx
import { notFound } from "next/navigation";

const newsData = [
  {
    title: "Nigeria Customs Updates Import Duty Rates for 2024",
    content: `
      The Nigeria Customs Service (NCS) has announced updated import duty rates effective immediately. 
      These changes are aligned with global market trends and aim to harmonize Nigeria’s tariff 
      structures with international standards. 

      Importers are advised to carefully review the new guidelines to ensure compliance. 
      Failure to do so may result in penalties or delays in cargo clearance. 

      The NCS also emphasized the importance of using the official e-payment platform 
      to streamline duty collection and promote transparency.
    `,
    date: "September 10, 2025",
  },
  {
    title: "New HS Codes Introduced for Agricultural Products",
    content: `
      The Nigeria Customs Service has introduced new Harmonized System (HS) codes 
      for agricultural products. This update simplifies classification, 
      ensures better traceability, and aligns Nigeria with World Customs Organization (WCO) standards. 

      Traders dealing in agricultural imports are encouraged to familiarize themselves 
      with the updated codes to avoid misclassification.
    `,
    date: "September 7, 2025",
  },
  {
    title: "Customs Duty E-Payment Now Mandatory at Ports",
    content: `
      Starting September 2025, all customs duty payments must be made electronically. 
      This reform is aimed at reducing corruption, improving accountability, and ensuring faster clearance. 

      Importers can now pay duties through accredited banks and online platforms 
      connected directly to the NCS system.
    `,
    date: "September 1, 2025",
  },
];

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const article = newsData[parseInt(params.id) - 1];

  if (!article) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090A0B] to-[#0D0E10] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-400 mb-2">{article.date}</p>
        <h1 className="text-3xl font-bold text-[#F7D234] mb-6">
          {article.title}
        </h1>
        <article className="prose prose-invert max-w-none text-gray-300">
          {article.content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </main>
  );
}