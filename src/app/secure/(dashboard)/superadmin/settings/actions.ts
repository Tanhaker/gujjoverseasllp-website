'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  const supabase = await createClient()
  
  // We don't want to blindly upsert everything since formData can contain button names
  // So we explicitly define the keys we expect based on the v2 schema
  const expectedKeys = [
    'contact_email', 'contact_phone', 'whatsapp_number', 'company_address', 
    'company_tagline', 'hero_badge_text', 'hero_text', 'hero_subtext', 
    'stat_products', 'stat_countries', 'stat_categories', 'stat_response_time',
    'homepage_banner', 'banner_enabled', 'maintenance_mode', 'chatbot_enabled'
  ]

  const updates = []
  
  for (const key of expectedKeys) {
    // For checkboxes, formData might have multiple values (hidden false + checkbox true)
    // We take the last one in the array
    const vals = formData.getAll(key)
    if (vals.length > 0) {
      const val = vals[vals.length - 1] as string
      updates.push({ key, value: val })
    }
  }

  if (updates.length > 0) {
    await supabase.from('site_settings').upsert(updates, { onConflict: 'key' })
  }

  // Revalidate public layouts to reflect new settings immediately
  revalidatePath('/', 'layout')

  // Log action
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'setting.update',
      target: 'site_settings'
    })
  }
}

