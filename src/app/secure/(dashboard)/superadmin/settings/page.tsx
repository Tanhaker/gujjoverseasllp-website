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
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-serif">Global Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your public contact information, homepage hero copy, and feature toggles.</p>
      </div>

      <form action={updateSettings} className="space-y-8">
        
        {/* Contact Information */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Public Email Address</label>
              <input 
                type="email" 
                name="contact_email"
                defaultValue={settings.contact_email || 'contact@gujjoverseasllp.com'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Public Phone Number</label>
              <input 
                type="text" 
                name="contact_phone"
                defaultValue={settings.contact_phone || '+91 9327883001'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">WhatsApp Number</label>
              <input 
                type="text" 
                name="whatsapp_number"
                defaultValue={settings.whatsapp_number || '+91 9327883001'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
              <p className="text-xs text-slate-500 mt-2">Used for inquiry buttons.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Address</label>
              <textarea 
                name="company_address"
                rows={2}
                defaultValue={settings.company_address || 'Gujarat, India'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none resize-none" 
              />
            </div>
          </div>
        </div>

        {/* Hero & Branding */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Hero & Branding</h2>
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hero Heading Text</label>
              <input 
                type="text" 
                name="hero_text"
                defaultValue={settings.hero_text || 'Export Quality Products From India To The World'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hero Badge Pill</label>
                <input 
                  type="text" 
                  name="hero_badge_text"
                  defaultValue={settings.hero_badge_text || 'Trusted Indian Exporter'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Hero Subtext</label>
                <input 
                  type="text" 
                  name="hero_subtext"
                  defaultValue={settings.hero_subtext || ''}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Company Tagline (Footer)</label>
              <input 
                type="text" 
                name="company_tagline"
                defaultValue={settings.company_tagline || 'Premium Quality Export Products.'}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none" 
              />
            </div>
          </div>
        </div>

        {/* Global Statistics */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Homepage Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Products</label>
              <input type="text" name="stat_products" defaultValue={settings.stat_products || '50+'} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Countries</label>
              <input type="text" name="stat_countries" defaultValue={settings.stat_countries || '20+'} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Categories</label>
              <input type="text" name="stat_categories" defaultValue={settings.stat_categories || '5+'} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Response Time</label>
              <input type="text" name="stat_response_time" defaultValue={settings.stat_response_time || '24h'} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 outline-none" />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-8">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Feature Toggles</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div>
                <h4 className="font-medium text-slate-900 dark:text-white">Enable Chatbot</h4>
                <p className="text-xs text-slate-500">Enable the WhatsApp Chatbot widget on the site.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="hidden" name="chatbot_enabled" value="false" />
                <input type="checkbox" name="chatbot_enabled" value="true" defaultChecked={settings.chatbot_enabled === 'true'} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-900/50">
              <div>
                <h4 className="font-medium text-amber-900 dark:text-amber-500">Maintenance Mode</h4>
                <p className="text-xs text-amber-700 dark:text-amber-600/70">Enable to show a "Coming Soon" screen to public visitors.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="hidden" name="maintenance_mode" value="false" />
                <input type="checkbox" name="maintenance_mode" value="true" defaultChecked={settings.maintenance_mode === 'true'} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="inline-flex items-center px-8 py-4 text-base font-bold rounded-xl shadow-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 gap-2 transition-colors">
            <Save className="h-5 w-5" /> Save All Settings
          </button>
        </div>
      </form>
    </div>
  )
}
