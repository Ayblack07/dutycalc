export default function RecentActivities() {
  const activities = [
    { id: 1, action: 'Created Quotation', date: '2025-09-29' },
    { id: 2, action: 'Checked Manifest', date: '2025-09-28' },
    { id: 3, action: 'Calculated Duty', date: '2025-09-27' },
  ];

  return (
    <div className="bg-white shadow rounded p-4">
      <h3 className="text-lg font-bold mb-4">Recent Activities</h3>
      <table className="w-full table-auto border-collapse text-center">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Action</th>
            <th className="border px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a.id}>
              <td className="border px-4 py-2">{a.id}</td>
              <td className="border px-4 py-2">{a.action}</td>
              <td className="border px-4 py-2">{a.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}