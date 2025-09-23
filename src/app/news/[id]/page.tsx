import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type NewsArticlePageProps = {
  params: {
    id: string;
  };
};

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { data: article, error } = await supabase
    .from("news")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !article) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090A0B] to-[#0D0E10] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-sm text-gray-400 mb-2">
          {new Date(article.date).toLocaleDateString()}
        </p>
        <h1 className="text-3xl font-bold text-[#F7D234] mb-6">
          {article.title}
        </h1>
        <article className="prose prose-invert max-w-none text-gray-300">
          {article.content.split("\n\n").map((paragraph: string, index: number) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </main>
  );
}