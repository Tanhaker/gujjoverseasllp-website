import Link from "next/link";
import { ArrowRight, Search, Filter } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export const metadata = {
  title: "All Products | GujjOverseas LLP",
  description: "Browse our entire catalog of premium export products across all categories.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const supabase = await createClient();

  // 1. Fetch all visible categories for the filter chips
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  const activeCategorySlug = searchParams.category;
  const activeCategoryId = categories?.find(c => c.slug === activeCategorySlug)?.id;

  // 2. Fetch products
  let query = supabase
    .from('products')
    .select(`
      *,
      category:categories(name, slug)
    `)
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  if (activeCategoryId) {
    query = query.eq('category_id', activeCategoryId);
  }

  if (searchParams.search) {
    query = query.ilike('name', `%${searchParams.search}%`);
  }

  const { data: products } = await query;
  const displayProducts = products || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Premium Header Banner */}
      <div className="relative bg-brand-950 text-white pt-24 pb-20 overflow-hidden">
        {/* Subtle patterned background overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Our Premium Catalog
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto font-light">
            Discover a world of superior quality. We source the finest commodities from India and deliver excellence globally.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Filters and Search Bar - Glassmorphism */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/50 dark:border-slate-800/50 shadow-xl rounded-3xl p-4 flex flex-col md:flex-row gap-4 justify-between items-center mb-16">
          
          <form className="relative w-full md:w-96">
            {activeCategorySlug && <input type="hidden" name="category" value={activeCategorySlug} />}
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search products..."
              className="block w-full pl-11 pr-4 py-3.5 border-0 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner"
            />
          </form>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Link 
              href={searchParams.search ? `/products?search=${searchParams.search}` : `/products`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${!activeCategorySlug ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              <Filter className="h-4 w-4" /> All
            </Link>
            {categories?.map(category => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all shrink-0 ${activeCategorySlug === category.slug ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <div className="bg-brand-50 dark:bg-brand-900/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No products found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto text-lg">
                We couldn't find any products matching your current filters. Try adjusting your search criteria.
              </p>
            </div>
          ) : (
            displayProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100/80 dark:border-slate-800 group flex flex-col h-full hover:-translate-y-2 relative"
              >
                {product.is_new_arrival && (
                  <div className="absolute top-4 left-4 z-20 overflow-hidden rounded-full p-[1px] group/badge">
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-400 via-blue-500 to-emerald-400 opacity-70 animate-pulse-slow blur-[2px]" />
                    <div className="relative bg-white/20 backdrop-blur-xl border border-white/40 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse"></span>
                      New Arrival
                    </div>
                  </div>
                )}
                <div className="h-72 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" 
                    style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
                  />
                  {/* Subtle gradient overlay at bottom of image for text readability if needed */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-4 right-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm uppercase tracking-wider">
                    {product.category?.name || 'Uncategorized'}
                  </div>
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow bg-white dark:bg-slate-900 relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 flex-grow leading-relaxed">
                    {product.short_description}
                  </p>
                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-semibold text-sm mt-auto group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    Discover More 
                    <div className="ml-2 bg-brand-50 dark:bg-brand-900/30 p-1.5 rounded-full group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
