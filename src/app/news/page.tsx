export default function LoadingNewsList() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#090A0B] to-[#0D0E10] px-6 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#F7D234] mb-8">Latest News</h1>

        <div className="space-y-8 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#1E293B] p-6 rounded-xl shadow-md border border-[#063064]"
            >
              <div className="h-4 w-1/4 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 w-2/3 bg-gray-600 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-700 rounded"></div>
                <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
              </div>
              <div className="h-4 w-24 bg-gray-600 rounded mt-4"></div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}