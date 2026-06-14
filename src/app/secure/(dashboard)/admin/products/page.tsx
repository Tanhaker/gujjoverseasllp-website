import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import { deleteProduct } from './actions'

export default async function ProductsManagementPage() {
  const supabase = await createClient()
  
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Products Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your inventory, prices, and visibility.</p>
        </div>
        <Link 
          href="/secure/admin/products/new"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-500 transition-colors shadow-sm gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {(!products || products.length === 0) ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    No products found. Click "Add Product" to create your first one.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                          {product.images && product.images[0] ? (
                            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${product.images[0]})` }} />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">No img</div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900 dark:text-white">{product.name}</div>
                          <div className="text-sm text-slate-500 truncate max-w-[200px]">{product.short_description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.visible ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <Eye className="h-3 w-3" /> Visible
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400">
                          <EyeOff className="h-3 w-3" /> Hidden
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <Link 
                          href={`/secure/admin/products/${product.id}/edit`}
                          className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                        
                        <form action={deleteProduct}>
                          <input type="hidden" name="id" value={product.id} />
                          <button 
                            type="submit" 
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors"
                            onClick={(e) => {
                              if (!confirm('Are you sure you want to delete this product?')) {
                                e.preventDefault()
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
