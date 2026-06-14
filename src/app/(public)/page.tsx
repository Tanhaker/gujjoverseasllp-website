import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck, Globe, LeafyGreen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: featuredProducts } = await supabase
    .from('products')
    .select('*')
    .eq('visible', true)
    .limit(3);

  const displayProducts = featuredProducts || [];

  // Fetch texts
  const { data: settingsData } = await supabase.from('site_settings').select('key, value').in('key', ['hero_text', 'company_tagline']);
  const settings = settingsData?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};

  const heroText = settings.hero_text || 'Premium Agro Exports Delivered Globally';
  const companyTagline = settings.company_tagline || 'Sourcing the finest grains, spices, and pulses directly from the heart of India to the world. Quality you can trust, taste you will remember.';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 z-0 bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 to-brand-900/40 mix-blend-multiply z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856724017-0624e548d1c7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-60" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-serif text-white tracking-tight mb-6 drop-shadow-lg whitespace-pre-line">
            {heroText}
          </h1>
          <p className="mt-6 text-xl md:text-2xl text-slate-200 max-w-3xl mx-auto font-light leading-relaxed drop-shadow whitespace-pre-line">
            {companyTagline}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-lg hover:shadow-brand-500/30 gap-2"
            >
              Explore Our Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium rounded-full text-white glassmorphism hover:bg-white/10 transition-all gap-2"
            >
              Contact for Inquiry
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Signals Section */}
      <section className="py-12 bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Certified Quality & Compliance
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for actual certification logos */}
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-slate-400" />
              <span className="text-xl font-bold text-slate-400">FSSAI</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-8 w-8 text-slate-400" />
              <span className="text-xl font-bold text-slate-400">APEDA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-slate-400" />
              <span className="text-xl font-bold text-slate-400">ISO 9001</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Featured Export Products
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Discover our top-grade selection of agricultural commodities, processed and packed to meet international standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-500">
                Products will appear here once added to the system.
              </div>
            ) : (
              displayProducts.map((product) => (
                <div key={product.id} className="bg-white dark:bg-slate-950 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800 group">
                  <div className="h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                      style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-brand-600 uppercase tracking-wider mb-2 block">{product.category}</span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
                      {product.short_description}
                    </p>
                    <Link href={`/products/${product.slug}`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 inline-flex items-center gap-1">
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
              className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-full text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Snippet */}
      <section className="py-24 bg-brand-900 relative overflow-hidden text-white">
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,0 C30,50 70,50 100,0 L100,100 L0,100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <LeafyGreen className="h-16 w-16 text-brand-400 mb-6" />
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
              Rooted in Quality,<br /> Growing Globally.
            </h2>
            <p className="text-lg text-brand-100 mb-8 font-light leading-relaxed">
              With years of expertise in the agricultural sector, GujjOverseas LLP has established itself as a reliable partner for importing high-quality commodities from India. We manage the entire supply chain to ensure our clients receive the best products.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-brand-300 font-medium hover:text-white transition-colors group"
            >
              Read Our Story
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="md:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
                <h4 className="text-4xl font-bold text-brand-400 mb-2">50+</h4>
                <p className="text-brand-100 text-sm">Products Exported</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 mt-8">
                <h4 className="text-4xl font-bold text-brand-400 mb-2">20+</h4>
                <p className="text-brand-100 text-sm">Countries Served</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
