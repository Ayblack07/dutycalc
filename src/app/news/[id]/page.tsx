import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NewsPageProps {
  params: { id: string };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = params;

  // Fetch single article
  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", id)
    .single();

  // Handle missing or error
  if (error || !article) {
    console.error("News fetch error:", error);
    return notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-6">
        Published: {new Date(article.date).toLocaleDateString()}
      </p>
      <article className="prose prose-lg text-gray-200">
        {article.content}
      </article>
    </main>
  );
}