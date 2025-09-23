"use client";

export default function Error({ error }: { error: Error }) {
  return (
    <main className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold text-red-500 mb-4">
        Something went wrong
      </h1>
      <p className="text-gray-400">{error.message}</p>
    </main>
  );
}