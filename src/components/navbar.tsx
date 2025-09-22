"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/calculator", label: "Calculator" },
    { href: "/tariff", label: "Tariff" },
    { href: "/manifest", label: "Manifest" },
    { href: "/learning-hub", label: "Learning Hub" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#090A0B] via-[#0D0E10] to-[#1F2937] text-white shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold bg-[#F7D234] text-black px-2 py-1 rounded">
          DutyCalc
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-[#F7D234] transition"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* CTA (desktop only) */}
        <div className="hidden md:block">
          <Link
            href="/calculator"
            className="bg-[#F7D234] hover:bg-[#e0c020] text-black px-4 py-2 rounded-lg font-semibold"
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 focus:outline-none"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-[#1F2937] px-4 py-4 space-y-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block text-gray-300 hover:text-[#F7D234] transition"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}

          {/* CTA button in dropdown */}
          <Link
            href="/calculator"
            className="block bg-[#F7D234] hover:bg-[#e0c020] text-black px-4 py-2 rounded-lg font-semibold text-center"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}