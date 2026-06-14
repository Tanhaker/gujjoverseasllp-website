import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Tracker } from "@/components/Tracker";
import { createClient } from '@/utils/supabase/server';
import { getContactDetails } from "@/lib/settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: bannerSetting } = await supabase.from('site_settings').select('value').eq('key', 'banner').single();
  const banner = bannerSetting?.value;
  const { phone, whatsapp } = await getContactDetails();

  const { data: maintenanceSetting } = await supabase.from('site_settings').select('value').eq('key', 'maintenance_mode').single();
  const maintenance_mode = maintenanceSetting?.value === 'true';

  if (maintenance_mode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 p-4">
        <h1 className="text-4xl font-serif font-bold text-brand-600 dark:text-brand-400 mb-4">GujjOverseas LLP</h1>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">We are launching soon!</h2>
        <p className="text-slate-600 dark:text-slate-400 text-center max-w-md">
          Our website is currently undergoing maintenance or we are preparing for our big launch. Please check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Tracker />
      {banner && (
        <div className="bg-brand-600 text-white text-center py-2 px-4 text-sm font-medium w-full">
          {banner}
        </div>
      )}
      <Navbar phone={phone} whatsapp={whatsapp} />
      {children}
      <Footer />
    </div>
  );
}
