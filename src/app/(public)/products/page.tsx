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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Our Products
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Browse our complete catalog of premium commodities and products, sourced from the best manufacturers in India and exported worldwide.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-12">
          
          <form className="relative w-full md:w-96">
            {activeCategorySlug && <input type="hidden" name="category" value={activeCategorySlug} />}
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              name="search"
              defaultValue={searchParams.search}
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm"
            />
          </form>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            <Link 
              href={searchParams.search ? `/products?search=${searchParams.search}` : `/products`}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${!activeCategorySlug ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600'}`}
            >
              <Filter className="h-4 w-4" /> All
            </Link>
            {categories?.map(category => (
              <Link 
                key={category.id} 
                href={`/products?category=${category.slug}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors shrink-0 ${activeCategorySlug === category.slug ? 'bg-brand-600 text-white shadow-sm' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400'}`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.length === 0 ? (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
              <p className="text-slate-500 max-w-md mx-auto">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </div>
          ) : (
            displayProducts.map((product) => (
              <Link 
                key={product.id} 
                href={`/products/${product.slug}`}
                className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 group flex flex-col h-full hover:-translate-y-1 relative"
              >
                {product.is_new_arrival && (
                  <div className="absolute top-4 left-4 z-10 bg-brand-500 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-md">
                    New
                  </div>
                )}
                <div className="h-64 bg-slate-200 dark:bg-slate-800 relative overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                    style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}
                  />
                  <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-brand-600 dark:text-brand-400 shadow-sm uppercase tracking-wider">
                    {product.category?.name || 'Uncategorized'}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 line-clamp-3 flex-grow">
                    {product.short_description}
                  </p>
                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium text-sm mt-auto group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    View Details <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
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
