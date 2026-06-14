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
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-slate-500 font-medium">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <Link href="/categories" className="hover:text-brand-600">Categories</Link>
          <ChevronRight className="w-4 h-4 mx-2 text-slate-400" />
          <span className="text-slate-800 dark:text-slate-200">{category.name}</span>
        </nav>
      </div>

      {/* Category Hero Banner */}
      <div 
        className="relative py-16 lg:py-24 overflow-hidden"
        style={{ backgroundColor: `${category.color}10` }}
      >
        {/* Background icon decoration */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-5 scale-[8] pointer-events-none">
          {renderIcon(category.icon, category.color)}
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-6 mb-6">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              {renderIcon(category.icon, category.color)}
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white">
              {category.name}
            </h1>
          </div>
          <p className="text-lg text-slate-700 dark:text-slate-300 max-w-2xl leading-relaxed">
            {category.description || `Explore our premium selection of ${category.name.toLowerCase()} sourced for international markets.`}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Products in {category.name}</h2>
            <p className="text-slate-500">Showing {displayProducts.length} items</p>
          </div>
          <Link href="/products" className="hidden sm:flex text-brand-600 hover:text-brand-700 font-medium items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {displayProducts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-12 text-center">
            <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Leaf className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No products found</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              We are currently updating our catalog for this category. Please check back later or contact us for specific requirements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayProducts.map((product) => (
              <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-800 group relative">
                {product.is_new_arrival && (
                  <div className="absolute top-4 left-4 z-10 bg-brand-500 text-white text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full font-bold shadow-md">
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
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{product.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 text-sm">
                    {product.short_description}
                  </p>
                  <Link href={`/products/${product.slug}`} className="text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 inline-flex items-center gap-1 text-sm">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
