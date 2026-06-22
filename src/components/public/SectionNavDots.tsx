"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const sections = [
 { id: "hero", label: "Home" },
 { id: "categories", label: "Categories" },
 { id: "featured", label: "Featured" },
 { id: "why-choose-us", label: "Why Us" },
 { id: "footer", label: "Contact" },
];

export default function SectionNavDots() {
 const [activeSection, setActiveSection] = useState("hero");

 useEffect(() => {
 const observers = new Map();

 const handleIntersect = (entries: IntersectionObserverEntry[]) => {
 entries.forEach((entry) => {
 if (entry.isIntersecting) {
 setActiveSection(entry.target.id);
 }
 });
 };

 const observer = new IntersectionObserver(handleIntersect, {
 threshold: 0.5,
 });

 sections.forEach(({ id }) => {
 const element = document.getElementById(id);
 if (element) {
 observer.observe(element);
 observers.set(id, element);
 }
 });

 return () => {
 observers.forEach((element) => observer.unobserve(element));
 };
 }, []);

 const scrollTo = (id: string) => {
 const element = document.getElementById(id);
 if (element) {
 element.scrollIntoView({ behavior: "smooth" });
 }
 };

 return (
 <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4">
 {sections.map(({ id, label }) => (
 <button
 key={id}
 onClick={() => scrollTo(id)}
 className="group relative flex items-center justify-end"
 aria-label={`Scroll to ${label}`}
 >
 <span className="absolute right-8 px-2 py-1 bg-white text-slate-800 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm whitespace-nowrap pointer-events-none font-serif">
 {label}
 </span>
 <motion.div
 className={`w-3 h-3 rounded-full border-2 transition-colors duration-300 ${
 activeSection === id
 ? "bg-brand-500 border-brand-500"
 : "bg-transparent border-slate-300 hover:border-brand-500"
 }`}
 whileHover={{ scale: 1.2 }}
 whileTap={{ scale: 0.9 }}
 />
 </button>
 ))}
 </div>
 );
}
