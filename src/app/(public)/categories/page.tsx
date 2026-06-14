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
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-6">
            Our Export Categories
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Explore our diverse range of premium Indian products sourced directly from manufacturers and prepared for global export.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCategories.map((category: any) => {
            const productCount = category.products?.[0]?.count || 0;
            return (
              <Link 
                href={`/categories/${category.slug}`} 
                key={category.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 hover:-translate-y-1"
              >
                <div 
                  className="h-32 p-6 flex items-end relative overflow-hidden"
                  style={{ backgroundColor: `${category.color}15` }}
                >
                  <div className="absolute -top-10 -right-10 opacity-10 scale-[2.5] transform group-hover:scale-[3] transition-transform duration-500">
                    {renderIcon(category.icon, category.color)}
                  </div>
                  <div className="bg-white dark:bg-slate-950 p-3 rounded-xl shadow-sm z-10">
                    {renderIcon(category.icon, category.color)}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                      {category.name}
                    </h2>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap">
                      {productCount} Products
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 line-clamp-3 mb-8 flex-grow">
                    {category.description || `Browse our collection of premium ${category.name.toLowerCase()} sourced and packaged for international quality standards.`}
                  </p>
                  
                  <div className="flex items-center text-brand-600 dark:text-brand-400 font-medium group-hover:text-brand-700 dark:group-hover:text-brand-300">
                    Browse Collection <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {displayCategories.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No categories are currently available. Check back soon.
          </div>
        )}
      </div>
    </div>
  );
}
