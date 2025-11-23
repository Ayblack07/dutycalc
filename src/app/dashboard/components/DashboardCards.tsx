'use client';
import { useRouter } from 'next/navigation';
import { FileText, Calculator, BookOpen, ClipboardList, MapPin } from 'lucide-react';

export default function DashboardCards() {
  const router = useRouter();

  const cards = [
    { title: 'Manifest Checker', subtitle: 'Check shipment manifests', icon: <FileText size={28} />, link: '/manifest' },
    { title: 'Duty Calculator', subtitle: 'Calculate customs duty', icon: <Calculator size={28} />, link: '/calculator' },
    { title: 'Track Item', subtitle: 'Track shipment in real-time', icon: <MapPin size={28} />, link: './track-item' },
    { title: 'Quotation Tool', subtitle: 'Send quotations to clients', icon: <ClipboardList size={28} />, link: '/quotation' },
  ];

  return (
    <>
      {cards.map((card) => (
        <div
          key={card.title}
          onClick={() => router.push(card.link)}
          className="bg-white shadow rounded-lg p-6 flex flex-col items-start justify-between cursor-pointer hover:shadow-xl transition flex-[1_1_calc(50%-1.5rem)] h-40"
        >
          {card.icon}
          <div className="mt-auto">
            <span className="text-gray-700 font-semibold">{card.title}</span>
            <p className="text-gray-500 text-sm mt-1">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </>
  );
}