'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function trackPageView(path: string) {
  try {
    const supabase = await createClient()
    const headerStore = await headers()
    const ip = headerStore.get('x-forwarded-for') || '127.0.0.1'
    
    await supabase.from('page_views').insert({
      path,
      ip_address: ip
    })
  } catch (error) {
    // Fail silently so tracking errors don't crash the app
    console.error('Tracking error:', error)
  }
}
