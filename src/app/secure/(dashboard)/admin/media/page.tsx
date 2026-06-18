import MediaLibrary from "@/components/admin/MediaLibrary";

export const metadata = {
 title: "Media Library | Admin Portal",
};

export default function AdminMediaPage() {
 return (
 <div className="p-8">
 <div className="mb-8">
 <h1 className="text-3xl font-bold text-slate-900 mb-2">Media Library</h1>
 <p className="text-slate-500">Manage all uploaded product images and assets.</p>
 </div>
 <MediaLibrary />
 </div>
 );
}
