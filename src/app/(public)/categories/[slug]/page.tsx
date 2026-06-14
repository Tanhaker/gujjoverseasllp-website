import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Leaf, Scissors, Palette, Diamond, Flame, Sofa, ChevronRight } from "lucide-react";

const renderIcon = (iconName: string, color: string) => {
  const props = { className: "w-12 h-12", style: { color } };
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

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();

  // 1. Fetch category details
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', params.slug)
    .eq('is_visible', true)
    .single();

  if (!category) {
    notFound();
  }

  // 2. Fetch products in this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', category.id)
    .eq('is_visible', true)
    .order('created_at', { ascending: false });

  const displayProducts = products || [];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      
      {/* Category Premium Hero Banner */}
      <div 
        className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden border-b border-slate-200 dark:border-slate-800"
        style={{ backgroundColor: `${category.color || '#2ecc71'}10` }}
      >
        {/* Background icon decoration with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-slate-950/40 z-0"></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 scale-[6] md:scale-[8] pointer-events-none z-0">
          {renderIcon(category.icon, category.color || '#2ecc71')}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-slate-500 font-medium mb-10 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md inline-flex px-4 py-2 rounded-full shadow-sm border border-slate-200/50 dark:border-slate-800/50">
            <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
            <Link href="/categories" className="hover:text-brand-600 transition-colors">Categories</Link>
            <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
            <span className="text-slate-900 dark:text-slate-100 font-bold">{category.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center gap-8 animate-fade-in-up">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 shrink-0 transform hover:scale-105 transition-transform duration-300">
              {renderIcon(category.icon, category.color || '#2ecc71')}
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
                {category.name}
              </h1>
              <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl leading-relaxed font-light">
                {category.description || `Explore our premium selection of ${category.name.toLowerCase()} sourced for international markets.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-2">Available Products</h2>
            <p className="text-slate-500 font-medium">Showing {displayProducts.length} items</p>
          </div>
          <Link href="/products" className="hidden sm:flex text-brand-600 hover:text-brand-700 font-bold items-center gap-2 bg-brand-50 dark:bg-brand-900/30 px-5 py-2.5 rounded-full transition-colors hover:bg-brand-100 dark:hover:bg-brand-900/50">
            View Full Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {displayProducts.length === 0 ? (
          <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-16 text-center shadow-sm">
            <div className="w-20 h-20 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <Leaf className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">
              We are currently updating our catalog for this category. Please check back later or contact us for specific requirements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayProducts.map((product) => (
              <Link key={product.id} href={`/products/${product.slug}`} className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100/80 dark:border-slate-800 group relative flex flex-col hover:-translate-y-2">
                {product.is_new_arrival && (
                  <div className="absolute top-4 left-4 z-20 bg-brand-500 text-white text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold shadow-lg shadow-brand-500/30 backdrop-blur-md">
                    New Arrival
                  </div>
                )}
                <div className="h-64 bg-slate-100 dark:bg-slate-800 relative overflow-hidden shrink-0">
                  <div 
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700 ease-out" 
                    style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-10 bg-white dark:bg-slate-900">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2">{product.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 text-sm flex-grow leading-relaxed">
                    {product.short_description}
                  </p>
                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-semibold mt-auto group-hover:text-brand-700 dark:group-hover:text-brand-300 text-sm">
                    View Details 
                    <div className="ml-2 bg-brand-50 dark:bg-brand-900/30 p-1.5 rounded-full group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
