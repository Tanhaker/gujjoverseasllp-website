'use client'

import dynamic from 'next/dynamic'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

const ProductForm = dynamic(() => import('@/components/admin/ProductForm'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100">
      <Loader2 className="h-8 w-8 text-brand-500 animate-spin" />
      <span className="ml-3 text-slate-500">Loading form...</span>
    </div>
  )
})

export default function NewProductPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link href="/secure/admin/products" className="inline-flex items-center text-sm text-slate-500 hover:text-brand-600 transition-colors mb-4">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Add New Product</h1>
        <p className="text-slate-500 mt-2">Fill in the details below to add a new product to your catalog.</p>
      </div>

      <ProductForm />
    </div>
  )
}
