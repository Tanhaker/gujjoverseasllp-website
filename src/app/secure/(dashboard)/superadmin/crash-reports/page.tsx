import { Activity, ExternalLink } from 'lucide-react'

export default function CrashReportsPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif flex items-center gap-2">
            <Activity className="h-8 w-8 text-brand-600" />
            Crash Reports
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Monitor frontend and backend exceptions.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8 text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="h-16 w-16 bg-brand-50 dark:bg-brand-900/30 rounded-full flex items-center justify-center mb-4">
          <Activity className="h-8 w-8 text-brand-600 dark:text-brand-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Sentry Integration</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-6">
          Crash reports and real-time exception tracking are managed through Sentry. Click below to access your dedicated project dashboard.
        </p>
        <a href="https://sentry.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-xl text-white bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors gap-2">
          Open Sentry Dashboard <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </div>
  )
}
