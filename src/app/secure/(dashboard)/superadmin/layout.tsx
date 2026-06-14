import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/secure/superadmin/login')
  }

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  
  if (userData?.role !== 'superadmin') {
    redirect('/secure/admin/dashboard')
  }

  return <>{children}</>
}
