'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardCards from './components/DashboardCards';
import UserProfile from './components/UserProfile';
import RecentActivities from './components/RecentActivities';
import ActivityLog from './components/ActivityLog';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('loggedIn')) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="p-6 bg-gray-100 flex-1 overflow-y-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-3/5 grid grid-cols-2 gap-6 w-full">
              <DashboardCards />
            </div>

            <div className="md:w-2/5 bg-white shadow rounded-lg p-6 flex flex-col justify-center items-center">
              <UserProfile />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentActivities />
            <ActivityLog />
          </div>
        </main>
      </div>
    </div>
  );
}
