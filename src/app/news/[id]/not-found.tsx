export default function NotFound() {
  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold text-yellow-400 mb-4">
        News Article Not Found
      </h1>
      <p className="text-gray-400 mb-6">
        The article you are looking for does not exist or has been removed.
      </p>
      <a
        href="/news"
        className="inline-block px-4 py-2 bg-yellow-500 text-black font-medium rounded hover:bg-yellow-400"
      >
        ← Back to News
      </a>
    </main>
  );
}