"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Leaf, Phone } from "lucide-react";

export default function Navbar({ phone = "+91 9714888806" }: { phone?: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-brand-500 p-2 rounded-lg group-hover:bg-brand-600 transition-colors">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">
                Gujj<span className="text-brand-600 dark:text-brand-400">Overseas</span>
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hidden lg:flex items-center gap-2 bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-800/50 text-brand-700 dark:text-brand-300 px-4 py-2 rounded-full font-medium transition-colors border border-brand-200 dark:border-brand-800/50"
            >
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 focus:outline-none p-2"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 pt-2 pb-6 space-y-1 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-slate-900 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="flex items-center gap-3 px-3 py-3 text-brand-600 dark:text-brand-400 font-medium"
            >
              <div className="bg-brand-100 dark:bg-brand-900/50 p-2 rounded-full">
                <Phone className="h-5 w-5" />
              </div>
              {phone}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
