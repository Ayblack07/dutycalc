"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Calculator,
  Search,
  FileText,
  BookOpen,
  Phone,
  ChevronDown,
  List,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  const links = [
    { href: "/calculator", label: "Calculator", icon: Calculator },
    { href: "/tariff", label: "Tariff Lookup", icon: Search },
    { href: "/manifest", label: "Manifest Check", icon: FileText },
    { href: "/learning-hub", label: "Learning Hub", icon: BookOpen },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="bg-slate-50 border-b border-slate-200 text-slate-800">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold bg-primary text-black px-2 py-1 rounded"
        >
          DutyCalc
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition 
              text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          {/* Resources dropdown (desktop) */}
          <div
            className="relative"
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <List size={18} />
              Resources
              <ChevronDown size={14} />
            </button>
            {resourcesOpen && (
              <div className="absolute mt-2 w-56 bg-white text-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  href="/exchange-rate"
                  className="block px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Exchange Rate
                </Link>
                <Link
                  href="/prohibition-list"
                  className="block px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Prohibition List
                </Link>
              </div>
            )}
          </div>

          {/* Contact */}
          {links.slice(4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition 
              text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </div>

        {/* CTA (desktop only) */}
        <div className="hidden md:block">
          <Link
            href="/signup"
            className="bg-primary hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold"
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
        <div className="md:hidden bg-slate-100 border-t border-slate-200 px-4 py-4 space-y-3">
          {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          {/* Resources section (mobile) */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 px-3 py-2 text-slate-600 text-sm">
              <List size={18} /> Resources
            </p>
            <div className="ml-6 space-y-1">
              <Link
                href="/exchange-rate"
                className="block text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-md px-2 py-1"
                onClick={() => setOpen(false)}
              >
                Exchange Rate
              </Link>
              <Link
                href="/prohibition-list"
                className="block text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded-md px-2 py-1"
                onClick={() => setOpen(false)}
              >
                Prohibition List
              </Link>
            </div>
          </div>

          {/* Contact */}
          {links.slice(4).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          {/* CTA button in dropdown */}
          <Link
            href="/signup"
            className="block bg-primary hover:bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold text-center"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}