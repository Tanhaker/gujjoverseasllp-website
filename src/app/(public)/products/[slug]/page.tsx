import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Package, LeafyGreen, MapPin, Scale } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import ReactMarkdown from 'react-markdown';

export default async function ProductDetailPage({
 params,
}: {
 params: Promise<{ slug: string }>;
}) {
 const { slug } = await params;
 
 const supabase = await createClient();
 const { data: product } = await supabase
 .from('products')
 .select(`
 *,
 category:categories(name, slug)
 `)
 .eq('slug', slug)
 .single();

 if (!product) {
 notFound();
 }

 // Fetch whatsapp number from settings
 const { data: settingsData } = await supabase.from('site_settings').select('value').eq('key', 'whatsapp_number').single();
 const whatsappNumber = settingsData?.value || '+91 9714888806';

 // Generate WhatsApp message
 const whatsappMessage = encodeURIComponent(`Hello GujjOverseas, I am interested in your product: ${product.name}. Please provide more details and pricing.`);
 const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${whatsappMessage}`;

 return (
 <div className="min-h-screen bg-slate-50 pb-20">
 
 {/* Premium Header Banner for Details */}
 <div className="relative bg-brand-950 text-white pt-24 pb-32 overflow-hidden mb-[-100px]">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
 <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-brand-950/80 to-transparent" />
 
 <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 {/* Breadcrumb & Back Link */}
 <div className="mb-8 flex items-center text-sm font-medium text-brand-200/70">
 <Link href="/products" className="hover:text-brand-300 transition-colors">Products</Link>
 <span className="mx-2">/</span>
 {product.category && (
 <>
 <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-300 transition-colors">{product.category.name}</Link>
 <span className="mx-2">/</span>
 </>
 )}
 <span className="text-white drop-shadow-sm">{product.name}</span>
 </div>
 </div>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
 <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
 
 {/* Product Images Gallery */}
 <div className="w-full lg:w-1/2 space-y-4">
 <div className="bg-white/80 backdrop-blur-xl rounded-3xl overflow-hidden aspect-[4/3] relative shadow-2xl border border-white/50 p-3 group">
 <div 
 className="absolute inset-3 rounded-2xl bg-slate-100 bg-cover bg-center shadow-inner transition-transform duration-700 group-hover:scale-[1.02]" 
 style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
 />
 {product.is_new_arrival && (
 <div className="absolute top-6 left-6 z-10 bg-brand-500 text-white text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-lg shadow-brand-500/30">
 New Arrival
 </div>
 )}
 </div>
 
 {/* Thumbnails (if more than 1 image) */}
 {product.images && product.images.length > 1 && (
 <div className="grid grid-cols-4 gap-4">
 {product.images.map((img: string, idx: number) => (
 <div key={idx} className="bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden aspect-square relative border border-white/50 hover:border-brand-500 hover:shadow-lg transition-all cursor-pointer p-1.5 group">
 <div 
 className="absolute inset-1.5 rounded-xl bg-slate-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
 style={{ backgroundImage: `url(${img})` }}
 />
 </div>
 ))}
 </div>
 )}
 </div>

 {/* Product Info */}
 <div className="w-full lg:w-1/2 flex flex-col bg-white/50 backdrop-blur-md rounded-3xl p-8 border border-white/40 shadow-xl">
 <div className="mb-2">
 <Link href={`/categories/${product.category?.slug || ''}`}>
 <span className="inline-block px-4 py-1.5 bg-brand-100 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-brand-200 hover:bg-brand-200 transition-colors cursor-pointer shadow-sm">
 {product.category?.name || 'Uncategorized'}
 </span>
 </Link>
 <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-6 leading-tight">
 {product.name}
 </h1>
 
 <div className="flex items-center gap-6 text-slate-600 mb-8 border-b border-slate-200 pb-8">
 {product.origin && (
 <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full shadow-inner">
 <MapPin className="h-4 w-4 text-brand-600" />
 <span className="text-sm font-medium">Origin: {product.origin}</span>
 </div>
 )}
 <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full shadow-inner">
 <LeafyGreen className="h-4 w-4 text-brand-600" />
 <span className="text-sm font-medium">Premium Grade</span>
 </div>
 </div>
 </div>

        {product.short_description && (
          <p className="text-slate-600 leading-relaxed text-lg mb-8">
            {product.short_description}
          </p>
        )}

 {/* Actions */}
 <div className="mt-auto bg-gradient-to-br from-white to-slate-50 p-8 rounded-3xl border border-slate-200 shadow-lg relative overflow-hidden group">
 <div className="absolute top-0 left-0 w-2 h-full bg-brand-500 group-hover:bg-brand-400 transition-colors"></div>
 <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-colors"></div>
 
 <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-xl">
 <Package className="h-6 w-6 text-brand-500" /> Ready to Source?
 </h4>
 <p className="text-slate-600 mb-8">Get in touch to discuss bulk pricing, compliance documents, and custom logistics for your destination.</p>
 
 <div className="flex flex-col sm:flex-row gap-4">
 <a
 href={whatsappUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="flex-1 inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#20bd5a] hover:to-[#199647] transition-all shadow-lg shadow-[#25D366]/30 hover:shadow-[#25D366]/50 hover:-translate-y-1 gap-2"
 >
 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
 Request Quote via WhatsApp
 </a>
 <Link
 href="/contact"
 className="flex-1 inline-flex items-center justify-center px-6 py-4 text-base font-bold rounded-2xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-1 gap-2"
 >
 Send Formal Inquiry
 </Link>
 </div>
 </div>

        </div>
      </div>

      {/* Detailed Information Section */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Description */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm h-full">
            <h3 className="text-2xl font-bold font-serif mb-6 text-slate-900 border-b border-slate-100 pb-4">Product Overview</h3>
            <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-light leading-relaxed prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-strong:text-slate-800 prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
              <ReactMarkdown>
                {product.description || 'No description available for this product.'}
              </ReactMarkdown>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="text-2xl font-bold font-serif mb-6 text-slate-900 flex items-center gap-3 border-b border-slate-100 pb-4">
              <Scale className="h-6 w-6 text-brand-500" /> Technical Specs
            </h3>
            <div className="overflow-hidden">
              <table className="min-w-full divide-y divide-slate-100">
                <tbody className="divide-y divide-slate-100">
                  {product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => (
                    <tr key={key} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-2 text-sm font-bold text-slate-800 w-1/3">{key}</td>
                      <td className="py-3 px-2 text-sm text-slate-600 font-medium">{value as string}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={2} className="py-8 px-2 text-sm text-center text-slate-500 bg-slate-50 rounded-xl">Please contact us for detailed specifications.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
