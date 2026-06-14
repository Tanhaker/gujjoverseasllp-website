import { MapPin, Phone, Mail, Send, MessageCircle } from "lucide-react";
import { getContactDetails } from "@/lib/settings";

export default async function ContactPage() {
  const { phone, email } = await getContactDetails();
  
  // Format phone number for WhatsApp URL (ensure it has country code if not present)
  // Assuming Indian number by default if it's 10 digits
  const formattedPhone = phone.length === 10 ? `91${phone}` : phone.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=Hello%20GujjOverseas,%20I%20have%20an%20inquiry.`;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 dark:text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Ready to import premium agro products? Reach out to us for bulk orders, custom requirements, or any general inquiries.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Information Cards */}
          <div className="w-full lg:w-1/3 space-y-6">
            {/* WhatsApp */}
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 group">
              <div className="bg-[#25D366]/10 p-4 rounded-xl inline-block mb-6 group-hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle className="h-8 w-8 text-[#25D366]" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">WhatsApp Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Fastest response for inquiries and quotes.</p>
              <div className="text-[#25D366] font-medium flex items-center gap-2">
                Chat Now &rarr;
              </div>
            </a>

            {/* Email */}
            <a href={`mailto:${email}`} className="block bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 group">
              <div className="bg-brand-50 dark:bg-brand-900/30 p-4 rounded-xl inline-block mb-6 group-hover:bg-brand-100 dark:group-hover:bg-brand-900/50 transition-colors">
                <Mail className="h-8 w-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Email Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">For official documentation and formal inquiries.</p>
              <div className="text-brand-600 dark:text-brand-400 font-medium break-all">
                {email}
              </div>
            </a>

            {/* Phone */}
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="block bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 group">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl inline-block mb-6 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                <Phone className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4 text-sm">Mon-Sat from 9am to 6pm IST.</p>
              <div className="text-blue-600 dark:text-blue-400 font-medium">
                {phone}
              </div>
            </a>
          </div>

          {/* Contact Form & Location */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800 h-full flex flex-col">
              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-white mb-8">Send an Inquiry</h2>
              
              <form className="space-y-6 flex-grow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                    <input type="text" id="name" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                    <input type="email" id="email" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="john@example.com" />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="product" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Interested Product / Subject</label>
                  <input type="text" id="product" className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all" placeholder="e.g., Bulk order for Basmati Rice" />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Message</label>
                  <textarea id="message" rows={5} className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all resize-none" placeholder="Tell us about your requirements, volume, and destination..."></textarea>
                </div>
                
                <button type="button" className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 text-base font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-500 transition-all shadow-md gap-2">
                  <Send className="h-5 w-5" /> Send Message
                </button>
              </form>
              
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                  <div className="bg-brand-50 dark:bg-brand-900/30 p-3 rounded-full mt-1">
                    <MapPin className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-1">Head Office</h4>
                    <p className="text-slate-600 dark:text-slate-400">
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
