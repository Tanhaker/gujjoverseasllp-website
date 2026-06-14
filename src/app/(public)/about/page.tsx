import Link from "next/link";
import { Leaf, ShieldCheck, Globe, Trophy, Users, History } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      {/* Hero Section */}
      <div className="bg-brand-950 text-white py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856724017-0624e548d1c7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />
        <div className="max-w-7xl mx-auto text-center relative z-10 animate-fade-in-up">
          <Leaf className="h-16 w-16 text-brand-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6">Our Story</h1>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto font-light leading-relaxed">
            GujjOverseas LLP was founded with a singular vision: to bring the finest, purest, and most authentic agricultural products from the fertile lands of India to the global market.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Mission & Values */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-6">
              Rooted in Tradition, Focused on the Future
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
              With deep-rooted connections to local farmers across India, we ensure that every product we export meets rigorous international standards. We are not just traders; we are partners in ensuring global food security and quality.
            </p>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
              Our extensive experience in logistics, compliance, and quality control allows us to seamlessly deliver bulk commodities to over 20 countries, maintaining freshness and nutritional value.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <Globe className="h-8 w-8 text-brand-500 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Global Reach</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">Exporting to 20+ countries worldwide.</p>
              </div>
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="h-8 w-8 text-brand-500 mb-4" />
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Verified Quality</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">100% compliance with global standards.</p>
              </div>
            </div>
          </div>
          <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center" />
          </div>
        </div>

        {/* Certifications & Trust */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-800 mb-24">
          <Trophy className="h-12 w-12 text-brand-500 mx-auto mb-6" />
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Recognized & Certified
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            We hold all necessary governmental and international certifications to ensure seamless, compliant, and safe cross-border trade of agricultural goods.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">FSSAI</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Food Safety and Standards Authority of India certified for superior food safety.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">APEDA</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Registered with the Agricultural and Processed Food Products Export Development Authority.</p>
            </div>
            <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">ISO 9001</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Internationally recognized for our rigorous quality management systems.</p>
            </div>
          </div>
        </div>

        {/* Team Placeholder */}
        <div className="text-center">
          <h2 className="text-3xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Our Leadership
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12">
            Led by industry veterans with decades of experience in global supply chain and agricultural commodities.
          </p>
          <div className="inline-block bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="w-32 h-32 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Users className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Founder Name</h3>
            <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">Managing Director</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mx-auto">
              [Bio placeholder: The founder's story and vision will be placed here once provided.]
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
