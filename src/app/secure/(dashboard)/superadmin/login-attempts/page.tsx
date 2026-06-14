import { createClient } from '@/utils/supabase/server'
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react'

import { LoginFilters } from '@/components/admin/LoginFilters'

export default async function LoginAttemptsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await createClient()

  const emailFilter = typeof searchParams.email === 'string' ? searchParams.email : null
  const ipFilter = typeof searchParams.ip === 'string' ? searchParams.ip : null

  let query = supabase
    .from('login_attempts')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(50)

  if (emailFilter) query = query.ilike('email', `%${emailFilter}%`)
  if (ipFilter) query = query.eq('ip_address', ipFilter)

  const { data: attempts } = await query

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-2xl">
          <ShieldAlert className="h-8 w-8 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Security Log</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor recent login attempts to detect unauthorized access.</p>
        </div>
      </div>

      <LoginFilters />

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {(!attempts || attempts.length === 0) ? (
          <div className="p-12 text-center text-slate-500">
            No login attempts recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Status</th>
                  <th className="p-4">Email Attempted</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {attempts.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-4">
                      {attempt.success ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          <XCircle className="w-3.5 h-3.5" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-900 dark:text-slate-300">
                      {attempt.email || 'Unknown'}
                    </td>
                    <td className="p-4 font-mono text-sm text-slate-500">
                      {attempt.ip_address || '127.0.0.1'}
                    </td>
                    <td className="p-4 text-sm text-slate-500 text-right">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
