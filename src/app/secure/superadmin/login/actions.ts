'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') || '127.0.0.1'

  // Rate Limiting (max 5 attempts per 15 minutes per IP)
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('login_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('ip_address', ip)
    .gte('timestamp', fifteenMinsAgo)

  if (count !== null && count >= 5) {
    return { error: 'Too many login attempts. Please try again in 15 minutes.' }
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    await supabase.from('login_attempts').insert({ email, ip_address: ip, success: false })
    return { error: error.message }
  }

  // Fetch 2FA setting
  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'require_2fa').single()
  const require2FA = setting?.value === 'true'

  // After successful password check, verify if they have MFA (if required)
  if (require2FA) {
    const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    
    if (mfaData?.currentLevel === 'aal1') {
      // User needs MFA
      const { data: factorsData } = await supabase.auth.mfa.listFactors()
      const totpFactor = factorsData?.factors?.find(f => f.factor_type === 'totp' && f.status === 'verified')

      if (!totpFactor) {
        return { mfaRequired: true, enroll: true }
      } else {
        const challenge = await supabase.auth.mfa.challenge({ factorId: totpFactor.id })
        return { 
          mfaRequired: true, 
          enroll: false, 
          factorId: totpFactor.id, 
          challengeId: challenge.data?.id 
        }
      }
    }
  }

  // Check role
  if (data.user) {
    const { data: userData, error: userError } = await supabase.from('users').select('role').eq('id', data.user.id).single()
    
    if (userError && userError.code === 'PGRST116') {
      // Auto-bootstrap the user if they don't exist in public.users yet
      if (data.user.email === 'superadmin@gujjoverseasllp.com') {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          role: 'superadmin'
        })
        await supabase.from('login_attempts').insert({ email, ip_address: ip, success: true })
        redirect('/secure/superadmin/dashboard')
      } else {
        await supabase.auth.signOut()
        return { error: 'Your account has not been fully registered. Please run the setup SQL.' }
      }
    } else if (userError) {
      await supabase.auth.signOut()
      return { error: `DB Error: ${userError.message} (Code: ${userError.code})` }
    }

    if (userData?.role !== 'superadmin') {
      // If an admin tries to log in through the SuperAdmin portal, we sign them out immediately
      await supabase.auth.signOut()
      await supabase.from('login_attempts').insert({ email, ip_address: ip, success: false })
      return { error: `Unauthorized. Role is '${userData?.role}'. SuperAdmin privileges required.` }
    }
  }

  await supabase.from('login_attempts').insert({ email, ip_address: ip, success: true })

  redirect('/secure/superadmin/dashboard')
}

export async function enrollMfa() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
  if (error) return { error: error.message }
  return { factorId: data.id, qrCode: data.totp.qr_code }
}

export async function verifyMfa(formData: FormData) {
  const code = formData.get('code') as string
  const factorId = formData.get('factorId') as string
  
  const supabase = await createClient()
  const headerStore = await headers()
  const ip = headerStore.get('x-forwarded-for') || '127.0.0.1'
  const email = (await supabase.auth.getUser()).data.user?.email || 'unknown'

  const { error } = await supabase.auth.mfa.challengeAndVerify({
    factorId,
    code,
  })

  if (error) {
    await supabase.from('login_attempts').insert({ email, ip_address: ip, success: false })
    return { error: 'Invalid authenticator code.' }
  }

  await supabase.from('login_attempts').insert({ email, ip_address: ip, success: true })
  redirect('/secure/superadmin/dashboard')
}
