import SeoManager from "@/components/superadmin/SeoManager";

export const metadata = {
 title: "SEO Management | SuperAdmin Portal",
};

export default function SeoPage() {
 return (
 <div className="p-8">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">SEO Control Center</h1>
 <p className="text-slate-500">Manage global meta tags, OpenGraph sharing images, and search engine visibility.</p>
 </div>
 <SeoManager />
 </div>
 );
}
