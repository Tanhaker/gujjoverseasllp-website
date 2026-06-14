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
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Featured Export Products
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover our top-grade selection of export commodities, processed and packed to meet international standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                Products will appear here once added to the system.
              </div>
            ) : (
              displayProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800 group relative">
                  {product.is_new_arrival && (
                    <div className="absolute top-4 left-4 z-10 bg-[#2ecc71] text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-md">
                      New
                    </div>
                  )}
                  <div className="h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                      style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2 block">
                      {product.category?.name || 'Uncategorized'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 text-sm">
                      {product.short_description}
                    </p>
                    <Link href={`/products/${product.slug}`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 inline-flex items-center gap-1 text-sm">
                      View Details <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium rounded-full text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-all shadow-sm hover:-translate-y-0.5"
            >
              View All Products
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
