"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Save, Loader2, Image as ImageIcon, Search } from "lucide-react";

export default function SeoManager() {
  const [settings, setSettings] = useState({
    meta_title: '',
    meta_description: '',
    og_image_url: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('site_settings').select('*').in('key', ['meta_title', 'meta_description', 'og_image_url']);
    
    if (data) {
      const newSettings = { ...settings };
      data.forEach(item => {
        if (item.key in newSettings) {
          (newSettings as any)[item.key] = item.value;
        }
      });
      setSettings(newSettings);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
      updated_by: session?.user?.id
    }));
    
    const { error } = await supabase.from('site_settings').upsert(updates);
    
    if (!error) {
      if (session?.user) {
        await supabase.from('audit_logs').insert({
          user_id: session.user.id,
          action: 'settings.update',
          target: 'SEO Settings'
        });
      }
      alert('SEO Settings saved successfully!');
    } else {
      alert(`Error saving settings: ${error.message}`);
    }
    
    setSaving(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);

    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `og-image-${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file, { upsert: true });
    
    if (!uploadError) {
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setSettings({ ...settings, og_image_url: data.publicUrl });
    } else {
      alert(`Upload failed: ${uploadError.message}`);
    }
    
    setUploading(false);
  };

  if (loading) {
    return <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-brand-500" /></div>;
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 space-y-6">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4 mb-4">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-brand-600" /> Global SEO Metadata
            </h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Global Meta Title</label>
            <input 
              type="text" 
              value={settings.meta_title}
              onChange={e => setSettings({...settings, meta_title: e.target.value})}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
            />
            <p className="text-xs text-slate-500 mt-2">Used as the default browser title and search engine title across the site.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Global Meta Description</label>
            <textarea 
              rows={4}
              value={settings.meta_description}
              onChange={e => setSettings({...settings, meta_description: e.target.value})}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white resize-none"
            />
            <p className="text-xs text-slate-500 mt-2">Recommended length is 150-160 characters. {settings.meta_description.length} characters used.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">OpenGraph (Social Share) Image</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <input 
                  type="text" 
                  value={settings.og_image_url}
                  onChange={e => setSettings({...settings, og_image_url: e.target.value})}
                  placeholder="https://..."
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-brand-500 outline-none text-slate-900 dark:text-white"
                />
                <p className="text-xs text-slate-500 mt-2">This image appears when your site is shared on WhatsApp, Facebook, Twitter, etc.</p>
              </div>
              <div className="relative shrink-0">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                />
                <button 
                  type="button"
                  disabled={uploading}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                  Upload Image
                </button>
              </div>
            </div>
            
            {settings.og_image_url && (
              <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden max-w-sm">
                <img src={settings.og_image_url} alt="OG Preview" className="w-full h-auto object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Save SEO Settings
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Search Engine Preview</h3>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <p className="text-[14px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer font-medium mb-1 truncate">{settings.meta_title || 'Your Site Title'}</p>
            <p className="text-[12px] text-[#006621] dark:text-[#81c995] mb-1">https://gujjoverseasllp.com</p>
            <p className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">{settings.meta_description || 'Your site description will appear here...'}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h3 className="font-bold text-slate-800 dark:text-white mb-2">Dynamic Sitemap</h3>
          <p className="text-sm text-slate-500 mb-4">Your sitemap is automatically generated and updated whenever you add or edit products and categories.</p>
          <a href="/sitemap.xml" target="_blank" rel="noreferrer" className="text-brand-600 hover:text-brand-700 text-sm font-medium flex items-center gap-1">
            View sitemap.xml &rarr;
          </a>
        </div>
      </div>
    </div>
  );
}
