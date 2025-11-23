'use client';
import { useRouter } from 'next/navigation';
import { Home, FileText, Calculator, BookOpen, ClipboardList, User } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    sessionStorage.removeItem('loggedIn');
    router.push('/login');
  };

  const links = [
    { title: 'Dashboard', icon: <Home size={18} />, route: '/dashboard' },
    { title: 'Manifest Checker', icon: <FileText size={18} />, route: '/manifest' },
    { title: 'Duty Calculator', icon: <Calculator size={18} />, route: '/calculator' },
    { title: 'Learning Hub', icon: <BookOpen size={18} />, route: '/learning' },
    { title: 'Quotation Tool', icon: <ClipboardList size={18} />, route: '/dashboard/quotation' },
    { title: 'Track Item', icon: <FileText size={18} />, route: '/track-item' },
    { title: 'Profile', icon: <User size={18} />, route: '/profile' },
  ];

  return (
    <aside className="w-64 bg-[#09607B] text-white flex flex-col p-4">
      <h1 className="text-2xl font-bold mb-6">DutyCalc Nigeria</h1>
      {links.map((link) => (
        <button
          key={link.title}
          className="mb-2 hover:bg-[#0b7f99] p-2 rounded flex items-center gap-2 text-left"
          onClick={() => router.push(link.route)}
        >
          {link.icon} <span>{link.title}</span>
        </button>
      ))}
      <button className="mt-auto hover:bg-[#0b7f99] p-2 rounded text-left" onClick={handleLogout}>
        Logout
      </button>
    </aside>
  );
}