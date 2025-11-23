export default function UserProfile() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4"></div>
      <h3 className="text-xl font-bold">Umar Abdulrasheed</h3>
      <span className="text-gray-600 mt-1">Subscription: Agent Pro - Active</span>
      <button className="mt-4 bg-secondary text-white px-6 py-2 rounded-lg hover:bg-[#0b7f99] transition">
        Edit Profile
      </button>
    </div>
  );
}