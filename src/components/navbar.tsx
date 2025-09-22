"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-[#0f172a] text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-[#F7D234]">
          DutyCalc
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-[#F7D234]">Home</Link>
          <Link href="/manifest" className="hover:text-[#F7D234]">Manifest</Link>
          <Link href="/tariff" className="hover:text-[#F7D234]">Tariff</Link>
          <Link href="/contact" className="hover:text-[#F7D234]">Contact</Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden mt-2 space-y-2 bg-[#1e293b] p-4 rounded-lg">
          <Link href="/" className="block hover:text-[#F7D234]">Home</Link>
          <Link href="/manifest" className="block hover:text-[#F7D234]">Manifest</Link>
          <Link href="/tariff" className="block hover:text-[#F7D234]">Tariff</Link>
          <Link href="/contact" className="block hover:text-[#F7D234]">Contact</Link>
        </div>
      )}
    </nav>
  );
}