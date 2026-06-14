import React from "react";

interface StatsBarProps {
  products: string;
  countries: string;
  categories: string;
  responseTime: string;
}

export default function StatsBar({ products, countries, categories, responseTime }: StatsBarProps) {
  const stats = [
    { value: products, label: "Products Listed" },
    { value: countries, label: "Countries Served" },
    { value: categories, label: "Product Categories" },
    { value: "100%", label: "Quality Certified" },
    { value: responseTime, label: "Inquiry Response" },
  ];

  return (
    <div className="bg-[#0a2e1a]/95 border-y border-white/10 relative z-10 w-full overflow-hidden shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-wrap justify-center gap-y-10 gap-x-4 sm:gap-x-12 md:divide-x md:divide-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center px-4 w-[45%] md:w-auto md:flex-1">
              <span className="text-4xl sm:text-5xl font-black text-[#2ecc71] mb-2 drop-shadow-md">{stat.value}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.15em] text-white/70 font-semibold text-center">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
