export default function ShipmentTable() {
  // Dummy data
  const shipments = [
    { id: 'TRK001', status: 'In Transit', origin: 'Lagos', destination: 'Abuja', updated: '2025-09-29' },
    { id: 'TRK002', status: 'Delivered', origin: 'Kano', destination: 'Port Harcourt', updated: '2025-09-28' },
    { id: 'TRK003', status: 'Pending', origin: 'Enugu', destination: 'Lagos', updated: '2025-09-27' },
  ];

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-bold mb-4">Recent Shipments</h3>
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Tracking ID</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Origin</th>
            <th className="border px-4 py-2">Destination</th>
            <th className="border px-4 py-2">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {shipments.map((s) => (
            <tr key={s.id} className="text-center">
              <td className="border px-4 py-2">{s.id}</td>
              <td className="border px-4 py-2">{s.status}</td>
              <td className="border px-4 py-2">{s.origin}</td>
              <td className="border px-4 py-2">{s.destination}</td>
              <td className="border px-4 py-2">{s.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}