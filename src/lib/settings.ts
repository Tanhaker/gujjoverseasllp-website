import { createClient } from "@/utils/supabase/server"

export async function getContactDetails() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('key, value');
  
  const settings = data?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};
  
  return {
    phone: settings['contact_phone'] || '+91 9714888806',
    email: settings['contact_email'] || 'gujjoverseasllp@gmail.com',
    whatsapp: settings['whatsapp_number'] || '+91 9714888806',
    address: settings['company_address'] || 'Ahmedabad, Gujarat, India',
  }
}
