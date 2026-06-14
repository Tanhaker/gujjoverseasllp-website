import Link from "next/link";
import { ArrowRight, LeafyGreen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/public/HeroSection";
import StatsBar from "@/components/public/StatsBar";
import FeatureStrip from "@/components/public/FeatureStrip";

export default async function Home() {
  const supabase = await createClient();
  
  // 1. Fetch featured products
  const { data: featuredProducts } = await supabase
    .from('products')
    .select(`
      *,
      category:categories(name)
    `)
    .eq('is_visible', true)
    .eq('is_featured', true)
    .limit(6);

  const displayProducts = featuredProducts || [];

  // 2. Fetch categories for Hero
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  const displayCategories = categories || [];

  // 3. Fetch site settings
  const { data: settingsData } = await supabase.from('site_settings').select('key, value');
  const settings = settingsData?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection 
        badgeText={settings.hero_badge_text || "Trusted Indian Exporter"}
        tagline={settings.company_tagline || "Export Quality Products From India To The World"}
        subtext={settings.hero_subtext || "GujjOverseas LLP connects global buyers with the finest Indian manufacturers."}
        categories={displayCategories}
      />
      
      <StatsBar 
        products={settings.stat_products || "50+"}
        countries={settings.stat_countries || "20+"}
        categories={settings.stat_categories || "5+"}
        responseTime={settings.stat_response_time || "24h"}
      />
      
      <FeatureStrip />

      {/* Featured Products Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-500/5 rounded-bl-[100%] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-[#2ecc71]/5 rounded-tr-[100%] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
              Featured Export Products
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Discover our top-grade selection of export commodities, processed and packed to meet strict international quality standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.length === 0 ? (
              <div className="col-span-full text-center py-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
                <p className="text-slate-500 dark:text-slate-400 text-lg">Products will appear here once added to the system.</p>
              </div>
            ) : (
              displayProducts.map((product) => (
                <div key={product.id} className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-slate-800/50 group relative flex flex-col hover:-translate-y-2">
                  {product.is_new_arrival && (
                    <div className="absolute top-4 left-4 z-20 overflow-hidden rounded-full p-[1px] group/badge">
                      <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-blue-500 to-emerald-400 opacity-70 animate-pulse-slow blur-[2px]" />
                      <div className="relative bg-white/20 backdrop-blur-xl border border-white/40 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                        New Arrival
                      </div>
                    </div>
                  )}
                  <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" 
                      style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-grow bg-white dark:bg-slate-900 relative z-10">
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-3 block">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1">{product.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 text-sm flex-grow leading-relaxed">
                      {product.short_description}
                    </p>
                    <Link href={`/products/${product.slug}`} className="flex items-center text-brand-600 dark:text-brand-400 font-semibold mt-auto group-hover:text-brand-700 dark:group-hover:text-brand-300 text-sm w-fit">
                      View Details 
                      <div className="ml-2 bg-brand-50 dark:bg-brand-900/30 p-1.5 rounded-full group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-16 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-10 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 gap-2"
            >
              Explore Full Catalog <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Snippet */}
      <section className="py-24 bg-[#0a2e1a] relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <LeafyGreen className="h-16 w-16 text-[#2ecc71] mb-6" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Rooted in Quality,<br /> Growing Globally.
            </h2>
            <p className="text-lg text-white/70 mb-8 font-light leading-relaxed">
              With years of expertise, GujjOverseas LLP has established itself as a reliable partner for importing high-quality commodities, textiles, and handicrafts from India. We manage the entire supply chain to ensure our clients receive the best products seamlessly.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#2ecc71] font-medium hover:text-[#27ae60] transition-colors group"
            >
              Read Our Story
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="md:w-1/2 w-full grid grid-cols-2 gap-4">
            {displayCategories.slice(0, 4).map((cat: any) => (
              <div key={cat.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
                <h4 className="text-xl font-bold text-white mb-1">{cat.name}</h4>
                <p className="text-[#2ecc71] text-xs uppercase tracking-wider">{cat.description || "Premium Quality"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
