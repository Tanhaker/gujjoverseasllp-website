"use client";

import React from "react";
import { ShieldCheck, Truck, MessageCircle, Building2 } from "lucide-react";
import { ScaleUp } from "@/components/public/MotionWrappers";

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
    <div id="why-choose-us" className="bg-bg-primary py-24 border-b border-border-subtle w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] uppercase tracking-[0.2em] text-brand-500 font-semibold">
            Why choose GujjOverseas
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-serif font-bold text-text-primary tracking-tight">
            Our Value Proposition
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, index) => (
            <ScaleUp key={index} delay={index * 0.1}>
              <div 
                className="bg-surface rounded-2xl p-8 border border-border-subtle hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center h-full"
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center text-brand-500 mb-6 border border-brand-500 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3 font-serif">{feat.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </ScaleUp>
          ))}
        </div>
      </div>
    </div>
  );
}
