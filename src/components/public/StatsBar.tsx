"use client";

import React from "react";
import CountUp from "react-countup";
import { motion } from "framer-motion";

interface StatsBarProps {
 products: string;
 countries: string;
 categories: string;
 responseTime: string;
}

export default function StatsBar({ products, countries, categories, responseTime }: StatsBarProps) {
 // Helper to parse numbers and suffixes
 const parseStat = (str: string) => {
 const match = str.match(/^(\d+)(.*)$/);
 if (match) {
 return { num: parseInt(match[1], 10), suffix: match[2] };
 }
 return { num: parseInt(str, 10) || 0, suffix: "" };
 };

 const stats = [
 { ...parseStat(products), label: "Products Listed" },
 { ...parseStat(countries), label: "Countries Served" },
 { ...parseStat(categories), label: "Product Categories" },
 { num: 100, suffix: "%", label: "Quality Certified" },
 { ...parseStat(responseTime), label: "Inquiry Response" },
 ];

 return (
 <div className="bg-bg-primary relative z-10 w-full overflow-hidden">
 {/* Central Expanding Divider */}
 <motion.div 
 initial={{ scaleX: 0 }}
 whileInView={{ scaleX: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 1, ease: "easeOut" }}
 className="w-full h-px bg-brand-500 origin-center absolute top-0"
 />
 
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
 <div className="flex flex-wrap justify-center gap-y-12 gap-x-4 sm:gap-x-12 md:divide-x md:divide-border-subtle">
 {stats.map((stat, index) => (
 <motion.div 
 key={index} 
 initial={{ opacity: 0, y: 20 }}
 whileInView={{ opacity: 1, y: 0 }}
 viewport={{ once: true, margin: "-50px" }}
 transition={{ duration: 0.5, delay: index * 0.1 }}
 className="flex flex-col items-center justify-center text-center px-4 w-[45%] md:w-auto md:flex-1"
 >
 <span className="text-4xl sm:text-5xl font-black text-text-primary mb-2 flex items-baseline font-serif tracking-tight">
 <CountUp 
 end={stat.num} 
 duration={2.5} 
 enableScrollSpy 
 scrollSpyOnce
 scrollSpyDelay={100}
 />
 <span className="text-brand-500 ml-1">{stat.suffix}</span>
 </span>
 <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-slate-500 font-semibold text-center">{stat.label}</span>
 </motion.div>
 ))}
 </div>
 </div>
 
 {/* Bottom Expanding Divider */}
 <motion.div 
 initial={{ scaleX: 0 }}
 whileInView={{ scaleX: 1 }}
 viewport={{ once: true, margin: "-100px" }}
 transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
 className="w-full h-px bg-border-subtle origin-center absolute bottom-0"
 />
 </div>
 );
}
