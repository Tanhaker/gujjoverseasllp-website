import React from "react";
import { ShieldCheck, Truck, MessageCircle, Building2 } from "lucide-react";

export default function FeatureStrip() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Certified Quality",
      desc: "FSSAI, APEDA & ISO 9001 certified products",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "End-to-End Export",
      desc: "Seamless logistics and customs clearance",
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "WhatsApp Support",
      desc: "24/7 automated & human assistance",
    },
    {
      icon: <Building2 className="h-6 w-6" />,
      title: "Direct from Source",
      desc: "Procured directly from top Indian manufacturers",
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-950 py-12 border-b border-slate-100 dark:border-slate-900 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-semibold">
            Why choose GujjOverseas
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <div 
              key={index} 
              className="bg-slate-50 dark:bg-slate-900/50 rounded-xl p-6 border border-slate-100 dark:border-slate-800/60 hover:shadow-lg hover:border-brand-200 dark:hover:border-brand-900/50 transition-all duration-300 group"
            >
              <div className="bg-white dark:bg-slate-800 w-12 h-12 rounded-lg flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feat.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
