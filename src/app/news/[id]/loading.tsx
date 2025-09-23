export default function LoadingNews() {
  return (
    <main className="max-w-3xl mx-auto p-6 animate-pulse">
      <div className="h-8 w-2/3 bg-gray-700 rounded mb-4"></div>
      <div className="h-4 w-1/3 bg-gray-600 rounded mb-6"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-700 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-700 rounded"></div>
      </div>
    </main>
  );
}