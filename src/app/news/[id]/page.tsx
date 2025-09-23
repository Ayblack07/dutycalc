// app/news/[id]/page.tsx
import { notFound } from "next/navigation";

// ✅ Make this page dynamic (no need for static params at build)
export const dynamic = "force-dynamic";

interface NewsPageProps {
  params: {
    id: string;
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = params;

  try {
    // Fetch your news item (replace with your real API or data source)
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/news/${id}`, {
      cache: "no-store", // avoid caching stale data
    });

    if (!res.ok) {
      return notFound();
    }

    const news = await res.json();

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-gray-500 mb-6">Published: {news.date}</p>
        <article className="prose prose-lg">
          {news.content}
        </article>
      </main>
    );
  } catch (error) {
    console.error("Error fetching news:", error);
    return notFound();
  }
}