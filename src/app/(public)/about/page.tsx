import Link from "next/link";
import { Leaf, ShieldCheck, Globe, Trophy, Users, History, CheckCircle2 } from "lucide-react";
import { FadeInUp, SlideInRight } from "@/components/public/MotionWrappers";

export default function AboutPage() {
 return (
 <div className="min-h-screen bg-bg-primary pb-24">
 {/* Premium Hero Section */}
 <div className="relative bg-surface text-text-primary pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden mb-[-100px] border-b border-border-subtle">
 {/* Patterned background */}
 <div className="absolute inset-0 bg-brand-50 opacity-30 mix-blend-multiply" />
 
 <FadeInUp className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
 <div className="inline-flex items-center justify-center p-4 bg-white rounded-3xl mb-8 shadow-sm border border-border-subtle">
 <Leaf className="h-10 w-10 text-brand-500" />
 </div>
 <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 tracking-tight text-text-primary">Our Story</h1>
 <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-light leading-relaxed font-sans">
 GujjOverseas LLP was founded with a singular vision: to bring the finest, purest, and most authentic agricultural products from the fertile lands of India to the global market.
 </p>
 </FadeInUp>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
 
 {/* Mission & Values */}
 <FadeInUp className="bg-surface backdrop-blur-xl rounded-[3rem] p-8 md:p-16 shadow-sm border border-border-subtle mb-24">
 <div className="grid lg:grid-cols-2 gap-16 items-center">
 <div className="order-2 lg:order-1">
 <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-8 leading-tight">
 Rooted in Tradition,<br/>
 <span className="text-brand-500">Focused on the Future</span>
 </h2>
 <p className="text-slate-600 leading-relaxed mb-6 text-lg font-light font-sans">
 With deep-rooted connections to local farmers across India, we ensure that every product we export meets rigorous international standards. We are not just traders; we are partners in ensuring global food security and quality.
 </p>
 <p className="text-slate-600 leading-relaxed mb-10 text-lg font-light font-sans">
 Our extensive experience in logistics, compliance, and quality control allows us to seamlessly deliver bulk commodities to over 20 countries, maintaining freshness and nutritional value.
 </p>
 
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="bg-white p-6 rounded-3xl border border-border-subtle shadow-sm group hover:shadow-md hover:border-brand-500 transition-all duration-300">
 <div className="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
 <Globe className="h-6 w-6 text-brand-500" />
 </div>
 <h4 className="font-bold text-text-primary font-serif mb-2 text-lg">Global Reach</h4>
 <p className="text-slate-500 font-sans text-sm">Exporting premium commodities to 20+ countries worldwide.</p>
 </div>
 <div className="bg-white p-6 rounded-3xl border border-border-subtle shadow-sm group hover:shadow-md hover:border-brand-500 transition-all duration-300">
 <div className="bg-brand-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
 <ShieldCheck className="h-6 w-6 text-brand-500" />
 </div>
 <h4 className="font-bold text-text-primary font-serif mb-2 text-lg">Verified Quality</h4>
 <p className="text-slate-500 font-sans text-sm">100% compliance with rigorous global food safety standards.</p>
 </div>
 </div>
 </div>
 
 <div className="order-1 lg:order-2 relative h-[500px] lg:h-[700px] rounded-[2.5rem] overflow-hidden shadow-sm group border border-border-subtle">
 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2940&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-700" />
 <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
 
 <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md border border-white p-6 rounded-3xl shadow-sm">
 <div className="flex items-center gap-4">
 <div className="bg-brand-500 p-3 rounded-2xl">
 <History className="w-6 h-6 text-white" />
 </div>
 <div>
 <h4 className="font-bold text-xl text-text-primary font-serif">Decades of Heritage</h4>
 <p className="text-slate-600 text-sm font-sans">Building trust since inception.</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </FadeInUp>

 {/* Certifications - Premium Gold styling */}
 <div className="mb-32">
 <FadeInUp className="text-center mb-16">
 <h2 className="text-3xl md:text-4xl font-serif font-bold text-text-primary mb-4">
 Recognized & Certified Excellence
 </h2>
 <p className="text-slate-600 font-sans max-w-2xl mx-auto text-lg">
 We hold all necessary governmental and international certifications to ensure seamless, compliant, and safe cross-border trade of agricultural goods.
 </p>
 </FadeInUp>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { title: 'FSSAI', desc: 'Food Safety and Standards Authority of India certified for superior food safety.' },
 { title: 'APEDA', desc: 'Registered with the Agricultural and Processed Food Products Export Development Authority.' },
 { title: 'ISO 9001', desc: 'Internationally recognized for our rigorous quality management systems.' }
 ].map((cert, i) => (
 <SlideInRight key={i} delay={i * 0.1}>
 <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-border-subtle hover:border-brand-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden group h-full">
 <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-brand-50 rounded-full blur-2xl group-hover:bg-brand-100 transition-colors" />
 <Trophy className="h-10 w-10 text-brand-500 mb-6" />
 <h3 className="text-2xl font-bold text-text-primary font-serif mb-3">{cert.title}</h3>
 <p className="text-slate-600 font-sans leading-relaxed">
 {cert.desc}
 </p>
 </div>
 </SlideInRight>
 ))}
 </div>
 </div>

 {/* Team Section */}
 <div className="text-center bg-slate-100 rounded-[3rem] p-12 lg:p-20 border border-slate-200/50 ">
 <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
 Our Leadership
 </h2>
 <p className="text-slate-600 max-w-2xl mx-auto mb-16 text-lg">
 Led by industry veterans with decades of experience in global supply chain and agricultural commodities.
 </p>
 
 <div className="inline-block bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 max-w-md w-full relative group">
 <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent rounded-[2.5rem] pointer-events-none" />
 <div className="w-32 h-32 bg-slate-100 rounded-[2rem] mx-auto mb-8 flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300 shadow-inner">
 <Users className="h-12 w-12 text-slate-400" />
 </div>
 <h3 className="text-2xl font-bold text-slate-900 mb-1">Imad Kinariwala</h3>
 <p className="text-brand-600 font-semibold mb-6 uppercase tracking-wider text-sm">Managing Director</p>
 <p className="text-slate-500 leading-relaxed font-light">
 "Our commitment is to deliver not just products, but trust, quality, and reliability to every corner of the globe."
 </p>
 </div>
 </div>

 </div>
 </div>
 );
}
