import { createClient } from '@/utils/supabase/server'
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react'

import { LoginFilters } from '@/components/admin/LoginFilters'

import LoginAttemptsManager from "@/components/superadmin/LoginAttemptsManager";

export const metadata = {
  title: "Login Attempts | SuperAdmin Portal",
};

export default function LoginAttemptsPage() {
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
      <LoginAttemptsManager />
    </div>
  )
}
