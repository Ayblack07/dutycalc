"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Calculator,
  Search,
  FileText,
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
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200 text-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
        <span className="text-primary">Duty</span>
         <span className="text-secondary">Calc</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 items-center">
          {links.slice(0, 3).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:text-accent transition"
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
              className="flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:text-accent transition"
            >
              <List size={18} />
              Resources
              <ChevronDown size={14} />
            </button>
            {resourcesOpen && (
              <div className="absolute mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                <Link
                  href="/exchange-rate"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Exchange Rate
                </Link>
                <Link
                  href="/prohibition-list"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Prohibition List
                </Link>
                <Link
                  href="/learning-hub"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                >
                  Learning Hub
                </Link>
              </div>
            )}
          </div>

          {/* Contact */}
          {links.slice(3).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:text-accent transition"
            >
              <Icon size={18} /> {label}
            </Link>
          ))}
        </div>

        {/* CTA (desktop only) */}
        <div className="hidden md:block">
          <Link
            href="/auth"
            className="bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg font-semibold shadow"
          >
            Get Started
          </Link>
        </div>

        {/* Hamburger (mobile only) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 focus:outline-none text-gray-800"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-3">
          {links.slice(0, 3).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          {/* Resources section (mobile) */}
          <div className="space-y-1">
            <p className="flex items-center gap-2 px-3 py-2 text-gray-700 text-sm">
              <List size={18} /> Resources
            </p>
            <div className="ml-6 space-y-1">
              <Link
                href="/exchange-rate"
                className="block text-sm text-gray-600 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                Exchange Rate
              </Link>
              <Link
                href="/prohibition-list"
                className="block text-sm text-gray-600 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                Prohibition List
              </Link>
              <Link
                href="/learning-hub"
                className="block text-sm text-gray-600 hover:text-accent"
                onClick={() => setOpen(false)}
              >
                Learning Hub
              </Link>
            </div>
          </div>

          {/* Contact */}
          {links.slice(3).map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
              text-gray-700 hover:text-accent transition"
              onClick={() => setOpen(false)}
            >
              <Icon size={18} /> {label}
            </Link>
          ))}

          {/* CTA button in dropdown */}
          <Link
            href="/auth"
            className="block bg-accent hover:bg-primary text-white px-4 py-2 rounded-lg font-semibold text-center shadow"
            onClick={() => setOpen(false)}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}