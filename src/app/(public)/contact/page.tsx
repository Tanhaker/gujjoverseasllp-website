import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { getContactDetails } from "@/lib/settings";
import { FadeInUp, SlideInRight } from "@/components/public/MotionWrappers";

export default async function ContactPage() {
  const { phone, email, address } = await getContactDetails();
 
 // Format phone number for WhatsApp URL (ensure it has country code if not present)
 // Assuming Indian number by default if it's 10 digits
 const formattedPhone = phone.length === 10 ? `91${phone}` : phone.replace(/\D/g, '');
 const whatsappUrl = `https://wa.me/${formattedPhone}?text=Hello%20GujjOverseas,%20I%20have%20an%20inquiry.`;

 return (
 <div className="min-h-screen bg-bg-primary pb-24">
 {/* Premium Header Banner */}
 <div className="relative bg-surface text-text-primary pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden mb-[-100px] border-b border-border-subtle">
 <div className="absolute inset-0 bg-brand-50 opacity-30 mix-blend-multiply" />
 
 <FadeInUp className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
 <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-primary mb-6 tracking-tight">
 Get in Touch
 </h1>
 <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-light font-sans leading-relaxed">
 Ready to import premium agro products? Reach out to us for bulk orders, custom requirements, or any general inquiries. We are here to help.
 </p>
 </FadeInUp>
 </div>

 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
 
 <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
 
 {/* Contact Information Cards */}
 <div className="w-full lg:w-1/3 space-y-6">
 {/* WhatsApp */}
 <SlideInRight delay={0.1}>
 <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block bg-surface p-8 rounded-3xl shadow-sm border border-border-subtle hover:border-[#25D366] transition-all duration-300 group hover:-translate-y-2">
 <div className="bg-[#25D366]/10 p-4 rounded-2xl inline-block mb-6 group-hover:bg-[#25D366]/20 transition-colors">
 <MessageCircle className="h-8 w-8 text-[#25D366] group-hover:scale-110 transition-transform" />
 </div>
 <h3 className="text-2xl font-serif font-bold text-text-primary mb-2">WhatsApp Us</h3>
 <p className="text-slate-500 font-sans mb-6 text-sm leading-relaxed">Fastest response for inquiries and quotes.</p>
 <div className="text-[#25D366] font-bold font-sans flex items-center gap-2 group-hover:translate-x-1 transition-transform">
 Chat Now <Send className="w-4 h-4" />
 </div>
 </a>
 </SlideInRight>

 {/* Email */}
 <SlideInRight delay={0.2}>
 <a href={`mailto:${email}`} className="block bg-surface p-8 rounded-3xl shadow-sm border border-border-subtle hover:border-brand-500 transition-all duration-300 group hover:-translate-y-2">
 <div className="bg-brand-50 p-4 rounded-2xl inline-block mb-6 group-hover:bg-brand-100 transition-colors">
 <Mail className="h-8 w-8 text-brand-500 group-hover:scale-110 transition-transform" />
 </div>
 <h3 className="text-2xl font-serif font-bold text-text-primary mb-2">Email Us</h3>
 <p className="text-slate-500 font-sans mb-6 text-sm leading-relaxed">For official documentation and formal inquiries.</p>
 <div className="text-brand-500 font-bold font-sans break-all group-hover:translate-x-1 transition-transform">
 {email}
 </div>
 </a>
 </SlideInRight>

 {/* Phone */}
 <SlideInRight delay={0.3}>
 <a href={`tel:${phone.replace(/\D/g, '')}`} className="block bg-surface p-8 rounded-3xl shadow-sm border border-border-subtle hover:border-brand-500 transition-all duration-300 group hover:-translate-y-2">
 <div className="bg-brand-50 p-4 rounded-2xl inline-block mb-6 group-hover:bg-brand-100 transition-colors">
 <Phone className="h-8 w-8 text-brand-500 group-hover:scale-110 transition-transform" />
 </div>
 <h3 className="text-2xl font-serif font-bold text-text-primary mb-2">Call Us</h3>
 <p className="text-slate-500 font-sans mb-6 text-sm leading-relaxed">Mon-Sat from 9am to 6pm IST.</p>
 <div className="text-brand-500 font-bold font-sans group-hover:translate-x-1 transition-transform">
 {phone}
 </div>
 </a>
 </SlideInRight>
 </div>

 {/* Contact Form & Location */}
 <FadeInUp className="w-full lg:w-2/3" delay={0.4}>
 <div className="bg-surface rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-border-subtle h-full flex flex-col relative overflow-hidden">
 {/* Form subtle background gradient */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
 
 <h2 className="text-3xl font-bold font-serif text-text-primary mb-8 relative z-10">Send an Inquiry</h2>
 
 <form className="space-y-6 flex-grow relative z-10 font-sans">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div>
 <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
 <input type="text" id="name" className="w-full px-5 py-4 rounded-2xl border border-border-subtle bg-bg-primary text-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none" placeholder="John Doe" />
 </div>
 <div>
 <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
 <input type="email" id="email" className="w-full px-5 py-4 rounded-2xl border border-border-subtle bg-bg-primary text-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none" placeholder="john@example.com" />
 </div>
 </div>
 
 <div>
 <label htmlFor="product" className="block text-sm font-bold text-slate-700 mb-2">Interested Product / Subject</label>
 <input type="text" id="product" className="w-full px-5 py-4 rounded-2xl border border-border-subtle bg-bg-primary text-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none" placeholder="e.g., Bulk order for Basmati Rice" />
 </div>
 
 <div>
 <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">Message</label>
 <textarea id="message" rows={5} className="w-full px-5 py-4 rounded-2xl border border-border-subtle bg-bg-primary text-text-primary placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all outline-none resize-none" placeholder="Tell us about your requirements, volume, and destination..."></textarea>
 </div>
 
 <button type="button" className="w-full bg-text-primary hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl shadow-md hover:shadow-xl transition-all flex justify-center items-center gap-2 group border border-transparent font-sans">
 Submit Inquiry
 <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
 </button>
 </form>
 
 <div className="mt-12 pt-8 border-t border-border-subtle relative z-10">
 <div className="flex items-start gap-5 p-6 bg-white rounded-3xl border border-border-subtle shadow-sm hover:shadow-md hover:border-brand-500 transition-all duration-300 group">
 <div className="bg-brand-50 p-4 rounded-2xl shrink-0 group-hover:scale-110 transition-transform">
 <MapPin className="h-6 w-6 text-brand-500" />
 </div>
 <div>
 <h4 className="font-bold text-text-primary mb-2 text-lg font-serif">Head Office</h4>
 <p className="text-slate-600 leading-relaxed font-sans text-sm whitespace-pre-wrap">
 {address}
 </p>
 </div>
 </div>
 </div>
 </div>
 </FadeInUp>

 </div>
 </div>
 </div>
 );
}
