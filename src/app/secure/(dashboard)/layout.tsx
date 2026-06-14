import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Package, Settings, LogOut, ShieldCheck, Activity, UserCog } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const isAuth = !!user
  let isSuperAdmin = false

  if (user) {
    const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
    isSuperAdmin = userData?.role === 'superadmin'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row">
      {isAuth && (
        <aside className="w-full md:w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0">
          <div className="p-6 border-b border-slate-800">
            <Link href={isSuperAdmin ? "/secure/superadmin/dashboard" : "/secure/admin/dashboard"} className="flex items-center gap-2 mb-2">
              <ShieldCheck className={`h-6 w-6 ${isSuperAdmin ? 'text-purple-500' : 'text-brand-500'}`} />
              <span className="font-serif font-bold text-white text-xl">
                {isSuperAdmin ? 'SuperAdmin' : 'Admin Portal'}
              </span>
            </Link>
            <div className="text-xs text-slate-500 truncate">{user?.email}</div>
          </div>
          
          <nav className="p-4 flex-grow space-y-2">
            <Link href={isSuperAdmin ? "/secure/superadmin/dashboard" : "/secure/admin/dashboard"} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/secure/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
              <Package className="h-5 w-5" />
              <span>Products</span>
            </Link>
            
            {isSuperAdmin && (
              <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">SuperAdmin</div>
                <Link href="/secure/superadmin/settings" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <Settings className="h-5 w-5" />
                  <span>Site Settings</span>
                </Link>
                <Link href="/secure/superadmin/audit-logs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <ShieldCheck className="h-5 w-5" />
                  <span>Audit Logs</span>
                </Link>
                <Link href="/secure/superadmin/login-attempts" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <UserCog className="h-5 w-5" />
                  <span>Login Attempts</span>
                </Link>
                <Link href="/secure/superadmin/crash-reports" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
                  <Activity className="h-5 w-5" />
                  <span>Crash Reports</span>
                </Link>
              </div>
            )}
          </nav>
          
          <div className="p-4 border-t border-slate-800">
            <form action="/auth/signout" method="post">
              <button type="submit" className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </form>
          </div>
        </aside>
      )}

      <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950">
        {children}
      </main>
    </div>
  )
}
