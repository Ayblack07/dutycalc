export default function ActivityLog() {
  const logs = [
    { id: 1, log: 'User logged in', date: '2025-09-29 09:00' },
    { id: 2, log: 'Tracked shipment TRK001', date: '2025-09-29 10:00' },
    { id: 3, log: 'Generated quotation', date: '2025-09-29 11:30' },
  ];

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-bold mb-4">Activity Log</h3>
      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Activity</th>
            <th className="border px-4 py-2">Date & Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td className="border px-4 py-2">{l.id}</td>
              <td className="border px-4 py-2">{l.log}</td>
              <td className="border px-4 py-2">{l.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}