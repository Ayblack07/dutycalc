"use client";

import { useState } from "react";

export default function TrackItemPage() {
  const [trackingId, setTrackingId] = useState("");
  const [destinationCountry, setDestinationCountry] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/track-item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingId, destinationCountry })
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Track Item</h1>
      <form onSubmit={handleTrack} className="flex flex-col gap-4 mb-4 max-w-md">
        <input
          type="text"
          placeholder="Tracking ID"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          className="p-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Destination Country"
          value={destinationCountry}
          onChange={(e) => setDestinationCountry(e.target.value)}
          className="p-3 border rounded"
          required
        />
        <button type="submit" className="p-3 bg-primary text-white rounded">Track</button>
      </form>

      {result && (
        <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(result, null, 2)}</pre>
      )}
    </div>
  );
}