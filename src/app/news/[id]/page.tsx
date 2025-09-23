// app/news/[id]/page.tsx
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

// ✅ Use NEXT_PUBLIC env vars (make sure they are set in Vercel dashboard)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ✅ Make this page dynamic
export const dynamic = "force-dynamic";

interface NewsPageProps {
  params: {
    id: string;
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { id } = params;

  try {
    // Fetch news by id
    const { data: news, error } = await supabase
      .from("news") // 👈 replace with your table name
      .select("*")
      .eq("id", id)
      .single();

    if (error || !news) {
      console.error("Error fetching news:", error);
      return notFound();
    }

    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <p className="text-gray-500 mb-6">
          Published:{" "}
          {new Date(news.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
        <article className="prose prose-lg">{news.content}</article>
      </main>
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return notFound();
  }
}