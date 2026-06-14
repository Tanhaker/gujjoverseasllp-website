import { createClient } from "@/utils/supabase/server"

export async function getContactDetails() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('key, value');
  
  const settings = data?.reduce((acc: any, curr: any) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {}) || {};
  
  return {
    phone: settings['phone'] || '9327883001',
    email: settings['email'] || 'gujjoverseasllp@gmail.com',
  }
}
