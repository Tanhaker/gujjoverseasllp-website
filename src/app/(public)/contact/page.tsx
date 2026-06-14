import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { getContactDetails } from "@/lib/settings";

export default async function ContactPage() {
  const { phone, email } = await getContactDetails();
  
  // Format phone number for WhatsApp URL (ensure it has country code if not present)
  // Assuming Indian number by default if it's 10 digits
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=Hello%20GujjOverseas,%20I%20have%20an%20inquiry.`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24">
      {/* Premium Header Banner */}
      <div className="relative bg-brand-950 text-white pt-32 pb-32 lg:pt-40 lg:pb-40 overflow-hidden mb-[-100px]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2874&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-brand-950/80 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-brand-100 max-w-2xl mx-auto font-light leading-relaxed">
            Ready to import premium agro products? Reach out to us for bulk orders, custom requirements, or any general inquiries. We are here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Contact Information Cards */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* WhatsApp */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-800/50 group hover:-translate-y-2">
              <div className="bg-[#25D366]/10 p-4 rounded-2xl inline-block mb-6 group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="h-8 w-8 text-[#25D366] group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">WhatsApp Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">Fastest response for inquiries and quotes.</p>
              <div className="text-[#25D366] font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                Chat Now <Send className="w-4 h-4" />
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${email}`} className="block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-800/50 group hover:-translate-y-2">
              <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-2xl inline-block mb-6 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                <Mail className="h-8 w-8 text-brand-600 dark:text-brand-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">For official documentation and formal inquiries.</p>
              <div className="text-brand-600 dark:text-brand-400 font-bold break-all group-hover:translate-x-1 transition-transform">
                {email}
              </div>
            </a>

            {/* Phone */}
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="block bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-slate-800/50 group hover:-translate-y-2">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-2xl inline-block mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">Mon-Sat from 9am to 6pm IST.</p>
              <div className="text-blue-600 dark:text-blue-400 font-bold group-hover:translate-x-1 transition-transform">
                {phone}
              </div>
            </a>
          </div>

          {/* Contact Form & Location */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/50 dark:border-slate-800/50 h-full flex flex-col relative overflow-hidden">
              {/* Form subtle background gradient */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
              
              <h2 className="text-3xl font-bold font-serif text-slate-900 dark:text-white mb-8 relative z-10">Send an Inquiry</h2>
              
              <form className="space-y-6 flex-grow relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input type="text" id="name" className="w-full px-5 py-4 rounded-2xl border-0 bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" id="email" className="w-full px-5 py-4 rounded-2xl border-0 bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="product" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Interested Product / Subject</label>
                  <input type="text" id="product" className="w-full px-5 py-4 rounded-2xl border-0 bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner" placeholder="e.g., Bulk order for Basmati Rice" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea id="message" rows={5} className="w-full px-5 py-4 rounded-2xl border-0 bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-brand-500 transition-all shadow-inner resize-none" placeholder="Tell us about your requirements, volume, and destination..."></textarea>
                </div>
                
                <button type="button" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-base font-bold rounded-2xl text-white bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 gap-2">
                  <Send className="h-5 w-5" /> Send Message
                </button>
              </form>
              
              <div className="mt-12 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 relative z-10">
                <div className="flex items-start gap-5 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                  <div className="bg-brand-100 dark:bg-brand-900/30 p-4 rounded-2xl shrink-0">
                    <MapPin className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-lg">Head Office</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">
                      123 Export Avenue, Business District<br />
                      Gujarat, India 380001
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
