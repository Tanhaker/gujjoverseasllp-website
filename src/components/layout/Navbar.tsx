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
        ? "bg-white/70 backdrop-blur-md shadow-sm border-b border-brand-500" 
        : "bg-white border-b border-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Left: Logo */}
          <div className="flex flex-col justify-center">
            <Link href="/" className="flex items-center group">
              <div className="relative h-[4.5rem] w-[4.5rem] overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform p-1">
                <img src="/logo.png" alt="GujjOverseas LLP Logo" className="h-full w-full object-contain drop-shadow-sm" />
              </div>
            </Link>
          </div>

          {/* Center: Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-slate-600 hover:text-brand-500 font-sans font-medium text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right: Phone & WhatsApp */}
          <div className="flex items-center gap-4">
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hidden lg:flex items-center gap-2 text-slate-600 hover:text-brand-500 text-sm font-medium transition-colors"
            >
              <Phone className="h-4 w-4" />
              <span>{phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden sm:inline">WhatsApp Us</span>
              <span className="sm:hidden">Chat</span>
            </a>

            {/* Mobile menu button */}
            <button
               onClick={() => setIsOpen(!isOpen)}
               className="md:hidden text-slate-600 hover:text-brand-500 p-1"
             >
               <span className="sr-only">Open main menu</span>
               {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
             </button>
           </div>
         </div>
       </div>
 
       {/* Mobile Menu Dropdown */}
       <div
         className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white border-t border-border-subtle shadow-lg ${
           isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
         }`}
       >
         <div className="px-4 py-4 space-y-2">
           {navLinks.map((link) => (
             <Link
               key={link.name}
               href={link.href}
               className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-500 transition-colors"
               onClick={() => setIsOpen(false)}
             >
               {link.name}
             </Link>
           ))}
           <div className="pt-4 mt-2 border-t border-border-subtle">
             <a
               href={`tel:${phone.replace(/\D/g, '')}`}
               className="flex items-center gap-3 px-3 py-3 text-slate-700 font-medium hover:text-brand-500 transition-colors"
             >
               <div className="bg-slate-50 text-brand-500 p-2 rounded-full">
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
