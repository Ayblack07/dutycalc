"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calculator,
  Search,
  FileText,
  BookOpen,
  Phone,
} from "lucide-react"; // icons

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/tariff", label: "Tariff Lookup", icon: Search },
    { href: "/manifest", label: "Manifest Check", icon: FileText },
    { href: "/learning-hub", label: "Learning Hub", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#090A0B] via-[#0D0E10] to-[#1F2937] text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="bg-[#F7D234] text-black px-2 py-1 rounded font-bold">
            DutyCalc Pro
          </span>
        </Link>

        {/* Menu */}
        <div className="flex space-x-6">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition ${
                pathname === href
                  ? "bg-[#0066E6] text-white"
                  : "text-gray-300 hover:text-white hover:bg-[#1F2937]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/calculator"
          className="bg-[#F7D234] hover:bg-[#F4D465] text-black px-4 py-2 rounded-lg font-semibold"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}