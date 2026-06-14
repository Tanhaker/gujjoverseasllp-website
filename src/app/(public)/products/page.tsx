import Link from "next/link";
import { ArrowRight, Search, Filter } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('visible', true)
    .order('created_at', { ascending: false });

  const displayProducts = products || [];
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Our Products
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our catalog of premium agricultural commodities, sourced from the best farms in India and exported worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors shrink-0">
              <Filter className="h-4 w-4" /> All
            </button>
            {["Grains", "Spices", "Pulses", "Dry Fruits"].map(category => (
              <button 
                key={category} 
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-full text-sm font-medium hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors shrink-0"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-slate-500">
              No products found. Please check back later.
            </div>
          ) : (
            displayProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group flex flex-col h-full hover:-translate-y-1"
              >
                <div className="h-56 bg-slate-200 dark:bg-slate-800 relative overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 dark:text-brand-400 shadow-sm uppercase tracking-wider">
                    {product.category}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {product.short_description}
                  </p>
                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium text-sm mt-auto group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    View Specifications <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
