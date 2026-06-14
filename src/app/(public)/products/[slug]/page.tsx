import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Package, LeafyGreen, MapPin, Scale } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const supabase = await createClient();
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!product) {
    notFound();
  }

  // Generate WhatsApp message
  const whatsappMessage = encodeURIComponent(`Hello GujjOverseas, I am interested in your product: ${product.name}. Please provide more details and pricing.`);
  const whatsappUrl = `https://wa.me/919999999999?text=${whatsappMessage}`;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb & Back Link */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          
          {/* Product Images Gallery */}
          <div className="w-full lg:w-1/2 space-y-4">
            <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl overflow-hidden aspect-[4/3] relative shadow-sm border border-slate-200 dark:border-slate-800">
              <div 
                className="absolute inset-0 bg-cover bg-center" 
                style={{ backgroundImage: `url(${product.images?.[0] || ''})` }}
              />
            </div>
            
            {/* Thumbnails (if more than 1 image) */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, idx: number) => (
                  <div key={idx} className="bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden aspect-square relative border-2 border-transparent hover:border-brand-500 transition-colors cursor-pointer">
                    <div 
                      className="absolute inset-0 bg-cover bg-center" 
                      style={{ backgroundImage: `url(${img})` }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-brand-200 dark:border-brand-800">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  <span className="text-sm font-medium">Origin: {product.origin}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <LeafyGreen className="h-4 w-4 text-brand-600" />
                  <span className="text-sm font-medium">Premium Grade</span>
                </div>
              </div>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none mb-10">
              <h3 className="text-xl font-bold font-serif mb-4 text-slate-900 dark:text-white">Description</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold font-serif mb-6 text-slate-900 dark:text-white flex items-center gap-2">
                <Scale className="h-5 w-5 text-brand-500" /> Specifications
              </h3>
              <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {product.specs ? Object.entries(product.specs).map(([key, value]) => (
                      <tr key={key} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-6 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/3 bg-slate-100/30 dark:bg-slate-900/30">{key}</td>
                        <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{value as string}</td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={2} className="py-4 px-6 text-sm text-slate-500">No specifications available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-auto bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Package className="h-5 w-5 text-brand-500" /> Ready to order?
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl text-white bg-[#25D366] hover:bg-[#20bd5a] transition-all shadow-md hover:shadow-lg gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Inquire on WhatsApp
                </a>
                <Link
                  href="/contact"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-xl text-brand-700 dark:text-brand-300 bg-brand-100 dark:bg-brand-900/50 hover:bg-brand-200 dark:hover:bg-brand-800/60 transition-all shadow-sm gap-2"
                >
                  Send Email Query
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
