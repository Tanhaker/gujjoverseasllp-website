'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useCallback } from 'react'
import { Search, Download } from 'lucide-react'

export function LogFilters({ actions = [] }: { actions?: string[] }) {
 const router = useRouter()
 const searchParams = useSearchParams()
 
 const [action, setAction] = useState(searchParams.get('action') || '')
 const [user, setUser] = useState(searchParams.get('user') || '')
 const [date, setDate] = useState(searchParams.get('date') || '')

 const handleFilter = useCallback(() => {
 const params = new URLSearchParams()
 if (action) params.set('action', action)
 if (user) params.set('user', user)
 if (date) params.set('date', date)
 
 router.push(`?${params.toString()}`)
 }, [action, user, date, router])

 const handleClear = () => {
 setAction('')
 setUser('')
 setDate('')
 router.push('?')
 }

 const exportCsv = () => {
 // This is a simple CSV export by grabbing table data from the DOM
 // For a highly secure app with large data, we'd do this server-side, 
 // but for our paginated view, this works well for the current page.
 const table = document.querySelector('table')
 if (!table) return

 const rows = Array.from(table.querySelectorAll('tr'))
 const csvData = rows.map(row => {
 const cols = Array.from(row.querySelectorAll('th, td'))
 return cols.map(c => `"${c.textContent?.trim().replace(/"/g, '""')}"`).join(',')
 }).join('\n')

 const blob = new Blob([csvData], { type: 'text/csv' })
 const url = window.URL.createObjectURL(blob)
 const a = document.createElement('a')
 a.setAttribute('hidden', '')
 a.setAttribute('href', url)
 a.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`)
 document.body.appendChild(a)
 a.click()
 document.body.removeChild(a)
 }

 return (
 <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-end">
 <div className="flex-1 w-full">
 <label className="block text-xs font-medium text-slate-500 mb-1">Action Type</label>
 <select 
 value={action} 
 onChange={(e) => setAction(e.target.value)}
 className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
 >
 <option value="">All Actions</option>
 {actions.map(a => <option key={a} value={a}>{a}</option>)}
 <option value="product.create">product.create</option>
 <option value="product.update">product.update</option>
 <option value="product.delete">product.delete</option>
 <option value="settings.update">settings.update</option>
 </select>
 </div>
 
 <div className="flex-1 w-full">
 <label className="block text-xs font-medium text-slate-500 mb-1">User ID</label>
 <input 
 type="text" 
 value={user} 
 onChange={(e) => setUser(e.target.value)}
 placeholder="e.g. 123e4567..."
 className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
 />
 </div>

 <div className="flex-1 w-full">
 <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
 <input 
 type="date" 
 value={date} 
 onChange={(e) => setDate(e.target.value)}
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
 <button 
 onClick={exportCsv}
 className="px-4 py-2 bg-brand-50 text-brand-700 rounded-lg text-sm font-medium hover:bg-brand-100 flex items-center justify-center gap-2 transition-colors border border-brand-200 "
 >
 <Download className="w-4 h-4" /> Export CSV
 </button>
 </div>
 </div>
 )
}
