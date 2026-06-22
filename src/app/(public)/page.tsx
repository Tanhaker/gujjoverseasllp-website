import Link from "next/link";
import { ArrowRight, LeafyGreen } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/public/HeroSection";
import StatsBar from "@/components/public/StatsBar";
import FeatureStrip from "@/components/public/FeatureStrip";
import TrustMarquee from "@/components/public/TrustMarquee";
import { SlideInRight, FadeInUp } from "@/components/public/MotionWrappers";

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
 <TrustMarquee />
 
 <FeatureStrip />

 {/* Featured Products Grid */}
 <section id="featured" className="py-24 bg-surface relative overflow-hidden">
 {/* Subtle background decoration */}
 <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-50 rounded-bl-[100%] pointer-events-none" />
 <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-50 rounded-tr-[100%] pointer-events-none" />
 
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 <FadeInUp className="text-center mb-16">
 <h2 className="text-3xl md:text-5xl font-serif font-bold text-text-primary mb-6 tracking-tight">
 Featured Export Products
 </h2>
 <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light leading-relaxed font-sans">
 Discover our top-grade selection of export commodities, processed and packed to meet strict international quality standards.
 </p>
 </FadeInUp>

 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {displayProducts.length === 0 ? (
 <div className="col-span-full text-center py-20 bg-white shadow-sm rounded-3xl border border-border-subtle">
 <p className="text-slate-500 text-lg">Products will appear here once added to the system.</p>
 </div>
 ) : (
 displayProducts.map((product, index) => (
 <SlideInRight key={product.id} delay={index * 0.1}>
 <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border-subtle hover:border-brand-500 group relative flex flex-col hover:-translate-y-2 h-full">
 {product.is_new_arrival && (
 <div className="absolute top-4 left-4 z-20 overflow-hidden rounded-full p-[1px] group/badge">
 <div className="absolute inset-0 bg-brand-500 opacity-70 animate-pulse blur-[2px]" />
 <div className="relative bg-white/90 backdrop-blur-xl border border-brand-200 text-brand-600 text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
 <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
 New Arrival
 </div>
 </div>
 )}
 <div className="h-64 bg-bg-primary relative overflow-hidden shrink-0 border-b border-border-subtle">
 <div 
 className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" 
 style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
 </div>
 <div className="p-6 md:p-8 flex flex-col flex-grow bg-white relative z-10">
 <span className="text-xs font-bold text-brand-500 uppercase tracking-widest mb-3 block font-serif">
 {product.category?.name || 'Uncategorized'}
 </span>
 <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-brand-500 transition-colors line-clamp-1 font-serif">{product.name}</h3>
 <p className="text-slate-500 line-clamp-2 mb-6 text-sm flex-grow leading-relaxed">
 {product.short_description}
 </p>
 <Link href={`/products/${product.slug}`} className="flex items-center text-text-primary font-semibold mt-auto group-hover:text-brand-500 text-sm w-fit transition-colors">
 View Details 
 <div className="ml-2 bg-brand-50 p-1.5 rounded-full group-hover:bg-brand-100 transition-colors">
 <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
 </div>
 </Link>
 </div>
 </div>
 </SlideInRight>
 ))
 )}
 </div>

 <FadeInUp className="mt-16 text-center">
 <Link
 href="/products"
 className="inline-flex items-center justify-center px-10 py-4 text-base font-bold rounded-full text-white bg-text-primary hover:bg-slate-800 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 gap-2"
 >
 Explore Full Catalog <ArrowRight className="h-5 w-5" />
 </Link>
 </FadeInUp>
 </div>
 </section>

 {/* Dark CTA Snippet */}
 <section className="py-24 bg-[#111111] relative overflow-hidden text-white">
 {/* Subtle grid pattern */}
 <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'linear-gradient(#FAFAF7 1px, transparent 1px), linear-gradient(90deg, #FAFAF7 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
 <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
 <LeafyGreen className="h-16 w-16 text-brand-500 mb-6" />
 <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">
 Ready to import premium Indian products?
 </h2>
 <p className="text-lg text-white/70 mb-10 font-light leading-relaxed max-w-2xl">
 Partner with GujjOverseas LLP for reliable sourcing, exceptional quality control, and seamless international shipping. Let's discuss your requirements today.
 </p>
 <div className="flex flex-col sm:flex-row gap-4">
 <Link
 href="/contact"
 className="inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-8 py-4 rounded-full font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/20"
 >
 Contact Us Now
 <ArrowRight className="h-5 w-5" />
 </Link>
 <Link
 href={`https://wa.me/${(settings.contact_whatsapp || "+919714888806").replace(/\D/g, '')}`}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
 >
 Chat on WhatsApp
 </Link>
 </div>
 </div>
 </section>
 </div>
 );
}
