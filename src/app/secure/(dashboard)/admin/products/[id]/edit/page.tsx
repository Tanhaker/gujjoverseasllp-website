import ProductForm from '@/components/admin/ProductForm'
import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    notFound()
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/secure/admin/products" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Edit Product</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Update the details for {product.name}.</p>
      </div>

      <ProductForm initialData={product} />
    </div>
  )
}
