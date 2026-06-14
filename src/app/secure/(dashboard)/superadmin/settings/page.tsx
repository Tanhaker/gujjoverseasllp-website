import { createClient } from '@/utils/supabase/server'
import { Save } from 'lucide-react'
import { updateSettings } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const { data } = await supabase.from('site_settings').select('key, value')
  const settings = data?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {}

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Site Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your public contact information and company details.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
        <form action={updateSettings} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Public Email Address</label>
              <input 
                type="email" 
                name="email"
                defaultValue={settings.email || 'gujjoverseasllp@gmail.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
              <p className="text-xs text-slate-500 mt-2">This email will be shown on the Contact page and Footer.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Public Phone Number</label>
              <input 
                type="text" 
                name="phone"
                defaultValue={settings.phone || '9327883001'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
              <p className="text-xs text-slate-500 mt-2">This number will be used for phone calls and WhatsApp.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Address</label>
              <textarea 
                name="address"
                rows={3}
                defaultValue={settings.address || '123 Export Lane\nBusiness District\nGujarat, India'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              />
              <p className="text-xs text-slate-500 mt-2">Physical address shown on contact page.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Homepage Banner Message</label>
              <textarea 
                name="banner"
                rows={3}
                defaultValue={settings.banner || ''}
                placeholder="e.g. Free shipping on all international orders this week!"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              />
              <p className="text-xs text-slate-500 mt-2">Leave blank to hide the top banner on the website.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Tagline</label>
              <textarea 
                name="company_tagline"
                rows={3}
                defaultValue={settings.company_tagline || ''}
                placeholder="e.g. Exporting premium quality agricultural products globally."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              />
              <p className="text-xs text-slate-500 mt-2">Shown below the hero text and in the footer.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hero Section Text</label>
              <textarea 
                name="hero_text"
                rows={3}
                defaultValue={settings.hero_text || ''}
                placeholder="e.g. Premium Agro Products for the World"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              />
              <p className="text-xs text-slate-500 mt-2">The large text displayed on the homepage banner.</p>
            </div>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Security Settings</h3>
            <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <h4 className="text-sm font-medium text-slate-900 dark:text-white">Require Two-Factor Authentication (2FA)</h4>
                <p className="text-xs text-slate-500 mt-1">If enabled, both Admin and SuperAdmin users must use Google Authenticator to log in.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="hidden" name="require_2fa" value="false" />
                <input 
                  type="checkbox" 
                  name="require_2fa" 
                  value="true"
                  defaultChecked={settings.require_2fa === 'true'} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 mt-4">
              <div>
                <h4 className="text-sm font-medium text-amber-900 dark:text-amber-500">Maintenance Mode</h4>
                <p className="text-xs text-amber-700 dark:text-amber-600 mt-1">If enabled, public visitors will see a "Coming Soon" page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="hidden" name="maintenance_mode" value="false" />
                <input 
                  type="checkbox" 
                  name="maintenance_mode" 
                  value="true"
                  defaultChecked={settings.maintenance_mode === 'true'} 
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 dark:peer-focus:ring-amber-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 gap-2">
              <Save className="h-5 w-5" /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
