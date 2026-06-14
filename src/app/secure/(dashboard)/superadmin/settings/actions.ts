'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string
  const banner = formData.get('banner') as string
  const company_tagline = formData.get('company_tagline') as string
  const hero_text = formData.get('hero_text') as string
  
  const require_2fa_vals = formData.getAll('require_2fa')
  const require_2fa = require_2fa_vals.length > 0 ? require_2fa_vals[require_2fa_vals.length - 1] as string : 'false'
  
  const maintenance_mode_vals = formData.getAll('maintenance_mode')
  const maintenance_mode = maintenance_mode_vals.length > 0 ? maintenance_mode_vals[maintenance_mode_vals.length - 1] as string : 'false'

  const supabase = await createClient()

  // Upsert email
  if (email) {
    await supabase.from('site_settings').upsert({ key: 'email', value: email }, { onConflict: 'key' })
  }

  // Upsert phone
  if (phone) {
    await supabase.from('site_settings').upsert({ key: 'phone', value: phone }, { onConflict: 'key' })
  }

  // Upsert address
  if (address !== null) {
    await supabase.from('site_settings').upsert({ key: 'address', value: address }, { onConflict: 'key' })
  }

  // Upsert banner
  if (banner !== null) {
    await supabase.from('site_settings').upsert({ key: 'banner', value: banner }, { onConflict: 'key' })
  }

  if (company_tagline !== null) {
    await supabase.from('site_settings').upsert({ key: 'company_tagline', value: company_tagline }, { onConflict: 'key' })
  }

  if (hero_text !== null) {
    await supabase.from('site_settings').upsert({ key: 'hero_text', value: hero_text }, { onConflict: 'key' })
  }

  // Upsert toggles
  await supabase.from('site_settings').upsert({ key: 'require_2fa', value: require_2fa }, { onConflict: 'key' })
  await supabase.from('site_settings').upsert({ key: 'maintenance_mode', value: maintenance_mode }, { onConflict: 'key' })

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
