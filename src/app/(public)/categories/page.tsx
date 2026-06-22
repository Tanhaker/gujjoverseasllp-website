import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { ArrowRight, Leaf, Scissors, Palette, Diamond, Flame, Sofa } from "lucide-react";
import { FadeInUp, SlideInRight } from "@/components/public/MotionWrappers";

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
 <div className="bg-bg-primary min-h-screen pb-24">
 {/* Premium Header Banner */}
 <div className="relative bg-surface text-text-primary pt-24 pb-32 overflow-hidden mb-[-80px] border-b border-border-subtle">
 <div className="absolute inset-0 bg-brand-50 opacity-30 mix-blend-multiply" />
 
 <FadeInUp className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6 tracking-tight">
 Our Export Categories
 </h1>
 <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light font-sans">
 Explore our diverse range of premium Indian products sourced directly from manufacturers and prepared for global export.
 </p>
 </FadeInUp>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
 {displayCategories.map((category: any, index: number) => {
 const productCount = category.products?.[0]?.count || 0;
 return (
 <SlideInRight key={category.id} delay={index * 0.1}>
 <Link 
 href={`/categories/${category.slug}`} 
 className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-border-subtle hover:border-brand-500 hover:-translate-y-2 relative h-full block"
 >
 <div 
 className="h-40 p-8 flex items-end relative overflow-hidden transition-colors duration-500 border-b border-border-subtle"
 style={{ backgroundColor: `${category.color || '#C9A84C'}10` }}
 >
 <div className="absolute -top-12 -right-12 opacity-10 scale-[3] transform group-hover:scale-[4] group-hover:rotate-12 transition-all duration-700 ease-out">
 {renderIcon(category.icon, category.color || '#C9A84C')}
 </div>
 <div className="bg-white p-4 rounded-2xl shadow-sm border border-border-subtle z-10 relative group-hover:scale-110 transition-transform duration-500">
 {renderIcon(category.icon, category.color || '#C9A84C')}
 </div>
 </div>
 
 <div className="p-8 flex flex-col flex-grow bg-white relative z-10">
 <div className="flex justify-between items-start mb-4">
 <h2 className="text-2xl font-serif font-bold text-text-primary transition-colors">
 {category.name}
 </h2>
 <span className="bg-bg-primary text-brand-500 border border-brand-200 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-sm uppercase tracking-wider font-sans">
 {productCount} Products
 </span>
 </div>
 <p className="text-slate-500 font-sans leading-relaxed line-clamp-3 mb-8 flex-grow">
 {category.description || `Browse our collection of premium ${category.name.toLowerCase()} sourced and packaged for international quality standards.`}
 </p>
 
 <div className="flex items-center font-bold text-sm text-text-primary group-hover:text-brand-500 transition-colors">
 Browse Collection 
 <div className="ml-2 p-1.5 rounded-full transition-colors bg-brand-50 group-hover:bg-brand-100 text-brand-500">
 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
 </div>
 </div>
 </div>
 </Link>
 </SlideInRight>
 );
 })}
 </div>

 {displayCategories.length === 0 && (
 <div className="text-center py-32 bg-white shadow-sm rounded-3xl border border-border-subtle">
 <h3 className="text-2xl font-serif font-bold text-text-primary mb-3">No categories found</h3>
 <p className="text-slate-500 font-sans max-w-md mx-auto text-lg">
 We are currently updating our catalog. Check back soon for our premium categories.
 </p>
 </div>
 )}
 </div>
 </div>
 );
}
