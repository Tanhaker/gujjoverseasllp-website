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
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Sleek Breadcrumb Bar */}
        <div className="mb-6 flex items-center text-sm font-medium text-slate-500">
          <Link href="/" className="hover:text-brand-600 transition-colors">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/products" className="hover:text-brand-600 transition-colors">Products</Link>
          <span className="mx-2 text-slate-300">/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-600 transition-colors">{product.category.name}</Link>
              <span className="mx-2 text-slate-300">/</span>
            </>
          )}
          <span className="text-slate-900 font-bold">{product.name}</span>
        </div>

        {/* Master Unified Super-Card */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Top Half: Image & Essential Info */}
          <div className="flex flex-col lg:flex-row border-b border-slate-100">
            
            {/* Left: Image Gallery */}
            <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 lg:border-r border-slate-100 bg-slate-50/50 flex flex-col justify-center">
              <div className="bg-white rounded-3xl overflow-hidden aspect-[4/3] relative shadow-lg border border-slate-200 p-2 group">
                <div 
                  className="absolute inset-2 rounded-2xl bg-slate-100 bg-cover bg-center shadow-inner transition-transform duration-700 group-hover:scale-[1.02]" 
                  style={{ backgroundImage: `url(${product.images?.[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800'})` }}
                />
                {product.is_new_arrival && (
                  <div className="absolute top-6 left-6 z-10 bg-brand-500 text-white text-[11px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-md shadow-brand-500/20">
                    New Arrival
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mt-6">
                  {product.images.map((img: string, idx: number) => (
                    <div key={idx} className="bg-white rounded-2xl overflow-hidden aspect-square relative border border-slate-200 hover:border-brand-500 shadow-sm hover:shadow-md transition-all cursor-pointer p-1 group">
                      <div 
                        className="absolute inset-1 rounded-xl bg-slate-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" 
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Essential Info & Actions */}
            <div className="w-full lg:w-1/2 p-5 sm:p-8 lg:p-12 flex flex-col">
              <div className="mb-8">
                <Link href={`/categories/${product.category?.slug || ''}`}>
                  <span className="inline-block px-4 py-1.5 bg-brand-50 text-brand-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-brand-100 hover:bg-brand-100 transition-colors cursor-pointer shadow-sm">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </Link>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
                  {product.name}
                </h1>
                
                <div className="flex flex-wrap items-center gap-4 text-slate-600 mb-8">
                  {product.origin && (
                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                      <MapPin className="h-4 w-4 text-brand-500" />
                      <span className="text-sm font-semibold text-slate-700">Origin: {product.origin}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100">
                    <LeafyGreen className="h-4 w-4 text-brand-500" />
                    <span className="text-sm font-semibold text-slate-700">Premium Grade</span>
                  </div>
                </div>

                {product.short_description && (
                  <p className="text-slate-600 leading-relaxed text-lg font-light mb-8">
                    {product.short_description}
                  </p>
                )}
              </div>

              {/* Seamless CTA Section */}
              <div className="mt-auto bg-slate-50 rounded-3xl p-5 sm:p-8 border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-colors"></div>
                
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2 text-xl">
                  <Package className="h-6 w-6 text-brand-500" /> Ready to Source?
                </h4>
                <p className="text-slate-500 text-sm mb-6">Get in touch to discuss bulk pricing, compliance documents, and custom logistics for your destination.</p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-2xl text-white bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#20bd5a] hover:to-[#199647] transition-all shadow-md shadow-[#25D366]/20 hover:shadow-[#25D366]/40 hover:-translate-y-0.5 gap-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp Quote
                  </a>
                  <Link
                    href="/contact"
                    className="flex-1 inline-flex items-center justify-center px-6 py-4 text-sm font-bold rounded-2xl text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 gap-2"
                  >
                    Formal Inquiry
                  </Link>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Half: Details & Specs */}
          <div className="p-5 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
              
              {/* Main Description */}
              <div className="lg:col-span-2">
                <h3 className="text-3xl font-bold font-serif mb-8 text-slate-900 border-b border-slate-100 pb-4">Product Overview</h3>
                <div className="prose prose-slate prose-lg max-w-none text-slate-600 font-light leading-relaxed prose-headings:font-serif prose-headings:text-slate-900 prose-a:text-brand-600 hover:prose-a:text-brand-500 prose-strong:text-slate-800 prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-li:my-0">
                  <ReactMarkdown>
                    {product.description || 'No description available for this product.'}
                  </ReactMarkdown>
                </div>
              </div>
              
              {/* Specifications */}
              <div className="lg:col-span-1">
                <div className="bg-slate-50 rounded-3xl p-5 sm:p-8 border border-slate-100 sticky top-28">
                  <h3 className="text-2xl font-bold font-serif mb-6 text-slate-900 flex items-center gap-3 border-b border-slate-200/60 pb-4">
                    <Scale className="h-6 w-6 text-brand-500" /> Technical Specs
                  </h3>
                  <div className="overflow-x-auto overflow-y-hidden">
                    <table className="min-w-full divide-y divide-slate-200/60">
                      <tbody className="divide-y divide-slate-200/60">
                        {product.specs && Object.keys(product.specs).length > 0 ? Object.entries(product.specs).map(([key, value]) => (
                          <tr key={key} className="hover:bg-slate-100/50 transition-colors group">
                            <td className="py-3 px-1 text-sm font-bold text-slate-800 w-2/5">{key}</td>
                            <td className="py-3 px-1 text-sm text-slate-600 font-medium">{value as string}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={2} className="py-8 px-2 text-sm text-center text-slate-500 bg-white rounded-xl">Please contact us for detailed specifications.</td>
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
      </div>
    </div>
  );
}
