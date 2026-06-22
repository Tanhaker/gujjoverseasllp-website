"use client";

import Marquee from "react-fast-marquee";
import Image from "next/image";

const certifications = [
 "APEDA Certified",
 "FSSAI Approved",
 "ISO 9001:2015",
 "Global GAP",
 "FIEO Member",
 "Spices Board India",
];

export default function TrustMarquee() {
 return (
 <div className="w-full bg-white border-y border-border-subtle py-4 overflow-hidden relative z-10 shadow-sm">
 <Marquee gradient={false} speed={40} className="overflow-hidden">
 {certifications.map((cert, index) => (
 <div
 key={index}
 className="flex items-center gap-2 mx-8 md:mx-16 text-slate-600 font-serif font-medium tracking-wide whitespace-nowrap"
 >
 <div className="w-2 h-2 rounded-full bg-brand-500" />
 {cert}
 </div>
 ))}
 </Marquee>
 </div>
 );
}
