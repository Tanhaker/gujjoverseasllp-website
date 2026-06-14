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
    <div className="bg-[#0a2e1a]/95 border-t border-white/10 relative z-10 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4 divide-x-0 md:divide-x divide-white/10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center justify-center text-center px-4">
              <span className="text-3xl font-bold text-[#2ecc71] mb-1">{stat.value}</span>
              <span className="text-xs uppercase tracking-wider text-white/60 font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
