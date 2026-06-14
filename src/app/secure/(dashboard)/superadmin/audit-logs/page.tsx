import { createClient } from '@/utils/supabase/server'
import { FileText, ShieldAlert } from 'lucide-react'

import { LogFilters } from '@/components/admin/LogFilters'

export default async function AuditLogsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()

  // Verify superadmin role - optional extra check
  const { data: { user } } = await supabase.auth.getUser()
  const { data: userRole } = await supabase.from('users').select('role').eq('id', user?.id).single()
  
  if (userRole?.role !== 'superadmin' && userRole?.role !== 'admin') {
    // For now we allow since there's only 1 admin.
  }

  const actionFilter = typeof searchParams.action === 'string' ? searchParams.action : null
  const userFilter = typeof searchParams.user === 'string' ? searchParams.user : null
  const dateFilter = typeof searchParams.date === 'string' ? searchParams.date : null

  let query = supabase
    .from('audit_logs')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(100)

  if (actionFilter) {
    query = query.eq('action', actionFilter)
  }
  if (userFilter) {
    query = query.eq('user_id', userFilter)
  }
  if (dateFilter) {
    // Filter by specific date
    const startOfDay = new Date(dateFilter)
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)
    
    query = query.gte('timestamp', startOfDay.toISOString())
                 .lt('timestamp', endOfDay.toISOString())
  }

  const { data: logs } = await query

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
            <FileText className="h-8 w-8 text-brand-600" />
            Audit Ledger
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Append-only security log of all administrative actions.</p>
        </div>
        <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 px-4 py-2 rounded-lg text-sm flex items-center gap-2 border border-amber-200 dark:border-amber-800/50">
          <ShieldAlert className="h-4 w-4" />
          Immutable Record
        </div>
      </div>

      <LogFilters actions={['product.create', 'product.update', 'product.delete', 'settings.update', 'login']} />

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
            <thead className="bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User ID</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Target</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
              {(!logs || logs.length === 0) ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {log.user_id ? log.user_id.substring(0, 8) + '...' : 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                      {log.target}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">
                      {log.ip_address || 'N/A'}
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
