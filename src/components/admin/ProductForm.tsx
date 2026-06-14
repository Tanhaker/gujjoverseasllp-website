'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, UploadCloud, Save, Loader2, X } from 'lucide-react'

export default function ProductForm({ initialData = null }: { initialData?: any }) {
  const router = useRouter()
  const supabase = createClient()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])

  // Form State
  const [name, setName] = useState(initialData?.name || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '')
  const [origin, setOrigin] = useState(initialData?.origin || '')
  const [shortDesc, setShortDesc] = useState(initialData?.short_description || '')
  const [desc, setDesc] = useState(initialData?.description || '')
  const [visible, setVisible] = useState(initialData?.is_visible ?? true)
  const [featured, setFeatured] = useState(initialData?.is_featured ?? false)
  const [newArrival, setNewArrival] = useState(initialData?.is_new_arrival ?? false)
  const [images, setImages] = useState<string[]>(initialData?.images || [])
  
  // Specs State - convert object to array of key/value pairs
  const [specs, setSpecs] = useState<{key: string, value: string}[]>(
    initialData?.specs && Object.keys(initialData.specs).length > 0
      ? Object.entries(initialData.specs).map(([k, v]) => ({ key: k, value: v as string }))
      : [{ key: '', value: '' }]
  )

  useEffect(() => {
    // Fetch categories for the dropdown
    supabase.from('categories').select('id, name').order('display_order').then(({ data }) => {
      if (data) {
        setCategories(data)
        if (!initialData?.category_id && data.length > 0) {
          setCategoryId(data[0].id)
        }
      }
    })
  }, [supabase, initialData])

  const handleSlugify = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setName(newName)
    if (!initialData) {
      setSlug(handleSlugify(newName))
    }
  }

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }])
  }

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const newSpecs = [...specs]
    newSpecs[index][field] = val
    setSpecs(newSpecs)
  }

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    
    setUploading(true)
    setError(null)
    
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      setError(`Failed to upload image: ${uploadError.message}`)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName)

    setImages([...images, publicUrlData.publicUrl])
    setUploading(false)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Convert specs array back to object
    const specsObj = specs.reduce((acc, curr) => {
      if (curr.key.trim() && curr.value.trim()) {
        acc[curr.key.trim()] = curr.value.trim()
      }
      return acc
    }, {} as Record<string, string>)

    const payload = {
      name,
      slug,
      category_id: categoryId,
      origin,
      short_description: shortDesc,
      description: desc,
      is_visible: visible,
      is_featured: featured,
      is_new_arrival: newArrival,
      images,
      specs: specsObj,
      updated_at: new Date().toISOString()
    }

    let response
    
    if (initialData?.id) {
      response = await supabase.from('products').update(payload).eq('id', initialData.id)
    } else {
      response = await supabase.from('products').insert([payload])
    }

    if (response.error) {
      setError(response.error.message)
      setLoading(false)
    } else {
      // Log action
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('audit_logs').insert({
          user_id: user.id,
          action: initialData?.id ? 'product.update' : 'product.create',
          target: slug
        })
      }

      router.push('/secure/admin/products')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Product Name</label>
          <input required type="text" value={name} onChange={handleNameChange} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Premium Basmati Rice" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Slug</label>
          <input required type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. premium-basmati-rice" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
          <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none">
            {categories.length === 0 && <option value="">Loading categories...</option>}
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Origin</label>
          <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" placeholder="e.g. Gujarat, India" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Short Description</label>
        <textarea required rows={2} value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Brief summary for the product cards..."></textarea>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Description</label>
        <textarea required rows={5} value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" placeholder="Detailed product information..."></textarea>
      </div>

      {/* Specifications Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Specifications (JSON Key-Value Pairs)</label>
          <button type="button" onClick={handleAddSpec} className="text-sm text-brand-600 dark:text-brand-400 font-medium hover:text-brand-700 flex items-center gap-1">
            <Plus className="h-4 w-4" /> Add Row
          </button>
        </div>
        
        <div className="space-y-3">
          {specs.map((spec, index) => (
            <div key={index} className="flex gap-3 items-center">
              <input type="text" value={spec.key} onChange={(e) => handleSpecChange(index, 'key', e.target.value)} placeholder="e.g. Packaging" className="w-1/3 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
              <input type="text" value={spec.value} onChange={(e) => handleSpecChange(index, 'value', e.target.value)} placeholder="e.g. 50kg PP Bags" className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none text-sm" />
              <button type="button" onClick={() => handleRemoveSpec(index)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images Section */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Product Images</label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${img})` }} />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button type="button" onClick={() => removeImage(index)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          
          <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center relative hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            {uploading ? (
              <Loader2 className="h-6 w-6 text-brand-500 animate-spin" />
            ) : (
              <div className="text-center">
                <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <span className="text-xs text-slate-500">Upload Image</span>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" />
          </div>
        </div>
      </div>

      {/* Visibility & Toggles */}
      <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Public Visibility</h4>
            <p className="text-xs text-slate-500">If hidden, the product won't appear on the public website.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">Featured Product</h4>
            <p className="text-xs text-slate-500">Show this product on the homepage featured section.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
          <div>
            <h4 className="text-sm font-medium text-slate-900 dark:text-white">New Arrival Badge</h4>
            <p className="text-xs text-slate-500">Display a "New" badge on the product card.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 flex justify-end">
        <button type="submit" disabled={loading} className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed gap-2">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {initialData ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  )
}
