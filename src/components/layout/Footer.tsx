import Link from "next/link";
import { Leaf, Mail, MapPin, Phone } from "lucide-react";
import { getContactDetails } from "@/lib/settings";

export default async function Footer() {
  const { phone, email } = await getContactDetails();

  return (
    <footer className="bg-[#111111] text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center group">
              <div className="relative h-20 w-20 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform bg-white/5 rounded-[2rem] p-2 border border-white/10">
                <img src="/logo.png" alt="GujjOverseas LLP Logo" className="h-full w-full object-contain filter drop-shadow-md brightness-110" />
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Exporting premium quality agricultural products globally. Our commitment is to deliver freshness, purity, and trust with every shipment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm font-serif">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-brand-500 transition-colors">Home</Link></li>
              <li><Link href="/about" className="hover:text-brand-500 transition-colors">About Us</Link></li>
              <li><Link href="/products" className="hover:text-brand-500 transition-colors">Products</Link></li>
              <li><Link href="/contact" className="hover:text-brand-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm font-serif">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-brand-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">123 Export Avenue, Business District, Gujarat, India 380001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-brand-500 shrink-0" />
                <a href={`tel:${phone.replace(/\D/g, '')}`} className="text-slate-400 hover:text-brand-500 transition-colors">{phone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-brand-500 shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-400 hover:text-brand-500 transition-colors break-all">{email}</a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-white font-semibold mb-6 uppercase tracking-wider text-sm font-serif">Business Hours</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex justify-between"><span>Monday - Friday:</span> <span>9:00 AM - 6:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 2:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span>Closed</span></li>
            </ul>
          </div>
          
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} GujjOverseas LLP. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-brand-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-brand-500 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
