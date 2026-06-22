'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'

export function LoginFilters() {
 const router = useRouter()
 const searchParams = useSearchParams()
 
 const [email, setEmail] = useState(searchParams.get('email') || '')
 const [ip, setIp] = useState(searchParams.get('ip') || '')

 const handleFilter = useCallback(() => {
 const params = new URLSearchParams()
 if (email) params.set('email', email)
 if (ip) params.set('ip', ip)
 
 router.push(`?${params.toString()}`)
 }, [email, ip, router])

 const handleClear = () => {
 setEmail('')
 setIp('')
 router.push('?')
 }

 return (
 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
 
 <div className="flex-1 w-full">
 <label className="block text-xs font-medium text-slate-500 mb-1">Email Address</label>
 <input 
 type="text" 
 value={email} 
 onChange={(e) => setEmail(e.target.value)}
 placeholder="e.g. admin@..."
 className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
 />
 </div>

 <div className="flex-1 w-full">
 <label className="block text-xs font-medium text-slate-500 mb-1">IP Address</label>
 <input 
 type="text" 
 value={ip} 
 onChange={(e) => setIp(e.target.value)}
 placeholder="e.g. 192.168.1.1"
 className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
 />
 </div>

 <div className="flex gap-2 w-full md:w-auto">
 <button 
 onClick={handleFilter}
 className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:opacity-90 flex items-center justify-center gap-2 transition-opacity"
 >
 <Search className="w-4 h-4" /> Filter
 </button>
 <button 
 onClick={handleClear}
 className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
 >
 Clear
 </button>
 </div>
 </div>
 )
}
