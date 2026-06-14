import Link from "next/link";
import { Leaf, ShieldCheck, Globe, Trophy, Users, History, CheckCircle2 } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Premium Hero Section */}
      <div className="relative bg-brand-950 text-white pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden mb-[-100px]">
        {/* Parallax-style background */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1595856724017-0624e548d1c7?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-fixed bg-center opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-brand-950/80 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl mb-8 shadow-2xl border border-white/20">
            <Leaf className="h-10 w-10 text-brand-400" />
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight">Our Story</h1>
          <p className="text-xl md:text-2xl text-brand-100 max-w-3xl mx-auto font-light leading-relaxed">
            GujjOverseas LLP was founded with a singular vision: to bring the finest, purest, and most authentic agricultural products from the fertile lands of India to the global market.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        {/* Mission & Values with Glassmorphism overlay */}
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/50 dark:border-slate-800/50 mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-8 leading-tight">
                Rooted in Tradition,<br/>
                <span className="text-brand-600 dark:text-brand-400">Focused on the Future</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 text-lg font-light">
                With deep-rooted connections to local farmers across India, we ensure that every product we export meets rigorous international standards. We are not just traders; we are partners in ensuring global food security and quality.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-10 text-lg font-light">
                Our extensive experience in logistics, compliance, and quality control allows us to seamlessly deliver bulk commodities to over 20 countries, maintaining freshness and nutritional value.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-inner group hover:shadow-md transition-all duration-300">
                  <div className="bg-brand-100 dark:bg-brand-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Globe className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Global Reach</h4>
                  <p className="text-slate-500 dark:text-slate-400">Exporting premium commodities to 20+ countries worldwide.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-inner group hover:shadow-md transition-all duration-300">
                  <div className="bg-brand-100 dark:bg-brand-900/30 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Verified Quality</h4>
                  <p className="text-slate-500 dark:text-slate-400">100% compliance with rigorous global food safety standards.</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 relative h-[500px] lg:h-[700px] rounded-[2.5rem] overflow-hidden shadow-2xl group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 via-transparent to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl text-white">
                <div className="flex items-center gap-4">
                  <div className="bg-brand-500 p-3 rounded-2xl">
                    <History className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl">Decades of Heritage</h4>
                    <p className="text-brand-100 text-sm">Building trust since inception.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certifications - Premium Gold/Green styling */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
              Recognized & Certified Excellence
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
              We hold all necessary governmental and international certifications to ensure seamless, compliant, and safe cross-border trade of agricultural goods.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'FSSAI', desc: 'Food Safety and Standards Authority of India certified for superior food safety.' },
              { title: 'APEDA', desc: 'Registered with the Agricultural and Processed Food Products Export Development Authority.' },
              { title: 'ISO 9001', desc: 'Internationally recognized for our rigorous quality management systems.' }
            ].map((cert, i) => (
              <div key={i} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900/50 p-10 rounded-[2.5rem] shadow-lg border border-slate-200/50 dark:border-slate-800/50 hover:-translate-y-2 transition-transform duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-brand-500/10 rounded-full blur-2xl group-hover:bg-brand-500/20 transition-colors" />
                <Trophy className="h-10 w-10 text-[#d4af37] mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{cert.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {cert.desc}
                </p>
                <div className="mt-8 flex items-center gap-2 text-brand-600 dark:text-brand-400 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-4 h-4" /> Verified Active
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center bg-slate-100 dark:bg-slate-900/50 rounded-[3rem] p-12 lg:p-20 border border-slate-200/50 dark:border-slate-800/50">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Our Leadership
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16 text-lg">
            Led by industry veterans with decades of experience in global supply chain and agricultural commodities.
          </p>
          
          <div className="inline-block bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700/50 max-w-md w-full relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-[2.5rem] pointer-events-none" />
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[2rem] mx-auto mb-8 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-inner">
              <Users className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-1">Founder Name</h3>
            <p className="text-brand-600 dark:text-brand-400 font-semibold mb-6 uppercase tracking-wider text-sm">Managing Director</p>
            <p className="text-slate-500 dark:text-slate-300 leading-relaxed font-light">
              "Our commitment is to deliver not just products, but trust, quality, and reliability to every corner of the globe."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
