import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Leaf, Scissors, Palette, Diamond, Flame, Sofa } from "lucide-react";

export const metadata = {
  title: "Product Categories | GujjOverseas LLP",
  description: "Browse our premium export categories including Agro, Textiles, Handicrafts, and more.",
};

const renderIcon = (iconName: string, color: string) => {
  const props = { className: "w-8 h-8", style: { color } };
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

export default async function CategoriesPage() {
  const supabase = await createClient();

  // Fetch categories with product counts
  const { data: categories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .eq('is_visible', true)
    .order('display_order', { ascending: true });

  const displayCategories = categories || [];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pb-24">
      {/* Premium Header Banner */}
      <div className="relative bg-brand-950 text-white pt-24 pb-32 overflow-hidden mb-[-80px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856724017-0624e548d1c7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-15 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-brand-950/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Our Export Categories
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto font-light">
            Explore our diverse range of premium Indian products sourced directly from manufacturers and prepared for global export.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category: any) => {
            const productCount = category.products?.[0]?.count || 0;
            return (
              <Link 
                href={`/categories/${category.slug}`} 
                key={category.id}
                className="group flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 dark:border-slate-800/50 hover:-translate-y-2 relative"
              >
                {/* Subtle top border glow based on category color */}
                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: category.color || '#2ecc71' }} />
                
                <div 
                  className="h-40 p-8 flex items-end relative overflow-hidden transition-colors duration-500"
                  style={{ backgroundColor: `${category.color || '#2ecc71'}10` }}
                >
                  <div className="absolute -top-12 -right-12 opacity-10 scale-[3] transform group-hover:scale-[4] group-hover:rotate-12 transition-all duration-700 ease-out">
                    {renderIcon(category.icon, category.color || '#2ecc71')}
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-4 rounded-2xl shadow-md z-10 relative group-hover:scale-110 transition-transform duration-500">
                    {renderIcon(category.icon, category.color || '#2ecc71')}
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow bg-white dark:bg-slate-900 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors" style={{ color: category.color ? undefined : undefined }}>
                      {category.name}
                    </h2>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-inner uppercase tracking-wider">
                      {productCount} Products
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-8 flex-grow">
                    {category.description || `Browse our collection of premium ${category.name.toLowerCase()} sourced and packaged for international quality standards.`}
                  </p>
                  
                  <div className="flex items-center font-bold text-sm" style={{ color: category.color || '#2ecc71' }}>
                    Browse Collection 
                    <div className="ml-2 p-1.5 rounded-full transition-colors" style={{ backgroundColor: `${category.color || '#2ecc71'}20` }}>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {displayCategories.length === 0 && (
          <div className="text-center py-32 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No categories found</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">
              We are currently updating our catalog. Check back soon for our premium categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
