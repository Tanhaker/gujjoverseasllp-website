'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteProduct(formData: FormData) {
 const id = formData.get('id') as string
 
 if (!id) return

 const supabase = await createClient()
 
 const { error } = await supabase.from('products').delete().eq('id', id)
 
 if (!error) {
 // Log action
 const { data: { user } } = await supabase.auth.getUser()
 if (user) {
 await supabase.from('audit_logs').insert({
 user_id: user.id,
 action: 'product.delete',
 target: `product_id: ${id}`
 })
 }

 revalidatePath('/secure/admin/products')
 revalidatePath('/products')
 }
}
