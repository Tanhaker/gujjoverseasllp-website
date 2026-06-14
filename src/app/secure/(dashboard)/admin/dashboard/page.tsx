import { createClient } from '@/utils/supabase/server'
import { Package, Eye, Activity, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch quick stats
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })

  const { count: visits30Days } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())

  const { count: visits7Days } = await supabase
    .from('page_views')
    .select('*', { count: 'exact', head: true })
    .gte('timestamp', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const stats = [
    { name: 'Total Products', value: productsCount || 0, icon: Package, color: 'text-brand-500', bg: 'bg-brand-500/10' },
    { name: 'Visits (Last 30 Days)', value: visits30Days || 0, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { name: 'Visits (Last 7 Days)', value: visits7Days || 0, icon: Activity, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ]

  // Fetch recent activity from audit logs
  const { data: recentActivity } = await supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(5)

  // Calculate most viewed products
  const { data: pageViewsData } = await supabase
    .from('page_views')
    .select('path')
    .like('path', '/products/%')

  const productCounts: Record<string, number> = {}
  if (pageViewsData) {
    pageViewsData.forEach(view => {
      const slug = view.path.replace('/products/', '')
      if (slug) {
        productCounts[slug] = (productCounts[slug] || 0) + 1
      }
    })
  }

  const popularProducts = Object.entries(productCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Welcome back to your admin portal. Here's what's happening.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-serif">
            <Eye className="h-5 w-5 text-slate-400" /> Most Viewed Products
          </h2>
          {popularProducts.length === 0 ? (
            <p className="text-slate-500 text-center py-4">No product views yet.</p>
          ) : (
            <div className="space-y-4">
              {popularProducts.map(([slug, count]) => (
                <div key={slug} className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{slug.replace(/-/g, ' ')}</span>
                  <span className="text-sm font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded">{count} views</span>
                </div>
              ))}
            </div>
          )}
        </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-serif">
          <Clock className="h-5 w-5 text-slate-400" /> Recent Activity
        </h2>
        
        {(!recentActivity || recentActivity.length === 0) ? (
          <div className="text-center py-10">
            <p className="text-slate-500">No recent activity logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((log) => (
              <div key={log.id} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800">
                <div className="w-2 h-2 mt-2 rounded-full bg-brand-500"></div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{log.action}</p>
                  <p className="text-sm text-slate-500">Target: {log.target} • IP: {log.ip_address}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  )
}
