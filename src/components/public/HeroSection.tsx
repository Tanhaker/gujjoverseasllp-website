"use client";

import Link from "next/link";
import { ArrowRight, Leaf, Scissors, Palette, Diamond, Flame, Sofa, ArrowUpRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
}

interface HeroProps {
  badgeText: string;
  tagline: string;
  subtext: string;
  categories: Category[];
}

export default function HeroSection({ badgeText, tagline, subtext, categories }: HeroProps) {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 1000], [0, 300]);

  const renderTagline = () => {
    const parts = tagline.split(/Quality/i);
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}<span className="text-brand-500">Quality</span>{parts[1]}
        </>
      );
    }
    return tagline;
  };

  const renderIcon = (iconName: string, color: string) => {
    const props = { className: "w-6 h-6", style: { color } };
    switch (iconName) {
      case 'plant-2': return <Leaf {...props} />;
      case 'scissors': return <Scissors {...props} />;
      case 'palette': return <Palette {...props} />;
      case 'diamond': return <Diamond {...props} />;
      case 'flame': return <Flame {...props} />;
      case 'sofa': return <Sofa {...props} />;
      default: return <Leaf {...props} />;
    }
  };

  return (
    <div id="hero" className="relative w-full min-h-[500px] bg-bg-primary overflow-hidden flex items-center pt-20">
      
      {/* Background Rings and Image Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Premium Image Background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-[0.04] mix-blend-multiply" />
        
        {/* Decorative Rings */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.07]">
          <div className="absolute w-[800px] h-[800px] rounded-full border-[2px] border-brand-500" />
          <div className="absolute w-[1200px] h-[1200px] rounded-full border-[2px] border-brand-500" />
          <div className="absolute w-[1600px] h-[1600px] rounded-full border-[2px] border-brand-500" />
        </div>
      </div>

      {/* Parallax Watermark Text */}
      <motion.div 
        style={{ y: yParallax }}
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden select-none"
      >
        <span className="text-[20vw] font-serif font-black text-brand-500 opacity-[0.03] tracking-tighter whitespace-nowrap">
          EXPORTS
        </span>
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Badge */}
            {badgeText && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-500/40 bg-surface shadow-sm mb-6"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                </span>
                <span className="text-xs font-medium text-brand-500 uppercase tracking-wide">{badgeText}</span>
              </motion.div>
            )}
            
            {/* Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-text-primary leading-[1.15] mb-6"
            >
              {renderTagline()}
            </motion.h1>
            
            {/* Subtext */}
            {subtext && (
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-[480px] mb-8 leading-relaxed font-sans"
              >
                {subtext}
              </motion.p>
            )}
            
            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              <Link href="/products" className="inline-flex justify-center items-center gap-2 bg-text-primary hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-md hover:-translate-y-0.5">
                Explore All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex justify-center items-center gap-2 bg-surface border border-border-subtle hover:border-brand-500 text-text-primary px-8 py-3.5 rounded-full font-medium transition-all shadow-sm">
                Send an Inquiry
              </Link>
            </motion.div>
          </div>
          
          {/* Right Column (45%) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 w-full relative"
          >
            <div className="mb-4">
              <span className="text-[11px] text-brand-500 uppercase tracking-[0.2em] font-medium">Browse by category</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat, index) => (
                <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                >
                  <Link 
                    href={`/categories/${cat.slug}`} 
                    className="group relative bg-surface border border-border-subtle hover:border-brand-500 rounded-xl p-4 sm:p-5 transition-all duration-300 overflow-hidden block shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowUpRight className="w-4 h-4 text-brand-500" />
                    </div>
                    
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 shadow-sm"
                      style={{ backgroundColor: `${cat.color}15` }}
                    >
                      {renderIcon(cat.icon, cat.color)}
                    </div>
                    
                    <h3 className="text-text-primary font-medium text-sm sm:text-[15px] mb-1 font-serif">{cat.name}</h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1">{cat.description || "Explore collection"}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
