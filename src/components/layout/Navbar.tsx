"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Leaf, Phone, MessageCircle } from "lucide-react";

export default function Navbar({ phone = "+91 9714888806", whatsapp = "+91 9714888806" }: { phone?: string, whatsapp?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const whatsappUrl = `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=Hi,%20I'm%20interested%20in%20your%20products.`;

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-500 overflow-hidden ${
      scrolled 
        ? "bg-[#0a2e1a]/40 backdrop-blur-2xl shadow-2xl border-b border-white/10" 
        : "bg-[#0a2e1a] border-b border-white/5"
    }`}>
      {scrolled && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-blue-900/20 to-brand-900/20 opacity-50 blur-xl animate-pulse-slow pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
        </>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo */}
          <div className="flex flex-col justify-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-14 w-14 rounded-full overflow-hidden bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform">
                <img src="/logo.jpg" alt="GujjOverseas LLP Logo" className="h-full w-full object-cover scale-110" />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white/80 hover:text-white font-medium text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Phone & WhatsApp */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hidden lg:flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-[0_0_15px_rgba(46,204,113,0.3)]"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp Us</span>
              <span className="sm:hidden">Chat</span>
            </a>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white/80 hover:text-white p-1"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-[#0f4a2a] border-t border-white/10 ${
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="block px-3 py-3 rounded-md text-base font-medium text-white/90 hover:bg-white/10 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 mt-2 border-t border-white/10">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="flex items-center gap-3 px-3 py-3 text-white/90 font-medium"
            >
              <div className="bg-white/10 p-2 rounded-full">
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
