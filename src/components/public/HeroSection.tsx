import Link from "next/link";
import { ArrowRight, Leaf, Scissors, Palette, Diamond, Flame, Sofa, ArrowUpRight } from "lucide-react";

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
  // Helper to safely render the word "Quality" in green if it exists in the tagline
  const renderTagline = () => {
    const parts = tagline.split(/Quality/i);
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}<span className="text-[#2ecc71]">Quality</span>{parts[1]}
        </>
      );
    }
    return tagline;
  };

  // Map string icon names to Lucide components
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
    <div className="relative w-full min-h-[460px] bg-gradient-to-br from-[#0a2e1a] via-[#0f4a2a] to-[#1a6b3a] overflow-hidden flex items-center">
      {/* Subtle overlay pattern */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column (55%) */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2ecc71]/40 bg-[#2ecc71]/10 backdrop-blur-sm mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2ecc71] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2ecc71]"></span>
                </span>
                <span className="text-xs font-medium text-[#2ecc71] uppercase tracking-wide">{badgeText}</span>
              </div>
            )}
            
            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-serif font-bold text-white leading-[1.15] mb-6">
              {renderTagline()}
            </h1>
            
            {/* Subtext */}
            {subtext && (
              <p className="text-base sm:text-lg text-white/65 max-w-[480px] mb-8 leading-relaxed font-light">
                {subtext}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 w-full sm:w-auto">
              <Link href="/products" className="inline-flex justify-center items-center gap-2 bg-[#2ecc71] hover:bg-[#27ae60] text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_4px_20px_rgba(46,204,113,0.3)] hover:shadow-[0_4px_25px_rgba(46,204,113,0.4)] hover:-translate-y-0.5">
                Explore All Products
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/contact" className="inline-flex justify-center items-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 text-white px-8 py-3.5 rounded-full font-medium transition-all hover:border-white/40">
                Send an Inquiry
              </Link>
            </div>
            
            {/* Certifications Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-6 border-t border-white/10 w-full sm:w-auto">
              {['FSSAI Certified', 'APEDA Registered', 'ISO 9001', 'GST Verified'].map((cert) => (
                <div key={cert} className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                  <span className="text-[11px] font-medium text-white/50 tracking-wider uppercase">{cert}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column (45%) */}
          <div className="lg:col-span-5 w-full">
            <div className="mb-4">
              <span className="text-[11px] text-white/40 uppercase tracking-[0.2em] font-medium">Browse by category</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {categories.slice(0, 6).map((cat) => (
                <Link 
                  href={`/categories/${cat.slug}`} 
                  key={cat.id}
                  className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-4 sm:p-5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-white/50" />
                  </div>
                  
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 shadow-inner"
                    style={{ backgroundColor: `${cat.color}20` }} // 20% opacity background
                  >
                    {renderIcon(cat.icon, cat.color)}
                  </div>
                  
                  <h3 className="text-white font-medium text-sm sm:text-[15px] mb-1 group-hover:text-[#2ecc71] transition-colors">{cat.name}</h3>
                  <p className="text-[11px] text-white/45 line-clamp-1">{cat.description || "Explore collection"}</p>
                </Link>
              ))}
              
              {/* Coming Soon placeholder if less than 6 categories */}
              {categories.length < 6 && Array.from({ length: 6 - categories.length }).map((_, i) => (
                <div key={`empty-${i}`} className="border border-dashed border-white/10 rounded-xl p-5 flex flex-col items-center justify-center opacity-50">
                  <div className="w-8 h-8 rounded bg-white/5 mb-2"></div>
                  <span className="text-[10px] text-white/30 uppercase tracking-wider">More Coming Soon</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
