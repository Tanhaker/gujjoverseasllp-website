import ProductForm from '@/components/admin/ProductForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
