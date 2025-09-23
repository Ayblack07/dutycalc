import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic"; // ⬅️ this ensures no build-time pre-rendering

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NewsPageProps {
  params: {
    id: string;
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = params;

  try {
    const { data: article, error } = await supabase
      .from("news")
      .select("*")
      .eq("id", id)
      .single(); // only one news item

    if (error || !article) {
      return notFound();
    }

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{article.title}</h1>
        <p className="text-gray-500 mb-6">
          Published: {new Date(article.date).toLocaleDateString()}
        </p>
        <article className="prose prose-lg">{article.content}</article>
      </main>
    );
  } catch (err) {
    console.error("Error fetching article:", err);
    return notFound();
  }
}