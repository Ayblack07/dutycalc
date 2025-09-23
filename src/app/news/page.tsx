import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function NewsPage() {
  const { data: articles, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0D0E10]">
        <p className="text-red-500">Failed to load news.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090A0B] to-[#0D0E10] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F7D234] mb-8">Latest News</h1>

        <div className="space-y-8">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
              <div
                key={article.id}
                className="bg-[#1E293B] p-6 rounded-xl shadow-md border border-[#063064]"
              >
                <p className="text-sm text-gray-400 mb-2">
                  {new Date(article.date).toLocaleDateString()}
                </p>
                <h2 className="text-2xl font-semibold text-white mb-4">
                  <Link href={`/news/${article.id}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h2>
                <p className="text-gray-300 line-clamp-3">
                  {article.content.length > 200
                    ? article.content.slice(0, 200) + "..."
                    : article.content}
                </p>
                <Link
                  href={`/news/${article.id}`}
                  className="inline-block mt-4 text-[#F7D234] hover:underline"
                >
                  Read More →
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No news articles available yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}